import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Star } from 'lucide-react';

export default function ProductCard({ product, onQuickAdd, isAdded }) {
  const [activeVariant, setActiveVariant] = useState(
    product.variants?.[0]?.id || null
  );

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        transition:
          'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
      }}
      className="product-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = '#D4CECA';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border-hairline)';
      }}
    >
      {/* 1. Top Badges: Discount Badge (matching reference blue/accent pill) */}
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
        {product.discount ? (
          <span
            style={{
              backgroundColor: '#3B82F6', // Reference image has crisp blue discount badges like '20% OFF'
              color: '#FFFFFF',
              fontSize: '0.6875rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
            }}
          >
            {product.discount}
          </span>
        ) : product.tag ? (
          <span
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFFFF',
              fontSize: '0.6875rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {product.tag}
          </span>
        ) : (
          <span />
        )}

        {product.stockCount <= 10 && (
          <span
            style={{
              backgroundColor: 'rgba(24, 24, 27, 0.8)',
              color: '#FFFFFF',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(4px)',
            }}
          >
            Low Stock
          </span>
        )}
      </div>

      {/* 2. Product Image Canvas (Centered, high contrast, clean) */}
      <Link
        to={`/products/${product.slug}`}
        style={{
          display: 'block',
          backgroundColor: '#FAF7F5',
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
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
          }}
        >
          ({product.reviewCount || 42})
        </span>
      </div>

      {/* 4. Product Title */}
      <Link
        to={`/products/${product.slug}`}
        style={{
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          lineHeight: 1.35,
          marginBottom: '8px',
          letterSpacing: '-0.01em',
          minHeight: '2.7em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {product.name}
      </Link>

      {/* 5. Pricing Row (Current Price + Strikethrough Original Price) */}
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
            fontSize: '1.1875rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
          }}
        >
          ${product.price.toFixed(2)}
        </span>
        {product.originalPrice && (
          <span
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-light)',
              textDecoration: 'line-through',
              fontWeight: 500,
            }}
          >
            ${product.originalPrice.toFixed(2)}
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

      {/* 7. Emphasized Add to Cart Button (User request: Prioritize the same kind of UI display for each product card, emphasizing the add to cart button to it) */}
      <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
        <button
          onClick={(e) => onQuickAdd(product, e)}
          className={`btn btn-block ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
          style={{
            padding: '11px 16px',
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
