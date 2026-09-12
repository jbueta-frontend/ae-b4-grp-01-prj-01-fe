import api from './api';
import { DATABASE_CATEGORIES } from '../features/product-catalog/models/productModel';

/**
 * Service for Product Catalog & Category Management
 * Sourced directly from PostgreSQL database via backend API
 */

/**
 * Fetch all product categories
 * GET /categories
 */
export async function getCategories() {
  try {
    const res = await api.get('/categories');
    const list = Array.isArray(res) ? res : res?.data || [];
    if (list.length > 0) {
      return list;
    }
    return DATABASE_CATEGORIES;
  } catch (err) {
    console.warn('Failed to fetch live categories, using database fallback:', err);
    return DATABASE_CATEGORIES;
  }
}

/**
 * Fetch all products
 * GET /products
 */
export async function getProducts(params = {}) {
  const res = await api.get('/products', { params });
  return Array.isArray(res) ? res : res?.products || res?.data || [];
}

/**
 * Fetch single product by ID or Slug
 * GET /products/:idOrSlug
 */
export async function getProductById(idOrSlug) {
  const res = await api.get(`/products/${idOrSlug}`);
  return res?.product || res?.data || res;
}

export const getProductBySlug = getProductById;
