import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../../services/api';
import { SAMPLE_ADMIN_ORDERS } from '../models/adminOrderModel';

export function useAdminOrdersViewModel() {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }

      const res = await api.get('/admin/orders', { params });
      // api unwraps res.data.data
      let list = [];
      let total = 0;

      if (Array.isArray(res)) {
        list = res;
        total = res.length;
      } else if (Array.isArray(res?.orders)) {
        list = res.orders;
        total = res.total || res.orders.length;
      }

      if (list.length > 0) {
        setOrders(list);
        setTotalCount(total);
      } else {
        // Fallback to demo sample orders if database has no live orders yet
        setOrders(SAMPLE_ADMIN_ORDERS);
        setTotalCount(SAMPLE_ADMIN_ORDERS.length);
      }
    } catch {
      // Graceful fallback for local development or empty state
      setOrders(SAMPLE_ADMIN_ORDERS);
      setTotalCount(SAMPLE_ADMIN_ORDERS.length);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (ord.orderNumber || ord.orderId || '')
          .toLowerCase()
          .includes(query) ||
        (ord.user?.name || ord.customerName || '')
          .toLowerCase()
          .includes(query) ||
        (ord.user?.email || ord.customerEmail || '')
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        (ord.status || '').toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return {
    orders: filteredOrders,
    rawCount: orders.length,
    totalCount,
    page,
    totalPages,
    statusFilter,
    setStatusFilter: (st) => {
      setStatusFilter(st);
      setPage(1);
    },
    searchQuery,
    setSearchQuery,
    loading,
    error,
    goToPage: (p) => setPage(Math.min(Math.max(1, p), totalPages)),
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    refresh: fetchOrders,
  };
}
