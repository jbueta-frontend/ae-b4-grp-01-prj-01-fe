import { Link } from 'react-router-dom';
import { useCheckoutViewModel } from '../viewmodels/useCheckoutViewModel';
import {
  Lock,
  ShieldCheck,
  Check,
  ArrowLeft,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import Logo from '../../../shared/components/Logo';

export default function CheckoutView() {
  const {
    currentStep,
    goToStep,
    items,
    subtotal,
    tax,
    deliveryOptions,
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
  } = useCheckoutViewModel();

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-page)',
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}
        >
          Your Bag is Empty
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Add items to your bag before checking out.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* 1. Enclosed Distraction-Free Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-card)',
          padding: '16px 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Logo size="sm" />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            <Lock size={15} color="var(--success)" />
            <span>Secure 256-Bit Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Body */}
      <main style={{ padding: '36px 0 80px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Form: Progressive 3 Steps */}
            <div>
              {error && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid #DC2626',
                    borderRadius: 'var(--radius-md)',
                    color: '#DC2626',
                    fontSize: '0.875rem',
                    marginBottom: '20px',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Step 1: Shipping Address */}
              <div
                className="card-clean"
                style={{
                  marginBottom: '20px',
                  border:
                    currentStep === 1
                      ? '1.5px solid var(--border-focus)'
                      : '1px solid var(--border-hairline)',
                }}
              >
                <div
                  onClick={() => goToStep(1)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: currentStep > 1 ? 'pointer' : 'default',
                    marginBottom: currentStep === 1 ? '20px' : '0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor:
                          currentStep > 1
                            ? 'var(--success)'
                            : 'var(--text-main)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                      }}
                    >
                      {currentStep > 1 ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        '1'
                      )}
                    </span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                      Shipping Address
                    </h3>
                  </div>

                  {currentStep > 1 && (
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--accent)',
                      }}
                    >
                      Edit
                    </span>
                  )}
                </div>

                {currentStep === 1 ? (
                  <form onSubmit={proceedFromShipping}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={shippingAddress.fullName}
                        onChange={(e) =>
                          updateShipping('fullName', e.target.value)
                        }
                        placeholder="e.g. Jane Doe"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Email for Delivery Confirmation *
                      </label>
                      <input
                        type="email"
                        className="form-input"
                        required
                        value={shippingAddress.email}
                        onChange={(e) =>
                          updateShipping('email', e.target.value)
                        }
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Street Address *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={shippingAddress.address}
                        onChange={(e) =>
                          updateShipping('address', e.target.value)
                        }
                        placeholder="123 Playcraft Boulevard"
                      />
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '12px',
                      }}
                    >
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={shippingAddress.city}
                          onChange={(e) =>
                            updateShipping('city', e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={shippingAddress.state}
                          onChange={(e) =>
                            updateShipping('state', e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">ZIP Code *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={shippingAddress.zip}
                          onChange={(e) =>
                            updateShipping('zip', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-secondary btn-block"
                      style={{ marginTop: '8px' }}
                    >
                      <span>Continue to Delivery</span>
                      <ChevronRight size={16} />
                    </button>
                  </form>
                ) : (
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      marginTop: '6px',
                    }}
                  >
                    {shippingAddress.fullName} • {shippingAddress.address},{' '}
                    {shippingAddress.city}, {shippingAddress.state}{' '}
                    {shippingAddress.zip}
                  </p>
                )}
              </div>

              {/* Step 2: Delivery Method */}
              <div
                className="card-clean"
                style={{
                  marginBottom: '20px',
                  border:
                    currentStep === 2
                      ? '1.5px solid var(--border-focus)'
                      : '1px solid var(--border-hairline)',
                }}
              >
                <div
                  onClick={() => goToStep(2)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: currentStep > 2 ? 'pointer' : 'default',
                    marginBottom: currentStep === 2 ? '20px' : '0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor:
                          currentStep > 2
                            ? 'var(--success)'
                            : currentStep === 2
                              ? 'var(--text-main)'
                              : 'var(--bg-muted)',
                        color:
                          currentStep >= 2 ? '#FFFFFF' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                      }}
                    >
                      {currentStep > 2 ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        '2'
                      )}
                    </span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                      Delivery Method
                    </h3>
                  </div>

                  {currentStep > 2 && (
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--accent)',
                      }}
                    >
                      Edit
                    </span>
                  )}
                </div>

                {currentStep === 2 ? (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        marginBottom: '20px',
                      }}
                    >
                      {deliveryOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedDelivery(opt)}
                          style={{
                            border: `1.5px solid ${selectedDelivery.id === opt.id ? 'var(--accent)' : 'var(--border-hairline)'}`,
                            backgroundColor:
                              selectedDelivery.id === opt.id
                                ? 'var(--accent-light)'
                                : 'var(--bg-card)',
                            padding: '16px',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: '0.9375rem',
                                }}
                              >
                                {opt.name}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--text-muted)',
                                }}
                              >
                                ({opt.time})
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: '0.8125rem',
                                color: 'var(--text-muted)',
                                marginTop: '4px',
                              }}
                            >
                              {opt.desc}
                            </p>
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                            {opt.price === 0
                              ? 'FREE'
                              : `₱${opt.price.toFixed(2)}`}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={proceedFromDelivery}
                      className="btn btn-secondary btn-block"
                    >
                      <span>Continue to Payment</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ) : currentStep > 2 ? (
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      marginTop: '6px',
                    }}
                  >
                    {selectedDelivery.name} (
                    {selectedDelivery.price === 0
                      ? 'FREE'
                      : `₱${selectedDelivery.price.toFixed(2)}`}
                    )
                  </p>
                ) : null}
              </div>

              {/* Step 3: Payment Method */}
              <div
                className="card-clean"
                style={{
                  border:
                    currentStep === 3
                      ? '1.5px solid var(--border-focus)'
                      : '1px solid var(--border-hairline)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: currentStep === 3 ? '20px' : '0',
                  }}
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor:
                        currentStep === 3
                          ? 'var(--text-main)'
                          : 'var(--bg-muted)',
                      color:
                        currentStep === 3 ? '#FFFFFF' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                    }}
                  >
                    3
                  </span>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                    Payment Method
                  </h3>
                </div>

                {currentStep === 3 && (
                  <div>
                    {/* Payment Type Switcher */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '20px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setPaymentType('card')}
                        className={`pill ${paymentType === 'card' ? 'active' : ''}`}
                        style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                      >
                        <CreditCard size={16} /> Credit / Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType('applepay')}
                        className={`pill ${paymentType === 'applepay' ? 'active' : ''}`}
                        style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                      >
                        Apple Pay / GPay
                      </button>
                    </div>

                    {paymentType === 'card' ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                        }}
                      >
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Card Number</label>
                          <input
                            type="text"
                            className="form-input"
                            value={cardData.number}
                            onChange={(e) =>
                              updateCard('number', e.target.value)
                            }
                            placeholder="4242 •••• •••• 4242"
                          />
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                          }}
                        >
                          <div
                            className="form-group"
                            style={{ marginBottom: 0 }}
                          >
                            <label className="form-label">Expiry</label>
                            <input
                              type="text"
                              className="form-input"
                              value={cardData.expiry}
                              onChange={(e) =>
                                updateCard('expiry', e.target.value)
                              }
                              placeholder="MM/YY"
                            />
                          </div>
                          <div
                            className="form-group"
                            style={{ marginBottom: 0 }}
                          >
                            <label className="form-label">CVC</label>
                            <input
                              type="text"
                              className="form-input"
                              value={cardData.cvc}
                              onChange={(e) =>
                                updateCard('cvc', e.target.value)
                              }
                              placeholder="123"
                            />
                          </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Cardholder Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={cardData.name}
                            onChange={(e) => updateCard('name', e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: '24px',
                          textAlign: 'center',
                          backgroundColor: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            marginBottom: '6px',
                          }}
                        >
                          1-Click Instant Device Payment
                        </p>
                        <p
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          Your biometrics will be requested upon clicking Place
                          Order.
                        </p>
                      </div>
                    )}

                    {/* Primary Authoritative Place Order CTA */}
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="btn btn-primary btn-block"
                      style={{
                        marginTop: '28px',
                        padding: '18px 24px',
                        fontSize: '1.0625rem',
                      }}
                    >
                      <Lock size={18} />
                      <span>
                        {isProcessing
                          ? 'Authorizing Payment...'
                          : `Place Order — ₱${finalTotal.toFixed(2)}`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sticky Order Summary */}
            <div
              className="card-clean"
              style={{ position: 'sticky', top: '24px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                  In Your Bag ({items.length})
                </h2>
                <Link
                  to="/cart"
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--accent)',
                    fontWeight: 600,
                  }}
                >
                  Edit
                </Link>
              </div>

              {/* Items preview list */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                        backgroundColor: 'var(--bg-subtle)',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.name}
                      </p>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Qty: {item.quantity} • {item.variant}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-hairline)',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Subtotal</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Delivery ({selectedDelivery.name})</span>
                  <span>
                    {selectedDelivery.price === 0
                      ? 'FREE'
                      : `₱${selectedDelivery.price.toFixed(2)}`}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Estimated Tax</span>
                  <span>₱{tax.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.1875rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-hairline)',
                  }}
                >
                  <span>Total Due</span>
                  <span>₱{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '20px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                <ShieldCheck size={16} color="var(--success)" />
                <span>Zero-risk guarantee • 30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
