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
  Layers,
} from 'lucide-react';
import { mapApiProduct } from '../../product-catalog/models/productModel.js';
import { formatPHP } from '../../../shared/utils/currency';

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

  // Normalize all products with ERD inventory metrics and authentic images
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

      const fallbackImg =
        mapped.heroImage ||
        p.imageUrl ||
        p.images?.[0]?.imageUrl ||
        '/products/zen_garden_pagoda.jpg';

      return {
        ...p,
        ...mapped,
        productId: p.productId || p.id || mapped.productId,
        name: p.name || mapped.name || 'Toy Product',
        sku: p.sku || mapped.sku || '—',
        category: p.category || mapped.category || 'Toys',
        price: Number(p.price || mapped.price || 0),
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

  // Selected product ERD metrics
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
    if (filterTab === 'LOW_STOCK' && !p.isLowStock) return false;
    if (filterTab === 'OUT_OF_STOCK' && !p.isOutOfStock) return false;

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
    setQuantity((prev) => Math.max(1, (Number(prev) || 0) + delta));
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
      setValidationError('Please select a toy product from the list on the left to restock.');
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
          maxWidth: '1020px',
          width: '100%',
          padding: '26px 30px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1)',
          border: '1.5px solid var(--border, #e7e5e4)',
          position: 'relative',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
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
            zIndex: 2,
          }}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexShrink: 0 }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(5, 150, 105, 0.12)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Package size={22} />
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
                margin: '2px 0 0',
              }}
            >
              Select product with fast imagery visualization and replenish warehouse stock levels.
            </p>
          </div>
        </div>

        {/* Validation / Error Alert */}
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

        {/* TWO-COLUMN CONTAINER BODY */}
        <form
          id="restock-form"
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '24px',
            alignItems: 'start',
            paddingRight: '2px',
          }}
        >
          {/* ==================================================== */}
          {/* LEFT COLUMN: NAVIGATION, SEARCH, PRODUCT LIST, RESTOCK OPTIONS */}
          {/* ==================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Search Bar */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
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
                  Click to select
                </span>
              </div>

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
                  placeholder="Search toy by name, SKU, or category..."
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

              {/* 2. Navigation / Filter Tabs */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
            </div>

            {/* 3. Visual Scrollable Product List with Images */}
            <div
              style={{
                maxHeight: '190px',
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
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: isSelected
                          ? '2px solid #059669'
                          : '1px solid var(--border-hairline, #e7e5e4)',
                        backgroundColor: isSelected
                          ? 'rgba(5, 150, 105, 0.08)'
                          : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        gap: '10px',
                      }}
                    >
                      {/* Product Thumbnail */}
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
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
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                            fontSize: '0.8125rem',
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
                            gap: '6px',
                            marginTop: '1px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {p.sku || 'N/A'}
                          </span>
                          <span>•</span>
                          <span>{p.category}</span>
                        </div>
                      </div>

                      {/* Stock Badge & Radio State */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: '5px',
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
                          {p.isOutOfStock ? '0 avail' : `${p.availableStock} avail`}
                        </span>

                        {isSelected ? (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={13} strokeWidth={3} />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
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

            {/* 4. Restocking Options (Units to Restock, Stepper, Presets) */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
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
                  Min: 1 unit
                </span>
              </div>

              {/* Stepper Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleStep(-10)}
                  disabled={parsedQuantity <= 10}
                  className="btn btn-outline btn-sm"
                  style={{ minWidth: '40px', padding: '6px 10px', fontWeight: 700 }}
                  title="Subtract 10 units"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={parsedQuantity <= 1}
                  className="btn btn-outline btn-sm"
                  style={{ minWidth: '36px', padding: '6px 8px', fontWeight: 700 }}
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
                    fontSize: '1.0625rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    padding: '6px 10px',
                    flex: 1,
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  className="btn btn-outline btn-sm"
                  style={{ minWidth: '36px', padding: '6px 8px', fontWeight: 700 }}
                  title="Add 1 unit"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(10)}
                  className="btn btn-outline btn-sm"
                  style={{ minWidth: '40px', padding: '6px 10px', fontWeight: 700 }}
                  title="Add 10 units"
                >
                  +10
                </button>
              </div>

              {/* Preset Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[10, 25, 50, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`pill ${parsedQuantity === preset ? 'active' : ''}`}
                    style={{
                      fontSize: '0.75rem',
                      padding: '3px 9px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Restock Reference / Supplier Notes */}
            <div>
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
          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: PRODUCT PREVIEW OF SELECTED PRODUCT */}
          {/* ==================================================== */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--border, #e7e5e4)',
              borderRadius: 'var(--radius-md, 14px)',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-hairline, #f0ede9)',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-muted)',
                }}
              >
                Product Preview
              </span>

              {selectedProduct && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: currentAvailableStock <= 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                    color: currentAvailableStock <= 0 ? '#dc2626' : '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertTriangle size={12} />
                  {currentAvailableStock <= 0 ? 'Out of Stock' : `${currentAvailableStock} available`}
                </span>
              )}
            </div>

            {selectedProduct ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Product Large Studio Image */}
                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#faf8f5',
                    border: '1px solid var(--border-hairline, #e7e5e4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={selectedProduct.heroImage || '/products/zen_garden_pagoda.jpg'}
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '8px',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/products/zen_garden_pagoda.jpg';
                    }}
                  />
                </div>

                {/* Product Title, SKU, Price */}
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#059669',
                    }}
                  >
                    SKU: {selectedProduct.sku}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      margin: '3px 0 2px',
                      lineHeight: 1.25,
                    }}
                  >
                    {selectedProduct.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '4px',
                    }}
                  >
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Category: <strong>{selectedProduct.category}</strong>
                    </span>
                    <span
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 800,
                        color: 'var(--accent, #c85a32)',
                      }}
                    >
                      {formatPHP(selectedProduct.price)}
                    </span>
                  </div>
                </div>

                {/* ERD 4-Metric Inventory Breakdown Grid */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle, #fcfbf9)',
                    border: '1px solid var(--border-hairline, #e7e5e4)',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '6px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Physical</div>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9375rem' }}>
                      {currentStockQuantity}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Reserved</div>
                    <div style={{ fontWeight: 800, color: '#d97706', fontSize: '0.9375rem' }}>
                      {currentReservedQuantity}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Available</div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: currentAvailableStock <= 0 ? '#dc2626' : '#059669',
                        fontSize: '0.9375rem',
                      }}
                    >
                      {currentAvailableStock}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)' }}>Threshold</div>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9375rem' }}>
                      {currentThreshold}
                    </div>
                  </div>
                </div>

                {/* Live Stock Projection Forecast Card */}
                <div
                  style={{
                    backgroundColor: willClearAlert ? 'rgba(5, 150, 105, 0.06)' : 'rgba(217, 119, 6, 0.06)',
                    border: `1px solid ${willClearAlert ? 'rgba(5, 150, 105, 0.25)' : 'rgba(217, 119, 6, 0.25)'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      flexWrap: 'wrap',
                      gap: '4px',
                    }}
                  >
                    <span>Net Avail: <strong>{currentAvailableStock}</strong></span>
                    <ArrowRight size={13} color="var(--text-muted)" />
                    <span>Adding: <strong style={{ color: '#059669' }}>+{parsedQuantity}</strong></span>
                    <ArrowRight size={13} color="var(--text-muted)" />
                    <span>
                      Projected:{' '}
                      <strong style={{ color: willClearAlert ? '#059669' : '#d97706', fontSize: '0.9375rem' }}>
                        {projectedAvailableStock} units
                      </strong>
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: willClearAlert ? '#059669' : '#d97706',
                      marginTop: '2px',
                    }}
                  >
                    {willClearAlert ? (
                      <>
                        <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                        <span>Clears low-stock alert threshold ({currentThreshold} units).</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                        <span>Will remain at/below threshold ({currentThreshold} units).</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  gap: '10px',
                }}
              >
                <Layers size={36} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  No Product Selected
                </div>
                <p style={{ fontSize: '0.75rem', margin: 0 }}>
                  Click on any toy product in the list on the left to preview its inventory levels and forecast.
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer Across Full Width */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-hairline, #e7e5e4)',
            marginTop: '14px',
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
              padding: '10px 24px',
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
