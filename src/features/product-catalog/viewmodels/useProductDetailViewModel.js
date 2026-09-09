import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../models/productModel';
import { useCart } from '../../../context/CartContext';

export function useProductDetailViewModel() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = useMemo(() => {
    return (
      PRODUCTS.find((p) => p.slug === idOrSlug || p.id === idOrSlug) ||
      PRODUCTS[0]
    );
  }, [idOrSlug]);

  const [activeImage, setActiveImage] = useState(
    product?.gallery?.[0] || product?.heroImage
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('dimensions');

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
    activeImage: activeImage || product.heroImage,
    setActiveImage,
    selectedVariant: selectedVariant || product.variants?.[0],
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
