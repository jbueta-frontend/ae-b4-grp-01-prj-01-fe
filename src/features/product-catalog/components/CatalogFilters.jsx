import { Filter, RotateCcw, Check } from 'lucide-react';

export default function CatalogFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  ageOptions,
  selectedAge,
  onSelectAge,
  priceOptions,
  selectedPrice,
  onSelectPrice,
  inStockOnly,
  onToggleInStock,
  activeFilterCount,
  onResetFilters,
}) {
  return (
    <aside
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: '90px',
      }}
      aria-label="Product Catalog Filters"
    >
      {/* Filter Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-hairline)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--accent)" />
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.01em',
            }}
          >
            Filter Toys
          </h3>
          {activeFilterCount > 0 && (
            <span
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFFFF',
                fontSize: '0.6875rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--accent)',
              cursor: 'pointer',
            }}
            title="Reset all filters"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div style={{ marginBottom: '24px' }}>
        <h4
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-muted)',
            marginBottom: '12px',
          }}
        >
          Category
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected
                    ? 'var(--accent-light)'
                    : 'transparent',
                  border: isSelected
                    ? '1px solid rgba(200, 90, 50, 0.3)'
                    : '1px solid transparent',
                  color: isSelected ? 'var(--accent)' : 'var(--text-main)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                }}
              >
                <span>{cat}</span>
                {isSelected && <Check size={14} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Filter */}
      <div style={{ marginBottom: '24px' }}>
        <h4
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-muted)',
            marginBottom: '12px',
          }}
        >
          Price Range
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {priceOptions.map((option) => {
            const isSelected = selectedPrice === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectPrice(option.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected
                    ? 'var(--accent-light)'
                    : 'transparent',
                  border: isSelected
                    ? '1px solid rgba(200, 90, 50, 0.3)'
                    : '1px solid transparent',
                  color: isSelected ? 'var(--accent)' : 'var(--text-main)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                }}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={14} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Age Group Filter */}
      <div style={{ marginBottom: '24px' }}>
        <h4
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-muted)',
            marginBottom: '12px',
          }}
        >
          Age Range
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {ageOptions.map((age) => {
            const isSelected = selectedAge === age;
            return (
              <button
                key={age}
                type="button"
                onClick={() => onSelectAge(age)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected
                    ? 'var(--text-main)'
                    : 'var(--bg-subtle)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  border: '1px solid',
                  borderColor: isSelected
                    ? 'var(--text-main)'
                    : 'var(--border-hairline)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {age}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. In Stock Toggle */}
      <div
        style={{
          paddingTop: '16px',
          borderTop: '1px solid var(--border-hairline)',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-main)',
            }}
          >
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              accentColor: 'var(--accent)',
              cursor: 'pointer',
            }}
          />
        </label>
      </div>
    </aside>
  );
}
