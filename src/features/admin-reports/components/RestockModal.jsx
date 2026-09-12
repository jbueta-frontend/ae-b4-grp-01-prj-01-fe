import { useState, useEffect, useMemo } from 'react';
import {
  Package,
  X,
  Check,
  ArrowRight,
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { mapApiProduct } from '../../product-catalog/models/productModel.js';

export default function RestockModal({
  isOpen,
  onClose,
  product = null,
  availableProducts = [],
  onRestock,
  isRestocking = false,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(50);
  const [restockReason, setRestockReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  const [validationError, setValidationError] = useState(null);

  // Normalize all products with ERD inventory metrics and images
  const normalizedProducts = useMemo(() => {
    return (availableProducts || []).map((p) => {
      const mapped = mapApiProduct(p);
      const inv = p.inventory || mapped.inventory || {};
      const stockQuantity = Number(inv.stockQuantity ?? p.stockQuantity ?? p.stock ?? 0);
      const reservedQuantity = Number(inv.reservedQuantity ?? p.reservedQuantity ?? 0);
      const lowStockThreshold = Number(inv.lowStockThreshold ?? p.lowStockThreshold ?? 10);
      const availableStock = Math.max(0, stockQuantity - reservedQuantity);
      const isOutOfStock = availableStock <= 0;
      const isLowStock = !isOutOfStock && availableStock <= lowStockThreshold;

      const fallbackImg = mapped.heroImage || p.imageUrl || p.images?.[0]?.imageUrl || '/products/zen_garden_pagoda.jpg';

      return {
        ...p,
        ...mapped,
        productId: p.productId || p.id || mapped.productId,
        name: p.name || mapped.name || 'Product',
        sku: p.sku || mapped.sku || '—',
        category: p.category || mapped.category || 'Toy',
        heroImage: fallbackImg,
        inventory: {
          stockQuantity,
          reservedQuantity,
          lowStockThreshold,
        },
        stockQuantity,
        reservedQuantity,
        lowStockThreshold,
        availableStock,
        isOutOfStock,
        isLowStock,
      };
    });
  }, [availableProducts]);

  useEffect(() => {
    if (isOpen) {
      setQuantity(50);
      setRestockReason('');
      setSearchQuery('');
      setFilterTab('ALL');
      setValidationError(null);

      // Pre-select matching product if provided, else select the first available product
      if (product) {
        const prodId = product.productId || product.id;
        const matched = normalizedProducts.find((p) => p.productId === prodId);
        if (matched) {
          setSelectedProduct(matched);
        } else {
          setSelectedProduct(mapApiProduct(product));
        }
      } else if (normalizedProducts.length > 0) {
        setSelectedProduct(normalizedProducts[0]);
      } else {
        setSelectedProduct(null);
      }
    }
  }, [isOpen, product, normalizedProducts]);

  if (!isOpen) return null;

  // Selected product ERD fields
  const currentStockQuantity = Number(
    selectedProduct?.inventory?.stockQuantity ??
    selectedProduct?.stockQuantity ??
    0
  );
  const currentReservedQuantity = Number(
    selectedProduct?.inventory?.reservedQuantity ??
    selectedProduct?.reservedQuantity ??
    0
  );
  const currentThreshold = Number(
    selectedProduct?.inventory?.lowStockThreshold ??
    selectedProduct?.lowStockThreshold ??
    10
  );
  const currentAvailableStock = Math.max(0, currentStockQuantity - currentReservedQuantity);

  // ERD Projection calculations
  const parsedQuantity = parseInt(quantity, 10) || 0;
  const projectedStockQuantity = Math.max(0, currentStockQuantity + parsedQuantity);
  const projectedAvailableStock = Math.max(0, projectedStockQuantity - currentReservedQuantity);
  const willClearAlert = projectedAvailableStock > currentThreshold;

  // Filter products list
  const filteredProducts = normalizedProducts.filter((p) => {
    // Tab filter
    if (filterTab === 'LOW_STOCK' && !p.isLowStock) return false;
    if (filterTab === 'OUT_OF_STOCK' && !p.isOutOfStock) return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  const lowStockCount = normalizedProducts.filter((p) => p.isLowStock).length;
  const outOfStockCount = normalizedProducts.filter((p) => p.isOutOfStock).length;

  const handlePresetClick = (amount) => {
    setQuantity(amount);
    setValidationError(null);
  };

  const handleStep = (delta) => {
    setQuantity((prev) => {
      const next = Math.max(1, (Number(prev) || 0) + delta);
      return next;
    });
    setValidationError(null);
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity('');
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setQuantity(Math.max(1, num));
      setValidationError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedProduct) {
      setValidationError('Please select a toy product from the list to restock.');
      return;
    }

    const productId =
      selectedProduct.productId ||
      selectedProduct.id ||
      selectedProduct.product_id;

    if (!productId) {
      setValidationError('Missing valid product identifier. Please re-select the product.');
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      setValidationError('Restock quantity must be a positive whole number greater than 0.');
      return;
    }

    // Call viewModel handler with full ERD parameters
    onRestock({
      productId,
      amount: qty,
      currentStock: currentStockQuantity,
      reservedQuantity: currentReservedQuantity,
      lowStockThreshold: currentThreshold,
      productName: selectedProduct.name || selectedProduct.productName || 'Toy Product',
      reason: restockReason.trim() || 'Warehouse Replenishment',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="restock-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        padding: '20px',
      }}
      onClick={() => !isRestocking && onClose()}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface, #ffffff)',
          borderRadius: 'var(--radius-lg, 16px)',
          maxWidth: '680px',
          width: '100%',
          padding: '28px 30px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1)',
          border: '1.5px solid var(--border, #e7e5e4)',
          position: 'relative',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isRestocking}
          className="btn btn-ghost btn-xs"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            padding: '8px',
            borderRadius: 'var(--radius-md, 8px)',
            color: 'var(--text-muted)',
            cursor: isRestocking ? 'not-allowed' : 'pointer',
          }}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', flexShrink: 0 }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(5, 150, 105, 0.12)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Package size={24} />
          </div>
          <div>
            <h2
              id="restock-modal-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main, #1c1917)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Warehouse Inventory Restock
            </h2>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted, #78716c)',
                margin: '3px 0 0',
              }}
            >
              Select product with fast imagery visualization and replenish warehouse stock levels.
            </p>
          </div>
        </div>

        {/* Validation / Error Banner */}
        {validationError && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md, 8px)',
              padding: '10px 14px',
              color: '#dc2626',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Scrollable Modal Content */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {/* 1. VISUAL PRODUCT SELECTION (REPLACING THE DROPDOWN) */}
          <div style={{ marginBottom: '18px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <label
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                }}
              >
                Select Product to Restock ({filteredProducts.length} items)
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Click a toy to preview and restock
              </span>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Search by toy name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  fontSize: '0.875rem',
                  width: '100%',
                }}
              />
            </div>

            {/* Category / Stock Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setFilterTab('ALL')}
                className={`pill ${filterTab === 'ALL' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '3px 10px', fontWeight: 700 }}
              >
                All Products ({normalizedProducts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('LOW_STOCK')}
                className={`pill ${filterTab === 'LOW_STOCK' ? 'active' : ''}`}
                style={{
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  fontWeight: 700,
                  borderColor: filterTab === 'LOW_STOCK' ? '#d97706' : undefined,
                  color: filterTab === 'LOW_STOCK' ? '#ffffff' : '#d97706',
                  backgroundColor: filterTab === 'LOW_STOCK' ? '#d97706' : 'rgba(217, 119, 6, 0.08)',
                }}
              >
                ⚠️ Low Stock ({lowStockCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('OUT_OF_STOCK')}
                className={`pill ${filterTab === 'OUT_OF_STOCK' ? 'active' : ''}`}
                style={{
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  fontWeight: 700,
                  borderColor: filterTab === 'OUT_OF_STOCK' ? '#dc2626' : undefined,
                  color: filterTab === 'OUT_OF_STOCK' ? '#ffffff' : '#dc2626',
                  backgroundColor: filterTab === 'OUT_OF_STOCK' ? '#dc2626' : 'rgba(239, 68, 68, 0.08)',
                }}
              >
                🚫 Out of Stock ({outOfStockCount})
              </button>
            </div>

            {/* Visual Products List Container with Images */}
            <div
              style={{
                maxHeight: '210px',
                overflowY: 'auto',
                border: '1px solid var(--border, #e7e5e4)',
                borderRadius: 'var(--radius-md, 10px)',
                backgroundColor: 'var(--bg-subtle, #fcfbf9)',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {filteredProducts.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                  }}
                >
                  No toys match your search criteria.
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const id = p.productId || p.id;
                  const isSelected =
                    selectedProduct &&
                    (selectedProduct.productId === id || selectedProduct.id === id);

                  return (
                    <div
                      key={id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setValidationError(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: isSelected
                          ? '2px solid #059669'
                          : '1px solid var(--border-hairline, #e7e5e4)',
                        backgroundColor: isSelected
                          ? 'rgba(5, 150, 105, 0.08)'
                          : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        gap: '12px',
                      }}
                    >
                      {/* Product Thumbnail Image */}
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          backgroundColor: '#f5f5f4',
                          border: '1px solid var(--border-hairline, #e7e5e4)',
                        }}
                      >
                        <img
                          src={p.heroImage || '/products/zen_garden_pagoda.jpg'}
                          alt={p.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/products/zen_garden_pagoda.jpg';
                          }}
                        />
                      </div>

                      {/* Product Meta */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: isSelected ? 800 : 700,
                            fontSize: '0.875rem',
                            color: 'var(--text-main)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            gap: '8px',
                            marginTop: '2px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            SKU: {p.sku || 'N/A'}
                          </span>
                          <span>•</span>
                          <span>{p.category}</span>
                          <span>•</span>
                          <span>Threshold: {p.lowStockThreshold} units</span>
                        </div>
                      </div>

                      {/* Stock Badge & Selection State */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: p.isOutOfStock
                              ? 'rgba(239, 68, 68, 0.12)'
                              : p.isLowStock
                              ? 'rgba(217, 119, 6, 0.12)'
                              : 'rgba(22, 163, 74, 0.1)',
                            color: p.isOutOfStock
                              ? '#dc2626'
                              : p.isLowStock
                              ? '#d97706'
                              : '#16a34a',
                          }}
                        >
                          {p.isOutOfStock
                            ? '0 available'
                            : `${p.availableStock} available`}
                        </span>

                        {isSelected ? (
                          <div
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              border: '1.5px solid var(--border-hairline, #d6d3d1)',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. SELECTED PRODUCT ERD INVENTORY SPOTLIGHT CARD */}
          {selectedProduct && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #059669',
                borderRadius: 'var(--radius-md, 12px)',
                padding: '14px 16px',
                marginBottom: '18px',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={selectedProduct.heroImage || '/products/zen_garden_pagoda.jpg'}
                    alt={selectedProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          color: '#059669',
                          fontWeight: 700,
                        }}
                      >
                        ACTIVE SELECTION: {selectedProduct.sku}
                      </span>
                      <h3
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 800,
                          color: 'var(--text-main)',
                          margin: '2px 0 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {selectedProduct.name}
                      </h3>
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: currentAvailableStock <= 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                        color: currentAvailableStock <= 0 ? '#dc2626' : '#d97706',
                      }}
                    >
                      <AlertTriangle size={12} />
                      {currentAvailableStock <= 0 ? 'Out of Stock' : `${currentAvailableStock} available`}
                    </span>
                  </div>

                  {/* ERD Breakdown Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '8px',
                      marginTop: '10px',
                      backgroundColor: 'var(--bg-subtle, #fcfbf9)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Physical Stock</div>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        {currentStockQuantity}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Reserved</div>
                      <div style={{ fontWeight: 800, color: '#d97706', fontSize: '0.875rem' }}>
                        {currentReservedQuantity}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Net Available</div>
                      <div style={{ fontWeight: 800, color: currentAvailableStock <= 0 ? '#dc2626' : '#059669', fontSize: '0.875rem' }}>
                        {currentAvailableStock}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>Threshold</div>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        {currentThreshold}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. UNITS TO RESTOCK CONTROLS */}
          <form id="restock-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <label
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                  }}
                >
                  Units to Restock (Warehouse Replenishment)
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Positive whole number
                </span>
              </div>

              {/* Stepper Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleStep(-10)}
                  disabled={parsedQuantity <= 10}
                  className="btn btn-outline btn-sm"
                  style={{ minWidth: '42px', padding: '8px 12px', fontWeight: 700 }}
                  title="Subtract 10 units"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={parsedQuantity <= 1}
                  className="btn btn-outline btn-sm"
                  style={{ minWidth: '38px', padding: '8px 10px', fontWeight: 700 }}
                  title="Subtract 1 unit"
                >
                  -1
                </button>
                <input
                  type="number"
                  min="1"
                  max="99999"
                  step="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="form-input"
                  style={{
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    padding: '8px 12px',
                    flex: 1,
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  className="btn btn-outline btn-sm"
                  style={{ minWidth: '38px', padding: '8px 10px', fontWeight: 700 }}
                  title="Add 1 unit"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(10)}
                  className="btn btn-outline btn-sm"
                  style={{ minWidth: '42px', padding: '8px 12px', fontWeight: 700 }}
                  title="Add 10 units"
                >
                  +10
                </button>
              </div>

              {/* Preset Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[10, 25, 50, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`pill ${parsedQuantity === preset ? 'active' : ''}`}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. LIVE ERD STOCK PROJECTION CARD */}
            <div
              style={{
                backgroundColor: willClearAlert ? 'rgba(5, 150, 105, 0.06)' : 'rgba(217, 119, 6, 0.06)',
                border: `1px solid ${willClearAlert ? 'rgba(5, 150, 105, 0.25)' : 'rgba(217, 119, 6, 0.25)'}`,
                borderRadius: 'var(--radius-md, 12px)',
                padding: '12px 16px',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                }}
              >
                <span>Current Stock: <strong>{currentStockQuantity}</strong></span>
                <ArrowRight size={14} color="var(--text-muted)" />
                <span>Added: <strong style={{ color: '#059669' }}>+{parsedQuantity}</strong></span>
                <ArrowRight size={14} color="var(--text-muted)" />
                <span>
                  Projected Physical: <strong>{projectedStockQuantity} units</strong>
                </span>
                <ArrowRight size={14} color="var(--text-muted)" />
                <span>
                  Net Available:{' '}
                  <strong style={{ fontSize: '0.9375rem', color: willClearAlert ? '#059669' : '#d97706' }}>
                    {projectedAvailableStock} units
                  </strong>
                </span>
              </div>

              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: willClearAlert ? '#059669' : '#d97706',
                }}
              >
                {willClearAlert ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>
                      Clears low-stock alert threshold ({currentThreshold} units). Net available will be {projectedAvailableStock} units.
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} />
                    <span>
                      Net available ({projectedAvailableStock} units) will remain at or below threshold ({currentThreshold} units). Consider adding more units.
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 5. RESTOCK REFERENCE / NOTES */}
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginBottom: '6px',
                }}
              >
                Restock Reference / Supplier Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Supplier Batch #2026-09, Warehouse Transfer, PO #4092"
                value={restockReason}
                onChange={(e) => setRestockReason(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.875rem' }}
              />
            </div>
          </form>
        </div>

        {/* Modal Footer Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-hairline, #e7e5e4)',
            marginTop: '8px',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isRestocking}
            className="btn btn-outline"
            style={{ padding: '10px 18px', fontSize: '0.875rem' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="restock-form"
            disabled={isRestocking || !selectedProduct || parsedQuantity <= 0}
            className="btn btn-primary"
            style={{
              backgroundColor: '#059669',
              borderColor: '#059669',
              color: '#ffffff',
              padding: '10px 22px',
              fontSize: '0.875rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
            }}
          >
            {isRestocking ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span>Restocking...</span>
              </>
            ) : (
              <>
                <Boxes size={18} />
                <span>Confirm Restock (+{parsedQuantity} Units)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
