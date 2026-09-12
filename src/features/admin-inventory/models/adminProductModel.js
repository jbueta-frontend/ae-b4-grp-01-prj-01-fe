/**
 * Admin Product Model & Form Definitions
 * Aligned with backend schema & ERD:
 * (categoryId, name, sku, description, price, compareAtPrice, ageMin, ageMax, brand, weightGrams, status)
 */

export const ADMIN_CATEGORIES = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Action Figures' },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'Building Sets' },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'Board Games & Puzzles' },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'Plush Toys' },
  { id: 'c1000000-0000-0000-0000-000000000005', name: 'Outdoor & Sports' },
  { id: 'c1000000-0000-0000-0000-000000000006', name: 'STEM & Educational' },
];

export const PRODUCT_STATUSES = [
  { id: 'ACTIVE', label: 'Active', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' },
  { id: 'DRAFT', label: 'Draft', color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' },
  { id: 'ARCHIVED', label: 'Archived', color: '#71717a', bg: 'rgba(113, 113, 122, 0.1)' },
];

export const DEFAULT_PRODUCT_FORM = {
  name: '',
  sku: '',
  categoryId: 'c1000000-0000-0000-0000-000000000002',
  description: '',
  price: '',
  compareAtPrice: '',
  stockQuantity: '50',
  imageUrl: '',
  ageMin: '1',
  ageMax: '8',
  brand: 'FiddleMania',
  weightGrams: '350',
  status: 'ACTIVE',
};

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];

export const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

export function validateImageFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  const fileName = file.name || '';
  const fileExt = fileName.includes('.')
    ? fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
    : '';
  const fileType = (file.type || '').toLowerCase();

  const isExtValid = ALLOWED_IMAGE_EXTENSIONS.includes(fileExt);
  const isMimeValid = fileType.startsWith('image/') || ALLOWED_IMAGE_MIMES.includes(fileType);

  if (!isExtValid || !isMimeValid) {
    return {
      isValid: false,
      error: `Invalid file format "${fileName}". Only image files (JPEG, PNG, WebP, GIF, SVG, AVIF) are accepted.`,
    };
  }

  // 10MB limit
  if (file.size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      error: `File "${fileName}" exceeds the 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller image.`,
    };
  }

  return { isValid: true, error: null };
}

export function validateProductForm(form, isEditing = false) {
  const errors = {};

  if (!form.name || !form.name.trim()) {
    errors.name = 'Product name is required';
  }

  if (!form.sku || !form.sku.trim()) {
    errors.sku = 'SKU identifier is required';
  }

  const priceNum = Number(form.price);
  if (form.price === '' || isNaN(priceNum) || priceNum <= 0) {
    errors.price = 'Valid positive price in PHP is required';
  }

  // Stock Quantity validation (required when creating new products, non-negative integer)
  if (form.stockQuantity !== '' && form.stockQuantity !== undefined && form.stockQuantity !== null) {
    const qty = Number(form.stockQuantity);
    if (isNaN(qty) || !Number.isInteger(qty) || qty < 0) {
      errors.stockQuantity = 'Quantity must be a non-negative whole number (0 or greater)';
    }
  } else if (!isEditing) {
    errors.stockQuantity = 'Initial stock quantity is required';
  }

  if (form.compareAtPrice !== '' && form.compareAtPrice !== undefined) {
    const compareNum = Number(form.compareAtPrice);
    if (isNaN(compareNum) || compareNum < 0) {
      errors.compareAtPrice = 'Compare price must be a valid positive number';
    }
  }

  if (form.ageMin !== '' && form.ageMax !== '') {
    if (Number(form.ageMin) > Number(form.ageMax)) {
      errors.ageMax = 'Max age must be greater than or equal to min age';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
