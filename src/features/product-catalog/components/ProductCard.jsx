import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Star } from 'lucide-react';

export default function ProductCard({ product, onQuickAdd, isAdded }) {
  const [activeVariant, setActiveVariant] = useState(
    product.variants?.[0]?.id || null
  );

  const isOnSale =
    product.isOnSale ||
    product.tag === 'Sale' ||
    product.tag === 'On Sale' ||
    (product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price));

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D4CCC4',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        transition:
          'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
      className="product-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow =
          '0 12px 28px rgba(0, 0, 0, 0.09), 0 3px 8px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 4px 16px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)';
        e.currentTarget.style.borderColor = '#D4CCC4';
      }}
    >
      {/* 1. Top Badges: On Sale (Red) / Discount / Stock alert */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        {isOnSale ? (
          <span
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            On Sale
          </span>
        ) : product.discount ? (
          <span
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
            }}
          >
            {product.discount}
          </span>
        ) : product.tag ? (
          <span
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 8px rgba(200, 90, 50, 0.3)',
            }}
          >
            {product.tag}
          </span>
        ) : (
          <span />
        )}

        {product.stockCount <= 0 ? (
          <span
            style={{
              backgroundColor: '#64748B',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            Out of Stock
          </span>
        ) : product.stockCount <= 10 ? (
          <span
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.02em',
              boxShadow: '0 2px 10px rgba(220, 38, 38, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                display: 'inline-block',
              }}
            />
            <span>Only {product.stockCount} left!</span>
          </span>
        ) : null}
      </div>

      {/* 2. Product Image Canvas (Centered, high contrast, clean) */}
      <Link
        to={`/products/${product.slug}`}
        style={{
          display: 'block',
          backgroundColor: '#FAF7F5',
          border: '1px solid #ECE6E1',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          aspectRatio: '1 / 1',
          marginBottom: '16px',
          position: 'relative',
        }}
      >
        <img
          src={product.heroImage}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'scale(1.05)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          loading="lazy"
        />
      </Link>

      {/* 3. Rating & Review Count (Reference format) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px',
        }}
      >
        <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
          ))}
        </div>
        <span
          style={{
            fontSize: 'var(--font-small, 14px)',
            fontWeight: 600,
            color: 'var(--text-muted)',
          }}
        >
          ({product.reviewCount || 42})
        </span>
      </div>

      {/* 4. Product Title (Body: 18px) */}
      <Link
        to={`/products/${product.slug}`}
        style={{
          fontSize: 'var(--font-body, 18px)',
          fontWeight: 700,
          color: 'var(--text-main)',
          lineHeight: 1.35,
          marginBottom: '8px',
          letterSpacing: '-0.015em',
          minHeight: '2.7em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {product.name}
      </Link>

      {/* 5. Pricing Row (Current Price + Strikethrough Original Price) - Emphasized Text Sensitivity */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '1.375rem', /* 22px */
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          ₱{product.price.toFixed(2)}
        </span>
        {product.originalPrice && (
          <span
            style={{
              fontSize: 'var(--font-small, 14px)',
              color: 'var(--text-light)',
              textDecoration: 'line-through',
              fontWeight: 500,
            }}
          >
            ₱{product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* 6. Color Swatches / Dots (Reference format: ● ● ●) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '14px',
          minHeight: '20px',
        }}
      >
        {product.variants && product.variants.length > 0 ? (
          product.variants.map((v) => {
            const isCurrent = activeVariant === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveVariant(v.id);
                }}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: v.color || '#D4B896',
                  border: isCurrent
                    ? '2px solid var(--text-main)'
                    : '1px solid rgba(0, 0, 0, 0.15)',
                  boxShadow: isCurrent
                    ? '0 0 0 2px rgba(200, 90, 50, 0.3)'
                    : 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'transform 0.15s ease',
                }}
                title={v.name}
                aria-label={`Select variant ${v.name}`}
              />
            );
          })
        ) : (
          <div style={{ height: '14px' }} />
        )}
      </div>

      {/* 7. Emphasized Add to Cart Button (Uniform 44px height) */}
      <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
        <button
          type="button"
          onClick={(e) => onQuickAdd(product, e)}
          className={`btn btn-block ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
          style={{
            height: '44px',
            padding: '0 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            backgroundColor: isAdded ? '#16A34A' : 'var(--accent)',
            borderColor: isAdded ? '#16A34A' : 'var(--accent)',
            boxShadow: isAdded
              ? '0 2px 8px rgba(22, 163, 74, 0.3)'
              : '0 3px 10px rgba(200, 90, 50, 0.28)',
            transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer',
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          {isAdded ? (
            <>
              <Check size={16} strokeWidth={3} />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
