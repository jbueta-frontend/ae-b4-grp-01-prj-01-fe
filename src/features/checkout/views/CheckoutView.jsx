import { Link } from 'react-router-dom';
import { useCheckoutViewModel } from '../viewmodels/useCheckoutViewModel';
import {
  Lock,
  ShieldCheck,
  Check,
  ArrowLeft,
  CreditCard,
  ChevronRight,
  Banknote,
  Wallet,
  Trash2,
  Plus,
  Minus,
  Edit2,
} from 'lucide-react';
import Logo from '../../../shared/components/Logo';

export default function CheckoutView() {
  const {
    currentStep,
    goToStep,
    items,
    subtotal,
    tax,
    selectedDelivery,
    shippingAddress,
    updateShipping,
    paymentMethods,
    paymentType,
    setPaymentType,
    cardData,
    updateCard,
    finalTotal,
    isProcessing,
    error,
    proceedFromShipping,
    handlePlaceOrder,
    isEditingBag,
    toggleEditBag,
    selectedItemKeys,
    toggleSelectItem,
    toggleSelectAll,
    handleRemoveSelected,
    updateQuantity,
    removeFromCart,
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
            {/* Left Form: Streamlined 2 Steps (Step 1: Shipping -> Step 2: Payment) */}
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
                    fontWeight: 600,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Step 1: Shipping Address (ERD Aligned & Auto-Profile Prefilled) */}
              <div
                className="card-clean"
                style={{
                  marginBottom: '20px',
                  border:
                    currentStep === 1
                      ? '1.5px solid var(--accent)'
                      : '1px solid var(--border-hairline)',
                  boxShadow:
                    currentStep === 1
                      ? '0 6px 20px rgba(200, 90, 50, 0.08)'
                      : 'var(--shadow-sm)',
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
                            : 'var(--accent)',
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
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>

                {currentStep === 1 ? (
                  <form onSubmit={proceedFromShipping}>
                    {/* Auto-fetched profile notification badge */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(200, 90, 50, 0.08)',
                        border: '1px solid rgba(200, 90, 50, 0.2)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem',
                        color: 'var(--accent)',
                        fontWeight: 600,
                        marginBottom: '18px',
                      }}
                    >
                      <ShieldCheck size={16} />
                      <span>
                        Name and email are pre-filled automatically from your profile.
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '14px',
                        marginBottom: '14px',
                      }}
                    >
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={shippingAddress.fullName}
                          onChange={(e) =>
                            updateShipping('fullName', e.target.value)
                          }
                          placeholder="e.g. Alexander Wright"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email Address *</label>
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
                    </div>

                    {/* ERD Address Fields */}
                    <div className="form-group">
                      <label className="form-label">Address Line 1 *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={shippingAddress.addressLine1}
                        onChange={(e) =>
                          updateShipping('addressLine1', e.target.value)
                        }
                        placeholder="House / Building No., Street Name, Barangay"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={shippingAddress.addressLine2}
                        onChange={(e) =>
                          updateShipping('addressLine2', e.target.value)
                        }
                        placeholder="Apartment, suite, unit, floor"
                      />
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '12px',
                        marginBottom: '18px',
                      }}
                    >
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={shippingAddress.city}
                          onChange={(e) =>
                            updateShipping('city', e.target.value)
                          }
                          placeholder="e.g. Quezon City"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">State / Province *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={shippingAddress.stateProvince}
                          onChange={(e) =>
                            updateShipping('stateProvince', e.target.value)
                          }
                          placeholder="e.g. Metro Manila"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Postal Code *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={shippingAddress.postalCode}
                          onChange={(e) =>
                            updateShipping('postalCode', e.target.value)
                          }
                          placeholder="e.g. 1100"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Country *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          value={shippingAddress.country}
                          onChange={(e) =>
                            updateShipping('country', e.target.value)
                          }
                          placeholder="e.g. Philippines"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      style={{
                        padding: '14px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        marginTop: '8px',
                      }}
                    >
                      <span>Continue to Payment Method</span>
                      <ChevronRight size={18} />
                    </button>
                  </form>
                ) : (
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      marginTop: '6px',
                      lineHeight: 1.5,
                    }}
                  >
                    <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {shippingAddress.fullName} ({shippingAddress.email})
                    </p>
                    <p>
                      {shippingAddress.addressLine1}
                      {shippingAddress.addressLine2
                        ? `, ${shippingAddress.addressLine2}`
                        : ''}
                    </p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.stateProvince}{' '}
                      {shippingAddress.postalCode}, {shippingAddress.country}
                    </p>
                  </div>
                )}
              </div>

              {/* Step 2: Payment Method (Including Cash on Delivery option) */}
              <div
                className="card-clean"
                style={{
                  border:
                    currentStep === 2
                      ? '1.5px solid var(--accent)'
                      : '1px solid var(--border-hairline)',
                  boxShadow:
                    currentStep === 2
                      ? '0 6px 20px rgba(200, 90, 50, 0.08)'
                      : 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: currentStep === 2 ? '20px' : '0',
                  }}
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor:
                        currentStep === 2
                          ? 'var(--accent)'
                          : 'var(--bg-muted)',
                      color:
                        currentStep === 2 ? '#FFFFFF' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                    }}
                  >
                    2
                  </span>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                    Payment Method
                  </h3>
                </div>

                {currentStep === 2 && (
                  <div>
                    {/* Payment Type Switcher */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '10px',
                        marginBottom: '24px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setPaymentType('card')}
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${paymentType === 'card' ? 'var(--accent)' : '#D4CCC4'}`,
                          backgroundColor:
                            paymentType === 'card'
                              ? 'var(--accent-light)'
                              : '#FFFFFF',
                          color:
                            paymentType === 'card'
                              ? 'var(--accent)'
                              : 'var(--text-main)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '6px',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          textAlign: 'left',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                          }}
                        >
                          <CreditCard size={18} />
                          <span>Credit / Debit Card</span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          Visa, Mastercard, JCB
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('cod')}
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${paymentType === 'cod' ? 'var(--accent)' : '#D4CCC4'}`,
                          backgroundColor:
                            paymentType === 'cod'
                              ? 'var(--accent-light)'
                              : '#FFFFFF',
                          color:
                            paymentType === 'cod'
                              ? 'var(--accent)'
                              : 'var(--text-main)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '6px',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          textAlign: 'left',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                          }}
                        >
                          <Banknote size={18} />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          Pay cash upon parcel arrival
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('ewallet')}
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${paymentType === 'ewallet' ? 'var(--accent)' : '#D4CCC4'}`,
                          backgroundColor:
                            paymentType === 'ewallet'
                              ? 'var(--accent-light)'
                              : '#FFFFFF',
                          color:
                            paymentType === 'ewallet'
                              ? 'var(--accent)'
                              : 'var(--text-main)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '6px',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          textAlign: 'left',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                          }}
                        >
                          <Wallet size={18} />
                          <span>GCash / Maya</span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          Scan QR or mobile wallet
                        </span>
                      </button>
                    </div>

                    {/* Card Payment Form */}
                    {paymentType === 'card' && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '18px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-hairline)',
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

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={cardData.name}
                            onChange={(e) =>
                              updateCard('name', e.target.value)
                            }
                            placeholder="Alexander Wright"
                          />
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                          }}
                        >
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Expires (MM/YY)</label>
                            <input
                              type="text"
                              className="form-input"
                              value={cardData.expiry}
                              onChange={(e) =>
                                updateCard('expiry', e.target.value)
                              }
                              placeholder="09/28"
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">CVC / Security Code</label>
                            <input
                              type="text"
                              className="form-input"
                              value={cardData.cvc}
                              onChange={(e) =>
                                updateCard('cvc', e.target.value)
                              }
                              placeholder="741"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cash on Delivery Configuration Notice */}
                    {paymentType === 'cod' && (
                      <div
                        style={{
                          padding: '20px',
                          backgroundColor: '#FAF7F5',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid #D4CCC4',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: 'var(--text-main)',
                            fontWeight: 700,
                          }}
                        >
                          <Banknote size={22} color="var(--accent)" />
                          <span style={{ fontSize: '1.0625rem' }}>
                            Cash on Delivery Selected
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.6,
                          }}
                        >
                          You will pay the courier in cash upon arrival of your package.
                          Please ensure that an authorized recipient is present at the
                          delivery address with the exact amount.
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.8125rem',
                            color: 'var(--success)',
                            fontWeight: 700,
                          }}
                        >
                          <Check size={16} strokeWidth={3} />
                          <span>Zero additional COD convenience or collection fees!</span>
                        </div>
                      </div>
                    )}

                    {/* E-Wallet Notice */}
                    {paymentType === 'ewallet' && (
                      <div
                        style={{
                          padding: '20px',
                          backgroundColor: '#FAF7F5',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid #D4CCC4',
                        }}
                      >
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.6,
                          }}
                        >
                          Upon placing the order, you will receive an instant QR code
                          or authorization prompt for your registered GCash or Maya wallet.
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
                        fontWeight: 700,
                        boxShadow: '0 4px 16px rgba(200, 90, 50, 0.35)',
                      }}
                    >
                      <Lock size={18} />
                      <span>
                        {isProcessing
                          ? 'Authorizing Order...'
                          : paymentType === 'cod'
                            ? `Confirm Order with Cash on Delivery — ₱${finalTotal.toFixed(2)}`
                            : `Place Order — ₱${finalTotal.toFixed(2)}`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sticky Order Summary with In-Place Edit & Prominent Monetary Typography */}
            <div
              className="card-clean"
              style={{
                position: 'sticky',
                top: '24px',
                border: '1px solid #D4CCC4',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Header with Interactive Edit Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--border-hairline)',
                }}
              >
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  In Your Bag ({items.length})
                </h2>
                <button
                  type="button"
                  onClick={toggleEditBag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.875rem',
                    color: isEditingBag ? 'var(--text-main)' : 'var(--accent)',
                    fontWeight: 700,
                    background: isEditingBag ? 'var(--bg-subtle)' : 'transparent',
                    border: isEditingBag ? '1px solid #D4CCC4' : 'none',
                    padding: isEditingBag ? '4px 12px' : '4px 0',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Edit2 size={14} />
                  <span>{isEditingBag ? 'Done' : 'Edit'}</span>
                </button>
              </div>

              {/* In-Place Editing Bulk Actions Bar */}
              {isEditingBag && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: '#FAF7F5',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '14px',
                    border: '1px solid #E4DDD6',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        items.length > 0 &&
                        selectedItemKeys.length === items.length
                      }
                      onChange={toggleSelectAll}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: 'var(--accent)',
                        cursor: 'pointer',
                      }}
                    />
                    <span>Select All</span>
                  </label>

                  {selectedItemKeys.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRemoveSelected}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#DC2626',
                        backgroundColor: 'rgba(220, 38, 38, 0.08)',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Delete ({selectedItemKeys.length})</span>
                    </button>
                  )}
                </div>
              )}

              {/* Items List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  marginBottom: '20px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {items.map((item) => {
                  const itemKey = `${item.id}-${item.variant}`;
                  const isSelected = selectedItemKeys.includes(itemKey);

                  return (
                    <div
                      key={itemKey}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        padding: isEditingBag ? '8px' : '4px 0',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor:
                          isEditingBag && isSelected
                            ? 'rgba(200, 90, 50, 0.04)'
                            : 'transparent',
                        border:
                          isEditingBag && isSelected
                            ? '1px solid rgba(200, 90, 50, 0.3)'
                            : '1px solid transparent',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* Multi-select checkbox displayed when editing */}
                      {isEditingBag && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(itemKey)}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: 'var(--accent)',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                          aria-label={`Select ${item.name}`}
                        />
                      )}

                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-hairline)',
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'var(--text-main)',
                          }}
                        >
                          {item.name}
                        </p>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            display: 'block',
                            marginTop: '2px',
                          }}
                        >
                          {item.variant}
                        </span>

                        {/* Interactive Quantity Stepper when in Edit Mode */}
                        {isEditingBag ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginTop: '6px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #D4CCC4',
                              borderRadius: 'var(--radius-sm)',
                              padding: '2px 4px',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.variant,
                                  item.quantity - 1
                                )
                              }
                              style={{
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: 'var(--text-main)',
                              }}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span
                              style={{
                                fontSize: '0.8125rem',
                                fontWeight: 800,
                                minWidth: '18px',
                                textAlign: 'center',
                                fontVariantNumeric: 'tabular-nums',
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.variant,
                                  item.quantity + 1
                                )
                              }
                              style={{
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: 'var(--text-main)',
                              }}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(item.id, item.variant)
                              }
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--text-light)',
                                cursor: 'pointer',
                                padding: '2px 4px',
                                marginLeft: '4px',
                              }}
                              title="Delete item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              display: 'block',
                              marginTop: '2px',
                            }}
                          >
                            Qty: {item.quantity}
                          </span>
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 800,
                          color: 'var(--text-main)',
                          fontVariantNumeric: 'tabular-nums',
                          flexShrink: 0,
                        }}
                      >
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 5. Clearly Visible Monetary Breakdown (Crucial UX) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-hairline)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    ₱{subtotal.toFixed(2)}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    Carbon-Neutral Delivery
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      color: '#16A34A',
                      backgroundColor: 'rgba(22, 163, 74, 0.1)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    FREE
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    Estimated Sales Tax (8%)
                  </span>
                  <span
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    ₱{tax.toFixed(2)}
                  </span>
                </div>

                {/* Prominently Highlighted Total Due Box */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#FAF7F5',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #E4DDD6',
                    marginTop: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    TOTAL DUE
                  </span>
                  <span
                    style={{
                      fontSize: '1.625rem',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      letterSpacing: '-0.02em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    ₱{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Reassuring Trust Pillars */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  marginTop: '18px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-hairline)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="var(--accent)" />
                  <span>Buyer Protection</span>
                </div>
                <span>•</span>
                <div>30-Day Free Returns</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
