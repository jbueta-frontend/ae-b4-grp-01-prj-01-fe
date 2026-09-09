import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'fiddlemania_cart';

const INITIAL_CART = [
  {
    id: 'prod-01',
    name: 'Architect Beechwood Block Set',
    slug: 'architect-beechwood-block-set',
    price: 48.0,
    originalPrice: 58.0,
    image:
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    variant: 'Natural Beech',
    quantity: 1,
  },
];

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (product, quantity = 1, variant = null) => {
    const selectedVariant =
      variant || (product.variants?.[0]?.name ?? 'Standard');
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.id === product.id && item.variant === selectedVariant
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.heroImage || product.image,
          variant: selectedVariant,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
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
        clearCart,
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
