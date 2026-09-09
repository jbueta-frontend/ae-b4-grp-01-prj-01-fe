import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldCheck,
  Truck,
  RefreshCw,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SupportView() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'What materials are used in FiddleMania toys?',
      a: 'All our wooden toys are precision-milled from sustainably harvested European Beechwood and Baltic Birch. We seal every piece with organic German beeswax. There are zero synthetic paints, formaldehydes, or microplastics.',
      cat: 'Materials & Safety',
    },
    {
      q: 'How does carbon-neutral delivery work?',
      a: 'We partner with certified zero-emission logistics carriers. Every shipment travels in 100% biodegradable corrugated boxes with plant-based ink labels. We offset 100% of transport emissions.',
      cat: 'Shipping & Delivery',
    },
    {
      q: 'What is your 30-Day Happiness Guarantee?',
      a: 'If your family does not fall in love with your FiddleMania piece within 30 days of arrival, simply initiate a return for a prompt full refund or free exchange. We even cover the return courier fee.',
      cat: 'Returns & Guarantee',
    },
    {
      q: 'Are these toys certified safe for infants and toddlers?',
      a: 'Yes. Every product undergoes rigorous third-party laboratory safety testing meeting both United States ASTM F963-17 standards and European EN71 safety criteria.',
      cat: 'Materials & Safety',
    },
    {
      q: 'How can I track my active package?',
      a: 'Once dispatched, you will receive a tracking link via email. You can also paste your tracking number anytime on our live tracking page or view it directly in your account order history.',
      cat: 'Shipping & Delivery',
    },
  ];

  return (
    <div style={{ padding: '48px 0 96px' }}>
      <div className="container-narrow">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--accent)',
            }}
          >
            FiddleMania Care & Concierge
          </span>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginTop: '4px',
              marginBottom: '10px',
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Straightforward answers regarding our craftsmanship, safety
            standards, and delivery.
          </p>
        </div>

        {/* 3 Value Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            className="card-clean"
            style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <ShieldCheck
              size={20}
              color="var(--accent)"
              style={{ margin: '0 auto 6px' }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
              ASTM Certified
            </span>
          </div>
          <div
            className="card-clean"
            style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <Truck
              size={20}
              color="var(--accent)"
              style={{ margin: '0 auto 6px' }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
              Free Over $75
            </span>
          </div>
          <div
            className="card-clean"
            style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <RefreshCw
              size={20}
              color="var(--accent)"
              style={{ margin: '0 auto 6px' }}
            />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
              30-Day Returns
            </span>
          </div>
        </div>

        {/* FAQ Accordions */}
        <div
          className="card-clean"
          style={{ padding: '8px 24px', marginBottom: '40px' }}
        >
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                borderBottom:
                  idx < faqs.length - 1
                    ? '1px solid var(--border-hairline)'
                    : 'none',
              }}
            >
              <button
                onClick={() =>
                  setOpenFaq((prev) => (prev === idx ? null : idx))
                }
                style={{
                  width: '100%',
                  padding: '20px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-main)',
                }}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {openFaq === idx && (
                <p
                  style={{
                    paddingBottom: '20px',
                    fontSize: '0.9375rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Unobtrusive Floating / Dedicated Concierge Card */}
        <div
          className="card-clean"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            backgroundColor: 'var(--text-main)',
            color: '#FFFFFF',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              Have a bespoke inquiry?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
              Our Munich studio concierge replies within 4 business hours.
            </p>
          </div>

          <a
            href="mailto:care@fiddlemania.com"
            className="btn btn-primary"
            style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}
          >
            <Mail size={16} />
            <span>care@fiddlemania.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}
