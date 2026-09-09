import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProductCatalogViewModel } from '../viewmodels/useProductCatalogViewModel';
import ProductCard from '../components/ProductCard';
import CategoryShowcase from '../components/CategoryShowcase';
import CatalogFilters from '../components/CatalogFilters';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  ShoppingBag,
  Star,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function ProductCatalogView() {
  const location = useLocation();
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    ageOptions,
    selectedAge,
    setSelectedAge,
    priceOptions,
    selectedPrice,
    setSelectedPrice,
    inStockOnly,
    setInStockOnly,
    activeFilterCount,
    resetFilters,
    searchQuery,
    setSearchQuery,
    products,
    totalProductsCount,
    handleQuickAdd,
    addedNotice,
  } = useProductCatalogViewModel();

  // Handle URL Hash navigation (#hero, #categories, #products)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Dynamic countdown timer for promotional banner (matching reference)
  const [timeLeft, setTimeLeft] = useState({
    days: 16,
    hours: 10,
    mins: 56,
    secs: 54,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        } else if (prev.mins > 0) {
          return { ...prev, mins: 59, secs: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            mins: 59,
            secs: 59,
          };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Id: #hero) - Replicating Image Reference Format           */}
      {/* ========================================================================= */}
      <section
        id="hero"
        style={{
          background:
            'linear-gradient(135deg, #FAF7F5 0%, #F5EDE6 60%, #EFE5DC 100%)',
          padding: '64px 0 80px',
          borderBottom: '1px solid var(--border-hairline)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative background circles */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '5%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(200, 90, 50, 0.08) 0%, rgba(200, 90, 50, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Left Content Column */}
            <div>
              {/* Eyebrow Tag with Circular Dot Badge (Reference layout) */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  marginBottom: '16px',
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
                <span>Hot Deal of This Week</span>
              </div>

              {/* Headline (Reference layout: 2-line bold title) */}
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5.5vw, 3.75rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '18px',
                }}
              >
                Architect Beechwood <br />
                Block Set
              </h1>

              {/* Subtitle / Description */}
              <p
                style={{
                  fontSize: '1.0625rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                  maxWidth: '460px',
                  marginBottom: '32px',
                }}
              >
                Zero microplastics, zero screens. 50 precision-milled
                architectural shapes carved from sustainable German beechwood
                with organic beeswax seals.
              </p>

              {/* CTA Button + Social Proof Avatar Cluster (Reference layout) */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '24px',
                }}
              >
                {/* Shop Now Primary Button */}
                <button
                  onClick={() => scrollToSection('products')}
                  className="btn btn-primary"
                  style={{
                    padding: '14px 28px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 14px rgba(200, 90, 50, 0.35)',
                    cursor: 'pointer',
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Shop Now</span>
                </button>

                {/* Social Proof: Avatar Stack + Rating (Exact match to reference) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {/* Overlapping Avatar Stack */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="Reviewer 1"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        border: '2px solid #FFFFFF',
                        objectFit: 'cover',
                      }}
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="Reviewer 2"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        border: '2px solid #FFFFFF',
                        marginLeft: '-10px',
                        objectFit: 'cover',
                      }}
                    />
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="Reviewer 3"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        border: '2px solid #FFFFFF',
                        marginLeft: '-10px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  {/* Stars + Review Count */}
                  <div>
                    <div
                      style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill="#F59E0B"
                          color="#F59E0B"
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                      }}
                    >
                      142+ Reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Product Showcase with Floating Price Tag Badge (Reference layout) */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Product Photography Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '480px',
                  aspectRatio: '1 / 1',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80"
                  alt="Architect Beechwood Block Set Flagship Showcase"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.04)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                />
              </div>

              {/* Floating Circular Price Tag Badge (Matching reference eTrade "$48.00" circle) */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  zIndex: 3,
                  width: '82px',
                  height: '82px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-hairline)',
                  animation: 'pulse 3s infinite ease-in-out',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}
                >
                  From
                </span>
                <span
                  style={{
                    fontSize: '1.1875rem',
                    fontWeight: 800,
                    color: 'var(--accent)',
                    lineHeight: 1.2,
                  }}
                >
                  $48.00
                </span>
              </div>

              {/* Secondary Floating Accessory Badge (Matching reference smartwatch preview) */}
              <div
                onClick={() => setSelectedCategory('Plush')}
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  right: '-10px',
                  zIndex: 3,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                  border: '1px solid var(--border-hairline)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'translateY(-2px)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'translateY(0)')
                }
              >
                <img
                  src="https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Sensory Fox Plush Preview"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                    }}
                  >
                    Sensory Fox Linen
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                    }}
                  >
                    $34.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Active Dash Indicator at bottom */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              marginTop: '40px',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '4px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent)',
              }}
            />
            <span
              style={{
                width: '8px',
                height: '4px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(24, 24, 27, 0.15)',
              }}
            />
            <span
              style={{
                width: '8px',
                height: '4px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(24, 24, 27, 0.15)',
              }}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BROWSE BY CATEGORY (Id: #categories) - Replicating Image Reference     */}
      {/* ========================================================================= */}
      <CategoryShowcase
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* ========================================================================= */}
      {/* 3. PROMOTIONAL MIDDLE BANNER ("Enhance Play Experience") - From Reference  */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '60px 0',
          backgroundColor: '#FAF7F5',
          borderBottom: '1px solid var(--border-hairline)',
        }}
      >
        <div className="container">
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid var(--border-hairline)',
              padding: '48px 40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Left Content with Countdown Timer */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  marginBottom: '14px',
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
                <span>Don't Miss!!</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  marginBottom: '24px',
                }}
              >
                Enhance Your <br />
                Play Experience
              </h2>

              {/* Countdown Timer Circles (Reference format) */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '32px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-hairline)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {timeLeft.days}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Day
                  </span>
                </div>

                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-hairline)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {timeLeft.hours}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Hrs
                  </span>
                </div>

                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-hairline)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {timeLeft.mins}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Min
                  </span>
                </div>

                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-hairline)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {timeLeft.secs}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Sec
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => scrollToSection('products')}
                className="btn btn-primary"
                style={{
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span>Check it Out!</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Right Showcase Image */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  aspectRatio: '1 / 1',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  backgroundColor: '#FAF7F5',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.06)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80"
                  alt="Curved Nordic Balance Board Promo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRODUCT CATALOG (Id: #products) - Reference Layout with Left Filter     */}
      {/* ========================================================================= */}
      <section
        id="products"
        style={{
          padding: '64px 0 88px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div className="container">
          {/* Section Header (Reference: Eyebrow + Explore our Products + Controls) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '36px',
            }}
          >
            <div>
              {/* Eyebrow with Circle Dot Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
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
                <span>Our Products</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                Explore our Products
              </h2>
            </div>

            {/* Active search filter badge if present */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {searchQuery && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--accent-light)',
                    border: '1px solid rgba(200, 90, 50, 0.2)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    color: 'var(--accent)',
                    fontWeight: 600,
                  }}
                >
                  <span>Searching: "{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ cursor: 'pointer', fontWeight: 800 }}
                    title="Clear search"
                  >
                    ×
                  </button>
                </div>
              )}

              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                }}
              >
                Showing {products.length} of {totalProductsCount} items
              </span>
            </div>
          </div>

          {/* Container Layout: Left Filter Option + Right Product Grid (User requirement) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* Left Filter Sidebar */}
            <CatalogFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              ageOptions={ageOptions}
              selectedAge={selectedAge}
              onSelectAge={setSelectedAge}
              priceOptions={priceOptions}
              selectedPrice={selectedPrice}
              onSelectPrice={setSelectedPrice}
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
              activeFilterCount={activeFilterCount}
              onResetFilters={resetFilters}
            />

            {/* Right Product Grid */}
            <div>
              {products.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '72px 24px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-hairline)',
                  }}
                >
                  <p
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      marginBottom: '8px',
                    }}
                  >
                    No toys found matching your criteria
                  </p>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      marginBottom: '20px',
                    }}
                  >
                    Try relaxing your category, price range, or search keywords.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="btn btn-outline btn-sm"
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickAdd={handleQuickAdd}
                      isAdded={addedNotice === product.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DISTILLED TRUST & VALUES ROW                                            */}
      {/* ========================================================================= */}
      <section
        style={{
          borderTop: '1px solid var(--border-hairline)',
          backgroundColor: '#FAF7F5',
          padding: '48px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Value 1 */}
            <div
              style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '4px',
                  }}
                >
                  100% Non-Toxic Beechwood
                </h3>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}
                >
                  Organic beeswax seals and zero formaldehyde. Meets ASTM & EN71
                  standards.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div
              style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Truck size={22} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '4px',
                  }}
                >
                  Carbon-Neutral Delivery
                </h3>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}
                >
                  Dispatched in 100% recycled biodegradable boxes. Free shipping
                  over $75.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div
              style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <RefreshCw size={22} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '4px',
                  }}
                >
                  30-Day Happiness Guarantee
                </h3>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}
                >
                  No-hassle returns and replacement warranty on every heirloom
                  piece.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
