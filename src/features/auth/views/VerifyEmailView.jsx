import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail, AlertCircle, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';
import Logo from '../../../shared/components/Logo';
import EmailVerifiedModal from '../components/EmailVerifiedModal';
import api from '../../../services/api';

export default function VerifyEmailView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || searchParams.get('token_hash');
  const type = searchParams.get('type') || 'signup';
  const emailParam = searchParams.get('email') || '';
  const isDirectlyVerified =
    searchParams.get('isEmailVerified') === 'true' ||
    searchParams.get('verified') === 'true';

  const [status, setStatus] = useState(
    isDirectlyVerified ? 'success' : token ? 'verifying' : 'instructions'
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNotice, setResendNotice] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(isDirectlyVerified);
  const [verifiedMessage, setVerifiedMessage] = useState(
    'Email verified successfully!'
  );

  useEffect(() => {
    if (isDirectlyVerified) {
      setStatus('success');
      setIsModalOpen(true);
      return;
    }

    if (token) {
      // Backend verification endpoint: GET /auth/verify-email?token=...
      api
        .get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
        .then((res) => {
          // Response envelope unwrapped: { isEmailVerified: true, message: "Email verified successfully!" }
          const successMsg =
            res?.message ||
            res?.data?.message ||
            'Email verified successfully!';
          setVerifiedMessage(successMsg);
          setStatus('success');
          setIsModalOpen(true);
        })
        .catch(async (err) => {
          // Fallback check: in case endpoint accepts POST or alternative path
          try {
            const fallbackRes = await api.post('/auth/verify', { token, type });
            const successMsg =
              fallbackRes?.message ||
              fallbackRes?.data?.message ||
              'Email verified successfully!';
            setVerifiedMessage(successMsg);
            setStatus('success');
            setIsModalOpen(true);
            return;
          } catch {
            // Check if error indicates it was already verified
            const msg =
              err.response?.data?.error?.message ||
              err.response?.data?.message ||
              err.message ||
              '';

            if (msg.toLowerCase().includes('already verified')) {
              setVerifiedMessage('Email is already verified!');
              setStatus('success');
              setIsModalOpen(true);
            } else {
              setStatus('error');
              setErrorMessage(
                msg || 'The verification link is invalid or has expired.'
              );
            }
          }
        });
    }
  }, [token, type, isDirectlyVerified]);

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
      setResendNotice('If an account exists, a new verification link was sent.');
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
      {/* Verification Success Modal */}
      <EmailVerifiedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProceed={() => navigate('/login')}
        message={verifiedMessage}
        email={emailParam}
      />

      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
            <Logo size="lg" />
          </div>
        </div>

        <div className="card-clean" style={{ padding: '36px 28px', textAlign: 'center' }}>
          {/* 1. Verifying State */}
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
                Please wait while we confirm your security credentials with the server.
              </p>
            </div>
          )}

          {/* 2. Success State */}
          {status === 'success' && (
            <div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <CheckCircle2 size={34} strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#059669',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Email Confirmed
              </span>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '8px' }}>
                {verifiedMessage}
              </h2>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginBottom: '24px',
                  lineHeight: 1.5,
                }}
              >
                Your email has been confirmed in our database. You can now sign in and explore the full heirloom toy catalog.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" className="btn btn-primary btn-block" style={{ padding: '12px' }}>
                  <span>Proceed to Sign In</span>
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-outline btn-block"
                  style={{ padding: '10px', fontSize: '0.8125rem' }}
                >
                  View Verification Details
                </button>
              </div>
            </div>
          )}

          {/* 3. Error State (Invalid/Expired Link) */}
          {status === 'error' && (
            <div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <AlertTriangle size={32} />
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#dc2626',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Verification Failed
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                Link Expired or Invalid
              </h2>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginBottom: '20px',
                  lineHeight: 1.5,
                }}
              >
                {errorMessage ||
                  'The verification link has expired or has already been used. Please request a new verification email.'}
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
                {emailParam && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="btn btn-primary btn-block"
                    style={{ padding: '12px', gap: '6px' }}
                  >
                    <RefreshCw size={15} className={resendLoading ? 'spin' : ''} />
                    <span>{resendLoading ? 'Sending...' : 'Resend Verification Email'}</span>
                  </button>
                )}
                <Link to="/login" className="btn btn-outline btn-block" style={{ padding: '11px' }}>
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          )}

          {/* 4. Instructions State (Check Inbox) */}
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
                We have sent an email verification link to{' '}
                {emailParam ? (
                  <strong style={{ color: 'var(--text-main)' }}>{emailParam}</strong>
                ) : (
                  'your registered address'
                )}
                . Please click the link to activate your account.
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
