import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import {
  DEFAULT_DELIVERY,
  INITIAL_SHIPPING,
  PAYMENT_METHODS,
} from '../models/checkoutModel';
import { getCheckoutSummary, placeOrder } from '../../../services/orderService';
import { createPaymentIntent } from '../../../services/paymentService';

export function useCheckoutViewModel() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, tax, total, clearCart, updateQuantity, removeFromCart } =
    useCart();
  const { user } = useAuth();

  // Multi-step: Step 1 (Shipping Address) -> Step 2 (Payment Method)
  const [currentStep, setCurrentStep] = useState(1);

  // Address fields matching ERD schema
  const [shippingAddress, setShippingAddress] = useState({
    ...INITIAL_SHIPPING,
    fullName: user?.displayName || user?.name || INITIAL_SHIPPING.fullName,
    email: user?.email || INITIAL_SHIPPING.email,
  });

  // Keep shipping and tax state synchronized with backend checkout-summary
  const [backendSummary, setBackendSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    let isMounted = true;
    async function loadSummary() {
      setSummaryLoading(true);
      try {
        const sum = await getCheckoutSummary(items);
        if (isMounted && sum) {
          setBackendSummary(sum);
        }
      } catch (err) {
        // Handled in service
      } finally {
        if (isMounted) setSummaryLoading(false);
      }
    }
    loadSummary();
    return () => {
      isMounted = false;
    };
  }, [items]);

  // Pre-fill shipping address from saved profile address (user.address sub-object)
  // or from the localStorage fallback key written by /profile on save.
  // This runs whenever user changes (e.g. after profile save syncs into AuthContext).
  useEffect(() => {
    if (!user) return;

    // Priority 1: user.address sub-object (set by profile's handleSaveAddress via updateProfile)
    const profileAddr = user.address || null;

    // Priority 2: localStorage key written directly by profile page
    let localAddr = null;
    try {
      const raw = localStorage.getItem('fiddlemania_user_address');
      if (raw) localAddr = JSON.parse(raw);
    } catch {}

    // Merge: profile address wins over localStorage; both win over blank initial state.
    const resolvedAddr = profileAddr || localAddr || {};

    setShippingAddress((prev) => ({
      ...prev,
      // Identity fields always from user object
      fullName:
        resolvedAddr.recipientName ||
        resolvedAddr.fullName ||
        user.name ||
        user.fullName ||
        prev.fullName ||
        '',
      email: user.email || prev.email || '',
      // Address fields from saved profile address (always override blank defaults)
      addressLine1: resolvedAddr.addressLine1 || prev.addressLine1 || '',
      addressLine2: resolvedAddr.addressLine2 || prev.addressLine2 || '',
      city: resolvedAddr.city || prev.city || '',
      stateProvince: resolvedAddr.stateProvince || prev.stateProvince || '',
      postalCode: resolvedAddr.postalCode || prev.postalCode || '',
      country: resolvedAddr.country || prev.country || 'Philippines',
    }));
  }, [user]);

  // Delivery is standardized as Carbon-Neutral Free Delivery (Step 2 Delivery Method removed)
  const selectedDelivery = DEFAULT_DELIVERY;
  const deliveryPrice =
    backendSummary?.shippingFee != null
      ? Number(backendSummary.shippingFee)
      : selectedDelivery.price;

  // Compute tax (8% backend aligned)
  const computedTax =
    backendSummary?.taxAmount != null
      ? Number(backendSummary.taxAmount)
      : (tax != null ? Number(tax) : Number((subtotal * 0.08).toFixed(2)));

  const finalTotal =
    backendSummary?.total != null
      ? Number(backendSummary.total)
      : Number((subtotal + computedTax + deliveryPrice).toFixed(2));

  // Payment method: 'card' | 'cod' | 'ewallet'
  const [paymentType, setPaymentType] = useState('card');
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: user?.name || 'Alexander Wright',
    expiry: '09/28',
    cvc: '741',
  });

  // Shopping Bag in-place editing state
  const [isEditingBag, setIsEditingBag] = useState(false);
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const updateShipping = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const updateCard = (field, value) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const proceedFromShipping = (e) => {
    e?.preventDefault();
    if (
      !shippingAddress.fullName.trim() ||
      !shippingAddress.email.trim() ||
      !shippingAddress.addressLine1.trim() ||
      !shippingAddress.city.trim() ||
      !shippingAddress.stateProvince.trim() ||
      !shippingAddress.postalCode.trim() ||
      !shippingAddress.country.trim()
    ) {
      setError('Please fill in all required shipping address fields.');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  // Bag item selection helpers
  const toggleSelectItem = (itemKey) => {
    setSelectedItemKeys((prev) =>
      prev.includes(itemKey)
        ? prev.filter((k) => k !== itemKey)
        : [...prev, itemKey]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemKeys.length === items.length) {
      setSelectedItemKeys([]);
    } else {
      setSelectedItemKeys(items.map((i) => `${i.id}-${i.variant}`));
    }
  };

  const handleRemoveSelected = () => {
    selectedItemKeys.forEach((key) => {
      const item = items.find((i) => `${i.id}-${i.variant}` === key);
      if (item) {
        removeFromCart(item.id, item.variant);
      }
    });
    setSelectedItemKeys([]);
  };

  const toggleEditBag = () => {
    setIsEditingBag((prev) => {
      if (prev) {
        setSelectedItemKeys([]);
      }
      return !prev;
    });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const paymentMethodName =
        paymentType === 'cod'
          ? 'Cash on Delivery (COD)'
          : paymentType === 'card'
            ? 'Credit / Debit Card'
            : 'GCash / Maya / E-Wallet';

      // 4. Payments & Transaction Gateway: Generate Payment Intent (TXN-XXXXX)
      let paymentIntent = null;
      try {
        paymentIntent = await createPaymentIntent({
          amount: finalTotal,
          currency: 'PHP',
          paymentType,
        });
      } catch (intentErr) {
        // Handled gracefully in service
      }

      const transactionReference =
        paymentIntent?.transactionReference ||
        'TXN-' + Math.floor(10000 + Math.random() * 90000);

      // 3. Order Checkout & Inventory Reservation: Place Order (ORD-XXXXX)
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.id || i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          variant: i.variant || null,
          image: i.image,
        })),
        shippingAddress,
        deliveryMethod: selectedDelivery,
        paymentMethod: paymentMethodName,
        paymentType,
        transactionReference,
        subtotal,
        tax: computedTax,
        shippingFee: deliveryPrice,
        totalAmount: finalTotal,
      };

      const placedOrder = await placeOrder(orderPayload);

      const resolvedOrderId =
        placedOrder?.orderNumber ||
        placedOrder?.orderId ||
        'ORD-' + Math.floor(10000 + Math.random() * 90000);

      const resolvedTrackingNumber =
        placedOrder?.trackingNumber ||
        'TRK-' + Math.floor(10000000 + Math.random() * 90000000);

      const orderData = {
        ...placedOrder,
        orderId: resolvedOrderId,
        orderNumber: resolvedOrderId,
        trackingNumber: resolvedTrackingNumber,
        transactionReference,
        createdAt: placedOrder?.createdAt || new Date().toISOString(),
        items: [...items],
        shippingAddress,
        deliveryMethod: selectedDelivery,
        subtotal,
        deliveryPrice,
        tax: computedTax,
        total: finalTotal,
        paymentType,
        paymentMethodName,
        status:
          paymentType === 'cod'
            ? 'PENDING'
            : (placedOrder?.status || 'CONFIRMED').toUpperCase(),
        estimatedDelivery: 'Sep 14 – Sep 16',
      };

      // Save order to localStorage for offline / persistence access
      try {
        const existing = JSON.parse(
          localStorage.getItem('fiddlemania_orders') || '[]'
        );
        localStorage.setItem(
          'fiddlemania_orders',
          JSON.stringify([orderData, ...existing])
        );
      } catch {
        // ignore
      }

      clearCart();
      navigate(`/orders/${resolvedOrderId}`, { state: { order: orderData } });
    } catch (err) {
      setError(
        'Payment authorization or order placement could not be completed. Please try again.'
      );
      setIsProcessing(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    goToStep,
    items,
    subtotal,
    tax: computedTax,
    selectedDelivery,
    deliveryPrice,
    shippingAddress,
    updateShipping,
    paymentMethods: PAYMENT_METHODS,
    paymentType,
    setPaymentType,
    cardData,
    updateCard,
    finalTotal,
    isProcessing,
    error,
    summaryLoading,
    backendSummary,
    proceedFromShipping,
    handlePlaceOrder,
    // In-place edit bag features
    isEditingBag,
    selectedItemKeys,
    toggleSelectItem,
    toggleSelectAll,
    handleRemoveSelected,
    toggleEditBag,
    updateQuantity,
    removeFromCart,
  };
}
