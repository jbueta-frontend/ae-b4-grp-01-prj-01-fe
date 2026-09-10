import { Link } from 'react-router-dom';
import { useAdminOrdersViewModel } from '../viewmodels/useAdminOrdersViewModel';
import {
  ORDER_STATUS_TABS,
  getOrderStatusConfig,
} from '../models/adminOrderModel';
import { formatPHP } from '../../../shared/utils/currency';

export default function AdminOrdersListView() {
  const {
    orders,
    page,
    totalPages,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    goToPage,
    nextPage,
    prevPage,
    refresh,
  } = useAdminOrdersViewModel();

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
            }}
          >
            Orders & Fulfillment Operations
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              marginTop: '4px',
            }}
          >
            Track incoming purchases, verify payment settlement, and manage dispatch manifests.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="btn btn-outline btn-sm"
        >
          <span>↻</span>
          <span>{loading ? 'Refreshing...' : 'Refresh List'}</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            color: '#dc2626',
            marginBottom: '20px',
            fontSize: '0.875rem',
          }}
        >
          ⚠ {typeof error === 'string' ? error : error?.message || 'Error occurred'}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="admin-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 280px', maxWidth: '380px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, customer name, email..."
            className="form-input"
            style={{ padding: '8px 14px', fontSize: '0.875rem' }}
          />
        </div>

        {/* Status Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {ORDER_STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`pill ${statusFilter === tab ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div
            style={{
              padding: '48px 0',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Loading orders list...
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📑</div>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '6px',
              }}
            >
              No orders match this criteria
            </h3>
            <p style={{ fontSize: '0.875rem' }}>
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try resetting your status filters or searching another keyword.'
                : 'Customer orders will appear here once placed.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
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
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '14px 20px' }}>Order #</th>
                  <th style={{ padding: '14px 20px' }}>Date</th>
                  <th style={{ padding: '14px 20px' }}>Customer</th>
                  <th style={{ padding: '14px 20px' }}>Items</th>
                  <th style={{ padding: '14px 20px' }}>Total</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => {
                  const id = ord.orderId || ord.id;
                  const stConfig = getOrderStatusConfig(ord.status);
                  const itemCount = Array.isArray(ord.items)
                    ? ord.items.reduce(
                        (sum, it) => sum + Number(it.quantity || 1),
                        0
                      )
                    : ord.itemCount || 1;

                  const dateStr = ord.createdAt
                    ? new Date(ord.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—';

                  return (
                    <tr
                      key={id}
                      style={{
                        borderBottom: '1px solid var(--border-hairline)',
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
                      {/* Order Number */}
                      <td
                        style={{
                          padding: '16px 20px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ord.orderNumber || ord.orderId}
                      </td>

                      {/* Date */}
                      <td
                        style={{
                          padding: '16px 20px',
                          color: 'var(--text-muted)',
                          fontSize: '0.8125rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {dateStr}
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '16px 20px' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: 'var(--text-main)',
                          }}
                        >
                          {ord.user?.name || ord.customerName || 'Customer'}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          {ord.user?.email || ord.customerEmail || '—'}
                        </div>
                      </td>

                      {/* Items */}
                      <td
                        style={{
                          padding: '16px 20px',
                          color: 'var(--text-muted)',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </td>

                      {/* Total */}
                      <td
                        style={{
                          padding: '16px 20px',
                          fontWeight: 700,
                          color: 'var(--accent)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatPHP(ord.total || 0)}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            backgroundColor: stConfig.bg,
                            color: stConfig.color,
                          }}
                        >
                          {stConfig.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td
                        style={{
                          padding: '16px 20px',
                          textAlign: 'right',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Link
                          to={`/admin/orders/${id}`}
                          className="btn btn-outline btn-sm"
                          style={{
                            padding: '6px 14px',
                            fontSize: '0.8125rem',
                            gap: '4px',
                          }}
                        >
                          <span>Manage</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={prevPage}
                disabled={page <= 1}
                className="btn btn-outline btn-sm"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      minWidth: '28px',
                    }}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={nextPage}
                disabled={page >= totalPages}
                className="btn btn-outline btn-sm"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
