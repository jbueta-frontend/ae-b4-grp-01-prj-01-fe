/**
 * Profile Model & Validation Schema
 * Represents complete user domain entities and validation rules
 */

export const INITIAL_PROFILE_STATE = {
  personal: {
    id: '',
    name: '',
    displayName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    bio: '',
    role: 'Customer',
    createdAt: '',
    avatarUrl: null,
  },
  address: {
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'Philippines',
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '',
  },
};

/**
 * Validate personal info fields
 */
export function validatePersonal(data) {
  const errors = {};
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }
  if (!data.displayName || data.displayName.trim().length < 2) {
    errors.displayName = 'Display name must be at least 2 characters.';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please provide a valid email address.';
  }
  if (data.phone && data.phone.trim().length > 0 && data.phone.trim().length < 7) {
    errors.phone = 'Please provide a valid contact number.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate delivery address fields (ERD Standards)
 */
export function validateAddress(data) {
  const errors = {};
  if (!data.recipientName || data.recipientName.trim().length < 2) {
    errors.recipientName = 'Recipient name is required (minimum 2 characters).';
  }
  if (!data.phone || data.phone.trim().length < 7) {
    errors.phone = 'Valid delivery contact phone number is required.';
  }
  if (!data.addressLine1 || data.addressLine1.trim().length < 5) {
    errors.addressLine1 = 'Street address (Address Line 1) is required (minimum 5 characters).';
  }
  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City / Municipality is required.';
  }
  if (!data.stateProvince || data.stateProvince.trim().length < 2) {
    errors.stateProvince = 'Province / State is required.';
  }
  const rawPostal = data.postalCode != null ? String(data.postalCode).trim() : '';
  if (!rawPostal) {
    errors.postalCode = 'Postal code is required.';
  } else if (!/^\d+$/.test(rawPostal)) {
    errors.postalCode = 'Postal code can only contain numbers (integers only).';
  } else if (rawPostal.length < 4 || rawPostal.length > 6) {
    errors.postalCode = 'Postal code must be between 4 and 6 digits.';
  }
  if (!data.country || data.country.trim().length < 2) {
    errors.country = 'Country is required.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate password change
 */
export function validatePasswordChange({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  const errors = {};
  if (!currentPassword) {
    errors.currentPassword = 'Current password is required.';
  }
  if (!newPassword || newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters long.';
  }
  if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate email change
 */
export function validateEmailChange({ newEmail, passwordConfirm }) {
  const errors = {};
  if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    errors.newEmail = 'Please provide a valid email address.';
  }
  if (!passwordConfirm) {
    errors.passwordConfirm =
      'Current password is required to verify email change.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
