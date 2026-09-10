import { useState, useEffect } from 'react';
import {
  ADMIN_CATEGORIES,
  PRODUCT_STATUSES,
  DEFAULT_PRODUCT_FORM,
  validateProductForm,
} from '../models/adminProductModel';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialProduct = null,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(DEFAULT_PRODUCT_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        sku: initialProduct.sku || '',
        categoryId: initialProduct.categoryId || 'cat-wooden',
        description: initialProduct.description || '',
        price: initialProduct.price ?? '',
        compareAtPrice: initialProduct.compareAtPrice ?? '',
        ageMin: initialProduct.ageMin ?? '1',
        ageMax: initialProduct.ageMax ?? '8',
        brand: initialProduct.brand || 'FiddleMania',
        weightGrams: initialProduct.weightGrams ?? '350',
        status: initialProduct.status || 'ACTIVE',
      });
    } else {
      setFormData(DEFAULT_PRODUCT_FORM);
    }
    setErrors({});
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateProductForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice
        ? Number(formData.compareAtPrice)
        : null,
      ageMin: formData.ageMin ? Number(formData.ageMin) : null,
      ageMax: formData.ageMax ? Number(formData.ageMax) : null,
      weightGrams: formData.weightGrams ? Number(formData.weightGrams) : null,
    };

    onSubmit(payload);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 24, 27, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="card-clean"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          padding: '28px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-hairline)',
            paddingBottom: '16px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main)',
              }}
            >
              {initialProduct ? 'Edit Toy Catalog Item' : 'Add New Fidget Toy'}
            </h2>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              Configure product details, pricing, and category classification.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            style={{ fontSize: '1.25rem', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Row 1: Name & SKU */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Kinetic Gyro Ring"
                className="form-input"
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">SKU Identifier *</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                placeholder="e.g. FDL-GYRO-01"
                className="form-input"
              />
              {errors.sku && <div className="form-error">{errors.sku}</div>}
            </div>
          </div>

          {/* Row 2: Category & Brand */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className="form-input"
              >
                {ADMIN_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="e.g. FiddleMania"
                className="form-input"
              />
            </div>
          </div>

          {/* Row 3: Price & Compare Price */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="form-group">
              <label className="form-label">Selling Price (₱ PHP) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.00"
                className="form-input"
              />
              {errors.price && <div className="form-error">{errors.price}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Compare-At Price (₱ Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.compareAtPrice}
                onChange={(e) => handleChange('compareAtPrice', e.target.value)}
                placeholder="Original MSRP (if discounted)"
                className="form-input"
              />
              {errors.compareAtPrice && (
                <div className="form-error">{errors.compareAtPrice}</div>
              )}
            </div>
          </div>

          {/* Row 4: Age Range & Weight */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
            }}
          >
            <div className="form-group">
              <label className="form-label">Min Age</label>
              <input
                type="number"
                min="0"
                value={formData.ageMin}
                onChange={(e) => handleChange('ageMin', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Age</label>
              <input
                type="number"
                min="0"
                value={formData.ageMax}
                onChange={(e) => handleChange('ageMax', e.target.value)}
                className="form-input"
              />
              {errors.ageMax && (
                <div className="form-error">{errors.ageMax}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Weight (g)</label>
              <input
                type="number"
                min="0"
                value={formData.weightGrams}
                onChange={(e) => handleChange('weightGrams', e.target.value)}
                placeholder="e.g. 250"
                className="form-input"
              />
            </div>
          </div>

          {/* Row 5: Status */}
          <div className="form-group">
            <label className="form-label">Publishing Status</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {PRODUCT_STATUSES.map((st) => (
                <label
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="status"
                    value={st.id}
                    checked={formData.status === st.id}
                    onChange={(e) => handleChange('status', e.target.value)}
                  />
                  <span>{st.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Row 6: Description */}
          <div className="form-group">
            <label className="form-label">Product Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Sensory tactile features, material craftsmanship, stress relief details..."
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-hairline)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting
                ? 'Saving...'
                : initialProduct
                  ? 'Update Product'
                  : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
