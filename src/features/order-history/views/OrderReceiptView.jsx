import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft, Download, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { getOrderReceipt } from '../../../services/orderService';
import Logo from '../../../shared/components/Logo';
import { formatPHP } from '../../../shared/utils/currency';

export default function OrderReceiptView() {
  const { orderId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReceipt() {
      if (!orderId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderReceipt(orderId);
        setReceipt(data);
      } catch (err) {
        setError(err?.message || 'Unable to generate receipt for the requested order.');
      } finally {
        setLoading(false);
      }
    }
    loadReceipt();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Generating official invoice receipt...</p>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '520px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <AlertCircle size={28} />
        </div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '8px' }}>
          Receipt Unavailable
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.875rem' }}>
          {error || `No invoice record was found for order #${orderId}.`}
        </p>
        <Link to="/orders" className="btn btn-primary">
          Return to Orders
        </Link>
      </div>
    );
  }

  const items = Array.isArray(receipt.items) ? receipt.items : [];
  const shippingAddress = receipt.shippingAddress || {};
  const billingAddress = receipt.billingAddress || shippingAddress;
  const customer = receipt.customer || {};

  return (
    <div style={{ padding: '40px 20px 100px', backgroundColor: 'var(--bg-subtle)' }} className="receipt-page-wrapper">
      {/* Print-specific style overrides */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .receipt-page-wrapper {
            padding: 0 !important;
            background-color: #ffffff !important;
          }
          .no-print, nav, footer, header, .cart-drawer, .toast-container {
            display: none !important;
          }
          .receipt-container {
            border: none !important;
            box-shadow: none !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          .receipt-table th {
            background-color: #f3f4f6 !important;
            color: #000000 !important;
          }
        }
      `}</style>

      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Navigation & Print Actions (Hidden on Print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <Link
            to={`/orders/${orderId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Order #{orderId}</span>
          </Link>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ padding: '10px 20px', gap: '8px', fontSize: '0.875rem' }}
            >
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Official Printable Invoice Sheet */}
        <div
          className="receipt-container card-clean"
          style={{
            backgroundColor: '#ffffff',
            padding: '48px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-hairline)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            color: '#111827',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid var(--border-hairline)',
              paddingBottom: '28px',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <Logo size="lg" />
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '10px', lineHeight: 1.4 }}>
                FiddleMania Handcrafted Toys Inc.<br />
                100 Artisan Boulevard, Suite 400<br />
                San Francisco, CA 94105<br />
                tax-id: US-849204812
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--accent)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Official Invoice / Receipt
              </span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0, fontFamily: 'monospace' }}>
                {receipt.receiptNumber || `REC-${orderId}`}
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '6px' }}>
                Order Ref:{' '}
                <strong style={{ color: '#111827', fontFamily: 'monospace' }}>
                  {receipt.orderNumber || orderId}
                </strong>
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '2px' }}>
                Date:{' '}
                {new Date(receipt.orderDate || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '28px',
              marginBottom: '36px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#9ca3af',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Billed / Sold To
              </span>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                {customer.name || billingAddress.fullName || 'Valued Customer'}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.4, margin: 0 }}>
                {customer.email || 'customer@example.com'}<br />
                {billingAddress.addressLine1 || billingAddress.street || 'Address on file'}<br />
                {billingAddress.addressLine2 && <>{billingAddress.addressLine2}<br /></>}
                {[billingAddress.city, billingAddress.stateProvince || billingAddress.state, billingAddress.postalCode]
                  .filter(Boolean)
                  .join(', ')}
                {billingAddress.country && <><br />{billingAddress.country}</>}
              </p>
            </div>

            <div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#9ca3af',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Shipment Destination
              </span>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                {shippingAddress.fullName || customer.name || 'Recipient'}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.4, margin: 0 }}>
                {shippingAddress.addressLine1 || shippingAddress.street || 'Standard Delivery'}<br />
                {shippingAddress.addressLine2 && <>{shippingAddress.addressLine2}<br /></>}
                {[shippingAddress.city, shippingAddress.stateProvince || shippingAddress.state, shippingAddress.postalCode]
                  .filter(Boolean)
                  .join(', ')}
                {shippingAddress.country && <><br />{shippingAddress.country}</>}
              </p>
            </div>

            <div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#9ca3af',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Payment Settlement
              </span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  color: '#16a34a',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '6px',
                }}
              >
                <CheckCircle2 size={13} />
                <span>{receipt.paymentStatus || 'Paid & Settled'}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#4b5563', margin: 0 }}>
                Method: <strong>{receipt.paymentMethod || 'Credit / Debit Card'}</strong>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <table
            className="receipt-table"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              marginBottom: '32px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>
                  Item Description
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', textAlign: 'center' }}>
                  Qty
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', textAlign: 'right' }}>
                  Unit Price
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', textAlign: 'right' }}>
                  Line Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const qty = Number(item.quantity) || 1;
                const price = Number(item.price || item.unitPrice || 0);
                const lineTotal = qty * price;

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ display: 'block', fontSize: '0.875rem', color: '#111827' }}>
                        {item.name || item.productName || item.title || 'Artisan Toy'}
                      </strong>
                      {item.variant && (
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Edition: {item.variant}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                      {qty}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.875rem', color: '#4b5563' }}>
                      {formatPHP(price)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                      {formatPHP(lineTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Financial Breakdown Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '36px' }}>
            <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4b5563' }}>
                <span>Subtotal</span>
                <span>{formatPHP(receipt.subtotal || 0)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4b5563' }}>
                <span>Standard Shipping</span>
                <span>
                  {Number(receipt.shippingFee) === 0 ? 'FREE' : formatPHP(receipt.shippingFee || 0)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4b5563' }}>
                <span>Estimated Tax (8%)</span>
                <span>{formatPHP(receipt.tax || 0)}</span>
              </div>

              {receipt.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#16a34a' }}>
                  <span>Discount Applied</span>
                  <span>-{formatPHP(receipt.discount)}</span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '2px solid #e5e7eb',
                  paddingTop: '10px',
                  marginTop: '4px',
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  color: '#111827',
                }}
              >
                <span>Total Amount Paid</span>
                <span>{formatPHP(receipt.totalAmount || receipt.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Receipt Footer & Authenticity Guarantee */}
          <div
            style={{
              borderTop: '1px solid #f3f4f6',
              paddingTop: '24px',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#9ca3af',
              lineHeight: 1.5,
            }}
          >
            <p style={{ margin: '0 0 6px' }}>
              This electronic receipt is an official verification of sale and tax document generated by FiddleMania.
            </p>
            <p style={{ margin: 0 }}>
              All heirloom toys are protected under our Lifetime Craftsmanship Warranty. For questions or support, contact support@fiddlemania.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
