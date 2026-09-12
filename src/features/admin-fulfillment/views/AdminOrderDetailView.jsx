import { Link } from 'react-router-dom';
import { useAdminOrderDetailViewModel } from '../viewmodels/useAdminOrderDetailViewModel';
import { getOrderStatusConfig } from '../models/adminOrderModel';
import { formatPHP } from '../../../shared/utils/currency';

export default function AdminOrderDetailView() {
  const {
    order,
    loading,
    error,
    feedback,
    clearFeedback,
    isUpdating,
    updateOrderStatus,
    refresh,
  } = useAdminOrderDetailViewModel();

  if (loading) {
    return (
      <div
        style={{
          padding: '80px 0',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}
      >
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
          Order Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          {typeof error === 'string'
            ? error
            : error?.message ||
              'Unable to retrieve records for the requested order ID.'}
        </p>
        <Link to="/admin/orders" className="btn btn-outline btn-sm">
          ← Back to Orders List
        </Link>
      </div>
    );
  }

  const stConfig = getOrderStatusConfig(order.status);
  const items = Array.isArray(order.items) ? order.items : [];
  const address = order.shippingAddress || order.address || {};
  const payment = order.payment || {};
  const shipment = order.shipment || {};

  return (
    <div>
      {/* Top Nav Breadcrumb & Actions */}
      <div
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
          to="/admin/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}
        >
          <span>←</span>
          <span>Back to Orders List</span>
        </Link>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            to={`/orders/${order.orderNumber || order.orderId}/receipt`}
            target="_blank"
            className="btn btn-outline btn-sm"
            style={{ gap: '6px' }}
          >
            <span>📄</span>
            <span>View Printable Receipt</span>
          </Link>
          <button
            onClick={refresh}
            disabled={loading}
            className="btn btn-outline btn-sm"
          >
            <span>↻</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          style={{
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            color: 'var(--success)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <span>✓ {feedback}</span>
          <button
            onClick={clearFeedback}
            style={{ color: 'var(--success)', cursor: 'pointer', padding: '0 4px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Order Headline Card */}
      <div
        className="admin-card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                fontFamily: 'monospace',
              }}
            >
              {order.orderNumber || order.orderId}
            </h1>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                backgroundColor: stConfig.bg,
                color: stConfig.color,
              }}
            >
              {stConfig.label}
            </span>
          </div>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginTop: '4px',
            }}
          >
            Placed on{' '}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : 'Recent'}
          </p>
        </div>

        {/* Quick Status Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Update Status:
          </span>
          <select
            value={order.status}
            disabled={isUpdating}
            onChange={(e) => updateOrderStatus(e.target.value)}
            className="form-input"
            style={{
              width: 'auto',
              padding: '6px 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Left Column: Items & Customer Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Purchased Line Items */}
          <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-hairline)',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              Order Line Items ({items.length})
            </div>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderBottom: '1px solid var(--border-hairline)',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  <th style={{ padding: '10px 20px' }}>Toy Item</th>
                  <th style={{ padding: '10px 20px', textAlign: 'center' }}>
                    Qty
                  </th>
                  <th style={{ padding: '10px 20px', textAlign: 'right' }}>
                    Price
                  </th>
                  <th style={{ padding: '10px 20px', textAlign: 'right' }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr
                    key={it.orderItemId || idx}
                    style={{ borderBottom: '1px solid var(--border-hairline)' }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600 }}>
                        {it.name || it.productName || 'Toy Item'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'monospace',
                        }}
                      >
                        SKU: {it.sku || '—'}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '14px 20px',
                        textAlign: 'center',
                        fontWeight: 600,
                      }}
                    >
                      {it.quantity}
                    </td>
                    <td
                      style={{
                        padding: '14px 20px',
                        textAlign: 'right',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {formatPHP(it.price || 0)}
                    </td>
                    <td
                      style={{
                        padding: '14px 20px',
                        textAlign: 'right',
                        fontWeight: 700,
                      }}
                    >
                      {formatPHP((it.price || 0) * (it.quantity || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial Totals */}
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.875rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Subtotal</span>
                <span>{formatPHP(order.subtotal || 0)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Shipping Fee</span>
                <span>{formatPHP(order.shippingFee || 0)}</span>
              </div>
              {order.tax > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>Tax</span>
                  <span>{formatPHP(order.tax)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.0625rem',
                  borderTop: '1px solid var(--border-hairline)',
                  paddingTop: '8px',
                  marginTop: '4px',
                  color: 'var(--accent)',
                }}
              >
                <span>Total Settled</span>
                <span>{formatPHP(order.total || 0)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Profile */}
          <div className="admin-card">
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '14px',
                color: 'var(--text-main)',
              }}
            >
              Recipient & Destination Address
            </h2>

            <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                {address.recipientName || order.user?.name || 'Customer'}
              </p>
              <p style={{ color: 'var(--text-muted)' }}>
                {order.user?.email || '—'}
              </p>
              {address.phone && (
                <p style={{ color: 'var(--text-muted)' }}>{address.phone}</p>
              )}

              <div
                style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-hairline)',
                  color: 'var(--text-main)',
                }}
              >
                <p>{address.addressLine1 || 'Street Address'}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {[address.city, address.stateProvince, address.postalCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                  {address.country || 'Philippines'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Shipment Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Payment Card */}
          <div className="admin-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
                Payment Transaction
              </h2>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor:
                    payment.status === 'PAID' || payment.status === 'COMPLETED'
                      ? 'var(--success-bg)'
                      : 'rgba(217, 119, 6, 0.1)',
                  color:
                    payment.status === 'PAID' || payment.status === 'COMPLETED'
                      ? 'var(--success)'
                      : '#D97706',
                  textTransform: 'uppercase',
                }}
              >
                {payment.status || (order.status === 'CANCELLED' ? 'CANCELLED' : 'PENDING SETTLEMENT')}
              </span>
            </div>

            <div
              style={{
                fontSize: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Method:
                </span>
                <div style={{ fontWeight: 600 }}>
                  {payment.paymentMethod || order.paymentMethod || 'Awaiting Payment Confirmation'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Transaction Reference:
                </span>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8125rem',
                    color: payment.transactionRef ? 'var(--text-main)' : 'var(--text-muted)',
                  }}
                >
                  {payment.transactionRef || order.paymentRef || '—'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Amount Captured:
                </span>
                <div style={{ fontWeight: 700, color: 'var(--accent)' }}>
                  {formatPHP(payment.amount || order.totalAmount || order.total || 0)}
                </div>
              </div>

              {payment.paidAt && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Payment Timestamp:
                  </span>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {new Date(payment.paidAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fulfillment & Shipment Card */}
          <div className="admin-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
                Courier Fulfillment
              </h2>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor:
                    shipment.status === 'DELIVERED'
                      ? 'var(--success-bg)'
                      : shipment.status === 'SHIPPED' || shipment.status === 'IN_TRANSIT'
                      ? 'rgba(124, 58, 237, 0.1)'
                      : 'rgba(113, 113, 122, 0.1)',
                  color:
                    shipment.status === 'DELIVERED'
                      ? 'var(--success)'
                      : shipment.status === 'SHIPPED' || shipment.status === 'IN_TRANSIT'
                      ? '#7c3aed'
                      : '#71717a',
                  textTransform: 'uppercase',
                }}
              >
                {shipment.status || (order.status === 'SHIPPED' ? 'SHIPPED' : 'UNASSIGNED')}
              </span>
            </div>

            <div
              style={{
                fontSize: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Carrier Partner:
                </span>
                <div style={{ fontWeight: 600 }}>
                  {shipment.carrier || (order.carrier ? order.carrier : 'Unassigned Courier')}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Tracking Waybill:
                </span>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    marginTop: '2px',
                    color: shipment.trackingNumber ? 'var(--text-main)' : 'var(--text-muted)',
                  }}
                >
                  {shipment.trackingNumber || order.trackingNumber || 'Awaiting Waybill Generation'}
                </div>
                {(shipment.trackingNumber || order.trackingNumber) && (
                  <Link
                    to={`/track/${shipment.trackingNumber || order.trackingNumber}`}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--accent)',
                      textDecoration: 'underline',
                      display: 'inline-block',
                      marginTop: '4px',
                    }}
                  >
                    Open Live Tracking Portal ↗
                  </Link>
                )}
              </div>

              {shipment.shippedAt && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Shipped At:
                  </span>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {new Date(shipment.shippedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
