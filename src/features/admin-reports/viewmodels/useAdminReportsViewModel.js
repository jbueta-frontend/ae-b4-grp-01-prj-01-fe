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
import { getErrorMessage } from '../../../shared/utils/errorHandler';

export function useAdminReportsViewModel() {
  const [activePreset, setActivePreset] = useState('today');
  const initialRange = getDateRangeByPreset('today');
  const [fromDate, setFromDate] = useState(initialRange.from);
  const [toDate, setToDate] = useState(initialRange.to);

  const [data, setData] = useState(INITIAL_REPORTS_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Catalog products for general restock selection
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

  // Fetch full products list once for restocking dropdown selection
  useEffect(() => {
    async function loadCatalog() {
      try {
        const items = await getAdminProducts();
        if (Array.isArray(items)) {
          setCatalogProducts(items);
        }
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
    setSelectedRestockProduct(product);
    setIsRestockModalOpen(true);
  };

  const closeRestockModal = () => {
    if (!isRestocking) {
      setIsRestockModalOpen(false);
      setSelectedRestockProduct(null);
    }
  };

  // Execute Restock Single Product
  const handleRestockProduct = async ({
    productId,
    amount,
    currentStock,
    productName,
  }) => {
    setIsRestocking(true);
    setRestockFeedback(null);
    const newStock = Math.max(0, Number(currentStock) + Number(amount));

    try {
      // 1. Dispatch backend API request
      await restockProductInventory(productId, amount, currentStock);

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
                inventory: {
                  ...(item.inventory || {}),
                  stockQuantity: newStock,
                },
              };
            }
            return item;
          });
          localStorage.setItem('fiddlemania_seeded_products', JSON.stringify(updated));
        } catch {}
      }

      // 3. Immediately update in-memory lowStockAlerts state
      setData((prev) => {
        const updatedAlerts = prev.lowStockAlerts
          .map((item) => {
            const id = item.productId || item.id;
            if (id === productId) {
              const thresh = Number(item.lowStockThreshold || item.inventory?.lowStockThreshold || 10);
              return {
                ...item,
                stockQuantity: newStock,
                stock: newStock,
                cleared: newStock > thresh,
              };
            }
            return item;
          })
          .filter((item) => {
            const thresh = Number(item.lowStockThreshold || item.inventory?.lowStockThreshold || 10);
            return (item.stockQuantity ?? item.stock ?? 0) <= thresh;
          });

        return {
          ...prev,
          lowStockAlerts: updatedAlerts,
        };
      });

      // 4. Update catalogProducts state
      setCatalogProducts((prev) =>
        prev.map((item) => {
          const id = item.productId || item.id;
          if (id === productId) {
            return {
              ...item,
              stockQuantity: newStock,
              stock: newStock,
            };
          }
          return item;
        })
      );

      setRestockFeedback({
        type: 'success',
        message: `Successfully restocked ${productName} with +${amount} units (New Total: ${newStock} units in warehouse).`,
      });

      setIsRestockModalOpen(false);
      setSelectedRestockProduct(null);

      // 5. Re-fetch reports from backend to update totals
      fetchReports(fromDate, toDate);
    } catch (err) {
      setRestockFeedback({
        type: 'error',
        message: getErrorMessage(err, 'Failed to update product inventory in warehouse'),
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
        return restockProductInventory(id, amount, cur);
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
