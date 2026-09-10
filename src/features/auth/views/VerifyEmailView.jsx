import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import Logo from '../../../shared/components/Logo';

export default function VerifyEmailView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();

  const [status, setStatus] = useState(token ? 'verifying' : 'no-token');
  const [errorMessage, setErrorMessage] = useState(null);
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);

  const verificationAttempted = useRef(false);

  useEffect(() => {
    if (!token) return;

    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const runVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        // Smooth auto-redirect to homepage after showing confirmation
        const timer = setTimeout(() => {
          navigate('/');
        }, 2400);
        return () => clearTimeout(timer);
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err?.message ||
            'The verification link is invalid, expired, or has already been used.'
        );
      }
    };

    runVerification();
  }, [token, verifyEmail, navigate]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResendLoading(true);
    setResendStatus(null);
    try {
      await resendVerification(resendEmail.trim());
      setResendStatus({
        type: 'success',
        message: 'A new verification link has been sent to your inbox.',
      });
    } catch (err) {
      setResendStatus({
        type: 'error',
        message:
          err?.message ||
          'Unable to send verification link. Please check the email address.',
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '80px 20px 120px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              marginBottom: '14px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Logo size="lg" />
          </div>
        </div>

        <div className="card-clean" style={{ textAlign: 'center', padding: '32px 24px' }}>
          {/* State 1: Verifying */}
          {status === 'verifying' && (
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <RefreshCw size={30} className="spin" />
              </div>
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  marginBottom: '10px',
                  color: 'var(--text-main)',
                }}
              >
                Verifying your email
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Please wait a moment while we confirm your account credentials...
              </p>
            </div>
          )}

          {/* State 2: Success */}
          {status === 'success' && (
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  marginBottom: '10px',
                  color: 'var(--text-main)',
                }}
              >
                Email Verified!
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  lineHeight: '1.55',
                  marginBottom: '24px',
                }}
              >
                Your account is now fully verified and activated. Redirecting you
                to the collection in just a second...
              </p>
              <Link to="/" className="btn btn-primary btn-block" style={{ padding: '12px' }}>
                <span>Continue to Store</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* State 3: No Token */}
          {status === 'no-token' && (
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(217, 119, 6, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                }}
              >
                <AlertCircle size={32} />
              </div>
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  marginBottom: '10px',
                  color: 'var(--text-main)',
                }}
              >
                Missing Verification Token
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  lineHeight: '1.55',
                  marginBottom: '24px',
                }}
              >
                No verification token was detected in your link. Please ensure you
                clicked the complete link sent to your email inbox.
              </p>
              <Link
                to="/login"
                className="btn btn-primary btn-block"
                style={{ padding: '12px' }}
              >
                <span>Back to Sign In</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* State 4: Error / Expired */}
          {status === 'error' && (
            <div>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                }}
              >
                <AlertCircle size={32} />
              </div>
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  marginBottom: '10px',
                  color: 'var(--text-main)',
                }}
              >
                Verification Failed
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  lineHeight: '1.55',
                  marginBottom: '20px',
                }}
              >
                {errorMessage}
              </p>

              {/* Request New Link Form */}
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  textAlign: 'left',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                    color: 'var(--text-main)',
                  }}
                >
                  Need a new verification link?
                </h4>
                <form onSubmit={handleResend}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="form-input"
                    value={resendEmail}
                    onChange={(e) => {
                      setResendEmail(e.target.value);
                      if (resendStatus) setResendStatus(null);
                    }}
                    style={{ marginBottom: '10px', fontSize: '0.875rem' }}
                  />
                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="btn btn-primary btn-block"
                    style={{ padding: '10px', fontSize: '0.85rem' }}
                  >
                    {resendLoading ? (
                      <>
                        <RefreshCw size={14} className="spin" />
                        <span>Sending new link...</span>
                      </>
                    ) : (
                      <span>Resend Verification Link</span>
                    )}
                  </button>
                </form>

                {resendStatus && (
                  <p
                    style={{
                      marginTop: '10px',
                      fontSize: '0.8125rem',
                      color:
                        resendStatus.type === 'success' ? '#059669' : '#DC2626',
                      fontWeight: 500,
                    }}
                  >
                    {resendStatus.message}
                  </p>
                )}
              </div>

              <Link
                to="/login"
                className="btn btn-outline btn-block"
                style={{ padding: '10px', fontSize: '0.875rem' }}
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
