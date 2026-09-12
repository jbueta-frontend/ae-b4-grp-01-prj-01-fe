import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Package,
  Truck,
  Home,
  Clock,
  ExternalLink,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { getCustomerOrderById } from '../../../services/orderService';
import { getEffectiveOrderStatus } from '../../../services/orderSync';
import { formatPHP } from '../../../shared/utils/currency';

export default function OrderConfirmationView() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!location.state?.order);
  const [order, setOrder] = useState(() => {
    let initial = null;
    if (location.state?.order) {
      initial = location.state.order;
    } else {
      try {
        const local = JSON.parse(
          localStorage.getItem('fiddlemania_orders') || '[]'
        );
        initial = local.find(
          (o) => o.orderId === orderId || o.orderNumber === orderId
        );
      } catch {}
    }
    if (initial) {
      const effective = getEffectiveOrderStatus(initial);
      return { ...initial, status: effective };
    }
    return null;
  });

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      getCustomerOrderById(orderId)
        .then((res) => {
          if (res) {
            const effective = getEffectiveOrderStatus(res);
            setOrder({ ...res, status: effective });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  // Live order status synchronization listener
  useEffect(() => {
    const handleOrderUpdate = (e) => {
      const { orderId: updatedId, status } = e.detail || {};
      const match =
        updatedId === orderId ||
        (order && (updatedId === order.orderId || updatedId === order.orderNumber));
      if (match && status) {
        setOrder((prev) => (prev ? { ...prev, status: status.toUpperCase() } : prev));
      }
    };

    window.addEventListener('fiddlemania_order_updated', handleOrderUpdate);
    return () => {
      window.removeEventListener('fiddlemania_order_updated', handleOrderUpdate);
    };
  }, [orderId, order]);

  if (loading && !order) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container-narrow">
          <div className="card-clean" style={{ padding: '48px 24px' }}>
            <div className="skeleton-line" style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Retrieving Order Record...
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Fetching verified purchase details from the database.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container-narrow">
          <div className="card-clean" style={{ padding: '48px 24px' }}>
            <AlertCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
              Order Not Found
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '24px' }}>
              We could not find an active order matching reference "{orderId}".
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/orders" className="btn btn-primary btn-sm">
                View My Orders
              </Link>
              <Link to="/" className="btn btn-outline btn-sm">
                Return to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const normStatus = (order.status || 'PENDING').toUpperCase();
  const isCancelled = normStatus === 'CANCELLED';

  // Derive dynamic delivery itinerary from actual status
  const steps = [
    {
      label: 'Order Placed',
      status: isCancelled ? 'cancelled' : 'completed',
      icon: Clock,
      desc: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Verified',
    },
    {
      label: 'Confirmed',
      status: isCancelled
        ? 'cancelled'
        : normStatus === 'PENDING'
        ? 'upcoming'
        : 'completed',
      icon: Package,
      desc: normStatus === 'PENDING' ? 'Awaiting Confirmation' : 'Warehouse Allocated',
    },
    {
      label: 'In Transit',
      status: isCancelled
        ? 'cancelled'
        : normStatus === 'SHIPPED'
        ? 'current'
        : normStatus === 'DELIVERED'
        ? 'completed'
        : 'upcoming',
      icon: Truck,
      desc: normStatus === 'SHIPPED' ? 'With Courier' : 'Express Courier',
    },
    {
      label: 'Delivered',
      status: isCancelled
        ? 'cancelled'
        : normStatus === 'DELIVERED'
        ? 'completed'
        : 'upcoming',
      icon: Home,
      desc: normStatus === 'DELIVERED' ? 'Signed & Received' : 'Doorstep Handover',
    },
  ];

  const address = order.shippingAddress || {};
  const orderItems = order.items || [];
  const orderTotal = Number(order.totalAmount || order.total || 0);
  const subtotal = Number(order.subtotal || orderTotal - (Number(order.shippingFee) || 0));

  return (
    <div style={{ padding: '60px 0 100px' }}>
      <div className="container-narrow">
        {/* Success Feedback Card */}
        <div
          className="card-clean"
          style={{
            textAlign: 'center',
            padding: '48px 32px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: isCancelled ? '#FEF2F2' : 'var(--success-bg)',
              color: isCancelled ? '#DC2626' : 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            {isCancelled ? (
              <AlertCircle size={36} strokeWidth={2.5} />
            ) : (
              <CheckCircle2 size={36} strokeWidth={2.5} />
            )}
          </div>

          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: isCancelled ? '#DC2626' : 'var(--accent)',
            }}
          >
            {isCancelled ? 'Order Cancelled' : 'Order Recorded'}
          </span>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginTop: '4px',
              marginBottom: '8px',
            }}
          >
            {isCancelled ? 'Order Has Been Cancelled' : 'Thank You for Your Order'}
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.9375rem',
              marginBottom: '16px',
            }}
          >
            {isCancelled
              ? 'This purchase has been cancelled. If any charges were captured, they will be reversed.'
              : `Order details and fulfillment progress updates are confirmed for ${address.email || 'your account'}.`}
          </p>

          <div
            style={{
              display: 'inline-flex',
              gap: '16px',
              backgroundColor: 'var(--bg-subtle)',
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <span>
              Order #: <strong>{order.orderNumber || order.orderId}</strong>
            </span>
            <span>•</span>
            <span>
              Status: <strong style={{ color: isCancelled ? '#DC2626' : 'var(--accent)' }}>{normStatus}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Delivery Itinerary Stepper */}
        {!isCancelled && (
          <div className="card-clean" style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                marginBottom: '24px',
              }}
            >
              Fulfillment & Delivery Progress
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted
                          ? 'var(--success)'
                          : isCurrent
                            ? 'var(--accent)'
                            : 'var(--bg-muted)',
                        color:
                          isCompleted || isCurrent
                            ? '#FFFFFF'
                            : 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                      }}
                    >
                      {step.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                      }}
                    >
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ordered Items Summary */}
        <div className="card-clean" style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            Items in this Package
          </h2>

          {orderItems.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No individual item records available for this order.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orderItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    paddingBottom: '14px',
                    borderBottom:
                      i < orderItems.length - 1
                        ? '1px solid var(--border-hairline)'
                        : 'none',
                  }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '54px',
                        height: '54px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-subtle)',
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                    {formatPHP((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Pricing breakdown */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-hairline)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal:</span>
              <span>{formatPHP(subtotal)}</span>
            </div>
            {order.shippingFee !== undefined && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping Fee:</span>
                <span>{Number(order.shippingFee) === 0 ? 'FREE' : formatPHP(order.shippingFee)}</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--text-main)',
                paddingTop: '8px',
                borderTop: '1px dashed var(--border-hairline)',
              }}
            >
              <span>Total Amount:</span>
              <span style={{ color: 'var(--accent)' }}>{formatPHP(orderTotal)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address Card (ERD Standards) */}
        {address.addressLine1 && (
          <div className="card-clean" style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '12px' }}>
              Delivery Destination
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              <strong>{address.fullName || address.recipientName}</strong>
              {address.phone && <span> • {address.phone}</span>}
              <br />
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ''}
              <br />
              {[address.city, address.stateProvince, address.postalCode].filter(Boolean).join(', ')}
              <br />
              {address.country || 'Philippines'}
            </p>
          </div>
        )}

        {/* Clear Actions */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {(order.trackingNumber || order.orderId) && !isCancelled && (
            <button
              onClick={() =>
                navigate(`/track/${order.trackingNumber || order.orderId}`, {
                  state: { order },
                })
              }
              className="btn btn-primary"
              style={{ padding: '14px 28px' }}
            >
              <span>Live Shipment Tracking</span>
              <ArrowRight size={18} />
            </button>
          )}
          <Link
            to="/orders"
            className="btn btn-outline"
            style={{ padding: '14px 24px' }}
          >
            My Orders
          </Link>
          <Link
            to="/"
            className="btn btn-outline"
            style={{ padding: '14px 24px' }}
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
