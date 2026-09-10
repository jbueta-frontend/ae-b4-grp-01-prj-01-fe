import { Link } from 'react-router-dom';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';
import { ArrowRight, ShieldCheck, AlertCircle, Mail, RefreshCw } from 'lucide-react';
import Logo from '../../../shared/components/Logo';

export default function LoginView({ initialTab = 'login' }) {
  const {
    tab,
    setTab,
    name,
    handleNameChange,
    email,
    handleEmailChange,
    password,
    handlePasswordChange,
    errors,
    loading,
    apiError,
    isUnverified,
    registrationSuccess,
    registeredEmail,
    directVerifyToken,
    resendLoading,
    resendStatus,
    handleResendVerification,
    handleSubmit,
    handleSocialAuth,
    handleGuestCheckout,
  } = useAuthViewModel(initialTab);

  return (
    <div
      style={{
        padding: '60px 20px 100px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
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
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Sign in to track orders, save favorite pieces, and manage delivery
            addresses.
          </p>
        </div>

        {/* Minimal Auth Card */}
        <div className="card-clean">
          {registrationSuccess ? (
            /* Post-Registration Email Verification Confirmation */
            <div style={{ textAlign: 'center', padding: '12px 6px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 18px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(217, 119, 6, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                }}
              >
                <Mail size={30} />
              </div>

              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  marginBottom: '10px',
                  color: 'var(--text-main)',
                }}
              >
                Check your email inbox
              </h2>

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  lineHeight: '1.55',
                  marginBottom: '16px',
                }}
              >
                Account created! Please check your email inbox to verify your
                account before signing in.
              </p>

              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  marginBottom: '20px',
                  wordBreak: 'break-all',
                }}
              >
                {registeredEmail}
              </div>

              {resendStatus && (
                <div
                  style={{
                    padding: '10px 12px',
                    marginBottom: '16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    backgroundColor:
                      resendStatus.type === 'success'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(220, 38, 38, 0.1)',
                    color:
                      resendStatus.type === 'success' ? '#059669' : '#DC2626',
                    fontWeight: 500,
                  }}
                >
                  {resendStatus.message}
                </div>
              )}

              {directVerifyToken && (
                <div style={{ marginBottom: '16px' }}>
                  <Link
                    to={`/verify-email?token=${encodeURIComponent(directVerifyToken)}`}
                    className="btn btn-outline btn-block"
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      borderColor: '#D97706',
                      color: '#B45309',
                      backgroundColor: 'rgba(217, 119, 6, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span>⚡ Verify Account Directly (Instant Link)</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="btn btn-primary btn-block"
                  style={{ padding: '12px' }}
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  disabled={resendLoading}
                  onClick={() => handleResendVerification(registeredEmail)}
                  className="btn btn-outline btn-block"
                  style={{ fontSize: '0.85rem', padding: '10px' }}
                >
                  {resendLoading ? (
                    <>
                      <RefreshCw size={14} className="spin" />
                      <span>Resending link...</span>
                    </>
                  ) : (
                    <span>Resend verification link</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '4px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                }}
              >
                <button
                  onClick={() => setTab('login')}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    backgroundColor:
                      tab === 'login' ? 'var(--bg-card)' : 'transparent',
                    color:
                      tab === 'login'
                        ? 'var(--text-main)'
                        : 'var(--text-muted)',
                    boxShadow: tab === 'login' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setTab('register')}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    backgroundColor:
                      tab === 'register' ? 'var(--bg-card)' : 'transparent',
                    color:
                      tab === 'register'
                        ? 'var(--text-main)'
                        : 'var(--text-muted)',
                    boxShadow: tab === 'register' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Register
                </button>
              </div>

              {/* Social Auth Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.875rem',
                    gap: '10px',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('Apple')}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.875rem',
                    gap: '10px',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.98.6-2.62 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.02-.49 2.62-1.24z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '20px 0',
                  color: 'var(--text-light)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'var(--border-hairline)',
                  }}
                />
                <span>or email</span>
                <div
                  style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: 'var(--border-hairline)',
                  }}
                />
              </div>

              {/* Error Banner */}
              {apiError && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '12px 14px',
                    backgroundColor: isUnverified
                      ? 'rgba(217, 119, 6, 0.08)'
                      : 'rgba(220, 38, 38, 0.08)',
                    border: `1px solid ${isUnverified ? '#D97706' : '#DC2626'}`,
                    borderRadius: 'var(--radius-md)',
                    color: isUnverified ? '#B45309' : '#DC2626',
                    fontSize: '0.875rem',
                    lineHeight: '1.45',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    {isUnverified ? (
                      <Mail
                        size={18}
                        style={{ flexShrink: 0, marginTop: '2px' }}
                      />
                    ) : (
                      <AlertCircle
                        size={18}
                        style={{ flexShrink: 0, marginTop: '2px' }}
                      />
                    )}
                    <span style={{ fontWeight: 600 }}>{apiError}</span>
                  </div>

                  {/* Unverified Action: Resend Verification Link */}
                  {isUnverified && (
                    <div style={{ marginTop: '4px', paddingLeft: '28px' }}>
                      <button
                        type="button"
                        disabled={resendLoading}
                        onClick={() => handleResendVerification()}
                        className="btn btn-outline"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.8125rem',
                          borderColor: '#D97706',
                          color: '#B45309',
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {resendLoading ? (
                          <>
                            <RefreshCw size={13} className="spin" />
                            <span>Resending link...</span>
                          </>
                        ) : (
                          <span>Resend Verification Link</span>
                        )}
                      </button>

                      {resendStatus && (
                        <p
                          style={{
                            marginTop: '8px',
                            fontSize: '0.8125rem',
                            color:
                              resendStatus.type === 'success'
                                ? '#059669'
                                : '#DC2626',
                            fontWeight: 500,
                          }}
                        >
                          {resendStatus.message}
                        </p>
                      )}

                      {directVerifyToken && (
                        <div style={{ marginTop: '10px' }}>
                          <Link
                            to={`/verify-email?token=${encodeURIComponent(directVerifyToken)}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: '#B45309',
                              fontWeight: 700,
                              fontSize: '0.8125rem',
                              textDecoration: 'underline',
                            }}
                          >
                            <span>⚡ Click here to verify your account now →</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {tab === 'register' && (
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="Juan Dela Cruz"
                      value={name}
                      onChange={handleNameChange}
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {errors.password && (
                    <p className="form-error">{errors.password}</p>
                  )}
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-block"
                  style={{ padding: '14px', marginTop: '8px' }}
                >
                  <span>
                    {loading
                      ? 'Authenticating...'
                      : tab === 'login'
                        ? 'Sign In'
                        : 'Create Account'}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Option: Continue as Guest */}
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-hairline)',
                  textAlign: 'center',
                }}
              >
                <button
                  type="button"
                  onClick={handleGuestCheckout}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Or{' '}
                  <span
                    style={{
                      color: 'var(--text-main)',
                      textDecoration: 'underline',
                    }}
                  >
                    Continue as Guest
                  </span>{' '}
                  to checkout →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Security Note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <ShieldCheck size={14} color="var(--success)" />
          <span>Encrypted with standard TLS 1.3 encryption</span>
        </div>
      </div>
    </div>
  );
}
