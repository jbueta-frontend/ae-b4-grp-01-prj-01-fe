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
  const {
    itemCount = 0,
    openCart = () => {},
    justAdded = false,
  } = useCart() || {};
  const {
    user = null,
    isAuthenticated = false,
    logout = () => {},
  } = useAuth() || {};
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isBouncing, setIsBouncing] = useState(false);
  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const prevCountRef = useRef(itemCount ?? 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (itemCount > prevCountRef.current || justAdded) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 700);
      prevCountRef.current = itemCount;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = itemCount;
  }, [itemCount, justAdded]);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Hide on checkout and admin portal
  if (location.pathname === '/checkout' || location.pathname.startsWith('/admin')) return null;

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '#hero');
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        const navHeight = 58;
        const targetY =
          el.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
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
        if (el) {
          const navHeight = 58;
          const targetY =
            el.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
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
            height: '58px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          {/* 1. Left-most: Brand Logo (Optimized for 58px bar) */}
          <div style={{ flexShrink: 0 }}>
            <Logo size={30} />
          </div>

          {/* 2. Center: Navigation Links (Home, Categories, Product) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
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
                padding: '4px 0',
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
                padding: '4px 0',
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
                padding: '4px 0',
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
              gap: '10px',
              flexShrink: 0,
            }}
          >
            {/* Search Icon Button */}
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              style={{
                width: '38px',
                height: '38px',
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
              {isSearchOpen ? <X size={17} /> : <Search size={17} />}
            </button>

            {/* Shopping Cart Icon with Dynamic Badge Update */}
            <button
              onClick={openCart}
              className={isBouncing ? 'cart-btn-bounce' : ''}
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-full)',
                border: isBouncing
                  ? '1px solid #16A34A'
                  : '1px solid var(--border-hairline)',
                backgroundColor: isBouncing
                  ? 'rgba(22, 163, 74, 0.08)'
                  : 'var(--bg-card)',
                color: isBouncing ? '#16A34A' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isBouncing
                  ? '0 0 0 3px rgba(22, 163, 74, 0.15)'
                  : 'none',
                cursor: 'pointer',
              }}
              aria-label={`Open shopping cart, ${itemCount} items`}
              title="Shopping Cart"
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span
                  key={`badge-${itemCount}`}
                  className={isBouncing ? 'badge-pop' : ''}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: isBouncing ? '#16A34A' : 'var(--accent)',
                    color: '#FFFFFF',
                    fontSize: 'var(--font-small, 14px)',
                    fontWeight: 800,
                    minWidth: '22px',
                    height: '22px',
                    padding: '0 5px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg-page)',
                    boxShadow: isBouncing
                      ? '0 0 10px rgba(22, 163, 74, 0.5)'
                      : '0 1px 3px rgba(0,0,0,0.1)',
                    transition:
                      'background-color 0.25s ease, box-shadow 0.25s ease',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Equal-Sized Profile Icon (38px) with Dropdown */}
            {isAuthenticated ? (
              <div ref={profileMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-full)',
                    border: isProfileMenuOpen
                      ? '1px solid var(--accent)'
                      : '1px solid var(--border-hairline)',
                    backgroundColor: isProfileMenuOpen
                      ? 'var(--accent-light)'
                      : 'var(--bg-card)',
                    color: isProfileMenuOpen
                      ? 'var(--accent)'
                      : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                    boxShadow: isProfileMenuOpen
                      ? '0 0 0 3px var(--accent-light)'
                      : 'none',
                  }}
                  aria-label="User account menu"
                  aria-expanded={isProfileMenuOpen}
                  title={user?.name || user?.email || 'Account'}
                >
                  <User size={18} color="var(--accent)" />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '190px',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      boxShadow:
                        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                      padding: '6px',
                      zIndex: 100,
                      animation: 'fadeIn 0.15s ease',
                    }}
                  >
                    {/* Compact User Header */}
                    <div
                      style={{
                        padding: '8px 10px 10px',
                        borderBottom: '1px solid var(--border-hairline)',
                        marginBottom: '4px',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {user?.name || user?.email?.split('@')[0]}
                      </p>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                        }}
                      >
                        {user?.email}
                      </span>
                    </div>

                    {/* Item 1: Profile */}
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        textDecoration: 'none',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          'var(--bg-subtle)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <User size={16} color="var(--accent)" />
                      <span>Profile</span>
                    </Link>

                    {/* Item 2: Logout */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#DC2626',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          'rgba(220, 38, 38, 0.08)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm"
                style={{
                  padding: '7px 16px',
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
