import { useParams, useLocation, Link } from 'react-router-dom';
import {
  Truck,
  Package,
  CheckCircle2,
  ArrowLeft,
  Download,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';

export default function ShipmentTrackingView() {
  const { trackingNumber } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();

  const order = location.state?.order || {
    orderId: 'FM-824109',
    trackingNumber: trackingNumber || 'TRK-98314512',
    carrier: 'EcoPost Carbon-Zero Courier',
    service: 'Guaranteed Carbon-Neutral Ground',
    status: 'In Transit',
    estimatedDelivery: 'Wednesday, Sep 16 by 5:00 PM',
    origin: 'Munich Fulfillment Hub, Germany',
    destination: 'Portland, OR, United States',
    items: [
      {
        id: 'prod-01',
        name: 'Architect Beechwood Block Set',
        price: 48.0,
        quantity: 1,
        variant: 'Natural Beech',
        image:
          'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
      },
    ],
  };

  const milestones = [
    {
      title: 'Package in Transit with Courier',
      location: 'Frankfurt Central Distribution Center',
      time: 'Today at 08:42 AM',
      done: true,
      current: true,
    },
    {
      title: 'Customs Clearance Completed',
      location: 'Munich International Export Facility',
      time: 'Yesterday at 04:15 PM',
      done: true,
      current: false,
    },
    {
      title: 'Dispatched & Handed Over',
      location: 'FiddleMania Handcrafted Workshop',
      time: 'Sep 09 at 11:30 AM',
      done: true,
      current: false,
    },
    {
      title: 'Order Verified & Packed in Recycled Box',
      location: 'Bavarian Woodcraft Depot',
      time: 'Sep 09 at 09:12 AM',
      done: true,
      current: false,
    },
  ];

  const handleReorder = (item) => {
    addToCart(item, 1, item.variant);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container-narrow">
        {/* Back Link */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            marginBottom: '24px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Collection</span>
        </Link>

        {/* Header Tracker Card */}
        <div className="card-clean" style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border-hairline)',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                <Truck size={14} /> In Transit
              </span>
              <h1
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                Tracking: {order.trackingNumber}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Carrier: <strong>{order.carrier || 'EcoPost'}</strong> • Order #
                {order.orderId}
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() =>
                  alert('Itemized invoice receipt PDF downloaded.')
                }
                className="btn btn-outline btn-sm"
              >
                <Download size={15} />
                <span>Receipt</span>
              </button>
            </div>
          </div>

          {/* Expected Date Banner */}
          <div
            style={{
              marginTop: '20px',
              backgroundColor: 'var(--bg-subtle)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
                Estimated Delivery
              </span>
              <p
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                }}
              >
                {order.estimatedDelivery}
              </p>
            </div>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--success)',
                backgroundColor: 'var(--success-bg)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              On Schedule
            </span>
          </div>
        </div>

        {/* Real-time Status Milestones */}
        <div className="card-clean" style={{ marginBottom: '24px' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            Live Progress Updates
          </h2>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {milestones.map((m, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', gap: '16px', position: 'relative' }}
              >
                {/* Node & Line */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: m.current
                        ? 'var(--accent)'
                        : m.done
                          ? 'var(--text-main)'
                          : 'var(--bg-muted)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    {m.done ? (
                      <CheckCircle2 size={16} strokeWidth={2.5} />
                    ) : (
                      <Package size={14} />
                    )}
                  </div>
                  {idx < milestones.length - 1 && (
                    <div
                      style={{
                        width: '2px',
                        flex: 1,
                        backgroundColor: 'var(--border-hairline)',
                        marginTop: '4px',
                      }}
                    />
                  )}
                </div>

                {/* Info */}
                <div
                  style={{
                    paddingBottom: idx < milestones.length - 1 ? '16px' : '0',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                    }}
                  >
                    {m.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      marginTop: '2px',
                    }}
                  >
                    {m.location}
                  </p>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-light)',
                      marginTop: '4px',
                      display: 'block',
                    }}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ordered Items & Reorder */}
        <div className="card-clean">
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            Package Contents
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  paddingBottom: '12px',
                  borderBottom:
                    idx < order.items.length - 1
                      ? '1px solid var(--border-hairline)'
                      : 'none',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '54px',
                      height: '54px',
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
                      Qty: {item.quantity} • {item.variant}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleReorder(item)}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '6px' }}
                >
                  <RotateCcw size={14} />
                  <span>Reorder</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
