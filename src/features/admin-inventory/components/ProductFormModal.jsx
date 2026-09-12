import { useState, useEffect, useRef } from 'react';
import {
  ADMIN_CATEGORIES,
  PRODUCT_STATUSES,
  DEFAULT_PRODUCT_FORM,
  validateProductForm,
  validateImageFile,
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
  const [imageError, setImageError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        sku: initialProduct.sku || '',
        categoryId:
          initialProduct.categoryId || 'c1000000-0000-0000-0000-000000000002',
        description: initialProduct.description || '',
        price: initialProduct.price ?? '',
        compareAtPrice: initialProduct.compareAtPrice ?? '',
        stockQuantity:
          initialProduct.inventory?.stockQuantity ??
          initialProduct.stockQuantity ??
          50,
        imageUrl:
          initialProduct.imageUrl ||
          (Array.isArray(initialProduct.images) &&
            initialProduct.images[0]?.imageUrl) ||
          '',
        ageMin: initialProduct.ageMin ?? '1',
        ageMax: initialProduct.ageMax ?? '8',
        brand: initialProduct.brand || 'FiddleMania',
        weightGrams: initialProduct.weightGrams ?? '350',
        status: initialProduct.status || 'ACTIVE',
      });
    } else {
      setFormData(DEFAULT_PRODUCT_FORM);
    }
    setImageError(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Immediate Image Upload & Format Validation
  const processImageFile = (file) => {
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      // Immediate upload error handling: only accepts image formats
      setImageError(validation.error);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Clear error immediately on valid file
    setImageError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      handleChange('imageUrl', e.target.result);
    };
    reader.onerror = () => {
      setImageError('Failed to read image file. Please choose another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    processImageFile(file);
  };

  const handleRemoveImage = () => {
    handleChange('imageUrl', '');
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEditing = Boolean(initialProduct);
    const validation = validateProductForm(formData, isEditing);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const initialQty =
      formData.stockQuantity !== '' ? Number(formData.stockQuantity) : 50;

    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice
        ? Number(formData.compareAtPrice)
        : null,
      stockQuantity: initialQty,
      imageUrl: formData.imageUrl || '',
      images: formData.imageUrl
        ? [
            {
              imageUrl: formData.imageUrl,
              altText: formData.name,
              isThumbnail: true,
              displayOrder: 1,
            },
          ]
        : [],
      inventory: {
        stockQuantity: initialQty,
        reservedQuantity: initialProduct?.inventory?.reservedQuantity || 0,
        lowStockThreshold: 5,
      },
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
        backgroundColor: 'rgba(24, 24, 27, 0.65)',
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
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          padding: '28px',
          borderRadius: 'var(--radius-lg, 12px)',
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
              Configure toy photography, warehouse stock quantity, pricing, and specs.
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
          {/* Section: Product Image Upload */}
          <div
            style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: 'var(--bg-subtle, #f8fafc)',
              borderRadius: 'var(--radius-md, 8px)',
              border: '1px solid var(--border-hairline, #e2e8f0)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <label
                className="form-label"
                style={{
                  marginBottom: 0,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                }}
              >
                Product Image Upload
              </label>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: '#e0e7ff',
                  color: '#4338ca',
                }}
              >
                Images Only (JPG, PNG, WebP, GIF, SVG)
              </span>
            </div>

            {/* Immediate Image Error Alert */}
            {imageError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#dc2626',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>⚠</span>
                <div>
                  <div style={{ fontWeight: 700 }}>Upload Error</div>
                  <div style={{ fontWeight: 500, marginTop: '2px' }}>{imageError}</div>
                </div>
              </div>
            )}

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Preview or Dropzone */}
            {formData.imageUrl ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid var(--border-hairline, #e2e8f0)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '84px',
                    height: '84px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-hairline)',
                    backgroundColor: '#f1f5f9',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={formData.imageUrl}
                    alt="Toy Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/products/zen_garden_pagoda.jpg';
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                    }}
                  >
                    Image Attached & Ready
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '2px',
                    }}
                  >
                    This photo will be displayed across the store catalog and inventory tables.
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '8px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn btn-ghost btn-sm"
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        color: '#dc2626',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging
                    ? '2px dashed var(--accent, #f97316)'
                    : '2px dashed #cbd5e1',
                  backgroundColor: isDragging ? 'rgba(249, 115, 22, 0.05)' : '#ffffff',
                  borderRadius: '8px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast, 150ms)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>📸</div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                  }}
                >
                  Click to upload product image or drag and drop
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                  }}
                >
                  Accepted image formats: JPEG, PNG, WebP, GIF, SVG, AVIF (Max 10MB)
                </div>
              </div>
            )}

            {/* Optional Direct URL Fallback */}
            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="Or paste an image URL (e.g. /products/zen_garden_pagoda.jpg or https://...)"
                className="form-input"
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
              />
            </div>
          </div>

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

          {/* Row 4: Quantity Option Field & Weight */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Quantity Option Field */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>
                {initialProduct ? 'Stock Quantity (Warehouse) *' : 'Initial Stock Quantity *'}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.stockQuantity}
                onChange={(e) => handleChange('stockQuantity', e.target.value)}
                placeholder="50"
                className="form-input"
              />
              <small
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                {initialProduct
                  ? 'Current available warehouse inventory units ready for dispatch.'
                  : 'Starting warehouse stock level initialized upon product creation.'}
              </small>
              {errors.stockQuantity && (
                <div className="form-error">{errors.stockQuantity}</div>
              )}
            </div>

            {/* Weight */}
            <div className="form-group">
              <label className="form-label">Weight (grams)</label>
              <input
                type="number"
                min="0"
                value={formData.weightGrams}
                onChange={(e) => handleChange('weightGrams', e.target.value)}
                placeholder="e.g. 350"
                className="form-input"
              />
              <small
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                Item package weight used for shipping calculations.
              </small>
            </div>
          </div>

          {/* Row 5: Age Range & Status */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Publishing Status</label>
              <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
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
