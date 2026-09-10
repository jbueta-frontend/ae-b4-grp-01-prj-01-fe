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

export const SAMPLE_ADMIN_ORDERS = [
  {
    orderId: 'ord-1001',
    orderNumber: 'FM-824109',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'SHIPPED',
    subtotal: 96.0,
    shippingFee: 15.0,
    tax: 0.0,
    total: 111.0,
    user: {
      userId: 'usr-001',
      name: 'Sofia Alcantara',
      email: 'sofia.alcantara@example.com',
      phone: '+63 917 555 0192',
    },
    shippingAddress: {
      recipientName: 'Sofia Alcantara',
      phone: '+63 917 555 0192',
      addressLine1: 'Unit 4B, The Sapphire Bloc',
      addressLine2: 'Sapphire Road, Ortigas Center',
      city: 'Pasig City',
      stateProvince: 'Metro Manila',
      postalCode: '1605',
      country: 'Philippines',
    },
    items: [
      {
        orderItemId: 'item-01',
        productId: 'prod-01',
        name: 'Architect Beechwood Block Set',
        sku: 'FDL-WDN-001',
        quantity: 2,
        price: 48.0,
        subtotal: 96.0,
      },
    ],
    payment: {
      paymentId: 'pay-7721',
      paymentMethod: 'GCash / PayMongo',
      transactionRef: 'PAY-GCASH-983145',
      amount: 111.0,
      status: 'PAID',
      paidAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    shipment: {
      shipmentId: 'shp-4001',
      carrier: 'Lalamove Express',
      trackingNumber: 'TRK-98314512',
      status: 'IN_TRANSIT',
      shippedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      deliveredAt: null,
    },
  },
  {
    orderId: 'ord-1002',
    orderNumber: 'FM-824110',
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    status: 'CONFIRMED',
    subtotal: 135.0,
    shippingFee: 0.0,
    tax: 0.0,
    total: 135.0,
    user: {
      userId: 'usr-002',
      name: 'Mateo De Leon',
      email: 'mateo.deleon@example.com',
      phone: '+63 928 444 8812',
    },
    shippingAddress: {
      recipientName: 'Mateo De Leon',
      phone: '+63 928 444 8812',
      addressLine1: '12 Acacia Avenue',
      addressLine2: 'Ayala Alabang Village',
      city: 'Muntinlupa City',
      stateProvince: 'Metro Manila',
      postalCode: '1780',
      country: 'Philippines',
    },
    items: [
      {
        orderItemId: 'item-02',
        productId: 'prod-02',
        name: 'Kinetic Gyroscope Orbit Ring',
        sku: 'FDL-STM-002',
        quantity: 3,
        price: 45.0,
        subtotal: 135.0,
      },
    ],
    payment: {
      paymentId: 'pay-7722',
      paymentMethod: 'Credit Card (Visa)',
      transactionRef: 'PAY-STRIPE-448102',
      amount: 135.0,
      status: 'PAID',
      paidAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    },
    shipment: {
      shipmentId: 'shp-4002',
      carrier: 'J&T Express',
      trackingNumber: 'JT-PHIL-551029',
      status: 'PENDING_PICKUP',
      shippedAt: null,
      deliveredAt: null,
    },
  },
  {
    orderId: 'ord-1003',
    orderNumber: 'FM-824111',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'DELIVERED',
    subtotal: 75.0,
    shippingFee: 15.0,
    tax: 0.0,
    total: 90.0,
    user: {
      userId: 'usr-003',
      name: 'Clara Santos',
      email: 'clara.santos@example.com',
      phone: '+63 905 123 4567',
    },
    shippingAddress: {
      recipientName: 'Clara Santos',
      phone: '+63 905 123 4567',
      addressLine1: 'Tower 2, Unit 1904',
      addressLine2: 'BGC High Street South',
      city: 'Taguig City',
      stateProvince: 'Metro Manila',
      postalCode: '1634',
      country: 'Philippines',
    },
    items: [
      {
        orderItemId: 'item-03',
        productId: 'prod-03',
        name: 'Weighted Sensory Caterpillar',
        sku: 'FDL-PLS-003',
        quantity: 1,
        price: 75.0,
        subtotal: 75.0,
      },
    ],
    payment: {
      paymentId: 'pay-7723',
      paymentMethod: 'GCash',
      transactionRef: 'PAY-GCASH-339184',
      amount: 90.0,
      status: 'PAID',
      paidAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    shipment: {
      shipmentId: 'shp-4003',
      carrier: 'Ninja Van',
      trackingNumber: 'NV-PH-992100',
      status: 'DELIVERED',
      shippedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      deliveredAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  },
];
