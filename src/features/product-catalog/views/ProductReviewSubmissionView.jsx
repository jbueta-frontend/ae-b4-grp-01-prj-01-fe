import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { getProductById, getProductBySlug } from '../../../services/productService';
import { submitProductReview } from '../../../services/reviewService';
import { useAuth } from '../../../context/AuthContext';
import { formatPHP } from '../../../shared/utils/currency';

export default function ProductReviewSubmissionView() {
  const { productId, idOrSlug } = useParams();
  const effectiveId = productId || idOrSlug;
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!effectiveId) return;
      setLoading(true);
      setError(null);
      try {
        let p = null;
        try {
          p = await getProductById(effectiveId);
        } catch {
          p = await getProductBySlug(effectiveId);
        }
        setProduct(p);
      } catch (err) {
        setError('Unable to load product information.');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [effectiveId]);

  const ratingDescriptions = {
    1: '1 Star — Poor Quality / Disappointing',
    2: '2 Stars — Fair / Needs Improvement',
    3: '3 Stars — Average / Met Basic Expectations',
    4: '4 Stars — Very Good / Highly Recommended',
    5: '5 Stars — Exceptional Masterpiece / Flawless Craftsmanship',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!rating || rating < 1 || rating > 5) {
      setFormError('Please select a rating between 1 and 5 stars.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      setFormError('Please share at least 10 characters detailing your experience.');
      return;
    }

    const actualProductId = product?.id || effectiveId;
    setSubmitting(true);
    try {
      await submitProductReview(actualProductId, {
        rating: Number(rating),
        title: title.trim() || 'Verified Customer Review',
        comment: comment.trim(),
      });
      setSubmittedSuccess(true);
    } catch (err) {
      setFormError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Unable to submit review. You must have a verified purchase of this product to post a review.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px 100px' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Back Link */}
        <Link
          to={`/products/${effectiveId}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '24px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to {product?.name || 'Product'}</span>
        </Link>

        {/* Product Snippet Card */}
        {product && (
          <div
            className="card-clean"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              marginBottom: '28px',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: '64px',
                  height: '64px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-hairline)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-hairline)',
                }}
              >
                <Package size={24} color="var(--text-muted)" />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--accent)',
                }}
              >
                {product.category || 'Heirloom Toy'}
              </span>
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  margin: '2px 0 4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {product.name}
              </h2>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {formatPHP(product.price)}
              </span>
            </div>
          </div>
        )}

        {/* Submission Card */}
        <div className="card-clean" style={{ padding: '36px 32px' }}>
          {submittedSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle2 size={34} strokeWidth={2.5} />
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--success)',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Feedback Submitted
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>
                Thank You For Your Review!
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                  maxWidth: '460px',
                  margin: '0 auto 28px',
                }}
              >
                Your feedback has been received and queued for verified purchase moderation. Once verified, it will be published to the public product gallery.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Link
                  to={`/products/${effectiveId}`}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  Return to Product Page
                </Link>
                <Link
                  to="/orders"
                  className="btn btn-outline"
                  style={{ padding: '12px 24px' }}
                >
                  View Order History
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Write a Customer Review
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Share your experience with this toy to help fellow collectors and parents make informed decisions.
                </p>
              </div>

              {/* Verified Purchase Requirement Note */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(200, 90, 50, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(200, 90, 50, 0.2)',
                  marginBottom: '24px',
                  fontSize: '0.8125rem',
                  color: 'var(--accent)',
                  fontWeight: 500,
                }}
              >
                <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                <span>
                  Only customers who have purchased this toy can submit verified reviews.
                </span>
              </div>

              {!isAuthenticated && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: '#dc2626' }}>
                      Sign In Required
                    </strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      You must be signed in to submit a verified purchase review.
                    </span>
                  </div>
                  <Link
                    to={`/login?redirect=/products/${effectiveId}/reviews`}
                    className="btn btn-primary btn-sm"
                  >
                    Sign In to Continue
                  </Link>
                </div>
              )}

              {formError && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '14px 16px',
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid #DC2626',
                    borderRadius: 'var(--radius-md)',
                    color: '#DC2626',
                    fontSize: '0.875rem',
                    marginBottom: '24px',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '2px' }}>Review Submission Note</strong>
                    <span>{formError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* 1. Star Rating Selector */}
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ fontWeight: 700, marginBottom: '8px' }}>
                    Overall Rating *
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = hoverRating ? star <= hoverRating : star <= rating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer',
                            color: active ? '#f59e0b' : 'var(--border-hairline)',
                            transition: 'transform 0.15s ease',
                          }}
                          aria-label={`${star} Stars`}
                        >
                          <Star
                            size={32}
                            fill={active ? '#f59e0b' : 'none'}
                            strokeWidth={active ? 1.5 : 1}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span
                    style={{
                      display: 'block',
                      marginTop: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {ratingDescriptions[hoverRating || rating]}
                  </span>
                </div>

                {/* 2. Review Headline / Title */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Headline / Summary
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Masterpiece quality! Solid hardwood construction."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {/* 3. Detailed Review Comment */}
                <div className="form-group" style={{ marginBottom: '28px' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Detailed Review *
                  </label>
                  <textarea
                    className="form-input"
                    rows={5}
                    required
                    placeholder="Describe the build quality, craftsmanship, packaging, and how much joy it brings..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '6px',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>Minimum 10 characters</span>
                    <span>{comment.length} characters</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={submitting || !isAuthenticated}
                  className="btn btn-primary btn-block"
                  style={{
                    padding: '14px',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    gap: '8px',
                  }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting Verified Review...' : 'Submit Review'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
