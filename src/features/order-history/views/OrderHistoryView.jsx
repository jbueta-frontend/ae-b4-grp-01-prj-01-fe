import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, ArrowRight, RotateCcw } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

export default function OrderHistoryView() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('fiddlemania_orders') || '[]'
      );
      if (saved.length > 0) {
        setOrders(saved);
      } else {
        // Seed default sample order for prototype exploration
        const defaultOrder = {
          orderId: 'FM-824109',
          trackingNumber: 'TRK-98314512',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          total: 96.0,
          status: 'In Transit',
          estimatedDelivery: 'Sep 14 – Sep 16',
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
        };
        setOrders([defaultOrder]);
      }
    } catch {
      setOrders([]);
    }
  }, []);

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
            {orders.map((order) => (
              <div key={order.orderId} className="card-clean">
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
                        ₱{order.total.toFixed(2)}
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
                      <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {order.orderId}
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
                      backgroundColor:
                        order.status === 'Delivered'
                          ? 'var(--success-bg)'
                          : 'var(--accent-light)',
                      color:
                        order.status === 'Delivered'
                          ? 'var(--success)'
                          : 'var(--accent)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    <Truck size={13} /> {order.status || 'In Transit'}
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
                            Qty: {item.quantity} • {item.variant}
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
                    gap: '10px',
                  }}
                >
                  <button
                    onClick={() =>
                      navigate(`/track/${order.trackingNumber}`, {
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
