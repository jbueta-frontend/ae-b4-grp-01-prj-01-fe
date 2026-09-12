/**
 * Order Synchronization & Status State Manager
 * Ensures bidirectional consistency between Admin operations and Customer portal,
 * strictly aligned with the ERD Order Status enum:
 * (PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED)
 */

export const ERD_ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

/**
 * Synchronize an order's status across all storage layers & dispatch live events
 * @param {string} orderId - Order identifier or orderNumber
 * @param {string} newStatus - Valid ERD status
 */
export function syncOrderStatus(orderId, newStatus) {
  if (!orderId || !newStatus) return;
  const normalized = newStatus.trim().toUpperCase();

  // 1. Update 'fiddlemania_orders' in localStorage
  try {
    const raw = localStorage.getItem('fiddlemania_orders');
    if (raw) {
      const orders = JSON.parse(raw);
      if (Array.isArray(orders)) {
        const updated = orders.map((o) => {
          const isMatch =
            o.orderId === orderId ||
            o.orderNumber === orderId ||
            o.id === orderId;
          if (isMatch) {
            return {
              ...o,
              status: normalized,
              updatedAt: new Date().toISOString(),
            };
          }
          return o;
        });
        localStorage.setItem('fiddlemania_orders', JSON.stringify(updated));
      }
    }
  } catch (err) {
    console.warn('Failed to update fiddlemania_orders in localStorage:', err);
  }

  // 2. Update persistent override map 'fiddlemania_order_statuses'
  try {
    const rawMap = localStorage.getItem('fiddlemania_order_statuses');
    const statusMap = rawMap ? JSON.parse(rawMap) : {};
    statusMap[orderId] = normalized;
    localStorage.setItem('fiddlemania_order_statuses', JSON.stringify(statusMap));
  } catch (err) {
    console.warn('Failed to update fiddlemania_order_statuses in localStorage:', err);
  }

  // 3. Broadcast custom event for active tabs & components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('fiddlemania_order_updated', {
        detail: { orderId, status: normalized },
      })
    );
  }
}

/**
 * Applies all stored status overrides to an array of orders
 * @param {Array} orders - List of order objects
 * @returns {Array} Orders with latest statuses applied
 */
export function applyOrderStatusOverrides(orders) {
  if (!Array.isArray(orders)) return [];
  try {
    const rawMap = localStorage.getItem('fiddlemania_order_statuses');
    if (!rawMap) return orders;
    const statusMap = JSON.parse(rawMap);

    return orders.map((ord) => {
      const id = ord.orderId || ord.orderNumber || ord.id;
      if (id && statusMap[id]) {
        return {
          ...ord,
          status: statusMap[id],
        };
      }
      return ord;
    });
  } catch {
    return orders;
  }
}

/**
 * Get effective status for a single order
 * @param {Object|string} orderOrId
 * @returns {string} Effective status
 */
export function getEffectiveOrderStatus(orderOrId) {
  if (!orderOrId) return 'PENDING';
  const orderId = typeof orderOrId === 'string'
    ? orderOrId
    : orderOrId.orderId || orderOrId.orderNumber || orderOrId.id;

  try {
    const rawMap = localStorage.getItem('fiddlemania_order_statuses');
    if (rawMap) {
      const statusMap = JSON.parse(rawMap);
      if (orderId && statusMap[orderId]) {
        return statusMap[orderId];
      }
    }
  } catch {}

  if (typeof orderOrId === 'object' && orderOrId.status) {
    const st = orderOrId.status.toUpperCase();
    if (st.includes('COD') || st.includes('PENDING')) return 'PENDING';
    if (st.includes('CONFIRM') || st.includes('PROCESS')) return 'CONFIRMED';
    if (st.includes('SHIP')) return 'SHIPPED';
    if (st.includes('DELIVER') || st.includes('COMPLETE')) return 'DELIVERED';
    if (st.includes('CANCEL')) return 'CANCELLED';
    return st;
  }

  return 'PENDING';
}
