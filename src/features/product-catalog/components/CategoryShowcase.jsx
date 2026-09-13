import { useState, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  TreePine,
  Layers,
} from 'lucide-react';
import { DATABASE_CATEGORIES } from '../models/productModel';
import ProductCard from './ProductCard';

const CATEGORY_IMAGE_MAP = {
  'Action Figures': '/products/cyber_mech_figure.jpg',
  'Building Sets': '/products/zen_garden_pagoda.jpg',
  'Board Games & Puzzles': '/products/mystic_board_game.jpg',
  'Plush Toys': '/products/cuddle_bear_plush.jpg',
  'Outdoor & Sports': '/products/desert_rally_truck.jpg',
  'STEM & Educational': '/products/solar_rover_stem.jpg',
};

const CATEGORY_METADATA = {
  'Building Sets': {
    tagline: 'Architectural wonder blocks engineered for tactile balance & spatial reasoning',
    featureBadge: '100% Solid European Beechwood',
    ageRange: 'Ages 3+ to 8+',
  },
  'STEM & Educational': {
    tagline: 'Kinetic gears, robotics & early physics puzzles for inquisitive young minds',
    featureBadge: 'Kinetic & Cognitive Play',
    ageRange: 'Ages 5+ to 8+',
  },
  'Action Figures': {
    tagline: 'Artisan hand-carved posable heroes & adventure story keepsakes',
    featureBadge: 'Artisan Articulated Joints',
    ageRange: 'Ages 3+',
  },
  'Board Games & Puzzles': {
    tagline: 'Timeless strategy games, cognitive mazes, and intergenerational family challenges',
    featureBadge: 'Solid Timber Boards',
    ageRange: 'All Ages',
  },
  'Plush Toys': {
    tagline: 'Organic cotton, gentle sensory textures, and bedtime heirloom companions',
    featureBadge: 'Hypoallergenic Organic Cotton',
    ageRange: 'Ages 0+',
  },
  'Outdoor & Sports': {
    tagline: 'Active gross-motor coordination, balanced ride-ons, and durable movement toys',
    featureBadge: 'Weather-Treated Hardwood',
    ageRange: 'Ages 2+',
  },
};

export default function CategoryShowcase({
  categoryItems = DATABASE_CATEGORIES,
  products = [],
  onQuickAdd,
  addedNotice,
  onExploreCatalog,
}) {
  const productsScrollRef = useRef(null);

  // Normalize categories list from database or props
  const displayCategories = useMemo(() => {
    return Array.isArray(categoryItems) && categoryItems.length > 0
      ? categoryItems
      : DATABASE_CATEGORIES;
  }, [categoryItems]);

  // Default active category to the first real category ('Building Sets' or displayCategories[0])
  const [activeCategory, setActiveCategory] = useState(() => {
    const building = displayCategories.find(
      (c) => (c.name || c.categoryKey) === 'Building Sets'
    );
    return building ? building.name || building.categoryKey : displayCategories[0]?.name || 'Building Sets';
  });

  // Filter products for currently active category in showcase
  const categoryProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.filter((p) => {
      const pCat = (p.category || '').toLowerCase().trim();
      const aCat = (activeCategory || '').toLowerCase().trim();
      return pCat === aCat || pCat.includes(aCat) || aCat.includes(pCat);
    });
  }, [products, activeCategory]);

  // Scroll handler for product carousel
  const scrollProducts = (direction) => {
    if (productsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      productsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const currentMeta = CATEGORY_METADATA[activeCategory] || {
    tagline: 'Handcrafted wooden pieces designed for wonder, discovery, and enduring play',
    featureBadge: '100% Non-Toxic Beechwood',
    ageRange: 'Child-Safe Certified',
  };

  return (
    <section
      id="categories"
      style={{
        padding: '56px 0 64px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-hairline, #e8e3df)',
      }}
    >
      <div className="container">
        {/* 1. Header: Eyebrow, Title and Product Carousel Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--accent, #c85a32)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent, #c85a32)',
                  display: 'inline-block',
                }}
              />
              <span>Curated Collections</span>
            </div>

            <h2
              style={{
                fontSize: 'var(--font-h2-fluid, 36px)',
                fontWeight: 800,
                color: 'var(--text-main, #18181b)',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Browse by Category
            </h2>
          </div>

          {/* Navigation Arrows for Category Product Carousel */}
          {categoryProducts.length > 3 && (
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => scrollProducts('left')}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-hairline, #e8e3df)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-main, #18181b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
                aria-label="Scroll products left"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #f5f1ed)';
                  e.currentTarget.style.borderColor = 'var(--accent, #c85a32)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'var(--border-hairline, #e8e3df)';
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => scrollProducts('right')}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-hairline, #e8e3df)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-main, #18181b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
                aria-label="Scroll products right"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #f5f1ed)';
                  e.currentTarget.style.borderColor = 'var(--accent, #c85a32)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'var(--border-hairline, #e8e3df)';
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* 2. Interactive Category Tabs Strip (Clicking updates in-place without jumping down) */}
        <div
          className="custom-scrollbar"
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '14px',
            marginBottom: '24px',
          }}
        >
          {displayCategories.map((cat) => {
            const catName = cat.name || cat.categoryKey;
            const isSelected = activeCategory?.toLowerCase() === catName?.toLowerCase();
            const imgSrc =
              CATEGORY_IMAGE_MAP[catName] || cat.thumbnail || cat.imageUrl;

            // Count products in this category
            const count = products.filter((p) => {
              const pCat = (p.category || '').toLowerCase().trim();
              const cName = catName.toLowerCase().trim();
              return pCat === cName || pCat.includes(cName) || cName.includes(pCat);
            }).length;

            return (
              <button
                key={cat.id || cat.categoryId || catName}
                type="button"
                onClick={() => setActiveCategory(catName)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: isSelected
                    ? '2px solid var(--accent, #c85a32)'
                    : '1px solid var(--border-hairline, #e8e3df)',
                  backgroundColor: isSelected
                    ? 'rgba(200, 90, 50, 0.08)'
                    : '#FFFFFF',
                  color: isSelected
                    ? 'var(--accent, #c85a32)'
                    : 'var(--text-main, #18181b)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected
                    ? '0 4px 14px rgba(200, 90, 50, 0.15)'
                    : '0 1px 3px rgba(0, 0, 0, 0.02)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-subtle, #f5f1ed)',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={catName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = '/products/zen_garden_pagoda.jpg';
                    }}
                  />
                </div>

                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: isSelected ? 800 : 600, display: 'block' }}>
                    {catName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #71717a)' }}>
                    {count > 0 ? `${count} pieces` : 'Collection'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. Category Editorial & Story Banner */}
        <div
          style={{
            backgroundColor: '#faf7f4',
            border: '1px solid #e8e1d9',
            borderRadius: '16px',
            padding: '24px 28px',
            marginBottom: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--accent, #c85a32)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '6px',
              }}
            >
              <Sparkles size={14} />
              <span>{activeCategory} Spotlight</span>
            </div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main, #18181b)',
                margin: '0 0 6px',
                letterSpacing: '-0.01em',
              }}
            >
              {activeCategory}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: 'var(--text-muted, #71717a)',
                lineHeight: 1.55,
              }}
            >
              {currentMeta.tagline}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e8e1d9',
                color: 'var(--text-main)',
              }}
            >
              <TreePine size={14} color="var(--accent)" />
              <span>{currentMeta.featureBadge}</span>
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e8e1d9',
                color: 'var(--text-main)',
              }}
            >
              <ShieldCheck size={14} color="#16a34a" />
              <span>{currentMeta.ageRange}</span>
            </span>
          </div>
        </div>

        {/* 4. Category Products Showcase (Horizontal Slider) */}
        {categoryProducts.length > 0 ? (
          <div
            ref={productsScrollRef}
            className="custom-scrollbar"
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              paddingBottom: '16px',
              marginBottom: '20px',
            }}
          >
            {categoryProducts.map((product) => (
              <div
                key={product.id || product.productId}
                style={{
                  flex: '0 0 270px',
                  minWidth: '270px',
                }}
              >
                <ProductCard
                  product={product}
                  onQuickAdd={onQuickAdd}
                  isAdded={addedNotice === product.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-subtle, #f5f1ed)',
              borderRadius: '14px',
              border: '1px dashed var(--border-hairline, #e8e3df)',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9375rem', fontWeight: 500 }}>
              New handcrafted {activeCategory} pieces are currently in timber workshop finishing.
            </p>
          </div>
        )}

        {/* 5. Contextual Action: Explore Full Category in Deep Catalog */}
        {onExploreCatalog && categoryProducts.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => onExploreCatalog(activeCategory)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--accent, #c85a32)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 90, 50, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>Explore all {categoryProducts.length} {activeCategory} toys with full age & price filters in the Catalog</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
