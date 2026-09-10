import api from './api';

/**
 * Service for Verified Product Reviews
 */

/**
 * Fetch approved product reviews
 * GET /products/:productId/reviews
 */
export async function getProductReviews(productId) {
  try {
    const res = await api.get(`/products/${productId}/reviews`);
    return Array.isArray(res) ? res : res?.reviews || [];
  } catch (err) {
    return [];
  }
}

/**
 * Submit customer product review (1-5 stars, rating, title, comment)
 * POST /products/:productId/reviews
 */
export async function submitProductReview(productId, reviewData) {
  try {
    const res = await api.post(`/products/${productId}/reviews`, {
      rating: Number(reviewData.rating),
      title: reviewData.title,
      comment: reviewData.comment,
    });
    return res;
  } catch (err) {
    throw err;
  }
}
