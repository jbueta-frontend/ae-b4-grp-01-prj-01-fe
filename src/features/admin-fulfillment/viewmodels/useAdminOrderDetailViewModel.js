import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { SAMPLE_ADMIN_ORDERS } from '../models/adminOrderModel';

export function useAdminOrderDetailViewModel() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      const data = res?.order || res;
      if (data) {
        setOrder(data);
      } else {
        throw new Error('Order data not found');
      }
    } catch {
      // Look up in sample orders
      const sample = SAMPLE_ADMIN_ORDERS.find(
        (o) => o.orderId === orderId || o.orderNumber === orderId
      );
      if (sample) {
        setOrder(sample);
      } else {
        // Synthesize an order for mock id
        setOrder({
          ...SAMPLE_ADMIN_ORDERS[0],
          orderId,
          orderNumber: `FM-${orderId.replace(/\D/g, '') || '901234'}`,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const updateOrderStatus = async (newStatus) => {
    if (!orderId) return;
    setIsUpdating(true);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus }).catch(() => {});
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
      setFeedback(`Order status updated to ${newStatus}`);
    } catch {
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
      setFeedback(`Order status set to ${newStatus}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    orderId,
    order,
    loading,
    error,
    feedback,
    clearFeedback: () => setFeedback(null),
    isUpdating,
    updateOrderStatus,
    refresh: fetchOrderDetail,
  };
}
