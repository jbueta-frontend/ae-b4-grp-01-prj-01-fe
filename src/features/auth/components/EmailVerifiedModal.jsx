import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, X } from 'lucide-react';

export default function EmailVerifiedModal({
  isOpen,
  onClose,
  onProceed,
  message = 'Email verified successfully!',
  email = '',
  userName = '',
  isAuthenticated = false,
  proceedText = '',
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (onProceed) {
      onProceed();
    } else {
      if (onClose) onClose();
      if (isAuthenticated) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  };

  return (
    <div
      id="email-verified-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verified-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.68)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        id="email-verified-modal"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow:
            '0 25px 60px -12px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Banner */}
        <div
          style={{
            height: '6px',
            background: 'linear-gradient(90deg, #10b981, #059669, #047857)',
          }}
        />

        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            id="close-verified-modal-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close dialog"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Modal Content */}
        <div style={{ padding: '36px 32px 32px', textAlign: 'center' }}>
          {/* Animated Celebration Icon */}
          <div
            style={{
              position: 'relative',
              width: '76px',
              height: '76px',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer Glow Ring */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.16)',
                animation: 'pulseGlow 2s infinite',
              }}
            />
            {/* Inner Badge */}
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.45)',
                zIndex: 1,
              }}
            >
              <CheckCircle2 size={34} strokeWidth={2.5} />
            </div>
            {/* Small decorative sparkle */}
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                color: '#f59e0b',
                zIndex: 2,
              }}
            >
              <Sparkles size={18} />
            </div>
          </div>

          {/* Status Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#047857',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
              }}
            />
            <span>Email Confirmed</span>
          </div>

          {/* Title */}
          <h2
            id="verified-modal-title"
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              marginBottom: '10px',
              lineHeight: 1.25,
            }}
          >
            {message || 'Email Verified Successfully!'}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '0.925rem',
              color: '#64748b',
              lineHeight: 1.55,
              marginBottom: '22px',
            }}
          >
            {isAuthenticated ? (
              <>
                Welcome to Fiddle &amp; Bloom{userName ? `, ${userName}` : ''}! Your email account has been verified and you are now securely signed in. You can explore our heirloom toy collections and manage your account.
              </>
            ) : email ? (
              <>
                <strong style={{ color: '#334155' }}>{email}</strong> has been confirmed.
                You can now proceed to log in to your account and explore our heirloom toy collections.
              </>
            ) : (
              'Your email account is confirmed in our database. You can now proceed to log in to your account and explore our heirloom toy collections.'
            )}
          </p>

          {/* Verification Detail Card */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '12px 16px',
              marginBottom: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
                  Account Security
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Email status: Verified (Authorized)
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#059669',
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              ACTIVE
            </span>
          </div>

          {/* Action Button: Start Shopping or Proceed to Login */}
          <button
            type="button"
            id="proceed-to-login-btn"
            onClick={handleProceed}
            className="btn btn-primary btn-block"
            style={{
              padding: '14px 20px',
              fontSize: '0.9375rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(200, 90, 50, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <span>{proceedText || (isAuthenticated ? 'Start Shopping' : 'Proceed to Login')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
