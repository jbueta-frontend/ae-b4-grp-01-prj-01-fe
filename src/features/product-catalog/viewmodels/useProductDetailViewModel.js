import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { mapApiProduct } from '../models/productModel';
import { useCart } from '../../../context/CartContext';

export function useProductDetailViewModel() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('dimensions');

  const fetchProduct = useCallback(async () => {
    if (!idOrSlug) return;
    setLoading(true);
    setError(null);
    try {
      let raw = null;
      try {
        const res = await api.get(`/products/${idOrSlug}`);
        raw = res?.product || res;
      } catch {
        // Fallback search across list
        const res = await api.get('/products');
        const list = Array.isArray(res) ? res : res?.products || res?.data || [];
        raw = list.find((p) => p.slug === idOrSlug || p.productId === idOrSlug || p.id === idOrSlug);
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
        setSelectedVariant(normalized.variants?.[0] || null);
      } else {
        setProduct(null);
      }
    } catch (err) {
      setError(err?.message || 'Product not found');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const toggleAccordion = (sectionKey) => {
    setOpenAccordion((prev) => (prev === sectionKey ? null : sectionKey));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedVariant?.name);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 1800);
  };

  return {
    product,
    loading,
    error,
    activeImage: activeImage || product?.heroImage,
    setActiveImage,
    selectedVariant: selectedVariant || product?.variants?.[0],
    setSelectedVariant,
    quantity,
    incrementQty,
    decrementQty,
    openAccordion,
    toggleAccordion,
    handleAddToCart,
    addedNotice,
    goBack: () => navigate(-1),
  };
}
