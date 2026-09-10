import { useState } from 'react';
import { useProductDetailViewModel } from '../viewmodels/useProductDetailViewModel';
import {
  Star,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Send,
} from 'lucide-react';

export default function ProductDetailView() {
  const {
    product,
    activeImage,
    setActiveImage,
    selectedVariant,
    setSelectedVariant,
    quantity,
    incrementQty,
    decrementQty,
    openAccordion,
    toggleAccordion,
    handleAddToCart,
    addedNotice,
    goBack,
    reviews,
    reviewsLoading,
    isSubmittingReview,
    reviewFeedback,
    handleAddReview,
    isAuthenticated,
  } = useProductDetailViewModel();

  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!product) {
    return (
      <div
        className="container"
        style={{ padding: '64px 0', textAlign: 'center' }}
      >
        <p>Product not found.</p>
        <button
          onClick={goBack}
          className="btn btn-outline"
          style={{ marginTop: '16px' }}
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0 80px' }}>
      <div className="container">
        {/* Back Link */}
        <button
          onClick={goBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '28px',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Collection</span>
        </button>

        {/* Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            alignItems: 'flex-start',
          }}
        >
          {/* Gallery Quadrant */}
          <div>
            {/* Active Image */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-subtle)',
                aspectRatio: '1 / 1',
                marginBottom: '16px',
                border: '1px solid var(--border-hairline)',
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.2s ease',
                }}
              />
            </div>

            {/* Thumbnail Rail */}
            {product.gallery?.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: `2px solid ${activeImage === img ? 'var(--accent)' : 'transparent'}`,
                      backgroundColor: 'var(--bg-card)',
                      flexShrink: 0,
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchase Quadrant */}
          <div>
            {/* Category & Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-small, 14px)',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {product.category} • {product.ageGroup}
              </span>
              {product.tag && (
                <span
                  style={{
                    fontSize: 'var(--font-small, 14px)',
                    fontWeight: 800,
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {product.tag}
                </span>
              )}
            </div>

            {/* Product Title (H2: 40px) */}
            <h1
              style={{
                fontSize: 'var(--font-h2-fluid, 40px)',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1.18,
                letterSpacing: '-0.02em',
                marginBottom: '14px',
              }}
            >
              {product.name}
            </h1>

            {/* Rating Summary */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Math.floor(product.rating) ? '#F59E0B' : '#E5E7EB'
                    }
                    color={
                      i < Math.floor(product.rating) ? '#F59E0B' : '#E5E7EB'
                    }
                  />
                ))}
              </div>
              <span style={{ fontSize: 'var(--font-small, 14px)', fontWeight: 700 }}>
                {product.rating}
              </span>
              <span
                style={{ fontSize: 'var(--font-small, 14px)', color: 'var(--text-muted)' }}
              >
                ({product.reviewCount} verified reviews)
              </span>
            </div>

            {/* Price Row (Text Sensitivity: Price Prominence & Stock Badge) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border-hairline)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-h2, 40px)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ₱{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontSize: 'var(--font-body, 18px)',
                    color: 'var(--text-light)',
                    textDecoration: 'line-through',
                    fontWeight: 500,
                  }}
                >
                  ₱{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span
                style={{
                  fontSize: 'var(--font-small, 14px)',
                  color: 'var(--success)',
                  fontWeight: 800,
                  backgroundColor: 'var(--success-bg)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.02em',
                }}
              >
                In Stock ({product.stockCount} ready to ship)
              </span>
            </div>

            {/* Description (Body: 18px) */}
            <p
              style={{
                fontSize: 'var(--font-body, 18px)',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '28px',
              }}
            >
              {product.shortDescription}
            </p>

            {/* Variant Selector */}
            {product.variants?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    marginBottom: '8px',
                  }}
                >
                  Finish: <strong>{selectedVariant?.name}</strong>
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${selectedVariant?.id === v.id ? 'var(--text-main)' : 'var(--border-hairline)'}`,
                        backgroundColor:
                          selectedVariant?.id === v.id
                            ? 'var(--bg-card)'
                            : 'transparent',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: v.color,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
                      />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Bag Row (Balanced 52px height & matching radius) */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              {/* Symmetrical & Balanced Stepper */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '52px',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={decrementQty}
                  style={{
                    width: '46px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'background-color var(--transition-fast)',
                    borderRight: '1px solid var(--border-hairline)',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div
                  style={{
                    width: '48px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                  }}
                >
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={incrementQty}
                  style={{
                    width: '46px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'background-color var(--transition-fast)',
                    borderLeft: '1px solid var(--border-hairline)',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Commanding Add to Bag CTA (Matching 52px height) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  height: '52px',
                  padding: '0 24px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {addedNotice ? (
                  <>
                    <Check size={18} strokeWidth={3} />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <span>
                    Add to Bag — ₱{(product.price * quantity).toFixed(2)}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Guarantees */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                padding: '16px 0',
                borderTop: '1px solid var(--border-hairline)',
                borderBottom: '1px solid var(--border-hairline)',
                marginBottom: '32px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Truck size={16} color="var(--accent)" />
                <span
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}
                >
                  Carbon-neutral shipping
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ShieldCheck size={16} color="var(--accent)" />
                <span
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}
                >
                  Heirloom warranty
                </span>
              </div>
            </div>

            {/* Collapsible Spec Accordions */}
            <div>
              {/* Accordion 1: Specs */}
              <div style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                <button
                  onClick={() => toggleAccordion('dimensions')}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: 'var(--font-body, 18px)',
                    color: 'var(--text-main)',
                  }}
                >
                  <span>Dimensions & Materials</span>
                  {openAccordion === 'dimensions' ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                {openAccordion === 'dimensions' && (
                  <div
                    style={{
                      paddingBottom: '16px',
                      fontSize: '1rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    <p>
                      <strong>Dimensions:</strong>{' '}
                      {product.specs?.dimensions || '28 × 18 × 12 cm'}
                    </p>
                    <p style={{ marginTop: '4px' }}>
                      <strong>Materials:</strong>{' '}
                      {product.specs?.materials ||
                        'Sustainable FSC Certified Beechwood, Non-toxic Beeswax Seals, Organic Pigments'}
                    </p>
                    <p style={{ marginTop: '4px' }}>
                      <strong>Craftsmanship:</strong>{' '}
                      {product.specs?.origin ||
                        'Precision engineered and hand-finished for heirloom durability'}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Safety & Age */}
              <div style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                <button
                  onClick={() => toggleAccordion('safety')}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: 'var(--font-body, 18px)',
                    color: 'var(--text-main)',
                  }}
                >
                  <span>Safety Certifications & Age Group</span>
                  {openAccordion === 'safety' ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                {openAccordion === 'safety' && (
                  <div
                    style={{
                      paddingBottom: '16px',
                      fontSize: '1rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    <p>
                      <strong>Certifications:</strong>{' '}
                      {product.specs?.safety ||
                        'EN71, ASTM F963, 100% Non-toxic & BPA-Free Certified'}
                    </p>
                    <p style={{ marginTop: '4px' }}>
                      <strong>Age Range:</strong>{' '}
                      {product.specs?.ageRange || product.ageGroup || 'All Ages'}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Verified Reviews */}
              <div style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                <button
                  onClick={() => toggleAccordion('reviews')}
                  style={{
                    width: '100%',
                    padding: '16px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: 'var(--font-body, 18px)',
                    color: 'var(--text-main)',
                  }}
                >
                  <span>Customer Reviews ({reviews.length})</span>
                  {openAccordion === 'reviews' ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                {openAccordion === 'reviews' && (
                  <div style={{ paddingBottom: '24px' }}>
                    {/* Header Action to Write a Review */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        paddingBottom: '12px',
                        borderBottom: '1px dashed var(--border-hairline)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} color="var(--accent)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          Verified Customer Feedback
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm((prev) => !prev)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.8125rem', padding: '5px 12px', gap: '5px' }}
                      >
                        <MessageSquare size={13} />
                        <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
                      </button>
                    </div>

                    {/* Review Feedback Banner */}
                    {reviewFeedback && (
                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: '16px',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          backgroundColor: 'rgba(22, 163, 74, 0.08)',
                          color: '#15803d',
                          border: '1px solid rgba(22, 163, 74, 0.25)',
                        }}
                      >
                        {reviewFeedback.message}
                      </div>
                    )}

                    {/* Interactive Review Submission Form (POST /products/:productId/reviews) */}
                    {showReviewForm && (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!formTitle.trim() || !formComment.trim()) {
                            alert('Please provide both a title and your feedback comment.');
                            return;
                          }
                          const ok = await handleAddReview({
                            rating: formRating,
                            title: formTitle,
                            comment: formComment,
                          });
                          if (ok) {
                            setFormTitle('');
                            setFormComment('');
                            setShowReviewForm(false);
                          }
                        }}
                        style={{
                          backgroundColor: '#FAF7F5',
                          border: '1px solid #E4DDD6',
                          borderRadius: 'var(--radius-md)',
                          padding: '18px',
                          marginBottom: '20px',
                        }}
                      >
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '12px' }}>
                          Share Your Toy Experience
                        </h4>

                        {/* Star Rating Picker */}
                        <div style={{ marginBottom: '14px' }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                            Rating ({formRating} / 5 Stars)
                          </label>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {[1, 2, 3, 4, 5].map((starVal) => (
                              <button
                                key={starVal}
                                type="button"
                                onClick={() => setFormRating(starVal)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: '2px',
                                  cursor: 'pointer',
                                }}
                                title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                              >
                                <Star
                                  size={22}
                                  fill={starVal <= formRating ? '#f59e0b' : 'none'}
                                  color={starVal <= formRating ? '#f59e0b' : '#d4ccc4'}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Review Title */}
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Headline or Summary
                          </label>
                          <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            placeholder="e.g. Exceptional craftsmanship & kinetic movement!"
                            required
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '0.875rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-hairline)',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                        </div>

                        {/* Review Comment */}
                        <div style={{ marginBottom: '14px' }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Detailed Feedback
                          </label>
                          <textarea
                            rows={3}
                            value={formComment}
                            onChange={(e) => setFormComment(e.target.value)}
                            placeholder="Describe the build quality, play value, and packaging..."
                            required
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '0.875rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-hairline)',
                              backgroundColor: '#FFFFFF',
                              resize: 'vertical',
                            }}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '6px', width: '100%', justifyContent: 'center' }}
                        >
                          <Send size={13} />
                          <span>{isSubmittingReview ? 'Submitting...' : 'Submit Verified Review'}</span>
                        </button>
                      </form>
                    )}

                    {/* List of Reviews */}
                    {reviewsLoading ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '16px 0' }}>
                        Loading verified reviews...
                      </p>
                    ) : reviews.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                          No customer reviews yet
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          Be the first to review this handcrafted architectural toy!
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {reviews.map((r, i) => {
                          const authorName =
                            r.user?.profile
                              ? `${r.user.profile.firstName || ''} ${r.user.profile.lastName || ''}`.trim()
                              : r.author || 'Verified Collector';

                          const starCount = Number(r.rating) || 5;

                          return (
                            <div
                              key={r.reviewId || r.id || i}
                              style={{
                                backgroundColor: 'var(--bg-subtle)',
                                padding: '14px 16px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-hairline)',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '6px',
                                  flexWrap: 'wrap',
                                  gap: '8px',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ display: 'flex', gap: '2px' }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        size={14}
                                        fill={s <= starCount ? '#f59e0b' : 'none'}
                                        color={s <= starCount ? '#f59e0b' : '#d4ccc4'}
                                      />
                                    ))}
                                  </div>
                                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                                    {authorName || 'Verified Collector'}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {r.createdAt
                                    ? new Date(r.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })
                                    : r.date || 'Verified Purchase'}
                                </span>
                              </div>

                              {r.title && (
                                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                                  {r.title}
                                </h5>
                              )}

                              <p
                                style={{
                                  fontSize: '0.8125rem',
                                  color: 'var(--text-muted)',
                                  lineHeight: 1.5,
                                }}
                              >
                                "{r.comment || r.text}"
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
