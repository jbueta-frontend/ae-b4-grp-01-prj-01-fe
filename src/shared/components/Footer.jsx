import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const location = useLocation();

  // Hide on checkout and admin portal
  if (location.pathname === '/checkout' || location.pathname.startsWith('/admin')) return null;

  return (
    <footer
      style={{
        marginTop: 'auto',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-hairline)',
        padding: '36px 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Brand Note */}
          <div>
            <Logo size="sm" />
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Heirloom toys crafted for cognitive wonder and tactile
              exploration.
            </p>
          </div>

          {/* Minimal Essential Links */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
            }}
          >
            <Link to="/" style={{ transition: 'color 0.15s ease' }}>
              Catalog
            </Link>
            <Link to="/orders" style={{ transition: 'color 0.15s ease' }}>
              Track Orders
            </Link>
            <Link to="/support" style={{ transition: 'color 0.15s ease' }}>
              FAQ & Care
            </Link>
            <span style={{ color: 'var(--text-light)' }}>
              © {new Date().getFullYear()} FiddleMania Inc.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
