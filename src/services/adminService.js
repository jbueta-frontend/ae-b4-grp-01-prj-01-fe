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

/**
 * Update Admin Order Status
 * PUT /admin/orders/:orderId/status
 */
export async function updateAdminOrderStatus(orderId, status) {
  const res = await api.put(`/admin/orders/${orderId}/status`, { status });
  return res;
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
 * Handles updating product stock quantities
 * @param {string} productId
 * @param {number} restockQuantity
 * @param {number} currentStock
 */
export async function restockProductInventory(productId, restockQuantity, currentStock = 0) {
  const newStock = Math.max(0, Number(currentStock) + Number(restockQuantity));

  // 1. Try dedicated product inventory endpoint
  try {
    return await api.put(`/admin/products/${productId}/inventory`, {
      stockQuantity: newStock,
      quantity: newStock,
      adjustment: Number(restockQuantity),
    });
  } catch {
    // 2. Try PATCH inventory
    try {
      return await api.patch(`/admin/products/${productId}/inventory`, {
        stockQuantity: newStock,
        quantity: newStock,
        adjustment: Number(restockQuantity),
      });
    } catch {
      // 3. Try generic inventory adjust route
      try {
        return await api.post('/admin/inventory/adjust', {
          productId,
          adjustment: Number(restockQuantity),
          stockQuantity: newStock,
        });
      } catch {
        // 4. Fallback to product update route
        return await api.put(`/admin/products/${productId}`, {
          stockQuantity: newStock,
        });
      }
    }
  }
}

