import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

export default function CartDrawer() {
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
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="drawer-backdrop" onClick={closeCart}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-hairline)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--accent)" />
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Your Shopping Bag ({itemCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            style={{
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
            }}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: 'var(--bg-subtle)',
            borderBottom: '1px solid var(--border-hairline)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color:
                freeShippingRemaining === 0
                  ? 'var(--success)'
                  : 'var(--text-main)',
              marginBottom: '8px',
            }}
          >
            {freeShippingRemaining === 0 ? (
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} /> Free Carbon-Neutral Delivery Unlocked!
              </span>
            ) : (
              <span>
                Add <strong>${freeShippingRemaining.toFixed(2)}</strong> more
                for Free Shipping
              </span>
            )}
            <span>
              ${subtotal.toFixed(2)} / ${freeShippingThreshold.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'var(--border-hairline)',
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

        {/* Item List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 0',
                color: 'var(--text-muted)',
              }}
            >
              <ShoppingBag
                size={40}
                style={{ margin: '0 auto 16px', opacity: 0.3 }}
              />
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>
                Your bag is empty
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '24px' }}>
                Explore our curated collection of architectural toys.
              </p>
              <button onClick={closeCart} className="btn btn-outline btn-sm">
                Start Exploring
              </button>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border-hairline)',
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '72px',
                      height: '72px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      flexShrink: 0,
                    }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </h4>
                    {item.variant && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginTop: '2px',
                        }}
                      >
                        {item.variant}
                      </span>
                    )}
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        marginTop: '6px',
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Stepper + Delete */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                      }}
                    >
                      <div
                        className="stepper"
                        style={{
                          transform: 'scale(0.88)',
                          transformOrigin: 'left center',
                        }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.variant,
                              item.quantity - 1
                            )
                          }
                          className="stepper-btn"
                          aria-label="Decrease quantity"
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
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.variant)}
                        style={{
                          color: 'var(--text-light)',
                          padding: '4px',
                          transition: 'color 0.15s ease',
                        }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Financial Breakdown & CTA */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border-hairline)',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
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
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-hairline)',
                }}
              >
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Unmissable Primary CTA */}
            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-block"
              style={{ padding: '16px 24px', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            {/* Understated Secondary Link */}
            <button
              onClick={closeCart}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                marginTop: '12px',
                cursor: 'pointer',
              }}
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
