import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { DATABASE_CATEGORIES } from '../models/productModel';

export const BROWSE_CATEGORIES = DATABASE_CATEGORIES;

const CATEGORY_IMAGE_MAP = {
  'Action Figures': '/products/cyber_mech_figure.jpg',
  'Building Sets': '/products/zen_garden_pagoda.jpg',
  'Board Games & Puzzles': '/products/mystic_board_game.jpg',
  'Plush Toys': '/products/cuddle_bear_plush.jpg',
  'Outdoor & Sports': '/products/desert_rally_truck.jpg',
  'STEM & Educational': '/products/solar_rover_stem.jpg',
};

export default function CategoryShowcase({
  categoryItems = DATABASE_CATEGORIES,
  selectedCategory = 'All Toys',
  onSelectCategory,
}) {
  const scrollRef = useRef(null);

  const displayCategories =
    Array.isArray(categoryItems) && categoryItems.length > 0
      ? categoryItems
      : DATABASE_CATEGORIES;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    const target = document.getElementById('products');
    if (target) {
      const navHeight = 58;
      const targetY =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const isAllToysSelected =
    !selectedCategory || selectedCategory === 'All Toys';

  return (
    <section
      id="categories"
      style={{
        padding: '60px 0 52px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-hairline)',
      }}
    >
      <div className="container">
        {/* Section Header with Eyebrow, Title and Navigation Arrows */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div>
            {/* Eyebrow with Circle Dot Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'var(--font-small, 14px)',
                fontWeight: 700,
                color: 'var(--accent)',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  display: 'inline-block',
                }}
              />
              <span>Categories</span>
            </div>

            {/* Section Headline (H2: 40px) */}
            <h2
              style={{
                fontSize: 'var(--font-h2-fluid, 40px)',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                lineHeight: 1.18,
              }}
            >
              Browse by Category
            </h2>
          </div>

          {/* Top-Right Navigation Arrows */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => scroll('left')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-hairline)',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: 'var(--shadow-sm)',
              }}
              aria-label="Scroll categories left"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.borderColor = '#D4CECA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--border-hairline)';
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => scroll('right')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-hairline)',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: 'var(--shadow-sm)',
              }}
              aria-label="Scroll categories right"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.borderColor = '#D4CECA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--border-hairline)';
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Category Cards Strip */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* All Toys card */}
          <div
            onClick={() => handleCategorySelect('All Toys')}
            style={{
              flex: '0 0 145px',
              height: '145px',
              backgroundColor: isAllToysSelected
                ? 'var(--accent-light)'
                : '#FFFFFF',
              border: isAllToysSelected
                ? '2px solid var(--accent)'
                : '1px solid #D4CCC4',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isAllToysSelected
                ? '0 8px 20px rgba(200, 90, 50, 0.18)'
                : '0 4px 12px rgba(0, 0, 0, 0.05)',
              padding: '12px',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              if (!isAllToysSelected) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow =
                  '0 8px 20px rgba(0, 0, 0, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isAllToysSelected) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#D4CCC4';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.05)';
              }
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isAllToysSelected
                  ? 'var(--accent)'
                  : 'var(--text-main)',
              }}
            >
              <Layers size={24} />
            </div>
            <span
              style={{
                fontSize: 'var(--font-small, 14px)',
                fontWeight: 700,
                color: isAllToysSelected
                  ? 'var(--accent)'
                  : 'var(--text-main)',
              }}
            >
              All Toys
            </span>
          </div>

          {/* Database Category Cards */}
          {displayCategories.map((cat) => {
            const catName = cat.name || cat.categoryKey;
            const isSelected =
              selectedCategory?.toLowerCase() === catName?.toLowerCase();
            const imgSrc =
              CATEGORY_IMAGE_MAP[catName] || cat.thumbnail || cat.imageUrl;

            return (
              <div
                key={cat.id || cat.categoryId || catName}
                onClick={() => handleCategorySelect(catName)}
                style={{
                  flex: '0 0 155px',
                  height: '145px',
                  backgroundColor: isSelected
                    ? 'var(--accent-light)'
                    : '#FFFFFF',
                  border: isSelected
                    ? '2px solid var(--accent)'
                    : '1px solid #D4CCC4',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected
                    ? '0 8px 20px rgba(200, 90, 50, 0.18)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                  padding: '12px',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 20px rgba(0, 0, 0, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#D4CCC4';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={catName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        CATEGORY_IMAGE_MAP[catName] ||
                        '/products/zen_garden_pagoda.jpg';
                    }}
                    loading="lazy"
                  />
                </div>
                <span
                  style={{
                    fontSize: 'var(--font-small, 13px)',
                    fontWeight: 700,
                    color: isSelected ? 'var(--accent)' : 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '135px',
                  }}
                  title={catName}
                >
                  {catName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
