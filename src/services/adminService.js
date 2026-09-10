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
