import api from './api';

/**
 * Service for Shipment Logistics & Delivery Tracking
 */

/**
 * Public tracking lookup
 * GET /shipments/track/:trackingNumber
 */
export async function trackShipmentPublic(trackingNumber) {
  try {
    const res = await api.get(`/shipments/track/${encodeURIComponent(trackingNumber)}`);
    return res?.shipment || res;
  } catch (err) {
    throw err;
  }
}

/**
 * Customer tracking lookup by order ID
 * GET /shipments/:orderId
 */
export async function getShipmentByOrderId(orderId) {
  try {
    const res = await api.get(`/shipments/${encodeURIComponent(orderId)}`);
    return res?.shipment || res;
  } catch (err) {
    throw err;
  }
}
