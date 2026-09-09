import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Package,
  Truck,
  Home,
  Clock,
} from 'lucide-react';

export default function OrderConfirmationView() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Try state or fallback to default sample order
  const order = location.state?.order || {
    orderId: orderId || 'FM-824109',
    trackingNumber: 'TRK-98314512',
    createdAt: new Date().toISOString(),
    total: 108.64,
    shippingAddress: {
      fullName: 'Alexander Wright',
      email: 'alex.wright@example.com',
      address: '427 Maplewood Avenue',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
    },
    items: [
      {
        id: 'prod-01',
        name: 'Architect Beechwood Block Set',
        price: 48.0,
        quantity: 2,
        variant: 'Natural Beech',
        image:
          'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
      },
    ],
    estimatedDelivery: 'Sep 14 – Sep 16',
  };

  const steps = [
    {
      label: 'Order Placed',
      status: 'completed',
      icon: Clock,
      desc: 'Verified',
    },
    {
      label: 'Dispatched',
      status: 'current',
      icon: Package,
      desc: 'In Packing',
    },
    {
      label: 'In Transit',
      status: 'upcoming',
      icon: Truck,
      desc: 'Zero-Emission',
    },
    { label: 'Delivered', status: 'upcoming', icon: Home, desc: 'Doorstep' },
  ];

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
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckCircle2 size={36} strokeWidth={2.5} />
          </div>

          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--accent)',
            }}
          >
            Payment Confirmed
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
            Thank You for Your Order
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.9375rem',
              marginBottom: '16px',
            }}
          >
            We've sent your itemized receipt and tracking updates to{' '}
            <strong>{order.shippingAddress.email}</strong>.
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
              Order #: <strong>{order.orderId}</strong>
            </span>
            <span>•</span>
            <span>
              Est. Arrival: <strong>{order.estimatedDelivery}</strong>
            </span>
          </div>
        </div>

        {/* Scannable Delivery Itinerary Stepper */}
        <div className="card-clean" style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '24px',
            }}
          >
            Delivery Itinerary
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

        {/* Ordered Items Summary */}
        <div className="card-clean" style={{ marginBottom: '36px' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            Items in this Package
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            {order.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  paddingBottom: '14px',
                  borderBottom:
                    i < order.items.length - 1
                      ? '1px solid var(--border-hairline)'
                      : 'none',
                }}
              >
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
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                    {item.name}
                  </h4>
                  <span
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    Qty: {item.quantity} • {item.variant}
                  </span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                  ₱{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clear Actions */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <button
            onClick={() =>
              navigate(`/track/${order.trackingNumber}`, { state: { order } })
            }
            className="btn btn-primary"
            style={{ padding: '14px 28px' }}
          >
            <span>Track Order</span>
            <ArrowRight size={18} />
          </button>
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
