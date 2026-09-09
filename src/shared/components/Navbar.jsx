import { useState, useEffect, useRef } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { itemCount, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const searchInputRef = useRef(null);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Hide on checkout for distraction-free tunnel
  if (location.pathname === '/checkout') return null;

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', `#${sectionId}`);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    setIsSearchOpen(false);
    if (trimmed) {
      if (location.pathname === '/') {
        const el = document.getElementById('products');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        navigate(`/?q=${encodeURIComponent(trimmed)}#products`);
      } else {
        navigate(`/?q=${encodeURIComponent(trimmed)}#products`);
      }
    } else {
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    if (searchParams.get('q')) {
      navigate('/');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(250, 247, 245, 0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-hairline)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <div className="container">
        <div
          style={{
            height: '74px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          {/* 1. Left-most: Brand Logo */}
          <div style={{ flexShrink: 0 }}>
            <Logo size="md" />
          </div>

          {/* 2. Center: Navigation Links (Home, Categories, Product) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
            }}
            aria-label="Primary Navigation"
          >
            <a
              href="/#hero"
              onClick={(e) => handleNavClick(e, 'hero')}
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                letterSpacing: '-0.01em',
                transition: 'color var(--transition-fast)',
                position: 'relative',
                padding: '6px 0',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--accent)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--text-main)')
              }
            >
              Home
            </a>

            <a
              href="/#categories"
              onClick={(e) => handleNavClick(e, 'categories')}
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                letterSpacing: '-0.01em',
                transition: 'color var(--transition-fast)',
                position: 'relative',
                padding: '6px 0',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--accent)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--text-main)')
              }
            >
              Categories
            </a>

            <a
              href="/#products"
              onClick={(e) => handleNavClick(e, 'products')}
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                letterSpacing: '-0.01em',
                transition: 'color var(--transition-fast)',
                position: 'relative',
                padding: '6px 0',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--accent)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--text-main)')
              }
            >
              Product
            </a>
          </nav>

          {/* 3. Right side: Search Icon, Cart Icon, Login CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            {/* Search Icon Button */}
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-full)',
                border: isSearchOpen
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border-hairline)',
                backgroundColor: isSearchOpen
                  ? 'var(--accent-light)'
                  : 'var(--bg-card)',
                color: isSearchOpen ? 'var(--accent)' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
              }}
              aria-label="Toggle search bar"
              title="Search Products"
            >
              {isSearchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            {/* Shopping Cart Icon with Badge */}
            <button
              onClick={openCart}
              style={{
                position: 'relative',
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-hairline)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition:
                  'border-color 0.15s ease, background-color 0.15s ease',
                cursor: 'pointer',
              }}
              aria-label={`Open shopping cart, ${itemCount} items`}
              title="Shopping Cart"
            >
              <ShoppingCart size={19} />
              {itemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--accent)',
                    color: '#FFFFFF',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 4px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg-page)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Login CTA / Profile */}
            {isAuthenticated ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-hairline)',
                  padding: '4px 8px 4px 12px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                  }}
                >
                  <User size={14} color="var(--accent)" />
                  <span>{user?.name || user?.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  style={{
                    color: 'var(--text-muted)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                  aria-label="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm"
                style={{
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(200, 90, 50, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <User size={15} />
                <span>Log In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Expandable Search Overlay / Popover */}
        {isSearchOpen && (
          <div
            style={{
              padding: '12px 0 16px',
              borderTop: '1px solid var(--border-hairline)',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <form
              onSubmit={handleSearchSubmit}
              style={{
                position: 'relative',
                maxWidth: '640px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={18}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: '16px',
                  pointerEvents: 'none',
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search architectural blocks, STEM sets, plush toys..."
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 44px 0 46px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--accent)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-main)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  boxShadow: '0 4px 16px rgba(200, 90, 50, 0.12)',
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    color: 'var(--text-muted)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Clear search query"
                >
                  <X size={16} />
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
