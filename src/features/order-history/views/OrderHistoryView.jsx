import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, ArrowRight, RotateCcw, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { getCustomerOrders, cancelOrder } from '../../../services/orderService';

export default function OrderHistoryView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const serverOrders = await getCustomerOrders();
      const localOrders = JSON.parse(
        localStorage.getItem('fiddlemania_orders') || '[]'
      );

      // Merge backend orders with any local orders
      const combined = [...serverOrders];
      const seenIds = new Set(serverOrders.map((o) => o.orderId || o.orderNumber));

      localOrders.forEach((lo) => {
        const id = lo.orderId || lo.orderNumber;
        if (!seenIds.has(id)) {
          combined.push(lo);
        }
      });

      setOrders(combined);
    } catch {
      const localOrders = JSON.parse(
        localStorage.getItem('fiddlemania_orders') || '[]'
      );
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (
      !window.confirm(
        `Are you sure you want to cancel Order ${orderId}? This will release the reserved inventory back to available warehouse stock.`
      )
    ) {
      return;
    }

    setCancellingId(orderId);
    setFeedback(null);
    try {
      await cancelOrder(orderId);

      // Update state locally
      setOrders((prev) =>
        prev.map((ord) => {
          const match = ord.orderId === orderId || ord.orderNumber === orderId;
          return match ? { ...ord, status: 'CANCELLED' } : ord;
        })
      );

      // Update localStorage cache as well
      try {
        const local = JSON.parse(localStorage.getItem('fiddlemania_orders') || '[]');
        const updated = local.map((ord) => {
          const match = ord.orderId === orderId || ord.orderNumber === orderId;
          return match ? { ...ord, status: 'CANCELLED' } : ord;
        });
        localStorage.setItem('fiddlemania_orders', JSON.stringify(updated));
      } catch {}

      setFeedback({
        type: 'success',
        message: `Order ${orderId} has been successfully cancelled and warehouse inventory released.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || `Could not cancel order ${orderId}.`,
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container-narrow">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              Your Orders
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Track shipments, reorder favorites, and review itemized receipts.
            </p>
          </div>
          <Link to="/" className="btn btn-outline btn-sm">
            Browse Toys
          </Link>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor:
                feedback.type === 'success'
                  ? 'rgba(22, 163, 74, 0.08)'
                  : 'rgba(220, 38, 38, 0.08)',
              color: feedback.type === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${feedback.type === 'success' ? 'rgba(22, 163, 74, 0.25)' : 'rgba(220, 38, 38, 0.25)'}`,
            }}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div
            className="card-clean"
            style={{ textAlign: 'center', padding: '60px 20px' }}
          >
            <Package
              size={40}
              style={{ margin: '0 auto 16px', opacity: 0.3 }}
            />
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>
              No orders yet
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                marginBottom: '20px',
              }}
            >
              When you place an order, it will appear here with live tracking.
            </p>
            <Link to="/" className="btn btn-primary btn-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {orders.map((order) => {
              const currentOrderId = order.orderId || order.orderNumber;
              const isCancelled = order.status === 'CANCELLED';
              const isDelivered = order.status === 'Delivered';

              return (
                <div key={currentOrderId} className="card-clean">
                  {/* Order Meta Bar */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid var(--border-hairline)',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                          }}
                        >
                          Order Placed
                        </span>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                          }}
                        >
                          Total
                        </span>
                        <p style={{ fontSize: '0.875rem', fontWeight: 800 }}>
                          ₱{(Number(order.totalAmount || order.total) || 0).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                          }}
                        >
                          Order #
                        </span>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>
                          {currentOrderId}
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: isCancelled
                          ? 'rgba(220, 38, 38, 0.08)'
                          : isDelivered
                            ? 'var(--success-bg)'
                            : 'var(--accent-light)',
                        color: isCancelled
                          ? '#dc2626'
                          : isDelivered
                            ? 'var(--success)'
                            : 'var(--accent)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: isCancelled ? '1px solid rgba(220, 38, 38, 0.25)' : 'none',
                      }}
                    >
                      {isCancelled ? (
                        <XCircle size={13} />
                      ) : (
                        <Truck size={13} />
                      )}
                      <span>{order.status || 'In Transit'}</span>
                    </span>
                  </div>

                  {/* Items in order */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '48px',
                              height: '48px',
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          />
                          <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                              {item.name}
                            </h4>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                              }}
                            >
                              Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(item, 1, item.variant)}
                          className="btn btn-ghost btn-sm"
                          style={{ gap: '6px', fontSize: '0.8125rem' }}
                        >
                          <RotateCcw size={13} />
                          <span>Reorder</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Action CTA */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {!isCancelled && !isDelivered && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(currentOrderId)}
                        disabled={cancellingId === currentOrderId}
                        className="btn btn-outline btn-sm"
                        style={{
                          color: '#dc2626',
                          borderColor: '#fca5a5',
                          gap: '6px',
                          fontSize: '0.8125rem',
                        }}
                      >
                        <XCircle size={14} />
                        <span>
                          {cancellingId === currentOrderId
                            ? 'Cancelling...'
                            : 'Cancel Order'}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        navigate(`/track/${order.trackingNumber || currentOrderId}`, {
                          state: { order },
                        })
                      }
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <Truck size={14} />
                      <span>Track Package</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
