import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, FileText, RotateCcw, Award, ArrowLeft, Mail } from 'lucide-react';

export default function LegalPolicyView() {
  const location = useLocation();

  // Determine initial active tab based on current path
  const getInitialTab = () => {
    if (location.pathname.includes('terms')) return 'terms';
    if (location.pathname.includes('return')) return 'returns';
    if (location.pathname.includes('safety')) return 'safety';
    return 'privacy';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'returns', label: 'Return & Refund Policy', icon: RotateCcw },
    { id: 'safety', label: 'Safety & Compliance', icon: Award },
  ];

  return (
    <div style={{ padding: '48px 0 96px', minHeight: '80vh' }}>
      <div className="container-narrow">
        {/* Breadcrumb / Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              color: 'var(--text-muted, #71717a)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--accent, #c85a32)',
            }}
          >
            Legal & Consumer Assurance
          </span>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginTop: '6px',
              marginBottom: '10px',
              color: 'var(--text-main, #18181b)',
            }}
          >
            Privacy Policy & Terms of Service
          </h1>
          <p style={{ color: 'var(--text-muted, #71717a)', fontSize: '0.9375rem', margin: 0 }}>
            Effective Date: January 1, 2026 • Compliant with Philippine Republic Act No. 10173 (Data Privacy Act) & Consumer Act
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border-hairline, #e8e3df)',
            marginBottom: '32px',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  fontSize: '0.9375rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent, #c85a32)' : 'var(--text-muted, #71717a)',
                  border: 'none',
                  background: 'none',
                  borderBottom: isActive ? '2px solid var(--accent, #c85a32)' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div
          className="card-clean"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-hairline, #e8e3df)',
            borderRadius: '16px',
            padding: '36px 32px',
            lineHeight: 1.7,
            color: 'var(--text-main, #18181b)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          }}
        >
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>
                  1. Commitment to Privacy & Compliance
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  FiddleMania Inc. (&ldquo;FiddleMania&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is deeply committed to protecting your personal information and respecting your privacy. This Privacy Policy details how we collect, process, store, and safeguard personal information collected through our website, in compliance with Republic Act No. 10173, also known as the <strong>Philippine Data Privacy Act of 2012 (DPA)</strong> and its Implementing Rules and Regulations.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                  2. Personal Information We Collect
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  When you visit our site, create an account, purchase heirloom toys, or contact our customer concierge, we may collect:
                </p>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9375rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Account Data:</strong> Name, email address, password hash, and profile preferences.</li>
                  <li><strong>Delivery & Contact Details:</strong> Delivery street address, province, city, ZIP code, and contact phone number for parcel dispatch across the Philippines.</li>
                  <li><strong>Transaction Details:</strong> Order contents, purchase history, and chosen payment method (GCash, Maya, Card, or COD). <em>Note: Payment card details are tokenized by PCI-DSS certified gateways and never stored on our servers.</em></li>
                  <li><strong>Technical & Browsing Data:</strong> IP address, browser type, device information, and session cookies to provide cart persistence.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                  3. Purpose and Legal Basis for Processing
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  We collect and process your information exclusively to:
                </p>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9375rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Fulfill and deliver your heirloom toy purchases with reputable courier partners in the Philippines.</li>
                  <li>Process payments, issue receipts, and prevent fraudulent transactions.</li>
                  <li>Provide customer service and respond to care inquiries or warranty requests.</li>
                  <li>Notify you of dispatch tracking, order status, or security updates.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                  4. Your Rights as a Data Subject
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  Under the Philippine Data Privacy Act, you have the right to be informed, right to access, right to object, right to erasure or blocking, and right to rectify inaccuracies in your data. To exercise any of these rights, contact our Data Protection Officer at <a href="mailto:privacy@fiddlemania.com" style={{ color: 'var(--accent)', fontWeight: 600 }}>privacy@fiddlemania.com</a>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>
                  1. Agreement to Terms
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  By accessing or utilizing the FiddleMania web store, creating an account, or placing an order, you agree to be bound by these Terms of Service and all applicable laws and regulations of the Republic of the Philippines. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                  2. Pricing and Currency
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  All prices listed on FiddleMania are quoted in <strong>Philippine Pesos (PHP ₱)</strong> and include applicable value-added taxes (VAT) unless explicitly stated otherwise. We reserve the right to modify prices or correct accidental typographical errors without prior notice.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                  3. Orders and Account Responsibilities
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  You are responsible for safeguarding your account credentials and password. Any orders submitted through your verified account will be deemed authorized by you. We reserve the right to cancel or limit orders suspected of unauthorized reseller behavior or fraudulent payment attempts.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                  4. Handcrafted Natural Variations
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  Our toys are handcrafted using European Beechwood, Baltic Birch, and natural botanical beeswax. Natural wood grain, slight color variations, and unique timber textures are natural attributes of authentic hardwood pieces and are celebrated as hallmarks of handcrafted quality, not manufacturing defects.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                  5. Governing Law and Jurisdiction
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  These terms are governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes arising from these terms shall be submitted exclusively to the competent courts of Taguig City, Metro Manila.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RETURN & REFUND POLICY */}
          {activeTab === 'returns' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>
                  1. The 30-Day Happiness Guarantee
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  We stand firmly behind the quality and enduring craftsmanship of every toy we build. If you or your child are not completely delighted with your purchase, you may return the item within <strong>30 calendar days</strong> from the delivery date for a replacement or a 100% refund.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
                  2. Return Eligibility & Process
                </h3>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9375rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Items must include all original wooden pieces, components, and packaging boxes.</li>
                  <li>Email our concierge at <a href="mailto:concierge@fiddlemania.com" style={{ color: 'var(--accent)', fontWeight: 600 }}>concierge@fiddlemania.com</a> with your order number.</li>
                  <li>We will provide a prepaid courier pickup label anywhere in Metro Manila and major provincial hubs.</li>
                  <li>Refunds are credited to your original payment method (GCash, Maya, Card) within 3 to 5 business days following receipt and inspection.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: SAFETY & COMPLIANCE */}
          {activeTab === 'safety' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>
                  Safety & Environmental Certifications
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                  Every FiddleMania wooden heirloom product is manufactured under strict international toy safety regulations:
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle, #f5f1ed)', border: '1px solid var(--border-hairline)' }}>
                  <h4 style={{ margin: '0 0 6px', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700 }}>
                    ASTM F963-17 Standard
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    United States Consumer Product Safety Commission standard for physical, mechanical, and heavy-metal toy safety.
                  </p>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle, #f5f1ed)', border: '1px solid var(--border-hairline)' }}>
                  <h4 style={{ margin: '0 0 6px', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700 }}>
                    EN71 European Toy Safety
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Meets EU directives for chemical migration, flammability, and mechanical durability against chipping.
                  </p>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle, #f5f1ed)', border: '1px solid var(--border-hairline)' }}>
                  <h4 style={{ margin: '0 0 6px', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700 }}>
                    100% Organic Beeswax
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Zero petrochemical lacquers, zero lead, and zero formaldehydes. Nourished solely with food-grade organic beeswax.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support Callout */}
        <div
          style={{
            marginTop: '32px',
            textAlign: 'center',
            padding: '24px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-subtle, #f5f1ed)',
            border: '1px solid var(--border-hairline, #e8e3df)',
          }}
        >
          <p style={{ margin: '0 0 10px', fontSize: '0.9375rem', color: 'var(--text-main)', fontWeight: 600 }}>
            Have questions regarding our policies or consumer rights?
          </p>
          <a
            href="mailto:concierge@fiddlemania.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent, #c85a32)',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <Mail size={15} />
            <span>Contact Legal & Concierge Desk (concierge@fiddlemania.com)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
