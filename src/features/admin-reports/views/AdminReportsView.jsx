import { useAdminReportsViewModel } from '../viewmodels/useAdminReportsViewModel';
import { DATE_PRESETS } from '../models/reportsModel';
import { formatPHP } from '../../../shared/utils/currency';
import RevenueAreaChart from '../components/RevenueAreaChart';
import OrderBreakdownMeters from '../components/OrderBreakdownMeters';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Calendar,
  ArrowUpRight,
  AlertTriangle,
  Box,
  CheckCircle2,
} from 'lucide-react';

export default function AdminReportsView() {
  const {
    activePreset,
    fromDate,
    toDate,
    data,
    loading,
    error,
    selectPreset,
    handleCustomDateChange,
    refresh,
  } = useAdminReportsViewModel();

  const maxSold = data.topProducts.length > 0
    ? Math.max(...data.topProducts.map((p) => Number(p.totalSold || p.quantity || 1)))
    : 1;

  return (
    <div>
      {/* 1. Header with Title & Quick Date Selector */}
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
              fontSize: 'var(--font-h2, 40px)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1.18,
            }}
          >
            Business Analytics & Visual Reports
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'var(--font-body, 18px)',
              marginTop: '6px',
            }}
          >
            Live revenue velocity, fulfillment pipeline distribution, and catalog movement.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="btn btn-outline btn-sm"
          style={{
            backgroundColor: '#ffffff',
            borderColor: 'var(--admin-card-border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            gap: '6px',
          }}
        >
          <span>↻</span>
          <span>{loading ? 'Refreshing...' : 'Refresh Metrics'}</span>
        </button>
      </div>

      {/* 2. Date Filtering Console */}
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
        {/* Preset Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '6px' }}>
            <Calendar size={15} color="var(--text-muted)" />
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
              }}
            >
              Timeframe:
            </span>
          </div>

          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset.id)}
              className={`pill ${activePreset === preset.id ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Date Pickers */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              From:
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => handleCustomDateChange(e.target.value, toDate)}
              className="form-input"
              style={{
                padding: '6px 10px',
                fontSize: '0.8125rem',
                width: 'auto',
                backgroundColor: '#faf8f5',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              To:
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => handleCustomDateChange(fromDate, e.target.value)}
              className="form-input"
              style={{
                padding: '6px 10px',
                fontSize: '0.8125rem',
                width: 'auto',
                backgroundColor: '#faf8f5',
              }}
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            color: '#dc2626',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </span>
          <button
            onClick={refresh}
            className="btn btn-outline btn-sm"
            style={{ borderColor: '#dc2626', color: '#dc2626' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Primary KPI Cards Grid (Executive BI: Revenue, Order Metrics, Active Products, Low-Stock Alerts) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        {/* KPI 1: Gross Revenue */}
        <div className="admin-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-small, 14px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-muted)',
              }}
            >
              Gross Revenue
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(200, 90, 50, 0.12)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={18} />
            </div>
          </div>
          <div
            style={{
              fontSize: 'var(--font-h2, 40px)',
              fontWeight: 800,
              color: 'var(--accent)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {loading ? '...' : formatPHP(data.totalRevenue)}
          </div>
          <div
            style={{
              marginTop: '10px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}
          >
            Real-time aggregate turnover
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="admin-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-small, 14px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-muted)',
              }}
            >
              Total Orders
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingCart size={18} />
            </div>
          </div>
          <div
            style={{
              fontSize: 'var(--font-h2, 40px)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {loading ? '...' : data.orderCount.toLocaleString()}
          </div>
          <div
            style={{
              marginTop: '10px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}
          >
            Live database transactions
          </div>
        </div>

        {/* KPI 3: Active Products */}
        <div className="admin-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-small, 14px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-muted)',
              }}
            >
              Active Toys
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box size={18} />
            </div>
          </div>
          <div
            style={{
              fontSize: 'var(--font-h2, 40px)',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {loading ? '...' : (data.activeProductsCount || 0).toLocaleString()}
          </div>
          <div
            style={{
              marginTop: '10px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}
          >
            Catalog SKUs in warehouse
          </div>
        </div>

        {/* KPI 4: Low-Stock Alerts */}
        <div className="admin-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-small, 14px)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: data.lowStockAlerts?.length > 0 ? '#dc2626' : 'var(--text-muted)',
              }}
            >
              Low-Stock Alerts
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor:
                  data.lowStockAlerts?.length > 0
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(22, 163, 74, 0.1)',
                color: data.lowStockAlerts?.length > 0 ? '#dc2626' : '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {data.lowStockAlerts?.length > 0 ? (
                <AlertTriangle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: 'var(--font-h2, 40px)',
              fontWeight: 800,
              color: data.lowStockAlerts?.length > 0 ? '#dc2626' : 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {loading ? '...' : data.lowStockAlerts?.length || 0}
          </div>
          <div
            style={{
              marginTop: '10px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: data.lowStockAlerts?.length > 0 ? '#dc2626' : '#16a34a',
            }}
          >
            {data.lowStockAlerts?.length > 0
              ? 'Replenishment action required'
              : 'Warehouse stock levels healthy'}
          </div>
        </div>
      </div>

      {/* Low-Stock Warehouse Alerts Panel (Executive BI) */}
      {data.lowStockAlerts?.length > 0 && (
        <div
          className="admin-card"
          style={{
            marginBottom: '28px',
            border: '1.5px solid rgba(220, 38, 38, 0.3)',
            backgroundColor: '#FFFBFB',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#dc2626" />
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#dc2626' }}>
                Warehouse Low-Stock Priority Alerts ({data.lowStockAlerts.length})
              </h3>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Action Required
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {data.lowStockAlerts.map((item, idx) => (
              <div
                key={item.productId || idx}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.name || item.productName || 'Toy Product'}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    SKU: {item.sku || 'N/A'} • Threshold: {item.lowStockThreshold || 5} units
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      color: '#dc2626',
                      backgroundColor: 'rgba(220, 38, 38, 0.08)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {item.stockQuantity ?? item.stock ?? 0} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Visual Graphs & Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Chart 1: Revenue Velocity Area Spline */}
        <div className="admin-card" style={{ padding: '24px 28px' }}>
          <div className="admin-card-header">
            <div>
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.01em',
                }}
              >
                Revenue Velocity Curve
              </h2>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                }}
              >
                Financial momentum & transaction inflow across selected dates
              </p>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent)',
                backgroundColor: 'rgba(200, 90, 50, 0.1)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Area Spline
            </span>
          </div>

          <RevenueAreaChart
            totalRevenue={data.totalRevenue}
            activeRange={activePreset}
          />
        </div>

        {/* Chart 2: Fulfillment & Dispatch Status Meters */}
        <div className="admin-card" style={{ padding: '24px 28px' }}>
          <div className="admin-card-header">
            <div>
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.01em',
                }}
              >
                Fulfillment Distribution Pipeline
              </h2>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                }}
              >
                Dispatch progress breakdown across current order batch
              </p>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#16a34a',
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Live Pipeline
            </span>
          </div>

          <OrderBreakdownMeters totalOrders={data.orderCount} />
        </div>
      </div>

      {/* 5. Top Selling Products Leaderboard */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f0ebe4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 800,
                color: 'var(--text-main)',
              }}
            >
              Top Selling Toys
            </h2>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              High-velocity products ranked by unit volume with relative sales progress
            </p>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              padding: '48px 0',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Loading toy movement analytics...
          </div>
        ) : data.topProducts.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
            <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              No sales records for this timeframe
            </p>
            <p style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
              Adjust your date filter to view customer purchase volume trends.
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
                    backgroundColor: '#faf7f4',
                    borderBottom: '1px solid #ede7df',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '14px 24px' }}>Rank</th>
                  <th style={{ padding: '14px 24px' }}>Product</th>
                  <th style={{ padding: '14px 24px' }}>SKU</th>
                  <th style={{ padding: '14px 24px', minWidth: '180px' }}>
                    Sales Volume Ratio
                  </th>
                  <th style={{ padding: '14px 24px', textAlign: 'right' }}>
                    Units
                  </th>
                  <th style={{ padding: '14px 24px', textAlign: 'right' }}>
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((prod, idx) => {
                  const sold = Number(prod.totalSold || prod.quantity || 0);
                  const pct = Math.min(100, Math.round((sold / maxSold) * 100));

                  return (
                    <tr
                      key={prod.productId || prod.id || idx}
                      style={{
                        borderBottom: '1px solid #f0ebe4',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#faf8f5')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#ffffff')
                      }
                    >
                      <td style={{ padding: '16px 24px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            backgroundColor:
                              idx === 0
                                ? '#fef08a'
                                : idx === 1
                                  ? '#e2e8f0'
                                  : idx === 2
                                    ? '#fed7aa'
                                    : '#f4efe9',
                            color:
                              idx === 0
                                ? '#854d0e'
                                : idx === 1
                                  ? '#334155'
                                  : idx === 2
                                    ? '#9a3412'
                                    : 'var(--text-muted)',
                          }}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 700 }}>
                        {prod.name || prod.productName || 'Unnamed Toy'}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          color: 'var(--text-muted)',
                          fontFamily: 'monospace',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {prod.sku || '—'}
                      </td>
                      {/* Visual Sales Progress Bar */}
                      <td style={{ padding: '16px 24px' }}>
                        <div
                          style={{
                            height: '8px',
                            backgroundColor: '#ebe5df',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              backgroundColor: 'var(--accent)',
                              borderRadius: 'var(--radius-full)',
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          fontWeight: 700,
                        }}
                      >
                        {sold.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          fontWeight: 800,
                          color: 'var(--accent)',
                        }}
                      >
                        {formatPHP(prod.revenue || prod.totalRevenue || 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
