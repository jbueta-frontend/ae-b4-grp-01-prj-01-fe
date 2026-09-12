import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Edit3,
  Check,
  X,
  Lock,
  Mail,
  Phone,
  Calendar,
  KeyRound,
  Trash2,
  PowerOff,
  Package,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';

export default function ProfileView() {
  const vm = useProfileViewModel();

  if (!vm.isAuthenticated) {
    return (
      <div
        className="container-narrow"
        style={{
          padding: '100px 20px',
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Lock size={28} />
        </div>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '10px',
            color: 'var(--text-main)',
          }}
        >
          Account Login Required
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            marginBottom: '28px',
            maxWidth: '420px',
          }}
        >
          Please log in to manage your personal details, shipping addresses,
          security settings, and order history.
        </p>
        <Link
          to="/login"
          className="btn btn-primary"
          style={{ height: '48px', padding: '0 32px' }}
        >
          Sign In to Your Account
        </Link>
      </div>
    );
  }

  const initial =
    vm.personalData.name?.charAt(0).toUpperCase() ||
    vm.personalData.email?.charAt(0).toUpperCase() ||
    'U';

  return (
    <div style={{ padding: '40px 0 90px', backgroundColor: 'var(--bg-page)' }}>
      <div className="container-narrow">
        {/* Toast Notification Alert */}
        {vm.notification && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor:
                vm.notification.type === 'success'
                  ? 'rgba(22, 163, 74, 0.1)'
                  : 'rgba(220, 38, 38, 0.1)',
              color: vm.notification.type === 'success' ? '#16A34A' : '#DC2626',
              border: `1px solid ${vm.notification.type === 'success'
                ? 'rgba(22, 163, 74, 0.25)'
                : 'rgba(220, 38, 38, 0.25)'
                }`,
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            <span>{vm.notification.message}</span>
            <button
              onClick={vm.clearNotification}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                display: 'flex',
              }}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Profile Header Hero Card */}
        <div
          className="card-clean"
          style={{
            marginBottom: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.625rem',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(200, 90, 50, 0.18)',
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <h1
                  style={{
                    fontSize: '1.375rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                  }}
                >
                  {vm.personalData.name}
                </h1>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    color: '#16A34A',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {vm.personalData.role}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                }}
              >
                @{vm.personalData.displayName} • {vm.personalData.email}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/orders"
              className="btn btn-outline btn-sm"
              style={{
                height: '40px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <Package size={16} color="var(--accent)" />
              <span>Order History</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '28px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {[
            { id: 'personal', label: 'Personal Information', icon: User },
            { id: 'address', label: 'Delivery Address', icon: MapPin },
            { id: 'security', label: 'Login & Security', icon: ShieldCheck },
            { id: 'account', label: 'Account Management', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = vm.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => vm.setActiveTab(tab.id)}
                type="button"
                style={{
                  height: '44px',
                  padding: '0 18px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive
                    ? '1.5px solid var(--accent)'
                    : '1px solid var(--border-hairline)',
                  backgroundColor: isActive
                    ? 'var(--accent)'
                    : 'var(--bg-card)',
                  color: isActive ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ----------------- TAB 1: PERSONAL INFORMATION ----------------- */}
        {vm.activeTab === 'personal' && (
          <div className="card-clean">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-hairline)',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800 }}>
                  Personal Information
                </h2>
                <p
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}
                >
                  Your basic contact and identification details.
                </p>
              </div>

              {!vm.isEditingPersonal && (
                <button
                  type="button"
                  onClick={() => vm.setIsEditingPersonal(true)}
                  className="btn btn-outline btn-sm"
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Edit3 size={15} />
                  <span>Edit Details</span>
                </button>
              )}
            </div>

            {vm.isEditingPersonal ? (
              <form onSubmit={vm.handleSavePersonal}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '18px',
                    marginBottom: '20px',
                  }}
                >
                  {/* Full Name */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.personalDraft.name}
                      onChange={(e) =>
                        vm.handlePersonalChange('name', e.target.value)
                      }
                      placeholder="e.g. Kyle Santos"
                    />
                    {vm.personalErrors.name && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.personalErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Display Name */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Display Name / Username
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.personalDraft.displayName}
                      onChange={(e) =>
                        vm.handlePersonalChange('displayName', e.target.value)
                      }
                      placeholder="e.g. kyle"
                    />
                    {vm.personalErrors.displayName && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.personalErrors.displayName}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Primary Email</label>
                    <input
                      type="email"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.personalDraft.email}
                      onChange={(e) =>
                        vm.handlePersonalChange('email', e.target.value)
                      }
                      placeholder="name@example.com"
                    />
                    {vm.personalErrors.email && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.personalErrors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Mobile Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.personalDraft.phone}
                      onChange={(e) =>
                        vm.handlePersonalChange('phone', e.target.value)
                      }
                      placeholder="+63 917 555 1234"
                    />
                    {vm.personalErrors.phone && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.personalErrors.phone}
                      </span>
                    )}
                  </div>

                  {/* Birth Date */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.personalDraft.birthDate || ''}
                      onChange={(e) =>
                        vm.handlePersonalChange('birthDate', e.target.value)
                      }
                    />
                  </div>

                  {/* Gender */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Gender</label>
                    <select
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.personalDraft.gender || 'Prefer not to say'}
                      onChange={(e) =>
                        vm.handlePersonalChange('gender', e.target.value)
                      }
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">About You / Notes</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    style={{
                      height: 'auto',
                      padding: '12px',
                      fontFamily: 'inherit',
                    }}
                    value={vm.personalDraft.bio || ''}
                    onChange={(e) =>
                      vm.handlePersonalChange('bio', e.target.value)
                    }
                    placeholder="Tell us a bit about your favorite crafts and toys..."
                  />
                </div>

                {/* Balanced Save / Cancel Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ height: '48px', padding: '0 24px' }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={vm.handleCancelPersonal}
                    className="btn btn-outline"
                    style={{ height: '48px', padding: '0 20px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    Full Name
                  </span>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      marginTop: '4px',
                    }}
                  >
                    {vm.personalData.name}
                  </p>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    Display Name
                  </span>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      marginTop: '4px',
                    }}
                  >
                    @{vm.personalData.displayName}
                  </p>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    Email Address
                  </span>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      marginTop: '4px',
                    }}
                  >
                    {vm.personalData.email}
                  </p>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    Phone
                  </span>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      marginTop: '4px',
                    }}
                  >
                    {vm.personalData.phone}
                  </p>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    Date of Birth
                  </span>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      marginTop: '4px',
                    }}
                  >
                    {vm.personalData.birthDate || 'Not specified'}
                  </p>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    Gender
                  </span>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      marginTop: '4px',
                    }}
                  >
                    {vm.personalData.gender || 'Not specified'}
                  </p>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    About / Bio
                  </span>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                      lineHeight: 1.5,
                    }}
                  >
                    {vm.personalData.bio || 'No bio added yet.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB 2: SHIPPING ADDRESS ----------------- */}
        {vm.activeTab === 'address' && (
          <div className="card-clean">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-hairline)',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800 }}>
                  Primary Delivery Address
                </h2>
                <p
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}
                >
                  This address is pre-selected for fast one-click checkout and
                  carbon-neutral deliveries.
                </p>
              </div>

              {!vm.isEditingAddress && (
                <button
                  type="button"
                  onClick={() => vm.setIsEditingAddress(true)}
                  className="btn btn-outline btn-sm"
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Edit3 size={15} />
                  <span>Edit Address</span>
                </button>
              )}
            </div>

            {vm.isEditingAddress ? (
              <form onSubmit={vm.handleSaveAddress}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '18px',
                    marginBottom: '24px',
                  }}
                >
                  {/* Recipient */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Recipient Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.addressDraft.recipientName}
                      onChange={(e) =>
                        vm.handleAddressChange('recipientName', e.target.value)
                      }
                      placeholder="e.g. Maria Santos"
                    />
                    {vm.addressErrors.recipientName && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.addressErrors.recipientName}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Delivery Contact Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.addressDraft.phone}
                      onChange={(e) =>
                        vm.handleAddressChange('phone', e.target.value)
                      }
                      placeholder="+63 917 555 1234"
                    />
                    {vm.addressErrors.phone && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.addressErrors.phone}
                      </span>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div
                    className="form-group"
                    style={{ marginBottom: 0, gridColumn: '1 / -1' }}
                  >
                    <label className="form-label">
                      Address Line 1 (Street Address & Building / House No.)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.addressDraft.addressLine1}
                      onChange={(e) =>
                        vm.handleAddressChange('addressLine1', e.target.value)
                      }
                      placeholder="e.g. 123 Ayala Avenue"
                    />
                    {vm.addressErrors.addressLine1 && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.addressErrors.addressLine1}
                      </span>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Address Line 2 (Unit, Floor, Building, Landmark - Optional)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.addressDraft.addressLine2}
                      onChange={(e) =>
                        vm.handleAddressChange('addressLine2', e.target.value)
                      }
                      placeholder="e.g. Unit 14B, Tower 2"
                    />
                  </div>

                  {/* City */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">City / Municipality</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.addressDraft.city}
                      onChange={(e) =>
                        vm.handleAddressChange('city', e.target.value)
                      }
                      placeholder="e.g. Makati City"
                    />
                    {vm.addressErrors.city && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.addressErrors.city}
                      </span>
                    )}
                  </div>

                  {/* State / Province */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">State / Province / Region</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.addressDraft.stateProvince}
                      onChange={(e) =>
                        vm.handleAddressChange('stateProvince', e.target.value)
                      }
                      placeholder="e.g. Metro Manila"
                    />
                    {vm.addressErrors.stateProvince && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.addressErrors.stateProvince}
                      </span>
                    )}
                  </div>

                  {/* Postal Code (Integer numbers only) */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.addressDraft.postalCode}
                      onChange={(e) =>
                        vm.handleAddressChange('postalCode', e.target.value)
                      }
                      placeholder="e.g. 1226"
                    />
                    {vm.addressErrors.postalCode && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.addressErrors.postalCode}
                      </span>
                    )}
                  </div>

                  {/* Country */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.addressDraft.country}
                      onChange={(e) =>
                        vm.handleAddressChange('country', e.target.value)
                      }
                    />
                    {vm.addressErrors.country && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.addressErrors.country}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ height: '48px', padding: '0 24px' }}
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={vm.handleCancelAddress}
                    className="btn btn-outline"
                    style={{ height: '48px', padding: '0 20px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : vm.addressData.addressLine1 ? (
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-hairline)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px',
                  }}
                >
                  <MapPin size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {vm.addressData.recipientName || 'Primary Address'}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    Default
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.6,
                  }}
                >
                  {vm.addressData.addressLine1}
                  {vm.addressData.addressLine2 ? `, ${vm.addressData.addressLine2}` : ''}
                  <br />
                  {vm.addressData.city}, {vm.addressData.stateProvince}{' '}
                  {vm.addressData.postalCode}
                  <br />
                  {vm.addressData.country}
                </p>
                {vm.addressData.phone && (
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      marginTop: '8px',
                    }}
                  >
                    Phone: {vm.addressData.phone}
                  </p>
                )}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '32px 24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-hairline)',
                  textAlign: 'center',
                }}
              >
                <MapPin size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
                  No Primary Delivery Address Saved
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  Add your delivery details to enable quick checkout for your heirloom toys.
                </p>
                <button
                  type="button"
                  onClick={() => vm.setIsEditingAddress(true)}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 20px' }}
                >
                  Add Delivery Address
                </button>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB 3: LOGIN & SECURITY ----------------- */}
        {vm.activeTab === 'security' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Change Password Card */}
            <div className="card-clean">
              <div
                style={{
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-hairline)',
                  marginBottom: '20px',
                }}
              >
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800 }}>
                  Change Password
                </h2>
                <p
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}
                >
                  Use a strong, unique password with at least 8 characters to
                  protect your account.
                </p>
              </div>

              <form onSubmit={vm.handlePasswordChange}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '18px',
                    marginBottom: '20px',
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.passwordForm.currentPassword}
                      onChange={(e) =>
                        vm.setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="••••••••"
                    />
                    {vm.passwordErrors.currentPassword && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.passwordErrors.currentPassword}
                      </span>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.passwordForm.newPassword}
                      onChange={(e) =>
                        vm.setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      placeholder="Min. 8 characters"
                    />
                    {vm.passwordErrors.newPassword && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.passwordErrors.newPassword}
                      </span>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.passwordForm.confirmPassword}
                      onChange={(e) =>
                        vm.setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="Repeat new password"
                    />
                    {vm.passwordErrors.confirmPassword && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.passwordErrors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ height: '48px', padding: '0 24px' }}
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Change Email Card */}
            <div className="card-clean">
              <div
                style={{
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-hairline)',
                  marginBottom: '20px',
                }}
              >
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800 }}>
                  Modify Primary Email
                </h2>
                <p
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}
                >
                  Current active email: <strong>{vm.personalData.email}</strong>
                </p>
              </div>

              <form onSubmit={vm.handleEmailChange}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '18px',
                    marginBottom: '20px',
                  }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">New Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.emailForm.newEmail}
                      onChange={(e) =>
                        vm.setEmailForm((prev) => ({
                          ...prev,
                          newEmail: e.target.value,
                        }))
                      }
                      placeholder="new.email@example.com"
                    />
                    {vm.emailErrors.newEmail && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.emailErrors.newEmail}
                      </span>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">
                      Verify Current Password
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      style={{ height: '48px' }}
                      value={vm.emailForm.passwordConfirm}
                      onChange={(e) =>
                        vm.setEmailForm((prev) => ({
                          ...prev,
                          passwordConfirm: e.target.value,
                        }))
                      }
                      placeholder="Enter password to authorize"
                    />
                    {vm.emailErrors.passwordConfirm && (
                      <span
                        style={{
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          display: 'block',
                        }}
                      >
                        {vm.emailErrors.passwordConfirm}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{ height: '48px', padding: '0 24px' }}
                >
                  Save New Email
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: ACCOUNT MANAGEMENT (DEACTIVATE & DELETE) ----------------- */}
        {vm.activeTab === 'account' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Temporary Deactivation */}
            <div className="card-clean">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <PowerOff size={22} color="var(--accent)" />
                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800 }}>
                  Deactivate Account
                </h2>
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                }}
              >
                Temporarily pause your account. Your order history, shipping
                itineraries, and saved preferences are preserved safely. You can
                reactivate anytime by signing back in with your credentials.
              </p>
              <button
                type="button"
                onClick={() => vm.setShowDeactivateModal(true)}
                className="btn btn-outline"
                style={{
                  height: '44px',
                  padding: '0 20px',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                }}
              >
                Deactivate My Account
              </button>
            </div>

            {/* Permanent Account Deletion */}
            <div
              className="card-clean"
              style={{
                border: '1px solid rgba(220, 38, 38, 0.3)',
                backgroundColor: 'rgba(220, 38, 38, 0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <Trash2 size={22} color="#DC2626" />
                <h2
                  style={{
                    fontSize: '1.1875rem',
                    fontWeight: 800,
                    color: '#DC2626',
                  }}
                >
                  Delete Account (Danger Zone)
                </h2>
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                }}
              >
                Permanently purge your account, transaction records, saved
                delivery addresses, and profile data from our databases. This
                action is permanent and cannot be reversed.
              </p>
              <button
                type="button"
                onClick={() => vm.setShowDeleteModal(true)}
                className="btn"
                style={{
                  height: '44px',
                  padding: '0 20px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                }}
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        )}

        {/* ----------------- MODAL: DEACTIVATE CONFIRMATION ----------------- */}
        {vm.showDeactivateModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <div
              className="card-clean"
              style={{ maxWidth: '440px', width: '100%', padding: '32px' }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <PowerOff size={24} />
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
              >
                Deactivate Your Account?
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  marginBottom: '24px',
                }}
              >
                You will be logged out immediately. Your profile and orders will
                remain intact and can be restored when you sign in again.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={vm.handleConfirmDeactivate}
                  className="btn btn-primary"
                  style={{ flex: 1, height: '48px' }}
                >
                  Yes, Deactivate
                </button>
                <button
                  onClick={() => vm.setShowDeactivateModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1, height: '48px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- MODAL: PERMANENT DELETE CONFIRMATION ----------------- */}
        {vm.showDeleteModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >
            <div
              className="card-clean"
              style={{ maxWidth: '480px', width: '100%', padding: '32px' }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(220, 38, 38, 0.12)',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <ShieldAlert size={26} />
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  color: '#DC2626',
                  marginBottom: '10px',
                }}
              >
                Confirm Account Destruction
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  marginBottom: '20px',
                }}
              >
                This action is irreversible. All your order history, delivery
                addresses, and account profile will be permanently deleted.
              </p>
              <p
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                Type <span style={{ color: '#DC2626' }}>DELETE</span> below to
                confirm:
              </p>
              <input
                type="text"
                className="form-input"
                style={{ height: '48px', marginBottom: '24px' }}
                value={vm.deleteConfirmText}
                onChange={(e) => vm.setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={vm.handleConfirmDelete}
                  disabled={vm.deleteConfirmText !== 'DELETE'}
                  className="btn"
                  style={{
                    flex: 1,
                    height: '48px',
                    backgroundColor:
                      vm.deleteConfirmText === 'DELETE'
                        ? '#DC2626'
                        : 'var(--bg-muted)',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor:
                      vm.deleteConfirmText === 'DELETE'
                        ? 'pointer'
                        : 'not-allowed',
                    fontWeight: 700,
                  }}
                >
                  Delete Forever
                </button>
                <button
                  onClick={() => {
                    vm.setShowDeleteModal(false);
                    vm.setDeleteConfirmText('');
                  }}
                  className="btn btn-outline"
                  style={{ flex: 1, height: '48px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
