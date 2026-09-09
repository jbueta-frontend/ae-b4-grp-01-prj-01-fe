import { useProductDetailViewModel } from '../viewmodels/useProductDetailViewModel';
import {
  Star,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
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
  } = useProductDetailViewModel();

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
                  fontSize: '0.8125rem',
                  fontWeight: 600,
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
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--accent-light)',
                    color: 'var(--accent)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {product.tag}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '12px',
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
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {product.rating}
              </span>
              <span
                style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}
              >
                ({product.reviewCount} verified reviews)
              </span>
            </div>

            {/* Price Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border-hairline)',
              }}
            >
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                }}
              >
                ₱{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontSize: '1.125rem',
                    color: 'var(--text-light)',
                    textDecoration: 'line-through',
                  }}
                >
                  ₱{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--success)',
                  fontWeight: 600,
                  backgroundColor: 'var(--success-bg)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                In Stock ({product.stockCount} ready to ship)
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '0.9375rem',
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
                    padding: '14px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    color: 'var(--text-main)',
                  }}
                >
                  <span>Dimensions & Materials</span>
                  {openAccordion === 'dimensions' ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {openAccordion === 'dimensions' && (
                  <div
                    style={{
                      paddingBottom: '16px',
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    <p>
                      <strong>Dimensions:</strong> {product.specs.dimensions}
                    </p>
                    <p style={{ marginTop: '4px' }}>
                      <strong>Materials:</strong> {product.specs.materials}
                    </p>
                    <p style={{ marginTop: '4px' }}>
                      <strong>Craftsmanship:</strong> {product.specs.origin}
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
                    padding: '14px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    color: 'var(--text-main)',
                  }}
                >
                  <span>Safety Certifications & Age Group</span>
                  {openAccordion === 'safety' ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {openAccordion === 'safety' && (
                  <div
                    style={{
                      paddingBottom: '16px',
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    <p>
                      <strong>Certifications:</strong> {product.specs.safety}
                    </p>
                    <p style={{ marginTop: '4px' }}>
                      <strong>Age Range:</strong> {product.specs.ageRange}
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
                    padding: '14px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    color: 'var(--text-main)',
                  }}
                >
                  <span>Customer Reviews ({product.reviews?.length || 0})</span>
                  {openAccordion === 'reviews' ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {openAccordion === 'reviews' && (
                  <div style={{ paddingBottom: '20px' }}>
                    {product.reviews?.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '14px 16px',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: '10px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                          }}
                        >
                          <span
                            style={{ fontWeight: 600, fontSize: '0.875rem' }}
                          >
                            {r.author}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {r.date}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          "{r.text}"
                        </p>
                      </div>
                    ))}
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
