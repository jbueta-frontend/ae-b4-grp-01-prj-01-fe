import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  Package,
  CheckCircle2,
  ArrowLeft,
  Download,
  RotateCcw,
  Search,
  AlertCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { trackShipmentPublic, getShipmentByOrderId } from '../../../services/shipmentService';
import { getEffectiveOrderStatus } from '../../../services/orderSync';

export default function ShipmentTrackingView() {
  const { trackingNumber: routeTrackingNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [searchInput, setSearchInput] = useState(routeTrackingNumber || '');
  const [activeTrackingNumber, setActiveTrackingNumber] = useState(routeTrackingNumber || '');
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback order state if passed from navigation
  const stateOrder = location.state?.order;

  const fetchTracking = async (trkNum) => {
    if (!trkNum) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Try public tracking endpoint: GET /shipments/track/:trackingNumber
      let data = null;
      try {
        data = await trackShipmentPublic(trkNum);
      } catch (err) {
        // 2. If track fails and we have an order ID, try customer endpoint: GET /shipments/:orderId
        if (stateOrder?.orderId || trkNum.startsWith('ORD-') || trkNum.startsWith('FM-')) {
          const ordId = stateOrder?.orderId || trkNum;
          try {
            data = await getShipmentByOrderId(ordId);
          } catch {}
        }
      }

      if (data) {
        const effectiveStatus = getEffectiveOrderStatus(data);
        setShipmentData({ ...data, status: effectiveStatus });
      } else if (stateOrder) {
        // Synthesize display from state order with effective status
        const effectiveStatus = getEffectiveOrderStatus(stateOrder);
        setShipmentData({
          trackingNumber: trkNum,
          orderId: stateOrder.orderId || stateOrder.orderNumber,
          carrier: stateOrder.carrier || 'FEDEX',
          service: 'Priority Carbon-Neutral Express',
          status: effectiveStatus,
          estimatedDelivery: stateOrder.estimatedDelivery || 'Estimated 2–3 business days',
          origin: 'Central Fulfillment Depot',
          destination: stateOrder.shippingAddress?.city
            ? `${stateOrder.shippingAddress.city}, ${stateOrder.shippingAddress.country || 'PH'}`
            : 'Delivery Destination',
          items: stateOrder.items || [],
          timeline: [
            {
              title: 'Parcel Prepared & Inventory Reserved',
              location: 'Fulfillment Hub',
              timestamp: new Date(stateOrder.createdAt || Date.now()).toLocaleString(),
              completed: true,
              current: false,
            },
            {
              title: 'Picked Up by Courier',
              location: 'FEDEX Express Logistics Center',
              timestamp: 'In Transit',
              completed: true,
              current: true,
            },
            {
              title: 'Out for Doorstep Delivery',
              location: 'Local Delivery Station',
              timestamp: 'Pending Handover',
              completed: false,
              current: false,
            },
          ],
        });
      } else {
        setError(`No active shipment found for tracking identifier "${trkNum}".`);
      }
    } catch (err) {
      if (stateOrder) {
        setShipmentData({
          trackingNumber: trkNum,
          orderId: stateOrder.orderId,
          carrier: 'FEDEX',
          service: 'Carbon-Neutral Standard Delivery',
          status: stateOrder.status || 'In Transit',
          estimatedDelivery: stateOrder.estimatedDelivery || 'Sep 14 – Sep 16',
          items: stateOrder.items || [],
        });
      } else {
        setError(`No active shipment record found for "${trkNum}". Please verify your tracking reference.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeTrackingNumber) {
      setActiveTrackingNumber(routeTrackingNumber);
      setSearchInput(routeTrackingNumber);
      fetchTracking(routeTrackingNumber);
    } else if (stateOrder?.trackingNumber) {
      setActiveTrackingNumber(stateOrder.trackingNumber);
      setSearchInput(stateOrder.trackingNumber);
      fetchTracking(stateOrder.trackingNumber);
    }
  }, [routeTrackingNumber]);

  // Live order status synchronization listener
  useEffect(() => {
    const handleOrderUpdate = (e) => {
      const { orderId, status } = e.detail || {};
      if (
        status &&
        (orderId === shipmentData?.orderId ||
          orderId === stateOrder?.orderId ||
          orderId === activeTrackingNumber)
      ) {
        setShipmentData((prev) => (prev ? { ...prev, status: status.toUpperCase() } : prev));
      }
    };

    window.addEventListener('fiddlemania_order_updated', handleOrderUpdate);
    return () => {
      window.removeEventListener('fiddlemania_order_updated', handleOrderUpdate);
    };
  }, [shipmentData?.orderId, stateOrder?.orderId, activeTrackingNumber]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = searchInput.trim();
    if (!clean) return;
    setActiveTrackingNumber(clean);
    navigate(`/track/${clean}`, { replace: true });
    fetchTracking(clean);
  };

  const handleReorder = (item) => {
    addToCart(item, 1, item.variant);
  };

  const currentCarrier = shipmentData?.carrier || 'FEDEX';
  const currentStatus = shipmentData?.status || 'In Transit';
  const currentEst = shipmentData?.estimatedDelivery || shipmentData?.deliveryTimestamp || 'Sep 14 – Sep 16';
  const currentItems = shipmentData?.items || stateOrder?.items || [];
  const currentTimeline = shipmentData?.timeline || [
    {
      title: 'Package Dispatched with Courier',
      location: `${currentCarrier} Central Gateway`,
      timestamp: 'Today at 08:30 AM',
      completed: true,
      current: true,
    },
    {
      title: 'Order Verified & Warehouse Stock Reserved',
      location: 'FiddleMania Bavarian Workshop Depot',
      timestamp: 'Yesterday at 04:15 PM',
      completed: true,
      current: false,
    },
  ];

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container-narrow">
        {/* Back Link & Quick Lookup Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <Link
            to="/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Orders</span>
          </Link>

          {/* Quick Tracking Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              maxWidth: '380px',
              width: '100%',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Tracking # (e.g. TRK-...)"
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  fontSize: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-card)',
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading}
              style={{ whiteSpace: 'nowrap', padding: '9px 16px' }}
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div
            className="card-clean"
            style={{ textAlign: 'center', padding: '60px 20px', marginBottom: '24px' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid var(--border-hairline)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 16px',
              }}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', fontWeight: 600 }}>
              Querying logistics gateway for real-time delivery telemetry...
            </p>
          </div>
        )}

        {/* Not Found / Error State */}
        {!loading && error && (
          <div
            className="card-clean"
            style={{ textAlign: 'center', padding: '48px 24px', marginBottom: '28px' }}
          >
            <AlertCircle
              size={42}
              color="var(--accent)"
              style={{ margin: '0 auto 16px', opacity: 0.8 }}
            />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
              Shipment Record Not Found
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                maxWidth: '460px',
                margin: '0 auto 20px',
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
            <div
              style={{
                display: 'inline-flex',
                gap: '8px',
                alignItems: 'center',
                backgroundColor: 'var(--bg-subtle)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>Tip: Valid tracking formats include</span>
              <code style={{ fontWeight: 700, color: 'var(--text-main)' }}>TRK-XXXXXXXX</code>
              <span>or carrier references from FEDEX / UPS.</span>
            </div>
          </div>
        )}

        {/* Active Shipment Display */}
        {!loading && !error && (
          <>
            {/* Header Tracker Card */}
            <div className="card-clean" style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid var(--border-hairline)',
                }}
              >
                <div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    <Truck size={14} /> {currentStatus}
                  </span>
                  <h1
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Tracking: {activeTrackingNumber || 'Pending Courier Scan'}
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                    Carrier:{' '}
                    <strong style={{ color: 'var(--text-main)' }}>{currentCarrier}</strong>{' '}
                    • Service:{' '}
                    <span>{shipmentData?.service || 'Carbon-Neutral Delivery'}</span>
                    {shipmentData?.orderId && (
                      <span> • Order #{shipmentData.orderId}</span>
                    )}
                  </p>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() =>
                      alert('Shipment receipt and delivery invoice downloaded.')
                    }
                    className="btn btn-outline btn-sm"
                  >
                    <Download size={15} />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>

              {/* Expected Date Banner */}
              <div
                style={{
                  marginTop: '20px',
                  backgroundColor: '#FAF7F5',
                  border: '1px solid #E4DDD6',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    Estimated Delivery Timestamp
                  </span>
                  <p
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      marginTop: '2px',
                    }}
                  >
                    {currentEst}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#16a34a',
                      backgroundColor: 'rgba(22, 163, 74, 0.1)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={13} /> On Schedule
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Status Milestones */}
            <div className="card-clean" style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 800,
                  marginBottom: '20px',
                  color: 'var(--text-main)',
                }}
              >
                Carrier Telemetry & Progress Timeline
              </h2>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                {currentTimeline.map((m, idx) => (
                  <div
                    key={idx}
                    style={{ display: 'flex', gap: '16px', position: 'relative' }}
                  >
                    {/* Node & Line */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: m.current
                            ? 'var(--accent)'
                            : m.completed || m.done
                              ? 'var(--text-main)'
                              : 'var(--bg-muted)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                        }}
                      >
                        {m.completed || m.done ? (
                          <CheckCircle2 size={16} strokeWidth={2.5} />
                        ) : (
                          <Clock size={14} />
                        )}
                      </div>
                      {idx < currentTimeline.length - 1 && (
                        <div
                          style={{
                            width: '2px',
                            flex: 1,
                            backgroundColor: 'var(--border-hairline)',
                            marginTop: '4px',
                          }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div
                      style={{
                        paddingBottom:
                          idx < currentTimeline.length - 1 ? '16px' : '0',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                        }}
                      >
                        {m.title}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--text-muted)',
                          marginTop: '2px',
                        }}
                      >
                        {m.location}
                      </p>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-light)',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {m.timestamp || m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordered Items & Reorder */}
            {currentItems.length > 0 && (
              <div className="card-clean">
                <h2
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 800,
                    marginBottom: '16px',
                  }}
                >
                  Package Contents
                </h2>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  {currentItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        paddingBottom: '12px',
                        borderBottom:
                          idx < currentItems.length - 1
                            ? '1px solid var(--border-hairline)'
                            : 'none',
                      }}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '54px',
                            height: '54px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        />
                        <div>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                            {item.name}
                          </h4>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleReorder(item)}
                        className="btn btn-outline btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <RotateCcw size={14} />
                        <span>Reorder</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
