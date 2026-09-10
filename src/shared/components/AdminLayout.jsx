import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Package, Truck, LogOut, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Reports & Overview', path: '/admin/reports', icon: BarChart3 },
    { label: 'Product Catalog', path: '/admin/inventory', icon: Package },
    { label: 'Orders & Dispatch', path: '/admin/orders', icon: Truck },
  ];

  // Helper for top breadcrumb title
  const currentNav = navItems.find((item) =>
    location.pathname.startsWith(item.path)
  );
  const pageTitle = currentNav?.label || 'Admin Control Terminal';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--admin-canvas)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 1. Left Vertical Sidebar */}
      <aside
        style={{
          width: '260px',
          flexShrink: 0,
          backgroundColor: '#161619',
          borderRight: '1px solid #27272e',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
        }}
      >
        {/* Brand Area - Height: 64px matching the main header container */}
        <div
          style={{
            height: '64px',
            padding: '0 18px',
            borderBottom: '1px solid #232328',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <Link
            to="/admin/reports"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              height: '100%',
            }}
          >
            <Logo size={36} textStyle={{ color: '#ffffff', fontSize: '1.0625rem' }} />
          </Link>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(200, 90, 50, 0.22)',
              color: '#f97316',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={11} />
            <span>Admin</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            flex: 1,
            padding: '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  backgroundColor: isActive
                    ? 'rgba(200, 90, 50, 0.18)'
                    : 'transparent',
                  borderLeft: isActive
                    ? '3px solid var(--accent)'
                    : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: isActive ? 'var(--accent)' : 'inherit',
                    flexShrink: 0,
                  }}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer: User Details & Sign Out */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #232328',
            backgroundColor: '#121214',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8125rem',
                flexShrink: 0,
              }}
            >
              {(user?.name || user?.email || 'A')[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#e5e7eb',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.email || 'admin@fiddlemania.com'}
              </p>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Administrator
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#f87171',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Right Content Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--admin-card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 36px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Admin
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>
              /
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--text-main)',
              }}
            >
              {pageTitle}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: '#16a34a',
              backgroundColor: 'rgba(22, 163, 74, 0.08)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(22, 163, 74, 0.2)',
              fontWeight: 600,
            }}
          >
            <Activity size={12} />
            <span>API Synchronized</span>
          </div>
        </header>

        {/* Dynamic Page Views - Maximized screen layout */}
        <main
          style={{
            flex: 1,
            padding: '28px 36px 64px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
