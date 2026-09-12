/**
 * Admin Fulfillment & Order Models
 * Aligned with ERD:
 * - Orders (orderId, userId, orderNumber, subtotal, shippingFee, tax, total, status, createdAt)
 * - User & Profile (recipientName, email, phone, addressLine1, city, stateProvince, postalCode, country)
 * - Order Items (orderItemId, productId, productName, sku, quantity, price, subtotal)
 * - Payment (paymentId, paymentMethod, status, transactionRef, amount, paidAt)
 * - Shipment (shipmentId, carrier, trackingNumber, status, shippedAt, deliveredAt)
 */

export const ORDER_STATUS_TABS = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.1)',
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: '#2563eb',
    bg: 'rgba(37, 99, 235, 0.1)',
  },
  SHIPPED: {
    label: 'Shipped',
    color: '#7c3aed',
    bg: 'rgba(124, 58, 237, 0.1)',
  },
  DELIVERED: {
    label: 'Delivered',
    color: '#16a34a',
    bg: 'rgba(22, 163, 74, 0.1)',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.1)',
  },
};

export function getOrderStatusConfig(status) {
  const normalized = (status || 'PENDING').toUpperCase();
  return (
    ORDER_STATUS_CONFIG[normalized] || {
      label: status || 'Pending',
      color: '#71717a',
      bg: 'rgba(113, 113, 122, 0.1)',
    }
  );
}

export const SAMPLE_ADMIN_ORDERS = [];
