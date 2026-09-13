import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProductCatalogViewModel } from '../viewmodels/useProductCatalogViewModel';
import ProductCard from '../components/ProductCard';
import CategoryShowcase from '../components/CategoryShowcase';
import CatalogFilters from '../components/CatalogFilters';
import HeroCarousel from '../components/HeroCarousel';
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
  Filter,
  X,
  SlidersHorizontal,
} from 'lucide-react';

export default function ProductCatalogView() {
  const location = useLocation();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const {
    categories,
    categoryItems,
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
    allProducts,
    totalFilteredCount,
    totalProductsCount,
    currentPage,
    totalPages,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    loading,
    handleQuickAdd,
    addedNotice,
  } = useProductCatalogViewModel();

  // Handle URL Hash navigation (#hero, #categories, #products) with sticky navbar offset
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const navHeight = 58;
          const targetY =
            element.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  const scrollToSection = (id) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 58;
      const targetY =
        element.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Id: #hero) - Interactive Carousel with Integrated Deal   */}
      {/* ========================================================================= */}
      <HeroCarousel onSelectCategory={setSelectedCategory} />

      {/* ========================================================================= */}
      {/* 2. BROWSE BY CATEGORY (Id: #categories) - Immediately Following Hero      */}
      {/* ========================================================================= */}
      <CategoryShowcase
        categoryItems={categoryItems}
        products={allProducts && allProducts.length > 0 ? allProducts : products}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onQuickAdd={handleQuickAdd}
        addedNotice={addedNotice}
        onExploreCatalog={(cat) => {
          setSelectedCategory(cat);
          scrollToSection('products');
        }}
      />

      {/* ========================================================================= */}
      {/* 4. PRODUCT CATALOG (Id: #products) - Reference Layout with Left Filter     */}
      {/* ========================================================================= */}
      <section
        id="products"
        style={{
          padding: '64px 0 88px',
          backgroundColor: 'var(--bg-page)',
        }}
      >
        <div className="container">
          {/* Section Header (Reference: Eyebrow + Explore our Products + Controls) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px',
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
                <span>Our Products</span>
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
                Showing {products.length} of {totalFilteredCount || totalProductsCount} items
              </span>
            </div>
          </div>

          {/* Mobile Filter Trigger Bar (< 992px) */}
          <div className="catalog-mobile-filter-bar">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full, 9999px)',
                backgroundColor: activeFilterCount > 0 ? 'var(--accent)' : 'var(--bg-card, #ffffff)',
                border: activeFilterCount > 0 ? '1px solid var(--accent)' : '1px solid var(--border-hairline, #e8e3df)',
                color: activeFilterCount > 0 ? '#ffffff' : 'var(--text-main)',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={16} />
              <span>Filter Toys</span>
              {activeFilterCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#ffffff',
                    color: 'var(--accent)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reset
                </button>
              )}
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {products.length} of {totalFilteredCount || totalProductsCount} items
              </span>
            </div>
          </div>

          {/* Container Layout: Left Filter Option (Desktop) + Right Product Grid */}
          <div className="catalog-layout-grid">
            {/* Left Filter Sidebar (Desktop >= 992px) */}
            <div className="catalog-sidebar-desktop">
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
            </div>

            {/* Right Product Grid */}
            <div>
              {loading ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '72px 24px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <p style={{ fontWeight: 600 }}>Loading toys catalog...</p>
                </div>
              ) : products.length === 0 ? (
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
                <>
                  <div className="products-responsive-grid">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickAdd={handleQuickAdd}
                        isAdded={addedNotice === product.id}
                      />
                    ))}
                  </div>

                  {/* Enhanced Centered Pagination Bar */}
                  {totalPages > 1 && (
                    <div
                      style={{
                        marginTop: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '18px 24px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid #D4CCC4',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                        flexWrap: 'wrap',
                      }}
                      aria-label="Product Catalog Pagination"
                    >
                      {/* Previous Page Button */}
                      <button
                        type="button"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        style={{
                          height: '42px',
                          padding: '0 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid #D4CCC4',
                          backgroundColor: '#FFFFFF',
                          color: currentPage === 1 ? 'var(--text-light)' : 'var(--text-main)',
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: currentPage === 1 ? 0.4 : 1,
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          transition: 'all var(--transition-fast)',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage > 1) {
                            e.currentTarget.style.borderColor = 'var(--accent)';
                            e.currentTarget.style.color = 'var(--accent)';
                            e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentPage > 1) {
                            e.currentTarget.style.borderColor = '#D4CCC4';
                            e.currentTarget.style.color = 'var(--text-main)';
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }
                        }}
                        aria-label="Go to Previous Page"
                      >
                        <ChevronLeft size={18} strokeWidth={2.5} />
                        <span>Prev</span>
                      </button>

                      {/* Page Numbers with Smart Windowing */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          return (
                            p === 1 ||
                            p === totalPages ||
                            Math.abs(p - currentPage) <= 1
                          );
                        })
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) {
                            acc.push('ellipsis-' + p);
                          }
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item) => {
                          if (typeof item === 'string') {
                            return (
                              <span
                                key={item}
                                style={{
                                  padding: '0 8px',
                                  color: 'var(--text-muted)',
                                  fontSize: '1.125rem',
                                  fontWeight: 800,
                                  userSelect: 'none',
                                }}
                              >
                                …
                              </span>
                            );
                          }

                          const isActive = item === currentPage;
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => goToPage(item)}
                              style={{
                                minWidth: '42px',
                                height: '42px',
                                padding: '0 10px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9375rem',
                                fontWeight: 800,
                                border: isActive
                                  ? '1.5px solid var(--accent)'
                                  : '1.5px solid #D4CCC4',
                                backgroundColor: isActive
                                  ? 'var(--accent)'
                                  : '#FFFFFF',
                                color: isActive ? '#FFFFFF' : 'var(--text-main)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                boxShadow: isActive
                                  ? '0 4px 14px rgba(200, 90, 50, 0.38)'
                                  : '0 2px 6px rgba(0, 0, 0, 0.04)',
                                transform: isActive ? 'scale(1.04)' : 'none',
                              }}
                              onMouseEnter={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.borderColor = 'var(--accent)';
                                  e.currentTarget.style.color = 'var(--accent)';
                                  e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.borderColor = '#D4CCC4';
                                  e.currentTarget.style.color = 'var(--text-main)';
                                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                                }
                              }}
                              aria-label={`Page ${item}`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              {item}
                            </button>
                          );
                        })}

                      {/* Next Page Button */}
                      <button
                        type="button"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        style={{
                          height: '42px',
                          padding: '0 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid #D4CCC4',
                          backgroundColor: '#FFFFFF',
                          color:
                            currentPage === totalPages
                              ? 'var(--text-light)'
                              : 'var(--text-main)',
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: currentPage === totalPages ? 0.4 : 1,
                          cursor:
                            currentPage === totalPages
                              ? 'not-allowed'
                              : 'pointer',
                          transition: 'all var(--transition-fast)',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage < totalPages) {
                            e.currentTarget.style.borderColor = 'var(--accent)';
                            e.currentTarget.style.color = 'var(--accent)';
                            e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentPage < totalPages) {
                            e.currentTarget.style.borderColor = '#D4CCC4';
                            e.currentTarget.style.color = 'var(--text-main)';
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }
                        }}
                        aria-label="Go to Next Page"
                      >
                        <span>Next</span>
                        <ChevronRight size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer Overlay (< 992px) */}
        {isMobileFilterOpen && (
          <div
            className="mobile-filter-drawer-backdrop"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <div
              className="mobile-filter-drawer-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-hairline, #e8e3df)',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0 }}>
                    Filter Toys
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-hairline, #e8e3df)',
                    backgroundColor: 'var(--bg-subtle, #f5f1ed)',
                    cursor: 'pointer',
                  }}
                  aria-label="Close filters"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                <CatalogFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                  }}
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
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-hairline, #e8e3df)', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="btn btn-primary btn-block"
                >
                  View {totalFilteredCount || totalProductsCount} Toys
                </button>
              </div>
            </div>
          </div>
        )}
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
                    fontSize: 'var(--font-body, 18px)',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '6px',
                  }}
                >
                  100% Non-Toxic Beechwood
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-small, 14px)',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
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
                    fontSize: 'var(--font-body, 18px)',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '6px',
                  }}
                >
                  Carbon-Neutral Delivery
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-small, 14px)',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  Dispatched in 100% recycled biodegradable boxes. Free shipping
                  over ₱75.
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
                    fontSize: 'var(--font-body, 18px)',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginBottom: '6px',
                  }}
                >
                  30-Day Happiness Guarantee
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-small, 14px)',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
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
