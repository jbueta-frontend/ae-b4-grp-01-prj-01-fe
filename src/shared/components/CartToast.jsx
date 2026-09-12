import { useEffect } from 'react';
import { Check, X, ShoppingBag, ArrowRight, RotateCcw } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartToast() {
  const cart = useCart() || {};
  const toast = cart.toast;
  const hideToast = cart.hideToast || (() => {});
  const openCart = cart.openCart || (() => {});
  const undoAddToCart = cart.undoAddToCart || (() => {});

  const isOpen = Boolean(toast?.isOpen);
  const item = toast?.item;

  // Close toast on Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        hideToast();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hideToast]);

  if (!isOpen || !item) return null;

  const handleViewCart = () => {
    hideToast();
    openCart();
  };

  const handleUndo = () => {
    undoAddToCart(item);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        zIndex: 9999,
        width: 'calc(100vw - 48px)',
        maxWidth: '380px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        borderRadius: 'var(--radius-lg)',
        boxShadow:
          '0 20px 40px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.05)',
        animation: 'toastSlideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Top Status Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'rgba(22, 163, 74, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Check size={12} strokeWidth={3} />
          </div>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#15803D',
              letterSpacing: '-0.01em',
            }}
          >
            Successfully Added to Cart!
          </span>
        </div>

        <button
          onClick={hideToast}
          style={{
            color: 'var(--text-muted)',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'color var(--transition-fast)',
          }}
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      </div>

      {/* Product Content Row */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          padding: '14px 16px',
        }}
      >
        {/* Product Image Thumbnail */}
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: '#FAF7F5',
            border: '1px solid var(--border-hairline)',
            flexShrink: 0,
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Product Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              lineHeight: 1.3,
              marginBottom: '3px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.name}
          </h4>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '4px',
            }}
          >
            {item.variant ? `Variant: ${item.variant} • ` : ''}
            Qty: {item.quantity}
          </p>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 800,
              color: 'var(--accent)',
            }}
          >
            ₱{(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 16px 14px',
        }}
      >
        <button
          onClick={handleViewCart}
          className="btn btn-primary btn-sm"
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(200, 90, 50, 0.25)',
            cursor: 'pointer',
          }}
        >
          <ShoppingBag size={14} />
          <span>View Cart</span>
          <ArrowRight size={13} />
        </button>

        <button
          type="button"
          onClick={handleUndo}
          className="btn btn-outline btn-sm"
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: '#DC2626',
            borderColor: '#FCA5A5',
            backgroundColor: '#FEF2F2',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEE2E2';
            e.currentTarget.style.borderColor = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
            e.currentTarget.style.borderColor = '#FCA5A5';
          }}
          title="Cancel and undo add to cart"
          aria-label="Cancel / Undo"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
          <span>Undo</span>
        </button>
      </div>

      {/* Auto-Dismiss Progress Bar Indicator */}
      <div
        style={{
          height: '3px',
          backgroundColor: 'rgba(22, 163, 74, 0.15)',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: '#16A34A',
            width: '100%',
            animation: 'toastProgress 4.5s linear forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
