import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Mail,
  Send,
  MapPin,
  Phone,
  CheckCircle2,
  Lock,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const location = useLocation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  // Hide on checkout and admin portal
  if (location.pathname === '/checkout' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribing(true);
    setTimeout(() => {
      setIsSubscribed(true);
      setSubscribing(false);
      setNewsletterEmail('');
    }, 500);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: 'auto',
        backgroundColor: '#f8f5f1',
        color: 'var(--text-main, #18181b)',
        borderTop: '1px solid var(--border-hairline, #e8e3df)',
        fontFamily: 'var(--font-sans, inherit)',
      }}
    >
      {/* ============================================================ */}
      {/* 1. NEWSLETTER & ARTISAN COMMUNITY BANNER */}
      {/* ============================================================ */}
      <div
        style={{
          borderBottom: '1px solid var(--border-hairline, #e8e3df)',
          backgroundColor: '#ffffff',
          padding: '44px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              backgroundColor: '#faf7f4',
              border: '1px solid #e8e1d9',
              borderRadius: '16px',
              padding: '36px 32px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <div style={{ maxWidth: '520px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(200, 90, 50, 0.08)',
                  color: 'var(--accent, #c85a32)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '10px',
                }}
              >
                <Sparkles size={13} />
                <span>The Heirloom Circle</span>
              </div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--text-main, #18181b)',
                  letterSpacing: '-0.02em',
                  margin: '0 0 8px',
                }}
              >
                Join the FiddleMania Community
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted, #71717a)',
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                Receive artisan wood release announcements, child play guides, and special access to limited toy batches.
              </p>
            </div>

            <div style={{ width: '100%', maxWidth: '420px' }}>
              {isSubscribed ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(22, 163, 74, 0.08)',
                    border: '1px solid #16a34a',
                    color: '#15803d',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={20} />
                  <span>Welcome to the circle! Check your inbox for your welcome guide.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Mail
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted, #71717a)',
                      }}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: 'var(--radius-md, 8px)',
                        border: '1px solid var(--border-hairline, #e8e3df)',
                        backgroundColor: '#ffffff',
                        color: 'var(--text-main, #18181b)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent, #c85a32)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border-hairline, #e8e3df)')}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="btn btn-primary"
                    style={{
                      padding: '12px 20px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      gap: '6px',
                      flexShrink: 0,
                      borderRadius: 'var(--radius-md, 8px)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{subscribing ? 'Sending...' : 'Subscribe'}</span>
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN NAVIGATION COLUMNS (LIGHT / LINEN THEME) */}
      {/* ============================================================ */}
      <div style={{ padding: '54px 0 44px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '40px 30px',
            }}
          >
            {/* Col 1: Brand & Manila Concierge */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ marginBottom: '14px' }}>
                <Logo size="md" />
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted, #71717a)',
                  lineHeight: 1.6,
                  marginBottom: '22px',
                }}
              >
                Heirloom wooden toys crafted for cognitive wonder, tactile discovery, and enduring childhood memories across the Philippines.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  <MapPin size={16} style={{ color: 'var(--accent, #c85a32)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Bonifacio Global City, Taguig, Metro Manila, Philippines</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem' }}>
                  <Mail size={16} style={{ color: 'var(--accent, #c85a32)', flexShrink: 0 }} />
                  <a
                    href="mailto:concierge@fiddlemania.com"
                    style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    concierge@fiddlemania.com
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem' }}>
                  <Phone size={16} style={{ color: 'var(--accent, #c85a32)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>+63 (2) 8888-TOYS (8697)</span>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Navigation / Heirloom Shop */}
            <div>
              <h4
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  color: 'var(--text-main, #18181b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '18px',
                }}
              >
                Heirloom Catalog
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {[
                  { name: 'All Wooden Toys', path: '/' },
                  { name: 'Architectural & Castles', path: '/#products' },
                  { name: 'STEM & Mechanical', path: '/#products' },
                  { name: 'Sensory & Discovery', path: '/#products' },
                  { name: 'Best Sellers', path: '/#products' },
                  { name: 'Featured Collections', path: '/#products' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted, #71717a)',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease, transform 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent, #c85a32)';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted, #71717a)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Customer Care & FAQs (Direct link to /faqs) */}
            <div>
              <h4
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  color: 'var(--text-main, #18181b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '18px',
                }}
              >
                Support & FAQs
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {[
                  { name: 'Frequently Asked Questions (FAQs)', path: '/faqs', highlight: true },
                  { name: 'Track Active Shipment', path: '/track' },
                  { name: 'Shipping & Delivery Policies', path: '/support' },
                  { name: '30-Day Happiness Returns', path: '/support' },
                  { name: 'Toy Safety Standards & Testing', path: '/support' },
                  { name: 'Natural Beeswax Care Guide', path: '/support' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      style={{
                        fontSize: '0.875rem',
                        color: link.highlight ? 'var(--accent, #c85a32)' : 'var(--text-muted, #71717a)',
                        fontWeight: link.highlight ? 700 : 400,
                        textDecoration: 'none',
                        transition: 'color 0.15s ease, transform 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = link.highlight ? 'var(--accent-hover, #b54e28)' : 'var(--accent, #c85a32)';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = link.highlight ? 'var(--accent, #c85a32)' : 'var(--text-muted, #71717a)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      {link.highlight && <HelpCircle size={14} />}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Account & Shopping */}
            <div>
              <h4
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  color: 'var(--text-main, #18181b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '18px',
                }}
              >
                Customer Account
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {[
                  { name: 'My Profile & Preferences', path: '/profile' },
                  { name: 'Order History & Receipts', path: '/orders' },
                  { name: 'Delivery Addresses', path: '/addresses' },
                  { name: 'Sign In / Register', path: '/login' },
                  { name: 'Shopping Bag', path: '/cart' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted, #71717a)',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease, transform 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--accent, #c85a32)';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-muted, #71717a)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. PAYMENT METHODS & SECURITY ASSURANCE BAR */}
      {/* ============================================================ */}
      <div
        style={{
          borderTop: '1px solid var(--border-hairline, #e8e3df)',
          padding: '18px 0',
          backgroundColor: '#f1ede8',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Payment Methods */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Accepted Payment Methods:
              </span>
              {['GCash', 'Maya', 'Visa', 'Mastercard', 'Cash on Delivery (COD)'].map((method, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '5px',
                    backgroundColor: '#ffffff',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-hairline, #e8e3df)',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  {method}
                </span>
              ))}
            </div>

            {/* Security Guarantee */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: '#16a34a',
                fontWeight: 600,
              }}
            >
              <Lock size={14} />
              <span>256-Bit SSL Encrypted & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM COPYRIGHT & LEGAL BAR */}
      {/* ============================================================ */}
      <div
        style={{
          borderTop: '1px solid var(--border-hairline, #e8e3df)',
          padding: '20px 0',
          fontSize: '0.8125rem',
          color: 'var(--text-muted, #71717a)',
          backgroundColor: '#eae5df',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div>
              <span>© {currentYear} FiddleMania Inc. All rights reserved. Handcrafted heirloom toys.</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/support" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link to="/support" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              <Link to="/faqs" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                FAQs & Safety
              </Link>
              <span style={{ color: 'var(--text-muted)' }}>
                🇵🇭 Philippines (PHP ₱)
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
