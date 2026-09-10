export const DEFAULT_DELIVERY = {
  id: 'standard',
  name: 'Standard Carbon-Neutral Delivery',
  time: '3–5 business days',
  price: 0.0,
  desc: 'Dispatched via certified zero-emission courier in biodegradable boxes',
};

export const INITIAL_SHIPPING = {
  fullName: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  stateProvince: '',
  postalCode: '',
  country: 'Philippines',
};

export const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    desc: 'Instant secure checkout with 256-bit SSL encryption',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    desc: 'Pay cash to the delivery courier directly upon arrival',
  },
  {
    id: 'ewallet',
    name: 'GCash / Maya / E-Wallet',
    desc: 'Fast and convenient payment via local mobile wallet',
  },
];
