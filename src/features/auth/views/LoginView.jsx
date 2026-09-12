import { useAuthViewModel } from '../viewmodels/useAuthViewModel';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    confirmPassword,
    handleConfirmPasswordChange,
    showPassword,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    isForgotPassword,
    setIsForgotPassword,
    forgotEmail,
    handleForgotEmailChange,
    forgotErrors,
    forgotLoading,
    forgotMessage,
    forgotError,
    handleForgotPasswordSubmit,
    errors,
    loading,
    apiError,
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
            {isForgotPassword
              ? 'Enter your registered email to receive password reset instructions.'
              : 'Sign in to track orders, save favorite pieces, and manage delivery addresses.'}
          </p>
        </div>

        {/* Auth / Forgot Password Card */}
        <div className="card-clean">
          {isForgotPassword ? (
            /* Forgot Password View */
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border-hairline)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <KeyRound size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                    Forgot Password
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Reset link will be sent to your account email.
                  </p>
                </div>
              </div>

              {forgotMessage && (
                <div
                  role="status"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(22, 163, 74, 0.08)',
                    border: '1px solid #16A34A',
                    borderRadius: 'var(--radius-md)',
                    color: '#16A34A',
                    fontSize: '0.875rem',
                    lineHeight: '1.45',
                    marginBottom: '18px',
                  }}
                >
                  <CheckCircle2
                    size={18}
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <span style={{ fontWeight: 500 }}>{forgotMessage}</span>
                </div>
              )}

              {forgotError && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid #DC2626',
                    borderRadius: 'var(--radius-md)',
                    color: '#DC2626',
                    fontSize: '0.875rem',
                    lineHeight: '1.45',
                    marginBottom: '18px',
                  }}
                >
                  <AlertCircle
                    size={18}
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <span style={{ fontWeight: 500 }}>{forgotError}</span>
                </div>
              )}

              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">Registered Account Email</label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={handleForgotEmailChange}
                  />
                  {forgotErrors.email && (
                    <p className="form-error">{forgotErrors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn btn-primary btn-block"
                  style={{ padding: '14px', marginTop: '8px' }}
                >
                  <span>
                    {forgotLoading ? 'Sending Reset Instructions...' : 'Send Reset Link'}
                  </span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <ArrowLeft size={15} />
                  <span>Back to Sign In</span>
                </button>
              </form>
            </div>
          ) : (
            /* Sign In / Register View */
            <div>
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
                      tab === 'login' ? 'var(--text-main)' : 'var(--text-muted)',
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

              {/* Form */}
              {apiError && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid #DC2626',
                    borderRadius: 'var(--radius-md)',
                    color: '#DC2626',
                    fontSize: '0.875rem',
                    lineHeight: '1.45',
                    marginBottom: '18px',
                  }}
                >
                  <AlertCircle
                    size={18}
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <span style={{ fontWeight: 500 }}>{apiError}</span>
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
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                {/* Password input with show/hide toggle */}
                <div className="form-group">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px',
                    }}
                  >
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Password
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      style={{ paddingRight: '42px' }}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
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
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="form-error">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password (Registration Only) */}
                {tab === 'register' && (
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-input"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        style={{ paddingRight: '42px' }}
                      />
                      <button
                        type="button"
                        onClick={toggleShowConfirmPassword}
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
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                        }}
                        title={
                          showConfirmPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                        aria-label={
                          showConfirmPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="form-error">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

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
            </div>
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
