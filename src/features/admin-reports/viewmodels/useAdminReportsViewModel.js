import { useState, useEffect, useCallback } from 'react';
import {
  getAdminReportsOverview,
  getAdminProducts,
  restockProductInventory,
} from '../../../services/adminService';
import {
  getDateRangeByPreset,
  INITIAL_REPORTS_STATE,
} from '../models/reportsModel';
import { mapApiProduct } from '../../product-catalog/models/productModel.js';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

export function useAdminReportsViewModel() {
  const [activePreset, setActivePreset] = useState('today');
  const initialRange = getDateRangeByPreset('today');
  const [fromDate, setFromDate] = useState(initialRange.from);
  const [toDate, setToDate] = useState(initialRange.to);

  const [data, setData] = useState(INITIAL_REPORTS_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Catalog products for general restock selection with images and ERD inventory
  const [catalogProducts, setCatalogProducts] = useState([]);

  // Restocking Modal & Feedback State
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedRestockProduct, setSelectedRestockProduct] = useState(null);
  const [isRestocking, setIsRestocking] = useState(false);
  const [restockFeedback, setRestockFeedback] = useState(null);

  const fetchReports = useCallback(async (from, to) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;

      // Executive BI Dashboard Overview endpoint GET /admin/reports/overview
      const res = await getAdminReportsOverview(params);

      const revenue = Number(res?.totalRevenue ?? res?.revenue ?? 0);
      const orders = Number(
        res?.orderCount ??
        res?.orders ??
        res?.orderMetrics?.total ??
        0
      );
      const aov = Number(res?.averageOrderValue ?? (orders > 0 ? revenue / orders : 0));
      const activeProductsCount = Number(
        res?.activeProductsCount ??
        res?.activeProducts ??
        res?.productCount ??
        0
      );
      const lowStockAlerts = Array.isArray(res?.lowStockAlerts)
        ? res.lowStockAlerts
        : Array.isArray(res?.lowStock)
          ? res.lowStock
          : [];
      const orderMetrics = res?.orderMetrics || {
        total: orders,
        confirmed: Number(res?.confirmedOrders || 0),
        processing: Number(res?.processingOrders || 0),
        delivered: Number(res?.deliveredOrders || 0),
        cancelled: Number(res?.cancelledOrders || 0),
      };
      const topProducts = Array.isArray(res?.topProducts)
        ? res.topProducts
        : [];

      setData({
        totalRevenue: revenue,
        orderCount: orders,
        averageOrderValue: aov,
        activeProductsCount,
        lowStockAlerts,
        orderMetrics,
        topProducts,
      });
    } catch (err) {
      setError(
        getErrorMessage(err, 'Failed to fetch executive business reports from database')
      );
      setData(INITIAL_REPORTS_STATE);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch full products list with authentic images and ERD inventory mappings
  useEffect(() => {
    async function loadCatalog() {
      try {
        const items = await getAdminProducts();
        let list = Array.isArray(items) ? items : items?.products || items?.data || [];

        // Check locally cached products to ensure complete synchronization
        const cached = localStorage.getItem('fiddlemania_seeded_products');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
              const ids = new Set(list.map((p) => p.productId || p.id));
              parsed.forEach((p) => {
                const id = p.productId || p.id;
                if (!ids.has(id)) list.push(p);
              });
            }
          } catch {}
        }

        // Map every product through canonical normalizer strictly conforming to the ERD
        const mapped = list.map((p) => mapApiProduct(p));
        setCatalogProducts(mapped);
      } catch {
        // Fallback silently if public/admin endpoint fails
      }
    }
    loadCatalog();
  }, []);

  useEffect(() => {
    fetchReports(fromDate, toDate);
  }, [fetchReports, fromDate, toDate]);

  const selectPreset = (presetId) => {
    setActivePreset(presetId);
    const range = getDateRangeByPreset(presetId);
    setFromDate(range.from);
    setToDate(range.to);
  };

  const handleCustomDateChange = (from, to) => {
    setActivePreset('custom');
    setFromDate(from);
    setToDate(to);
  };

  // Open & Close Restock Modal
  const openRestockModal = (product = null) => {
    if (product) {
      const prodId = product.productId || product.id;
      const foundInCatalog = catalogProducts.find((p) => p.productId === prodId);
      setSelectedRestockProduct(foundInCatalog || mapApiProduct(product));
    } else {
      setSelectedRestockProduct(null);
    }
    setIsRestockModalOpen(true);
  };

  const closeRestockModal = () => {
    if (!isRestocking) {
      setIsRestockModalOpen(false);
      setSelectedRestockProduct(null);
    }
  };

  // Execute Restock Single Product strictly utilizing the INVENTORIES ERD
  const handleRestockProduct = async ({
    productId,
    amount,
    currentStock,
    reservedQuantity = 0,
    lowStockThreshold = 10,
    productName,
    reason,
  }) => {
    setIsRestocking(true);
    setRestockFeedback(null);
    const newStock = Math.max(0, Number(currentStock) + Number(amount));
    const newAvailable = Math.max(0, newStock - Number(reservedQuantity));

    try {
      // 1. Dispatch backend API request conforming strictly to INVENTORIES schema
      await restockProductInventory(productId, amount, currentStock, {
        reservedQuantity,
        reason,
      });

      // 2. Synchronize local cache (localStorage) for seamless consistency across views
      const cached = localStorage.getItem('fiddlemania_seeded_products');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const updated = parsed.map((item) => {
            const id = item.productId || item.id;
            if (id === productId) {
              return {
                ...item,
                stockQuantity: newStock,
                availableQuantity: newAvailable,
                stockCount: newAvailable,
                inStock: newAvailable > 0,
                isOutOfStock: newAvailable <= 0,
                isLowStock: newAvailable > 0 && newAvailable <= lowStockThreshold,
                inventory: {
                  ...(item.inventory || {}),
                  stockQuantity: newStock,
                  reservedQuantity: Number(reservedQuantity),
                  lowStockThreshold: Number(lowStockThreshold),
                },
              };
            }
            return item;
          });
          localStorage.setItem('fiddlemania_seeded_products', JSON.stringify(updated));
        } catch {}
      }

      // 3. Immediately update in-memory lowStockAlerts state using ERD formula:
      // Available Stock = stockQuantity - reservedQuantity
      setData((prev) => {
        const updatedAlerts = prev.lowStockAlerts
          .map((item) => {
            const id = item.productId || item.id;
            if (id === productId) {
              const thresh = Number(item.lowStockThreshold || item.inventory?.lowStockThreshold || lowStockThreshold);
              const resQty = Number(item.reservedQuantity || item.inventory?.reservedQuantity || reservedQuantity);
              const avail = Math.max(0, newStock - resQty);
              return {
                ...item,
                stockQuantity: newStock,
                stock: newStock,
                availableStock: avail,
                availableQuantity: avail,
                isLowStock: avail > 0 && avail <= thresh,
                isOutOfStock: avail <= 0,
              };
            }
            return item;
          })
          .filter((item) => {
            const thresh = Number(item.lowStockThreshold || item.inventory?.lowStockThreshold || 10);
            const resQty = Number(item.reservedQuantity || item.inventory?.reservedQuantity || 0);
            const total = Number(item.stockQuantity ?? item.stock ?? 0);
            const avail = Math.max(0, total - resQty);
            return avail <= thresh;
          });

        return {
          ...prev,
          lowStockAlerts: updatedAlerts,
        };
      });

      // 4. Update catalogProducts state with ERD recalculations
      setCatalogProducts((prev) =>
        prev.map((item) => {
          const id = item.productId || item.id;
          if (id === productId) {
            const resQty = Number(item.inventory?.reservedQuantity || item.reservedQuantity || reservedQuantity);
            const thresh = Number(item.inventory?.lowStockThreshold || item.lowStockThreshold || lowStockThreshold);
            const avail = Math.max(0, newStock - resQty);
            return {
              ...item,
              stockQuantity: newStock,
              stock: newStock,
              availableQuantity: avail,
              availableStock: avail,
              stockCount: avail,
              inStock: avail > 0,
              isOutOfStock: avail <= 0,
              isLowStock: avail > 0 && avail <= thresh,
              inventory: {
                ...(item.inventory || {}),
                stockQuantity: newStock,
                reservedQuantity: resQty,
                lowStockThreshold: thresh,
              },
            };
          }
          return item;
        })
      );

      setRestockFeedback({
        type: 'success',
        message: `Successfully restocked ${productName} with +${amount} units (New Physical Total: ${newStock}, Net Available: ${newAvailable} units).`,
      });

      setIsRestockModalOpen(false);
      setSelectedRestockProduct(null);

      // 5. Re-fetch reports from backend to update totals
      fetchReports(fromDate, toDate);
    } catch (err) {
      setRestockFeedback({
        type: 'error',
        message: getErrorMessage(
          err,
          'Failed to update product inventory in warehouse. Please verify database connection and credentials.'
        ),
      });
    } finally {
      setIsRestocking(false);
    }
  };

  // Batch Restock All Low-Stock Items
  const handleBatchRestock = async (amount = 50) => {
    if (!data.lowStockAlerts || data.lowStockAlerts.length === 0) return;
    setIsRestocking(true);
    setRestockFeedback(null);

    try {
      const promises = data.lowStockAlerts.map(async (item) => {
        const id = item.productId || item.id;
        const cur = Number(item.stockQuantity ?? item.stock ?? 0);
        const res = Number(item.reservedQuantity ?? item.inventory?.reservedQuantity ?? 0);
        return restockProductInventory(id, amount, cur, { reservedQuantity: res });
      });

      await Promise.allSettled(promises);

      // Synchronize local cache
      const cached = localStorage.getItem('fiddlemania_seeded_products');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const alertIds = new Set(data.lowStockAlerts.map((a) => a.productId || a.id));
          const updated = parsed.map((item) => {
            const id = item.productId || item.id;
            if (alertIds.has(id)) {
              const newQty = (item.stockQuantity || 0) + amount;
              return {
                ...item,
                stockQuantity: newQty,
                inventory: { ...(item.inventory || {}), stockQuantity: newQty },
              };
            }
            return item;
          });
          localStorage.setItem('fiddlemania_seeded_products', JSON.stringify(updated));
        } catch {}
      }

      setRestockFeedback({
        type: 'success',
        message: `Successfully replenished all ${data.lowStockAlerts.length} priority items with +${amount} units each!`,
      });

      // Clear alerts immediately
      setData((prev) => ({ ...prev, lowStockAlerts: [] }));

      // Refresh overview
      fetchReports(fromDate, toDate);
    } catch (err) {
      setRestockFeedback({
        type: 'error',
        message: getErrorMessage(err, 'Failed to complete batch replenishment'),
      });
    } finally {
      setIsRestocking(false);
    }
  };

  return {
    activePreset,
    fromDate,
    toDate,
    data,
    loading,
    error,
    catalogProducts,
    isRestockModalOpen,
    selectedRestockProduct,
    isRestocking,
    restockFeedback,
    clearRestockFeedback: () => setRestockFeedback(null),
    openRestockModal,
    closeRestockModal,
    handleRestockProduct,
    handleBatchRestock,
    selectPreset,
    handleCustomDateChange,
    refresh: () => fetchReports(fromDate, toDate),
  };
}
