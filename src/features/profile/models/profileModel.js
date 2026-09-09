/**
 * Profile Model & Validation Schema
 * Represents complete user domain entities and validation rules
 */

export const INITIAL_PROFILE_STATE = {
  personal: {
    id: 'usr_88291',
    name: 'Kyle Santos',
    displayName: 'kyle',
    email: 'kyle.user@example.com',
    phone: '+63 917 555 1234',
    birthDate: '1996-05-14',
    gender: 'Male',
    bio: 'Collector of heirloom wooden toys, artisanal puzzles, and Montessori learning materials.',
    role: 'Verified Customer',
    createdAt: 'March 2024',
    avatarUrl: null,
  },
  address: {
    recipientName: 'Kyle Santos',
    phone: '+63 917 555 1234',
    street: '123 Ayala Avenue, Unit 14B',
    unit: 'Tower 2, Legaspi Village',
    city: 'Makati City',
    province: 'Metro Manila',
    postalCode: '1226',
    country: 'Philippines',
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: '2 months ago',
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
  if (!data.phone || data.phone.trim().length < 7) {
    errors.phone = 'Please provide a valid contact number.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate delivery address fields
 */
export function validateAddress(data) {
  const errors = {};
  if (!data.recipientName || data.recipientName.trim().length < 2) {
    errors.recipientName = 'Recipient name is required.';
  }
  if (!data.street || data.street.trim().length < 5) {
    errors.street = 'Complete street address is required.';
  }
  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City / Municipality is required.';
  }
  if (!data.province || data.province.trim().length < 2) {
    errors.province = 'Province / Region is required.';
  }
  if (!data.postalCode || data.postalCode.trim().length < 4) {
    errors.postalCode = 'Valid postal code is required.';
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
