import { createContext, useContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'fiddlemania_cart';

const INITIAL_CART = [];

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, item: null });
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const showToast = (item) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ isOpen: true, item });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ isOpen: false, item: null });
    }, 4500);
  };

  const hideToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ isOpen: false, item: null });
  };

  const addToCart = (product, quantity = 1, variant = null) => {
    const selectedVariant = variant || null;

    const addedItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.heroImage || product.image,
      variant: selectedVariant,
      quantity,
    };

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.id === product.id && (!selectedVariant || item.variant === selectedVariant)
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }
      return [...prev, addedItem];
    });

    // Trigger visual pulse on navbar cart icon
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);

    // Trigger high-visibility top-left toast
    showToast(addedItem);
  };

  const updateQuantity = (id, variant, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, variant);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.variant === variant
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const removeFromCart = (id, variant) => {
    setItems((prev) =>
      prev.filter((item) => !(item.id === id && item.variant === variant))
    );
  };

  const undoAddToCart = (addedItem) => {
    const target = addedItem || toast?.item;
    if (!target) {
      hideToast();
      return;
    }
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.id === target.id && (!target.variant || it.variant === target.variant)
      );
      if (existingIdx === -1) return prev;
      const currentQty = prev[existingIdx].quantity;
      const qtyToRemove = target.quantity || 1;
      const nextQty = currentQty - qtyToRemove;
      if (nextQty <= 0) {
        return prev.filter((_, idx) => idx !== existingIdx);
      }
      const next = [...prev];
      next[existingIdx] = {
        ...next[existingIdx],
        quantity: nextQty,
      };
      return next;
    });
    hideToast();
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const freeShippingThreshold = 75.0;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );

  const shipping =
    subtotal === 0 || subtotal >= freeShippingThreshold ? 0.0 : 6.5;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        freeShippingThreshold,
        freeShippingRemaining,
        freeShippingProgress,
        shipping,
        tax,
        total,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        undoAddToCart,
        clearCart,
        justAdded,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
