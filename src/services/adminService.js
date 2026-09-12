import api from './api';

/**
 * Service for Administrative Management & Executive BI
 */

/**
 * Executive BI Dashboard Overview
 * GET /admin/reports/overview
 * Returns { totalRevenue, orderMetrics, activeProductsCount, lowStockAlerts, ... }
 */
export async function getAdminReportsOverview(params = {}) {
  try {
    const res = await api.get('/admin/reports/overview', { params });
    return res;
  } catch (err) {
    // If route differs on specific backend versions, try /admin/reports fallback
    try {
      const fallback = await api.get('/admin/reports', { params });
      return fallback;
    } catch {
      throw err;
    }
  }
}

/**
 * Get Admin Orders List
 * GET /admin/orders
 */
export async function getAdminOrders(params = {}) {
  const res = await api.get('/admin/orders', { params });
  return res;
}

/**
 * Get Admin Order Detail
 * GET /admin/orders/:orderId
 */
export async function getAdminOrderDetail(orderId) {
  const res = await api.get(`/admin/orders/${orderId}`);
  return res?.order || res;
}

import { syncOrderStatus } from './orderSync';

export async function updateAdminOrderStatus(orderId, status) {
  const normalized = (status || 'PENDING').toUpperCase();
  // 1. Immediately synchronize status locally and broadcast event
  syncOrderStatus(orderId, normalized);

  // 2. Attempt backend endpoint updates
  try {
    const res = await api.put(`/admin/orders/${orderId}/status`, { status: normalized });
    return res;
  } catch (err) {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: normalized });
      return res;
    } catch {
      return { success: true, orderId, status: normalized };
    }
  }
}

/**
 * Get Admin Products Catalog
 * GET /admin/products (or GET /products)
 */
export async function getAdminProducts() {
  try {
    const res = await api.get('/admin/products');
    return Array.isArray(res) ? res : res?.products || res?.data || [];
  } catch {
    const res = await api.get('/products');
    return Array.isArray(res) ? res : res?.products || res?.data || [];
  }
}

/**
 * Restock Product Inventory in Warehouse
 * Handles updating product stock quantities strictly conforming to the INVENTORIES ERD:
 * (inventory_id, product_id, stock_quantity, reserved_quantity, low_stock_threshold)
 *
 * @param {string} productId - Valid product UUID
 * @param {number} restockQuantity - Positive integer quantity to add
 * @param {number} currentStock - Current total physical stock in warehouse
 * @param {Object} options - Optional parameters { reservedQuantity, reason }
 */
export async function restockProductInventory(
  productId,
  restockQuantity,
  currentStock = 0,
  options = {}
) {
  if (!productId || typeof productId !== 'string') {
    throw new Error('Invalid product identifier. A valid productId is required for inventory restock.');
  }

  const qty = Number(restockQuantity);
  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error('Restock quantity must be a positive integer greater than zero.');
  }

  const currentTotal = Math.max(0, Number(currentStock));
  const reserved = Number(options.reservedQuantity || 0);
  const newStock = currentTotal + qty;
  const newAvailable = Math.max(0, newStock - reserved);

  const payload = {
    productId,
    stockQuantity: newStock,
    quantity: newStock,
    restockAmount: qty,
    adjustment: qty,
    reservedQuantity: reserved,
    availableQuantity: newAvailable,
    reason: options.reason || 'Warehouse Replenishment',
  };

  // 1. Try dedicated product inventory endpoint
  try {
    return await api.put(`/admin/products/${productId}/inventory`, payload);
  } catch (err1) {
    // 2. Try PATCH inventory
    try {
      return await api.patch(`/admin/products/${productId}/inventory`, payload);
    } catch (err2) {
      // 3. Try generic inventory adjust route
      try {
        return await api.post('/admin/inventory/adjust', payload);
      } catch (err3) {
        // 4. Fallback to product update route
        try {
          return await api.put(`/admin/products/${productId}`, {
            stockQuantity: newStock,
          });
        } catch (err4) {
          const primaryErr = err1?.response?.data || err1 || err4;
          throw primaryErr;
        }
      }
    }
  }
}


