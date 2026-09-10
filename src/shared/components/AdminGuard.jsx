import { Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminGuard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-hairline)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Verifying security clearance...
        </p>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ensure role is ADMIN
  if (user?.role !== 'ADMIN') {
    return (
      <div
        className="container"
        style={{
          padding: '80px 24px',
          maxWidth: '560px',
          textAlign: 'center',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '1.75rem',
          }}
        >
          🛡️
        </div>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginBottom: '10px',
          }}
        >
          Admin Access Required
        </h1>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          You are signed in as{' '}
          <strong style={{ color: 'var(--text-main)' }}>
            {user?.email || 'authenticated user'}
          </strong>
          , but this account has role <code>{user?.role || 'CUSTOMER'}</code>.
          Access to this terminal requires <code>ADMIN</code> privileges.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/" className="btn btn-primary">
            Return to Store
          </Link>
          <button onClick={logout} className="btn btn-outline">
            Sign In with Another Account
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
