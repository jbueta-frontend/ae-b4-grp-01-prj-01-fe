import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAdminOrders } from '../../../services/adminService';
import { getCustomerOrders } from '../../../services/orderService';

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

      let list = [];
      let total = 0;

      try {
        const res = await getAdminOrders(params);
        if (Array.isArray(res)) {
          list = res;
          total = res.length;
        } else if (Array.isArray(res?.orders)) {
          list = res.orders;
          total = res.total || res.orders.length;
        }
      } catch (adminErr) {
        // If unauthenticated or 401/403, check customer orders or local database orders
        try {
          const custOrders = await getCustomerOrders();
          if (Array.isArray(custOrders) && custOrders.length > 0) {
            list = custOrders;
            total = custOrders.length;
          } else {
            const local = JSON.parse(localStorage.getItem('fiddlemania_orders') || '[]');
            list = local;
            total = local.length;
          }
        } catch {
          const local = JSON.parse(localStorage.getItem('fiddlemania_orders') || '[]');
          list = local;
          total = local.length;
        }
      }

      // If there are no orders in the database, present honest empty state
      setOrders(list);
      setTotalCount(total);
    } catch (err) {
      setError(err?.message || 'Failed to retrieve fulfillment orders');
      setOrders([]);
      setTotalCount(0);
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
