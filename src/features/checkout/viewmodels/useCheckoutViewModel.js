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

  // Keep Name & Email synced when user profile resolves
  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || user.fullName || '',
        email: prev.email || user.email || '',
        addressLine1: prev.addressLine1 || user.addressLine1 || user.address || '',
        city: prev.city || user.city || '',
        stateProvince: prev.stateProvince || user.stateProvince || user.state || '',
        postalCode: prev.postalCode || user.postalCode || user.zip || '',
        country: prev.country || user.country || 'Philippines',
      }));
    }
  }, [user]);

  // Delivery is standardized as Carbon-Neutral Free Delivery (Step 2 Delivery Method removed)
  const selectedDelivery = DEFAULT_DELIVERY;
  const deliveryPrice = selectedDelivery.price;
  const finalTotal = Number((subtotal + tax + deliveryPrice).toFixed(2));

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
            ? 'Pending COD Delivery'
            : placedOrder?.status || 'Confirmed',
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
