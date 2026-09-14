import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  User,
  ArrowRight,
  X,
  CheckCircle2,
  Package,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function NewUserWelcomeSetupModal() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsOpen(false);
      return;
    }

    const userId = user.userId || user.id || user.email;
    const hasBeenWelcomed = localStorage.getItem(`fiddlemania_setup_welcomed_${userId}`);
    const isSetupPending =
      localStorage.getItem('fiddlemania_show_welcome_setup_modal') === 'true' ||
      localStorage.getItem('fiddlemania_new_account_setup_pending') === 'true';

    // Show modal if flagged as a newly registered user who hasn't completed setup prompt
    if (isSetupPending && !hasBeenWelcomed) {
      setIsOpen(true);
    }
  }, [isAuthenticated, user]);

  const handleDismiss = () => {
    if (user) {
      const userId = user.userId || user.id || user.email;
      localStorage.setItem(`fiddlemania_setup_welcomed_${userId}`, 'true');
    }
    localStorage.removeItem('fiddlemania_show_welcome_setup_modal');
    localStorage.removeItem('fiddlemania_new_account_setup_pending');
    setIsOpen(false);
  };

  const handleProceedToSetup = () => {
    handleDismiss();
    navigate('/profile?tab=personal');
  };

  const handleProceedToAddress = () => {
    handleDismiss();
    navigate('/addresses');
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName =
    user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'there');

  return (
    <div
      id="new-user-welcome-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '20px',
        animation: 'welcomeFadeIn 0.25s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <style>{`
        @keyframes welcomeFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes welcomeCardScale {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(14px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes welcomePulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.2;
          }
        }
      `}</style>

      <div
        id="new-user-welcome-modal"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow:
            '0 25px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'welcomeCardScale 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gradient Banner */}
        <div
          style={{
            height: '6px',
            background: 'linear-gradient(90deg, #C85A32, #EA580C, #F59E0B, #10B981)',
          }}
        />

        {/* Close (X) Button */}
        <button
          type="button"
          id="close-welcome-modal-btn"
          onClick={handleDismiss}
          aria-label="Close welcome dialog"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(241, 245, 249, 0.8)',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '7px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E2E8F0';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.8)';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Main Body */}
        <div style={{ padding: '36px 30px 28px', textAlign: 'center' }}>
          {/* Animated Celebration Icon Badge */}
          <div
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Pulsing Outer Glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 90, 50, 0.2)',
                animation: 'welcomePulseGlow 2.5s infinite ease-in-out',
              }}
            />
            {/* Core Badge */}
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C85A32, #E06D44)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 24px -6px rgba(200, 90, 50, 0.45)',
                zIndex: 1,
              }}
            >
              <Sparkles size={34} strokeWidth={2.2} />
            </div>
            {/* Small Top-Right Success Pip */}
            <div
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                zIndex: 2,
              }}
            >
              <CheckCircle2 size={16} strokeWidth={2.5} />
            </div>
          </div>

          {/* Welcome Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(200, 90, 50, 0.08)',
              color: '#C85A32',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
            }}
          >
            <span>Registration Successful</span>
          </div>

          {/* Title */}
          <h2
            id="welcome-modal-title"
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              marginBottom: '10px',
              lineHeight: 1.25,
            }}
          >
            Welcome to FiddleMania, {displayName}!
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '0.925rem',
              color: '#64748B',
              lineHeight: 1.55,
              marginBottom: '22px',
            }}
          >
            Your account is verified and ready. To prepare for a seamless heirloom shopping
            and checkout experience, please take a moment to set up your personal details and
            default shipping address.
          </p>

          {/* Two-Item Setup Checklist Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '26px',
              textAlign: 'left',
            }}
          >
            {/* Step 1: Personal Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(200, 90, 50, 0.1)',
                  color: '#C85A32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={18} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                  1. Personal Information
                </div>
                <div style={{ fontSize: '0.78125rem', color: '#64748B', lineHeight: 1.35 }}>
                  Set your phone number, display name &amp; contact preferences.
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MapPin size={18} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                  2. Default Delivery Address
                </div>
                <div style={{ fontSize: '0.78125rem', color: '#64748B', lineHeight: 1.35 }}>
                  Add your primary street address for one-click checkout.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Primary Action Button */}
            <button
              type="button"
              id="proceed-to-profile-setup-btn"
              onClick={handleProceedToSetup}
              className="btn btn-primary btn-block"
              style={{
                padding: '14px 20px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(200, 90, 50, 0.3)',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <span>Set Up Profile &amp; Address</span>
              <ArrowRight size={18} />
            </button>

            {/* Secondary Action: Explore store first */}
            <button
              type="button"
              id="explore-store-first-btn"
              onClick={handleDismiss}
              style={{
                padding: '11px 16px',
                fontSize: '0.84375rem',
                fontWeight: 600,
                color: '#64748B',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0F172A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748B';
              }}
            >
              I&apos;ll do this later &bull; Start exploring toys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
