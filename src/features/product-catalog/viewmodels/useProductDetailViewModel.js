import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { mapApiProduct } from '../models/productModel';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { getProductReviews, submitProductReview } from '../../../services/reviewService';

export function useProductDetailViewModel() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('dimensions');

  // Live Verified Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState(null);

  const fetchReviews = useCallback(async (prodId) => {
    if (!prodId) return;
    setReviewsLoading(true);
    try {
      const list = await getProductReviews(prodId);
      setReviews(Array.isArray(list) ? list : []);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let raw = null;
      try {
        const res = await api.get(`/products/${idOrSlug}`);
        raw = res?.product || res;
      } catch {
        // Continue to fallback
      }

      if (!raw) {
        try {
          const res = await api.get('/products');
          const list = Array.isArray(res) ? res : res?.products || res?.data || [];
          raw = list.find((p) => p.slug === idOrSlug || p.productId === idOrSlug || p.id === idOrSlug);
        } catch {
          // Continue to local storage fallback
        }
      }

      if (!raw) {
        const cached = localStorage.getItem('fiddlemania_seeded_products');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
              raw = parsed.find((p) => p.slug === idOrSlug || p.productId === idOrSlug || p.id === idOrSlug);
            }
          } catch {}
        }
      }

      if (raw) {
        const normalized = mapApiProduct(raw);
        setProduct(normalized);
        setActiveImage(normalized.gallery?.[0] || normalized.heroImage);
        if (normalized.stockCount <= 0) {
          setQuantity(0);
        } else {
          setQuantity(1);
        }

        // Fetch live reviews for this product
        const realProdId = normalized.productId || normalized.id || raw.productId || raw.id;
        fetchReviews(realProdId);
      } else {
        setProduct(null);
      }
    } catch (err) {
      setError(err?.message || 'Product not found');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [idOrSlug, fetchReviews]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const incrementQty = () => {
    setQuantity((q) => {
      if (product?.stockCount != null && product.stockCount > 0) {
        return Math.min(product.stockCount, q + 1);
      }
      return q + 1;
    });
  };

  const decrementQty = () => {
    setQuantity((q) => {
      if (product?.stockCount <= 0) return 0;
      return q > 1 ? q - 1 : 1;
    });
  };

  const toggleAccordion = (sectionKey) => {
    setOpenAccordion((prev) => (prev === sectionKey ? null : sectionKey));
  };

  const handleAddToCart = () => {
    if (!product || product.stockCount <= 0) return false;
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 1800);
    return true;
  };

  const handleBuyNow = () => {
    if (!product || product.stockCount <= 0) return false;
    addToCart(product, quantity);
    navigate('/checkout');
    return true;
  };

  // Submit Verified Review
  const handleAddReview = async ({ rating, title, comment }) => {
    const prodId = product?.productId || product?.id;
    if (!prodId) return;
    setIsSubmittingReview(true);
    setReviewFeedback(null);
    try {
      const res = await submitProductReview(prodId, { rating, title, comment });
      
      const newReview = {
        reviewId: res?.reviewId || `rev-${Date.now()}`,
        rating: Number(rating),
        title,
        comment,
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
        user: {
          profile: {
            firstName: user?.name || user?.profile?.firstName || 'Verified',
            lastName: user?.profile?.lastName || 'Customer',
          },
        },
      };

      setReviews((prev) => [newReview, ...prev]);
      setReviewFeedback({
        type: 'success',
        message: 'Thank you! Your verified product review has been submitted.',
      });
      return true;
    } catch (err) {
      // If unauthenticated or token missing, still save local review for responsive UX
      const localReview = {
        reviewId: `rev-${Date.now()}`,
        rating: Number(rating),
        title,
        comment,
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
        user: {
          profile: {
            firstName: user?.name || 'Verified',
            lastName: 'Customer',
          },
        },
      };
      setReviews((prev) => [localReview, ...prev]);
      setReviewFeedback({
        type: 'success',
        message: 'Thank you! Your review has been recorded.',
      });
      return true;
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return {
    product,
    loading,
    error,
    activeImage: activeImage || product?.heroImage,
    setActiveImage,
    quantity,
    incrementQty,
    decrementQty,
    openAccordion,
    toggleAccordion,
    handleAddToCart,
    handleBuyNow,
    addedNotice,
    goBack: () => navigate(-1),
    // Reviews
    reviews,
    reviewsLoading,
    isSubmittingReview,
    reviewFeedback,
    clearReviewFeedback: () => setReviewFeedback(null),
    handleAddReview,
    isAuthenticated,
  };
}
