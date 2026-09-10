import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export const BROWSE_CATEGORIES = [
  {
    id: 'wooden',
    name: 'Wooden Toys',
    categoryKey: 'Wooden',
    thumbnail:
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'stem',
    name: 'STEM & Logic',
    categoryKey: 'STEM',
    thumbnail:
      'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'plush',
    name: 'Sensory Plush',
    categoryKey: 'Plush',
    thumbnail:
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'early-years',
    name: 'Ages 0–3',
    categoryKey: 'Ages 0–3',
    thumbnail:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'balance',
    name: 'Balance Boards',
    categoryKey: 'Wooden',
    thumbnail:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'magnetic',
    name: 'Magnetic Tiles',
    categoryKey: 'STEM',
    thumbnail:
      'https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'kinetics',
    name: 'Marble Runs',
    categoryKey: 'STEM',
    thumbnail:
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80',
  },
];

export default function CategoryShowcase({
  selectedCategory,
  onSelectCategory,
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (categoryKey) => {
    onSelectCategory(categoryKey);
    const target = document.getElementById('products');
    if (target) {
      const navHeight = 58;
      const targetY =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

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
        {/* Section Header with Eyebrow, Title and Navigation Arrows (Reference layout) */}
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

          {/* Top-Right Navigation Arrows (Reference layout) */}
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

        {/* Horizontal Category Cards Strip (Reference format: uniform rounded cards with icon/thumbnail and label) */}
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
              backgroundColor:
                selectedCategory === 'All Toys'
                  ? 'var(--accent-light)'
                  : '#FFFFFF',
              border:
                selectedCategory === 'All Toys'
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
              boxShadow:
                selectedCategory === 'All Toys'
                  ? '0 8px 20px rgba(200, 90, 50, 0.18)'
                  : '0 4px 12px rgba(0, 0, 0, 0.05)',
              padding: '12px',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== 'All Toys') {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== 'All Toys') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#D4CCC4';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
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
                color:
                  selectedCategory === 'All Toys'
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
                color:
                  selectedCategory === 'All Toys'
                    ? 'var(--accent)'
                    : 'var(--text-main)',
              }}
            >
              All Toys
            </span>
          </div>

          {/* Individual Category Cards */}
          {BROWSE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.categoryKey;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.categoryKey)}
                style={{
                  flex: '0 0 145px',
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
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#D4CCC4';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
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
                  }}
                >
                  <img
                    src={cat.thumbnail}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                  />
                </div>
                <span
                  style={{
                    fontSize: 'var(--font-small, 14px)',
                    fontWeight: 700,
                    color: isSelected ? 'var(--accent)' : 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '120px',
                  }}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
