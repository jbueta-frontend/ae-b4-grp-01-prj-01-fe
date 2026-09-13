import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Mail,
  Send,
  MapPin,
  Phone,
  CheckCircle2,
  Lock,
  ArrowRight,
  HelpCircle,
  Package,
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
    }, 600);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: 'auto',
        backgroundColor: '#121215',
        color: '#e4e4e7',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: 'var(--font-sans, inherit)',
      }}
    >
      {/* ============================================================ */}
      {/* 1. VALUE PROPOSITIONS & TRUST PILLARS BAR */}
      {/* ============================================================ */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          backgroundColor: '#16161a',
          padding: '28px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Pillar 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(234, 88, 12, 0.12)',
                  color: '#f97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Truck size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: '#f4f4f5' }}>
                  Nationwide PH Delivery
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#a1a1aa', margin: '2px 0 0' }}>
                  Carbon-neutral shipping to all provinces
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: '#f4f4f5' }}>
                  Certified Child-Safe
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#a1a1aa', margin: '2px 0 0' }}>
                  ASTM F963-17 & EN71 lab tested & verified
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <RotateCcw size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: '#f4f4f5' }}>
                  30-Day Guarantee
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#a1a1aa', margin: '2px 0 0' }}>
                  Hassle-free returns & replacement
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(168, 85, 247, 0.12)',
                  color: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: '#f4f4f5' }}>
                  FSC® Certified Wood
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#a1a1aa', margin: '2px 0 0' }}>
                  Organic German beeswax finish, 0% plastic
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. NEWSLETTER SUBSCRIPTION BANNER */}
      {/* ============================================================ */}
      <div
        style={{
          padding: '44px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          background: 'linear-gradient(180deg, rgba(234, 88, 12, 0.05) 0%, transparent 100%)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <div style={{ maxWidth: '500px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#f97316',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Heirloom Collectors Circle
              </span>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: '0 0 6px',
                }}
              >
                Join the Fiddle & Bloom Community
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
                Receive artisan wood release announcements, child play guides, and special access to limited toy batches.
              </p>
            </div>

            <div style={{ width: '100%', maxWidth: '440px' }}>
              {isSubscribed ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid #10b981',
                    color: '#34d399',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={20} />
                  <span>Welcome to the circle! Check your inbox for your welcome guide.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  style={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Mail
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#71717a',
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
                        padding: '12px 14px 12px 40px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: '#1c1c21',
                        color: '#f4f4f5',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#f97316')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribing}
                    style={{
                      padding: '12px 22px',
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'background-color 0.15s ease',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
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
      {/* 3. MAIN NAVIGATION COLUMNS */}
      {/* ============================================================ */}
      <div style={{ padding: '56px 0 40px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px 30px',
            }}
          >
            {/* Col 1: Brand & Contact */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ marginBottom: '16px' }}>
                <Logo size="md" />
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#a1a1aa',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                }}
              >
                Heirloom wooden toys crafted for cognitive wonder, tactile discovery, and enduring childhood memories across the Philippines.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8125rem', color: '#71717a' }}>
                  <MapPin size={16} style={{ color: '#f97316', flexShrink: 0, marginTop: '2px' }} />
                  <span>Bonifacio Global City, Taguig, Metro Manila, Philippines</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: '#71717a' }}>
                  <Mail size={16} style={{ color: '#f97316', flexShrink: 0 }} />
                  <a href="mailto:concierge@fiddlemania.com" style={{ color: '#d4d4d8', textDecoration: 'none' }}>
                    concierge@fiddlemania.com
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: '#71717a' }}>
                  <Phone size={16} style={{ color: '#f97316', flexShrink: 0 }} />
                  <span style={{ color: '#d4d4d8' }}>+63 (2) 8888-TOYS (8697)</span>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Navigation / Heirloom Shop */}
            <div>
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#ffffff',
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
                        color: '#a1a1aa',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease, transform 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#f97316';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#a1a1aa';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Customer Care & FAQs (Direct routes to /faqs and /support) */}
            <div>
              <h4
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#ffffff',
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
                        color: link.highlight ? '#f97316' : '#a1a1aa',
                        fontWeight: link.highlight ? 700 : 400,
                        textDecoration: 'none',
                        transition: 'color 0.15s ease, transform 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = link.highlight ? '#f97316' : '#a1a1aa';
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
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: '#ffffff',
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
                        color: '#a1a1aa',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease, transform 0.15s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#f97316';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#a1a1aa';
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
      {/* 4. PAYMENT METHODS & SECURITY BADGES */}
      {/* ============================================================ */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '20px 0',
          backgroundColor: '#0e0e11',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600 }}>
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
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#d4d4d8',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {method}
                </span>
              ))}
            </div>

            {/* Security Guarantee */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#10b981' }}>
              <Lock size={14} />
              <span style={{ fontWeight: 600 }}>256-Bit SSL Encrypted & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. BOTTOM COPYRIGHT & LEGAL BAR */}
      {/* ============================================================ */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '20px 0',
          fontSize: '0.8125rem',
          color: '#71717a',
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
              <span>© {currentYear} FiddleMania Inc. All rights reserved. Handcrafted heirloom pieces.</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/support" style={{ color: '#a1a1aa', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link to="/support" style={{ color: '#a1a1aa', textDecoration: 'none' }}>
                Terms of Service
              </Link>
              <Link to="/faqs" style={{ color: '#a1a1aa', textDecoration: 'none' }}>
                FAQs & Care
              </Link>
              <span style={{ color: '#52525b' }}>
                🇵🇭 Philippines (PHP ₱)
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
