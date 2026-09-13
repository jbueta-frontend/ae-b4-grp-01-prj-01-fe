import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, X } from 'lucide-react';
import Logo from '../../../shared/components/Logo';
import api from '../../../services/api';

// Helper to parse JWT payload without external libraries
function parseJwt(tokenStr) {
  try {
    if (!tokenStr || typeof tokenStr !== 'string') return null;
    const parts = tokenStr.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function ResetPasswordView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract token from multiple potential formats (URL query, hash fragment, or active recovery session)
  const extractToken = () => {
    // 1. Prioritize explicit token / token_hash from URL query
    const fromSearch =
      searchParams.get('token') ||
      searchParams.get('token_hash') ||
      searchParams.get('code') ||
      searchParams.get('access_token');
    if (fromSearch) return fromSearch;

    // 2. Prioritize explicit token / token_hash from URL hash
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const fromHash =
      hashParams.get('token') ||
      hashParams.get('token_hash') ||
      hashParams.get('access_token');
    if (fromHash) return fromHash;

    // 3. Check session storage recovery token
    const fromSession = sessionStorage.getItem('fiddlemania_recovery_token');
    if (fromSession) return fromSession;

    // Do NOT fall back to localStorage accessToken — a password reset requires an explicit recovery token
    return '';
  };

  const [token, setToken] = useState(extractToken);
  const [tokenValidityError, setTokenValidityError] = useState(() => {
    const initialToken = extractToken();
    if (!initialToken) return null;
    const payload = parseJwt(initialToken);
    if (payload) {
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        return 'This password reset link has expired (links are valid for 1 hour). Please request a fresh reset link.';
      }
      if (payload.type && payload.type !== 'PASSWORD_RESET') {
        return 'This link does not contain a valid password reset token. Please request a new link.';
      }
    }
    return null;
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const foundToken = extractToken();
    if (foundToken) {
      setToken(foundToken);
      const payload = parseJwt(foundToken);
      if (payload) {
        if (payload.exp && Date.now() / 1000 > payload.exp) {
          setTokenValidityError(
            'This password reset link has expired (links are valid for 1 hour). Please request a fresh reset link.'
          );
        } else if (payload.type && payload.type !== 'PASSWORD_RESET') {
          setTokenValidityError(
            'This link does not contain a valid password reset token. Please request a new link.'
          );
        } else {
          setTokenValidityError(null);
        }
      }
    } else {
      setToken('');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const activeToken = token || extractToken();

    if (!activeToken) {
      setError(
        'Password reset token is missing. Please request a new reset link from the login page.'
      );
      return;
    }
    if (password.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post(
        '/auth/reset-password',
        {
          token: activeToken,
          accessToken: activeToken,
          password: password,
          newPassword: password,
        },
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        }
      );

      // Clear any temporary tokens so user must log in with their new password
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('fiddlemania_user');

      setSuccess(true);
    } catch (err) {
      const backendErrorMsg =
        err?.error?.message ||
        err?.message ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to reset password. The link may have expired — please request a new one.';
      setError(backendErrorMsg);
    } finally {
      setLoading(false);
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
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
            <Logo size="lg" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Create a secure new password for your FiddleMania account.
          </p>
        </div>

        <div className="card-clean" style={{ padding: '32px 28px' }}>
          {/* No token in URL or token invalid/expired */}
          {(!token || tokenValidityError) && !success ? (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <AlertCircle size={32} strokeWidth={2} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                {tokenValidityError ? 'Reset Link Expired or Invalid' : 'Invalid or Expired Link'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                {tokenValidityError ||
                  'This password reset link is missing or has already expired. Please request a new one from the login page.'}
              </p>
              <Link to="/login" className="btn btn-primary btn-block" style={{ padding: '12px' }}>
                <span>Request New Reset Link</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : success ? (
            <>
              {/* Success Modal Overlay */}
              <div
                id="reset-password-success-modal-backdrop"
                role="dialog"
                aria-modal="true"
                aria-labelledby="reset-modal-title"
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
                  if (e.target === e.currentTarget) navigate('/login');
                }}
              >
                <div
                  id="reset-password-success-modal"
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
                  {/* Top Decorative Border */}
                  <div
                    style={{
                      height: '6px',
                      background: 'linear-gradient(90deg, #10b981, #059669, #047857)',
                    }}
                  />

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    aria-label="Close dialog"
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={18} />
                  </button>

                  <div style={{ padding: '36px 32px 32px', textAlign: 'center' }}>
                    {/* Glowing Check Icon */}
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
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(16, 185, 129, 0.16)',
                          animation: 'pulseGlow 2s infinite',
                        }}
                      />
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
                      <span>Password Updated</span>
                    </div>

                    {/* Title */}
                    <h2
                      id="reset-modal-title"
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        letterSpacing: '-0.02em',
                        marginBottom: '10px',
                        lineHeight: 1.25,
                      }}
                    >
                      Password Reset Successfully!
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
                      Your account password has been successfully updated. You can now log in using your newly created password.
                    </p>

                    {/* Action Button: Proceed to Login */}
                    <button
                      type="button"
                      id="proceed-to-login-after-reset-btn"
                      onClick={() => navigate('/login')}
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
                      <span>Proceed to Login</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* In-place message fallback */}
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Password Reset Complete
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Your password was successfully updated.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="btn btn-primary btn-block"
                  style={{ padding: '12px' }}
                >
                  <span>Go to Login</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                Set New Password
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Please enter and confirm your new account password.
              </p>

              {error && (
                <div
                  role="alert"
                  style={{
                    padding: '14px 16px',
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid #DC2626',
                    borderRadius: 'var(--radius-md)',
                    color: '#DC2626',
                    fontSize: '0.875rem',
                    lineHeight: '1.45',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{error}</div>
                      {(error.toLowerCase().includes('invalid') || error.toLowerCase().includes('expired')) && (
                        <div style={{ marginTop: '6px', fontSize: '0.8125rem', color: '#991B1B' }}>
                          Password reset links are valid for 1 hour from when they are requested.
                          <div style={{ marginTop: '8px' }}>
                            <Link
                              to="/login"
                              style={{
                                color: '#DC2626',
                                fontWeight: 700,
                                textDecoration: 'underline',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <span>Request a new reset link</span>
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: '42px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: '4px',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-input"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingRight: '42px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: '4px',
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-block"
                  style={{ padding: '14px', marginTop: '8px' }}
                >
                  <span>{loading ? 'Resetting Password...' : 'Save New Password'}</span>
                  <ArrowRight size={16} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <Link
                    to="/login"
                    style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}
                  >
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
