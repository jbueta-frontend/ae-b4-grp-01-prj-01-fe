/**
 * Customer Order Model & Status Configuration
 * Directly aligned with ERD:
 * 
 * ORDERS
 * - PK orderId
 * - FK userId
 * - orderNumber
 * - subtotal
 * - shippingFee
 * - tax
 * - totalAmount
 * - status (PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED)
 * - createdAt
 * - updatedAt
 */

export const ORDER_STATUS_ERD = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export const ORDER_STATUS_TABS = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.1)',
    border: '1px solid rgba(217, 119, 6, 0.25)',
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: '#2563eb',
    bg: 'rgba(37, 99, 235, 0.1)',
    border: '1px solid rgba(37, 99, 235, 0.25)',
  },
  SHIPPED: {
    label: 'Shipped',
    color: '#7c3aed',
    bg: 'rgba(124, 58, 237, 0.1)',
    border: '1px solid rgba(124, 58, 237, 0.25)',
  },
  DELIVERED: {
    label: 'Delivered',
    color: '#16a34a',
    bg: 'rgba(22, 163, 74, 0.1)',
    border: '1px solid rgba(22, 163, 74, 0.25)',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.25)',
  },
};

export function getOrderStatusConfig(status) {
  const normalized = (status || 'PENDING').toUpperCase();
  if (normalized === 'COMPLETED') return ORDER_STATUS_CONFIG.DELIVERED;
  return (
    ORDER_STATUS_CONFIG[normalized] || {
      label: status || 'Pending',
      color: '#71717a',
      bg: 'rgba(113, 113, 122, 0.1)',
      border: '1px solid rgba(113, 113, 122, 0.25)',
    }
  );
}
