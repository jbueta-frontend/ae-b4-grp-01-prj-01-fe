import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, LogOut } from 'lucide-react';

export default function ProfileView() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div
        className="container-narrow"
        style={{ padding: '80px 20px', textAlign: 'center' }}
      >
        <h1
          style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}
        >
          Account Access
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Please sign in to view your account profile.
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container-narrow">
        <div className="card-clean" style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.125rem',
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {user?.name || user?.email?.split('@')[0]}
                </h1>
                <span
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}
                >
                  {user?.email} • {user?.role || 'Customer'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn btn-outline btn-sm"
              style={{ gap: '6px' }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          <Link
            to="/orders"
            className="card-clean"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              textDecoration: 'none',
            }}
          >
            <Package size={24} color="var(--accent)" />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                Orders & Tracking
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                View shipments and receipts
              </p>
            </div>
          </Link>

          <Link
            to="/support"
            className="card-clean"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              textDecoration: 'none',
            }}
          >
            <MapPin size={24} color="var(--accent)" />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                Care & Concierge
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                FAQ and return assistance
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
