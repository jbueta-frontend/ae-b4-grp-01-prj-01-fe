import { useState, useEffect } from 'react';
import { Package, X, Check, ArrowRight, AlertTriangle, Boxes, CheckCircle2 } from 'lucide-react';

export default function RestockModal({
  isOpen,
  onClose,
  product = null,
  availableProducts = [],
  onRestock,
  isRestocking = false,
}) {
  const [selectedProduct, setSelectedProduct] = useState(product);
  const [quantity, setQuantity] = useState(50);
  const [restockReason, setRestockReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedProduct(product || (availableProducts.length > 0 ? availableProducts[0] : null));
      setQuantity(50);
      setRestockReason('');
      setSearchQuery('');
    }
  }, [isOpen, product, availableProducts]);

  if (!isOpen) return null;

  const currentStock = Number(
    selectedProduct?.stockQuantity ??
    selectedProduct?.stock ??
    selectedProduct?.inventory?.stockQuantity ??
    0
  );

  const lowStockThreshold = Number(
    selectedProduct?.lowStockThreshold ??
    selectedProduct?.inventory?.lowStockThreshold ??
    10
  );

  const projectedStock = Math.max(0, currentStock + Number(quantity || 0));
  const willClearAlert = projectedStock > lowStockThreshold;

  const filteredCatalog = availableProducts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q))
    );
  });

  const handlePresetClick = (amount) => {
    setQuantity(amount);
  };

  const handleStep = (delta) => {
    setQuantity((prev) => Math.max(1, (Number(prev) || 0) + delta));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const productId =
      selectedProduct.productId ||
      selectedProduct.id ||
      selectedProduct.product_id;

    if (!productId || Number(quantity) <= 0) return;

    onRestock({
      productId,
      amount: Number(quantity),
      currentStock,
      productName: selectedProduct.name || selectedProduct.productName || 'Product',
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
          maxWidth: '540px',
          width: '100%',
          padding: '28px 30px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1)',
          border: '1.5px solid var(--border, #e7e5e4)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
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
              Replenish toy supply to maintain healthy stock and meet customer orders.
            </p>
          </div>
        </div>

        {/* Product Selection / Info Box */}
        {product ? (
          /* Pre-selected Product Card */
          <div
            style={{
              backgroundColor: 'var(--bg-subtle, #f5f5f4)',
              border: '1px solid var(--border-hairline, #e7e5e4)',
              borderRadius: 'var(--radius-md, 12px)',
              padding: '16px',
              marginBottom: '22px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                  }}
                >
                  SKU: {selectedProduct.sku || 'N/A'}
                </span>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    margin: '2px 0 4px',
                  }}
                >
                  {selectedProduct.name || selectedProduct.productName || 'Product'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Low-Stock Threshold: <strong>{lowStockThreshold} units</strong>
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm, 6px)',
                    backgroundColor: currentStock <= 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                    color: currentStock <= 0 ? '#dc2626' : '#d97706',
                  }}
                >
                  <AlertTriangle size={12} />
                  {currentStock <= 0 ? 'Out of Stock' : `${currentStock} in stock`}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Searchable Product Picker */
          <div style={{ marginBottom: '22px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '6px',
              }}
            >
              Select Product to Restock
            </label>
            <input
              type="text"
              placeholder="Search product by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.875rem', marginBottom: '8px' }}
            />
            <select
              value={selectedProduct?.productId || selectedProduct?.id || ''}
              onChange={(e) => {
                const found = availableProducts.find(
                  (p) => (p.productId || p.id) === e.target.value
                );
                if (found) setSelectedProduct(found);
              }}
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.875rem', width: '100%' }}
            >
              {filteredCatalog.length === 0 ? (
                <option value="">No products match search</option>
              ) : (
                filteredCatalog.map((p) => {
                  const id = p.productId || p.id;
                  const stock = p.stockQuantity ?? p.stock ?? p.inventory?.stockQuantity ?? 0;
                  return (
                    <option key={id} value={id}>
                      {p.name} ({p.sku || 'No SKU'}) — Current: {stock} units
                    </option>
                  );
                })
              )}
            </select>
          </div>
        )}

        {/* Restock Quantity Controls */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
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
                Units to Restock
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Min: 1 unit
              </span>
            </div>

            {/* Stepper Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => handleStep(-10)}
                disabled={quantity <= 10}
                className="btn btn-outline btn-sm"
                style={{ minWidth: '42px', padding: '8px 12px', fontWeight: 700 }}
                title="Subtract 10 units"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => handleStep(-1)}
                disabled={quantity <= 1}
                className="btn btn-outline btn-sm"
                style={{ minWidth: '38px', padding: '8px 10px', fontWeight: 700 }}
                title="Subtract 1 unit"
              >
                -1
              </button>
              <input
                type="number"
                min="1"
                max="9999"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
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
                  className={`pill ${quantity === preset ? 'active' : ''}`}
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

          {/* Stock Projection Card */}
          <div
            style={{
              backgroundColor: willClearAlert ? 'rgba(5, 150, 105, 0.06)' : 'rgba(217, 119, 6, 0.06)',
              border: `1px solid ${willClearAlert ? 'rgba(5, 150, 105, 0.25)' : 'rgba(217, 119, 6, 0.25)'}`,
              borderRadius: 'var(--radius-md, 12px)',
              padding: '14px 16px',
              marginBottom: '20px',
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
              <span>Current: <strong>{currentStock}</strong></span>
              <ArrowRight size={14} color="var(--text-muted)" />
              <span>Added: <strong style={{ color: '#059669' }}>+{quantity}</strong></span>
              <ArrowRight size={14} color="var(--text-muted)" />
              <span>
                Projected Total:{' '}
                <strong style={{ fontSize: '1rem', color: willClearAlert ? '#059669' : '#d97706' }}>
                  {projectedStock} units
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
                  <span>Clears warehouse low-stock alert status (threshold is {lowStockThreshold} units).</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={14} />
                  <span>Will still remain below threshold ({lowStockThreshold} units). Consider restocking more.</span>
                </>
              )}
            </div>
          </div>

          {/* Restock Reference / Notes */}
          <div style={{ marginBottom: '24px' }}>
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
              placeholder="e.g., PO #4409, Weekly Delivery, Factory Batch"
              value={restockReason}
              onChange={(e) => setRestockReason(e.target.value)}
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '0.875rem' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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
              disabled={isRestocking || !selectedProduct || quantity <= 0}
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
                  <span>Confirm Restock (+{quantity} Units)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
