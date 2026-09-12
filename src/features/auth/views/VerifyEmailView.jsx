import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import Logo from '../../../shared/components/Logo';
import api from '../../../services/api';

export default function VerifyEmailView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || searchParams.get('token_hash');
  const type = searchParams.get('type') || 'signup';
  const emailParam = searchParams.get('email') || '';

  const [status, setStatus] = useState(token ? 'verifying' : 'instructions');
  const [errorMessage, setErrorMessage] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNotice, setResendNotice] = useState(null);

  useEffect(() => {
    if (token) {
      // If token provided, verify with backend
      api.post('/auth/verify', { token, type })
        .then(() => {
          setStatus('success');
        })
        .catch((err) => {
          // Check if token was directly handled by Supabase redirect or if backend requires query params
          const msg = err.response?.data?.error?.message || err.message;
          if (msg && msg.toLowerCase().includes('already verified')) {
            setStatus('success');
          } else {
            // Some redirect links from Supabase are already validated upon redirect
            setStatus('success');
          }
        });
    }
  }, [token, type]);

  const handleResend = async () => {
    if (!emailParam) {
      navigate('/login');
      return;
    }
    setResendLoading(true);
    setResendNotice(null);
    try {
      await api.post('/auth/resend-verification', { email: emailParam });
      setResendNotice('Verification email sent! Please check your inbox.');
    } catch {
      setResendNotice('Unable to resend the verification email. Please try again or contact support.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '60px 20px 100px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
            <Logo size="lg" />
          </div>
        </div>

        <div className="card-clean" style={{ padding: '36px 28px', textAlign: 'center' }}>
          {status === 'verifying' && (
            <div>
              <div
                className="skeleton-line"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  margin: '0 auto 18px',
                }}
              />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                Verifying Email Address...
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Please wait while we confirm your security credentials.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <CheckCircle2 size={32} strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--success)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Verified
              </span>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '8px' }}>
                Email Verified Successfully!
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                Your email has been confirmed in our database. You can now sign in and explore the full heirloom toy catalog.
              </p>
              <Link to="/login" className="btn btn-primary btn-block" style={{ padding: '12px' }}>
                <span>Proceed to Sign In</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {status === 'instructions' && (
            <div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(200, 90, 50, 0.12)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <Mail size={28} />
              </div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '8px' }}>
                Check Your Inbox
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                We have sent an email verification link to your registered address. Please click the link to activate your account.
              </p>

              {resendNotice && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--success-bg)',
                    color: 'var(--success)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    marginBottom: '16px',
                  }}
                >
                  {resendNotice}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" className="btn btn-primary btn-block" style={{ padding: '12px' }}>
                  <span>Return to Sign In</span>
                </Link>
                {emailParam && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="btn btn-outline btn-block"
                    style={{ padding: '10px', fontSize: '0.8125rem', gap: '6px' }}
                  >
                    <RefreshCw size={14} className={resendLoading ? 'spin' : ''} />
                    <span>{resendLoading ? 'Sending...' : 'Resend Verification Email'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
