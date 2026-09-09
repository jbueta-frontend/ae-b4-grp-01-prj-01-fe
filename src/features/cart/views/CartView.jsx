import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function CartView() {
  const {
    items,
    itemCount,
    subtotal,
    freeShippingThreshold,
    freeShippingRemaining,
    freeShippingProgress,
    shipping,
    tax,
    total,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div
        className="container"
        style={{ padding: '80px 20px', textAlign: 'center' }}
      >
        <ShoppingBag
          size={48}
          style={{ margin: '0 auto 20px', opacity: 0.3 }}
        />
        <h1
          style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}
        >
          Your Bag is Empty
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
          Discover handcrafted wooden toys and kinetic STEM building sets.
        </p>
        <Link to="/" className="btn btn-primary">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              marginBottom: '16px',
            }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
            }}
          >
            Shopping Bag ({itemCount})
          </h1>
        </div>

        {/* Free Shipping Tracker */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '10px',
              color:
                freeShippingRemaining === 0
                  ? 'var(--success)'
                  : 'var(--text-main)',
            }}
          >
            {freeShippingRemaining === 0 ? (
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={16} /> Free Carbon-Neutral Delivery Unlocked!
              </span>
            ) : (
              <span>
                Add <strong>${freeShippingRemaining.toFixed(2)}</strong> more to
                qualify for Free Shipping
              </span>
            )}
            <span>
              ${subtotal.toFixed(2)} / ${freeShippingThreshold.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              height: '8px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor:
                  freeShippingRemaining === 0
                    ? 'var(--success)'
                    : 'var(--accent)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* 2 Column Layout: Items + Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: Item Cards */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {items.map((item) => (
              <div
                key={`${item.id}-${item.variant}`}
                className="card-clean"
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  padding: '20px',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '96px',
                    height: '96px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                        }}
                      >
                        {item.name}
                      </h3>
                      {item.variant && (
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {item.variant}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '16px',
                    }}
                  >
                    <div className="stepper">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.variant,
                            item.quantity - 1
                          )
                        }
                        className="stepper-btn"
                      >
                        −
                      </button>
                      <div className="stepper-value">{item.quantity}</div>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.variant,
                            item.quantity + 1
                          )
                        }
                        className="stepper-btn"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.variant)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--text-light)' }}
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Sticky Order Summary */}
          <div
            className="card-clean"
            style={{ position: 'sticky', top: '24px' }}
          >
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                marginBottom: '20px',
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Carbon-Neutral Delivery</span>
                <span>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Estimated Sales Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-hairline)',
                }}
              >
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-block"
              style={{ padding: '16px', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={14} color="var(--accent)" />
              <span>256-bit Encrypted SSL Checkout Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
