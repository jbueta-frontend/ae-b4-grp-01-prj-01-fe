/**
 * Centralized API & Authentication Error Handler
 * Translates HTTP status codes, network errors, and backend payloads
 * into clear, user-friendly, actionable messages.
 */

// Helper to safely extract a non-empty string and reject [object Object] artifacts
function cleanString(val) {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  // Reject raw Javascript object serialization artifacts
  if (
    trimmed.toLowerCase().includes('[object') ||
    trimmed.includes('status code')
  ) {
    return null;
  }
  return trimmed;
}

export function getAuthErrorMessage(err, context = 'login') {
  if (!err) {
    return context === 'login'
      ? 'Authentication failed. Please verify your credentials.'
      : 'Registration failed. Please try again.';
  }

  // 0. Handle raw string input safely
  if (typeof err === 'string') {
    const cleaned = cleanString(err);
    const genericPhrases = [
      'unauthorized',
      'bad request',
      'not found',
      'forbidden',
      'internal server error',
      'error',
      'failed',
      'request failed',
    ];
    if (cleaned && !genericPhrases.includes(cleaned.toLowerCase())) {
      return cleaned;
    }
  }

  // 1. Check if backend returned a specific readable message
  // Backend format: { success: false, error: { code: "UNAUTHORIZED", message: "Invalid email or password" } }
  const rawBackendMessage =
    cleanString(err?.error?.message) ||
    cleanString(err?.response?.data?.error?.message) ||
    cleanString(err?.response?.data?.message) ||
    cleanString(err?.data?.message) ||
    cleanString(err?.data?.error?.message) ||
    cleanString(typeof err?.error === 'string' ? err.error : null) ||
    cleanString(err?.message);

  const genericPhrases = [
    'unauthorized',
    'bad request',
    'not found',
    'forbidden',
    'internal server error',
    'error',
    'failed',
    'request failed',
  ];

  if (
    rawBackendMessage &&
    !genericPhrases.includes(rawBackendMessage.toLowerCase())
  ) {
    return rawBackendMessage;
  }

  // 2. Check for backend array of validation errors (e.g. express-validator / Zod)
  const validationErrors =
    err?.errors ||
    err?.error?.details ||
    err?.response?.data?.errors ||
    err?.response?.data?.error?.details;

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    const first = validationErrors[0];
    if (typeof first === 'string') {
      const cleaned = cleanString(first);
      if (cleaned) return cleaned;
    }
    if (first?.msg) {
      const cleaned = cleanString(first.msg);
      if (cleaned) return cleaned;
    }
    if (first?.message) {
      const cleaned = cleanString(first.message);
      if (cleaned) return cleaned;
    }
  }

  // 3. Extract HTTP status code or backend error code
  const errorCode =
    err?.code ||
    err?.error?.code ||
    err?.response?.data?.code ||
    err?.response?.data?.error?.code;

  if (errorCode === 'EMAIL_NOT_VERIFIED') {
    return 'Your email is not verified yet. Please check your inbox.';
  }

  const status =
    err?.response?.status ||
    err?.status ||
    (typeof err?.statusCode === 'number' ? err.statusCode : null) ||
    (typeof err?.error?.status === 'number' ? err.error.status : null) ||
    (err?.error?.code === 'UNAUTHORIZED' ? 401 : null) ||
    (err?.error?.code === 'NOT_FOUND' ? 404 : null) ||
    (err?.error?.code === 'CONFLICT' ? 409 : null);

  if (status === 403) {
    return 'Your email is not verified yet. Please check your inbox.';
  }

  if (status === 401) {
    return context === 'login'
      ? 'Incorrect email or password. Please double-check your credentials and try again.'
      : 'Unauthorized access. Please sign in again.';
  }

  if (status === 404) {
    return 'No account was found with this email. Please check your email address or register for a new account.';
  }

  if (status === 409) {
    return 'An account with this email address already exists. Please sign in instead.';
  }

  if (status === 422 || status === 400) {
    return context === 'register'
      ? 'Please provide a valid full name, email address, and a password with at least 8 characters.'
      : 'Invalid credentials format. Please ensure your email and password meet the requirements.';
  }

  if (status === 429) {
    return 'Too many sign-in attempts. For your security, please wait a few moments before trying again.';
  }

  if (status >= 500) {
    return 'The authentication server encountered an issue. Please try again in a few moments.';
  }

  // 4. Network and Connection Failures
  const isNetworkFailure =
    err?.code === 'ERR_NETWORK' ||
    err?.message === 'Network Error' ||
    (!err?.response && !status);

  if (isNetworkFailure) {
    return 'Unable to connect to the authentication server. Please check your internet connection or verify that the backend API is online.';
  }

  // 5. Contextual Fallback
  if (context === 'verify') {
    return 'Verification link is invalid or has expired. Please request a new verification link.';
  }
  if (context === 'resend') {
    return 'Unable to resend verification email. Please try again.';
  }
  return context === 'login'
    ? 'Incorrect email or password. Please double-check your credentials and try again.'
    : 'Registration could not be completed. Please review your details and try again.';
}

/**
 * Universal safe error message extractor that guarantees a string return value.
 * Prevents objects like { code, message } from ever being rendered directly in React.
 */
export function getErrorMessage(err, fallback = 'An unexpected error occurred') {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  if (typeof err?.message === 'string') return err.message;
  if (typeof err?.error?.message === 'string') return err.error.message;
  if (typeof err?.error === 'string') return err.error;
  if (typeof err?.response?.data?.message === 'string') return err.response.data.message;
  if (typeof err?.response?.data?.error?.message === 'string') return err.response.data.error.message;
  if (typeof err?.data?.message === 'string') return err.data.message;
  if (typeof err?.data?.error?.message === 'string') return err.data.error.message;
  if (typeof err?.code === 'string') return err.code;
  if (typeof err?.error?.code === 'string') return err.error.code;
  return fallback;
}

