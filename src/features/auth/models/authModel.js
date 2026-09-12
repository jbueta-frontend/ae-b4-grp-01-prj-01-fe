// Requires format: something@domain.tld (at least one dot after @)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateAuthForm = ({
  email,
  password,
  confirmPassword,
  name,
  isRegister,
}) => {
  const errors = {};
  if (isRegister) {
    if (typeof name === 'string' && !name.trim()) {
      errors.name = 'Please enter your full name.';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }
  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please enter a valid email address (e.g. name@example.com).';
  }
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateForgotPasswordForm = ({ email }) => {
  const errors = {};
  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please enter a valid email address (e.g. name@example.com).';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
