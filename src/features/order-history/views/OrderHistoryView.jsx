import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  ArrowRight,
  RotateCcw,
  XCircle,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  X,
  Send,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { getCustomerOrders, cancelOrder } from '../../../services/orderService';
import {
  ORDER_STATUS_TABS,
  getOrderStatusConfig,
} from '../models/orderModel';

export default function OrderHistoryView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cancellingId, setCancellingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Cancel Order Confirmation Modal State
  const [cancelModalOrder, setCancelModalOrder] = useState(null);

  // Contact Seller Modal State
  const [contactModalOrder, setContactModalOrder] = useState(null);
  const [contactSubject, setContactSubject] = useState('Order Clarification & Product Support');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const loadOrders = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const serverOrders = await getCustomerOrders();
      const localOrders = JSON.parse(
        localStorage.getItem('fiddlemania_orders') || '[]'
      );

      // Merge backend orders with any local orders
      const combined = [...serverOrders];
      const seenIds = new Set(
        serverOrders.map((o) => o.orderId || o.orderNumber)
      );

      localOrders.forEach((lo) => {
        const id = lo.orderId || lo.orderNumber;
        if (!seenIds.has(id)) {
          combined.push(lo);
        }
      });

      setOrders(combined);
    } catch (err) {
      const localOrders = JSON.parse(
        localStorage.getItem('fiddlemania_orders') || '[]'
      );
      setOrders(localOrders);
      setFeedback({
        type: 'error',
        message: err?.message || 'Unable to sync live orders with database. Displaying cached orders.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const confirmCancelOrder = async () => {
    if (!cancelModalOrder) return;
    const orderId = cancelModalOrder.orderId || cancelModalOrder.orderNumber;

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
        const local = JSON.parse(
          localStorage.getItem('fiddlemania_orders') || '[]'
        );
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
      setCancelModalOrder(null);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.message || `Could not cancel order ${orderId}.`,
      });
    } finally {
      setCancellingId(null);
    }
  };

  // 'Buy Again' handler for completed transactions
  const handleBuyAgain = (order) => {
    if (!order.items || order.items.length === 0) {
      setFeedback({
        type: 'error',
        message: 'No items found in this order snapshot to reorder.',
      });
      return;
    }

    let totalItemsAdded = 0;
    order.items.forEach((item) => {
      // Re-add each item using CartContext
      addToCart(item, item.quantity || 1, item.variant || null);
      totalItemsAdded += item.quantity || 1;
    });

    setFeedback({
      type: 'success',
      message: `Added ${totalItemsAdded} item${totalItemsAdded > 1 ? 's' : ''} from Order #${order.orderId || order.orderNumber} to your cart.`,
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart'),
      },
    });
  };

  // 'Contact Seller' handlers
  const openContactSellerModal = (order) => {
    setContactModalOrder(order);
    setContactSubject('Order Clarification & Product Support');
    setContactMessage('');
  };

  const handleSendSellerMessage = (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      const orderRef =
        contactModalOrder.orderId || contactModalOrder.orderNumber;
      setFeedback({
        type: 'success',
        message: `Your inquiry regarding Order #${orderRef} has been sent to our seller concierge. We will respond within 24 hours.`,
      });
      setContactModalOrder(null);
      setContactMessage('');
    }, 500);
  };

  // Compute status counts aligned with ERD
  const statusCounts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => (o.status || '').toUpperCase() === 'PENDING').length,
    CONFIRMED: orders.filter((o) => (o.status || '').toUpperCase() === 'CONFIRMED').length,
    SHIPPED: orders.filter((o) => (o.status || '').toUpperCase() === 'SHIPPED').length,
    DELIVERED: orders.filter((o) => {
      const s = (o.status || '').toUpperCase();
      return s === 'DELIVERED' || s === 'COMPLETED';
    }).length,
    CANCELLED: orders.filter((o) => (o.status || '').toUpperCase() === 'CANCELLED').length,
  };

  // Filter orders by ERD status
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'ALL') return true;
    const s = (order.status || '').toUpperCase();
    if (statusFilter === 'DELIVERED') {
      return s === 'DELIVERED' || s === 'COMPLETED';
    }
    return s === statusFilter;
  });

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container-narrow">
        {/* View Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-main)',
              }}
            >
              Your Orders
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Track shipments, reorder completed purchases, and manage transactions.
            </p>
          </div>
          <Link to="/" className="btn btn-outline btn-sm">
            Browse Toys
          </Link>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor:
                feedback.type === 'success'
                  ? 'rgba(22, 163, 74, 0.08)'
                  : 'rgba(220, 38, 38, 0.08)',
              color: feedback.type === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${
                feedback.type === 'success'
                  ? 'rgba(22, 163, 74, 0.25)'
                  : 'rgba(220, 38, 38, 0.25)'
              }`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {feedback.type === 'success' ? (
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
              )}
              <span>{feedback.message}</span>
            </div>
            {feedback.action && (
              <button
                type="button"
                onClick={feedback.action.onClick}
                className="btn btn-primary btn-xs"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {feedback.action.label}
              </button>
            )}
          </div>
        )}

        {/* ERD Order Status Tabs Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter orders by status"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '24px',
            scrollbarWidth: 'none',
          }}
        >
          {ORDER_STATUS_TABS.map((tab) => {
            const count = statusCounts[tab.key] || 0;
            const isActive = statusFilter === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  border: isActive
                    ? '1.5px solid var(--accent)'
                    : '1px solid var(--border)',
                  backgroundColor: isActive
                    ? 'var(--accent)'
                    : 'var(--bg-surface, #ffffff)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    backgroundColor: isActive
                      ? 'rgba(255, 255, 255, 0.25)'
                      : 'var(--bg-subtle, #f3f4f6)',
                    color: isActive ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders List / Empty States */}
        {loading ? (
          <div
            className="card-clean"
            style={{ textAlign: 'center', padding: '60px 20px' }}
          >
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
              Loading your orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div
            className="card-clean"
            style={{ textAlign: 'center', padding: '60px 20px' }}
          >
            <Package
              size={40}
              style={{ margin: '0 auto 16px', opacity: 0.3 }}
            />
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>
              No orders placed yet
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
        ) : filteredOrders.length === 0 ? (
          <div
            className="card-clean"
            style={{ textAlign: 'center', padding: '60px 20px' }}
          >
            <Package
              size={40}
              style={{ margin: '0 auto 16px', opacity: 0.3 }}
            />
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>
              No {statusFilter.toLowerCase()} orders found
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                marginBottom: '20px',
              }}
            >
              There are currently no records under status &ldquo;{statusFilter}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className="btn btn-outline btn-sm"
            >
              View All Orders
            </button>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {filteredOrders.map((order) => {
              const currentOrderId = order.orderId || order.orderNumber;
              const statusUpper = (order.status || 'PENDING').toUpperCase();
              const isCancelled = statusUpper === 'CANCELLED';
              const isDelivered = statusUpper === 'DELIVERED';
              // Successfully completed transactions (Delivered or Completed)
              const isCompleted = isDelivered || statusUpper === 'COMPLETED';

              const statusConfig = getOrderStatusConfig(order.status);

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
                        gap: '18px',
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
                          Total Amount
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
                        <p
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: 'var(--accent)',
                          }}
                        >
                          {currentOrderId}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.color,
                        border: statusConfig.border,
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {isCancelled ? (
                        <XCircle size={13} />
                      ) : isCompleted ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Truck size={13} />
                      )}
                      <span>{statusConfig.label}</span>
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
                            src={item.image || '/products/zen_garden_pagoda.jpg'}
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
                          type="button"
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

                  {/* Action CTA Row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* For successfully completed transactions: 'Buy Again' and 'Contact Seller' */}
                    {isCompleted && (
                      <>
                        <button
                          type="button"
                          onClick={() => openContactSellerModal(order)}
                          className="btn btn-outline btn-sm"
                          style={{
                            gap: '6px',
                            fontSize: '0.8125rem',
                            color: 'var(--text-main)',
                            borderColor: 'var(--border)',
                          }}
                        >
                          <MessageSquare size={14} />
                          <span>Contact Seller</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBuyAgain(order)}
                          className="btn btn-primary btn-sm"
                          style={{
                            gap: '6px',
                            fontSize: '0.8125rem',
                            boxShadow: '0 2px 6px rgba(188, 90, 69, 0.2)',
                          }}
                        >
                          <RotateCcw size={14} />
                          <span>Buy Again</span>
                        </button>
                      </>
                    )}

                    {/* For active pending / confirmed orders: 'Cancel Order' */}
                    {!isCancelled && !isDelivered && (
                      <button
                        type="button"
                        onClick={() => setCancelModalOrder(order)}
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
                        <span>Cancel Order</span>
                      </button>
                    )}

                    {/* Track Package button */}
                    <button
                      type="button"
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

      {/* Contact Seller Modal */}
      {contactModalOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            padding: '20px',
          }}
          onClick={() => !contactSubmitting && setContactModalOrder(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface, #ffffff)',
              borderRadius: 'var(--radius-lg, 12px)',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid var(--border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                  }}
                >
                  Contact Seller
                </h3>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}
                >
                  Order #{contactModalOrder.orderId || contactModalOrder.orderNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setContactModalOrder(null)}
                className="btn btn-ghost btn-xs"
                style={{ padding: '6px', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Order Snippet */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle, #f9fafb)',
                border: '1px solid var(--border-hairline, #e5e7eb)',
                marginBottom: '20px',
                fontSize: '0.8125rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status: </span>
                <strong style={{ color: '#16a34a' }}>Delivered & Completed</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total: </span>
                <strong>
                  ₱{(Number(contactModalOrder.totalAmount || contactModalOrder.total) || 0).toFixed(2)}
                </strong>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSendSellerMessage}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '6px',
                  }}
                >
                  Inquiry Topic
                </label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--bg-surface, #ffffff)',
                    color: 'var(--text-main)',
                  }}
                >
                  <option value="Order Clarification & Product Support">
                    Order Clarification & Product Support
                  </option>
                  <option value="Replacement or Defect Inquiry">
                    Replacement or Defect Inquiry
                  </option>
                  <option value="Return / Refund Assistance">
                    Return / Refund Assistance
                  </option>
                  <option value="Delivery Feedback & Compliment">
                    Delivery Feedback & Compliment
                  </option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '6px',
                  }}
                >
                  Message to Seller
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Describe your inquiry or question regarding this completed purchase..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    backgroundColor: 'var(--bg-surface, #ffffff)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                }}
              >
                <button
                  type="button"
                  disabled={contactSubmitting}
                  onClick={() => setContactModalOrder(null)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contactSubmitting || !contactMessage.trim()}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Send size={14} />
                  <span>{contactSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Cancel Order Confirmation Modal (Branded Centered Modal) */}
      {cancelModalOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(5px)',
            padding: '20px',
          }}
          onClick={() => !cancellingId && setCancelModalOrder(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface, #ffffff)',
              borderRadius: 'var(--radius-lg, 16px)',
              maxWidth: '500px',
              width: '100%',
              padding: '32px 28px 28px',
              boxShadow:
                '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1)',
              border: '1.5px solid var(--border)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top-Right */}
            <button
              type="button"
              onClick={() => setCancelModalOrder(null)}
              disabled={Boolean(cancellingId)}
              className="btn btn-ghost btn-xs"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '8px',
                borderRadius: 'var(--radius-md, 8px)',
                color: 'var(--text-muted)',
                cursor: cancellingId ? 'not-allowed' : 'pointer',
              }}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {/* 1. Thick Warning SVG Icon (Middle, Alone, No Border) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2.5L1.2 21.2C0.8 21.9 1.3 22.8 2.1 22.8H21.9C22.7 22.8 23.2 21.9 22.8 21.2L12 2.5Z"
                  fill="#DC2626"
                />
                <path
                  d="M12 8.5V14.5"
                  stroke="#FFFFFF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="18" r="1.3" fill="#FFFFFF" />
              </svg>
            </div>

            {/* 2. Primary Heading: 'Cancel Order?' (Centered) */}
            <h3
              id="cancel-modal-title"
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                textAlign: 'center',
                margin: '0 0 8px',
              }}
            >
              Cancel Order?
            </h3>

            {/* 3. Centered Subheading with Inventory Restocking message integrated */}
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                textAlign: 'center',
                maxWidth: '430px',
                margin: '0 auto 20px',
              }}
            >
              Are you sure you want to cancel this order? This action cannot be undone. All reserved items will be released back to available warehouse inventory.
            </p>

            {/* 4. Order Details Container (Kept as is) */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle, #F8F6F2)',
                border: '1.5px solid #E2D9CE',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              }}
            >
              {/* Order Meta Header Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #E8E1D7',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.03em',
                    }}
                  >
                    Order Reference
                  </span>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      marginTop: '2px',
                    }}
                  >
                    #{cancelModalOrder.orderId || cancelModalOrder.orderNumber}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.03em',
                    }}
                  >
                    Total Amount
                  </span>
                  <div
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      letterSpacing: '-0.01em',
                      marginTop: '1px',
                    }}
                  >
                    ₱{(Number(cancelModalOrder.totalAmount || cancelModalOrder.total) || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Items List Preview */}
              {Array.isArray(cancelModalOrder.items) && cancelModalOrder.items.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}
                >
                  {cancelModalOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #EBE5DC',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={item.image || '/products/zen_garden_pagoda.jpg'}
                          alt={item.name}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            border: '1px solid #E5DFD7',
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 700,
                              color: 'var(--text-main)',
                              lineHeight: 1.3,
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              marginTop: '2px',
                            }}
                          >
                            Quantity: <strong>{item.quantity || 1}</strong>
                            {item.variant ? ` • ${item.variant}` : ''}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ₱{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    padding: '8px 0',
                  }}
                >
                  Order includes {cancelModalOrder.items?.length || 1} items
                </div>
              )}
            </div>

            {/* 5. High-Visibility Action Buttons (Keep Order & Cancel Order) */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                width: '100%',
              }}
            >
              <button
                type="button"
                disabled={Boolean(cancellingId)}
                onClick={() => setCancelModalOrder(null)}
                className="btn btn-outline"
                style={{
                  flex: 1,
                  height: '48px',
                  padding: '0 20px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  border: '1.5px solid var(--border)',
                  backgroundColor: 'var(--bg-surface, #ffffff)',
                  color: 'var(--text-main)',
                  borderRadius: 'var(--radius-md, 10px)',
                  cursor: cancellingId ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Keep Order
              </button>

              <button
                type="button"
                disabled={Boolean(cancellingId)}
                onClick={confirmCancelOrder}
                className="btn"
                style={{
                  flex: 1,
                  height: '48px',
                  padding: '0 20px',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  backgroundColor: '#DC2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md, 10px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: cancellingId ? 'not-allowed' : 'pointer',
                  opacity: cancellingId ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <XCircle size={18} />
                <span>
                  {cancellingId ? 'Cancelling...' : 'Cancel Order'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
