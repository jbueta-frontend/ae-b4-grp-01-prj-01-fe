import { useEffect, useRef } from 'react';
import { UserX, ArrowRight, X, UserPlus, AlertCircle } from 'lucide-react';

export default function AccountNotFoundToast({
  isOpen,
  email,
  onClose,
  onRegister,
  autoCloseDuration = 7000,
}) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    timerRef.current = setTimeout(() => {
      if (onClose) onClose();
    }, autoCloseDuration);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, onClose, autoCloseDuration]);

  if (!isOpen) return null;

  const handlePause = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleResume = () => {
    timerRef.current = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      id="account-not-found-toast"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        width: 'calc(100vw - 48px)',
        maxWidth: '430px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(220, 38, 38, 0.28)',
        borderRadius: '16px',
        boxShadow:
          '0 20px 40px -8px rgba(220, 38, 38, 0.18), 0 8px 24px -4px rgba(15, 23, 42, 0.12)',
        animation: 'toastSlideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes toastSlideInRight {
          from {
            opacity: 0;
            transform: translateX(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes toastProgressShrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* Top Gradient Stripe */}
      <div
        style={{
          height: '4px',
          background: 'linear-gradient(90deg, #DC2626, #EA580C, #F59E0B)',
        }}
      />

      {/* Toast Content Area */}
      <div style={{ padding: '16px 18px 14px' }}>
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <UserX size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.2,
                }}
              >
                No Account Found
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#DC2626',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Unregistered Email
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Message Body */}
        <p
          style={{
            fontSize: '0.84375rem',
            color: '#475569',
            lineHeight: 1.5,
            margin: '0 0 14px',
          }}
        >
          There is <strong style={{ color: '#0F172A' }}>no account existing</strong> from{' '}
          {email ? (
            <span
              style={{
                fontFamily: 'monospace',
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                color: '#B91C1C',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.8125rem',
                wordBreak: 'break-all',
              }}
            >
              {email}
            </span>
          ) : (
            'that email address'
          )}
          . Please verify that you typed it correctly or create a new account to continue.
        </p>

        {/* Actions Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              if (onRegister) onRegister();
              if (onClose) onClose();
            }}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: '9px 14px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(200, 90, 50, 0.25)',
              cursor: 'pointer',
            }}
          >
            <UserPlus size={15} />
            <span>Create New Account</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '9px 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#64748B',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div
        style={{
          height: '3px',
          backgroundColor: '#F1F5F9',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: '#DC2626',
            animation: `toastProgressShrink ${autoCloseDuration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
