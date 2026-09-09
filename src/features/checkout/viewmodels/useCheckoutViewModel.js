import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { DELIVERY_OPTIONS, INITIAL_SHIPPING } from '../models/checkoutModel';

export function useCheckoutViewModel() {
  const navigate = useNavigate();
  const { items, subtotal, tax, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    ...INITIAL_SHIPPING,
    email: user?.email || INITIAL_SHIPPING.email,
    fullName: user?.name || INITIAL_SHIPPING.fullName,
  });

  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0]);
  const [paymentType, setPaymentType] = useState('card');
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: 'Alexander Wright',
    expiry: '09/28',
    cvc: '741',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const deliveryPrice = selectedDelivery.price;
  const finalTotal = Number((subtotal + tax + deliveryPrice).toFixed(2));

  const updateShipping = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const updateCard = (field, value) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (step) => {
    if (step < currentStep || step === currentStep) {
      setCurrentStep(step);
    }
  };

  const proceedFromShipping = (e) => {
    e?.preventDefault();
    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      setError('Please complete all required shipping address fields.');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const proceedFromDelivery = () => {
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate secure order authorization
      await new Promise((resolve) => setTimeout(resolve, 800));

      const orderId = 'FM-' + Math.floor(100000 + Math.random() * 900000);
      const trackingNumber =
        'TRK-' + Math.floor(10000000 + Math.random() * 90000000);

      const orderData = {
        orderId,
        trackingNumber,
        createdAt: new Date().toISOString(),
        items: [...items],
        shippingAddress,
        deliveryMethod: selectedDelivery,
        subtotal,
        deliveryPrice,
        tax,
        total: finalTotal,
        paymentType,
        status: 'Confirmed',
        estimatedDelivery: 'Sep 14 – Sep 16',
      };

      // Save to order history in localStorage
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
      navigate(`/orders/${orderId}`, { state: { order: orderData } });
    } catch {
      setError(
        'Payment authorization could not be completed. Please try again.'
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
    tax,
    deliveryOptions: DELIVERY_OPTIONS,
    selectedDelivery,
    setSelectedDelivery,
    shippingAddress,
    updateShipping,
    paymentType,
    setPaymentType,
    cardData,
    updateCard,
    finalTotal,
    isProcessing,
    error,
    proceedFromShipping,
    proceedFromDelivery,
    handlePlaceOrder,
  };
}
