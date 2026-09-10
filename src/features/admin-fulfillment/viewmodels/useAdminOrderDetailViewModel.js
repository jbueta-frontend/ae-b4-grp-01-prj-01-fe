import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getAdminOrderDetail, updateAdminOrderStatus } from '../../../services/adminService';
import { getCustomerOrderById, cancelOrder } from '../../../services/orderService';

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
      let data = null;
      try {
        data = await getAdminOrderDetail(orderId);
      } catch (adminErr) {
        // Try customer order lookup or local storage
        try {
          data = await getCustomerOrderById(orderId);
        } catch {
          const local = JSON.parse(localStorage.getItem('fiddlemania_orders') || '[]');
          data = local.find((o) => o.orderId === orderId || o.orderNumber === orderId);
        }
      }

      if (data) {
        setOrder(data);
      } else {
        // Look in local storage for order
        const local = JSON.parse(localStorage.getItem('fiddlemania_orders') || '[]');
        const found = local.find((o) => o.orderId === orderId || o.orderNumber === orderId);
        if (found) {
          setOrder(found);
        } else {
          setError(`Order "${orderId}" not found in database.`);
          setOrder(null);
        }
      }
    } catch (err) {
      setError(err?.message || `Order "${orderId}" could not be retrieved.`);
      setOrder(null);
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
    setFeedback(null);
    try {
      if (newStatus === 'CANCELLED') {
        // 3. Order Cancellation: PUT /orders/:orderId/cancel
        await cancelOrder(orderId);
      } else {
        await updateAdminOrderStatus(orderId, newStatus);
      }
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
