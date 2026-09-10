/**
 * Admin Reports Data Models & Date Range Helpers
 */

export const DATE_PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'last7days', label: 'Last 7 Days' },
  { id: 'last30days', label: 'Last 30 Days' },
  { id: 'thisMonth', label: 'This Month' },
  { id: 'allTime', label: 'All Time' },
];

export function formatDateInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateRangeByPreset(presetId) {
  const now = new Date();
  const to = formatDateInput(now);
  let from = to;

  switch (presetId) {
    case 'today':
      from = to;
      break;
    case 'last7days': {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      from = formatDateInput(past);
      break;
    }
    case 'last30days': {
      const past = new Date();
      past.setDate(past.getDate() - 30);
      from = formatDateInput(past);
      break;
    }
    case 'thisMonth': {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      from = formatDateInput(firstOfMonth);
      break;
    }
    case 'allTime':
      from = '2024-01-01';
      break;
    default:
      from = to;
  }

  return { from, to };
}

export const INITIAL_REPORTS_STATE = {
  totalRevenue: 0,
  orderCount: 0,
  averageOrderValue: 0,
  activeProductsCount: 0,
  lowStockAlerts: [],
  orderMetrics: {
    total: 0,
    confirmed: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
  },
  topProducts: [],
};
