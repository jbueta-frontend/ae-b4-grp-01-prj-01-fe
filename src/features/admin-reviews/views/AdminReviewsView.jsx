import { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  Flag,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Calendar,
  User,
  Package,
} from 'lucide-react';
import { getAdminReviews, updateAdminReviewStatus } from '../../../services/adminService';

export default function AdminReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load customer reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusUpdate = async (reviewId, newStatus) => {
    setActionInProgress(reviewId);
    setFeedback(null);
    try {
      await updateAdminReviewStatus(reviewId, newStatus);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId || r.reviewId === reviewId ? { ...r, status: newStatus } : r))
      );
      setFeedback(`Review status successfully changed to ${newStatus}`);
    } catch (err) {
      setError(err?.message || `Failed to update review status to ${newStatus}`);
    } finally {
      setActionInProgress(null);
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => (r.status || 'PENDING').toUpperCase() === 'PENDING').length;
    const approved = reviews.filter((r) => (r.status || '').toUpperCase() === 'APPROVED').length;
    const rejected = reviews.filter((r) => ['REJECTED', 'FLAGGED'].includes((r.status || '').toUpperCase())).length;
    const avgRating = total > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / total).toFixed(1)
      : '0.0';

    return { total, pending, approved, rejected, avgRating };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const currentStatus = (r.status || 'PENDING').toUpperCase();
      if (statusFilter !== 'ALL' && currentStatus !== statusFilter) return false;

      if (ratingFilter !== 'ALL' && Number(r.rating) !== Number(ratingFilter)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const comment = (r.comment || '').toLowerCase();
        const title = (r.title || '').toLowerCase();
        const author = (r.userName || r.user?.fullName || r.customerName || '').toLowerCase();
        const productName = (r.productName || r.product?.name || '').toLowerCase();

        return (
          comment.includes(query) ||
          title.includes(query) ||
          author.includes(query) ||
          productName.includes(query)
        );
      }

      return true;
    });
  }, [reviews, statusFilter, ratingFilter, searchQuery]);

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    switch (s) {
      case 'APPROVED':
        return {
          label: 'Approved',
          bg: 'rgba(34, 197, 94, 0.15)',
          color: '#22c55e',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'FLAGGED':
        return {
          label: 'Flagged',
          bg: 'rgba(234, 179, 8, 0.15)',
          color: '#eab308',
          border: '1px solid rgba(234, 179, 8, 0.3)',
        };
      default:
        return {
          label: 'Pending Review',
          bg: 'rgba(148, 163, 184, 0.15)',
          color: '#94a3b8',
          border: '1px solid rgba(148, 163, 184, 0.3)',
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
            Customer Review Moderation
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Audit, verify, and moderate customer ratings and testimonials across the product catalog.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="btn btn-outline btn-sm"
          style={{
            borderColor: '#374151',
            color: '#e5e7eb',
            gap: '8px',
            backgroundColor: '#1f2937',
          }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Notifications */}
      {feedback && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            color: '#22c55e',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>✓ {feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Executive Metric Tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: '#1f2937',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            border: '1px solid #374151',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Submitted Reviews
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
            {metrics.total}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#1f2937',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            border: '1px solid #374151',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#eab308', textTransform: 'uppercase', fontWeight: 600 }}>
            Pending Moderation
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#eab308', marginTop: '6px' }}>
            {metrics.pending}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#1f2937',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            border: '1px solid #374151',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#22c55e', textTransform: 'uppercase', fontWeight: 600 }}>
            Approved & Live
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#22c55e', marginTop: '6px' }}>
            {metrics.approved}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#1f2937',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            border: '1px solid #374151',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>
            Storewide Average Rating
          </span>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#f59e0b',
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{metrics.avgRating}</span>
            <Star size={20} fill="#f59e0b" color="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#1f2937',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          border: '1px solid #374151',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
          />
          <input
            type="text"
            placeholder="Search reviews, authors, or products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Status and Rating Dropdowns */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#9ca3af', fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                backgroundColor: '#111827',
                color: '#ffffff',
                border: '1px solid #374151',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved Only</option>
              <option value="REJECTED">Rejected Only</option>
              <option value="FLAGGED">Flagged Only</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#9ca3af', fontWeight: 600 }}>Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              style={{
                backgroundColor: '#111827',
                color: '#ffffff',
                border: '1px solid #374151',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
          <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px' }} />
          <p>Loading customer reviews from database...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div
          style={{
            backgroundColor: '#1f2937',
            borderRadius: 'var(--radius-md)',
            padding: '60px 24px',
            textAlign: 'center',
            border: '1px solid #374151',
          }}
        >
          <MessageSquare size={36} color="#9ca3af" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
            No Reviews Found
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto' }}>
            {searchQuery || statusFilter !== 'ALL' || ratingFilter !== 'ALL'
              ? 'No reviews match your current search and filter criteria.'
              : 'There are currently no reviews submitted by customers in the system.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredReviews.map((review) => {
            const reviewId = review.id || review.reviewId;
            const badge = getStatusBadge(review.status);
            const isProcessing = actionInProgress === reviewId;
            const stars = Array.from({ length: 5 }, (_, i) => i < (Number(review.rating) || 0));

            return (
              <div
                key={reviewId}
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #374151',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Header Row: Product info, Rating & Status */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          color: '#f59e0b',
                        }}
                      >
                        {stars.map((filled, idx) => (
                          <Star
                            key={idx}
                            size={16}
                            fill={filled ? '#f59e0b' : 'none'}
                            color={filled ? '#f59e0b' : '#4b5563'}
                          />
                        ))}
                      </div>

                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: badge.bg,
                          color: badge.color,
                          border: badge.border,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff' }}>
                      {review.title || 'Product Feedback'}
                    </h3>
                  </div>

                  {/* Moderation Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleStatusUpdate(reviewId, 'APPROVED')}
                      disabled={isProcessing || review.status === 'APPROVED'}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: review.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' : '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        opacity: review.status === 'APPROVED' ? 0.6 : 1,
                        cursor: review.status === 'APPROVED' ? 'default' : 'pointer',
                      }}
                    >
                      <CheckCircle size={14} />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleStatusUpdate(reviewId, 'REJECTED')}
                      disabled={isProcessing || review.status === 'REJECTED'}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: review.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        opacity: review.status === 'REJECTED' ? 0.6 : 1,
                        cursor: review.status === 'REJECTED' ? 'default' : 'pointer',
                      }}
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleStatusUpdate(reviewId, 'FLAGGED')}
                      disabled={isProcessing || review.status === 'FLAGGED'}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: review.status === 'FLAGGED' ? 'rgba(234, 179, 8, 0.2)' : '#d97706',
                        color: '#ffffff',
                        border: 'none',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        opacity: review.status === 'FLAGGED' ? 0.6 : 1,
                        cursor: review.status === 'FLAGGED' ? 'default' : 'pointer',
                      }}
                    >
                      <Flag size={14} />
                      <span>Flag</span>
                    </button>
                  </div>
                </div>

                {/* Review Body */}
                <p
                  style={{
                    color: '#e5e7eb',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    backgroundColor: '#111827',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #283141',
                  }}
                >
                  "{review.comment}"
                </p>

                {/* Meta details footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    paddingTop: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={13} color="#9ca3af" />
                      <span>{review.userName || review.user?.fullName || review.customerName || 'Anonymous Customer'}</span>
                    </span>

                    {review.productName && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Package size={13} color="#9ca3af" />
                        <span>Product: <strong>{review.productName}</strong></span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="#9ca3af" />
                    <span>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString('en-US', {
                            dateStyle: 'medium',
                          })
                        : 'Recent'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
