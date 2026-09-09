/**
 * Centralized API & Authentication Error Handler
 * Translates HTTP status codes, network errors, and backend payloads
 * into clear, user-friendly, actionable messages.
 */

export function getAuthErrorMessage(err, context = 'login') {
  if (!err) {
    return context === 'login'
      ? 'Authentication failed. Please verify your credentials.'
      : 'Registration failed. Please try again.';
  }

  // 0. Handle string input
  if (typeof err === 'string') {
    const lower = err.trim().toLowerCase();
    if (
      !['unauthorized', 'not found', 'bad request', 'error', 'failed'].includes(
        lower
      )
    ) {
      return err;
    }
  }

  // 1. Check if backend returned a specific, readable message string
  const rawBackendMessage =
    (typeof err?.message === 'string' &&
      err.message !== 'Network Error' &&
      !err.message.includes('status code') &&
      err.message) ||
    (typeof err?.error === 'string' && err.error) ||
    (typeof err?.data?.message === 'string' && err.data.message) ||
    (typeof err?.response?.data?.message === 'string' &&
      err.response.data.message) ||
    (typeof err?.response?.data?.error === 'string' && err.response.data.error);

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
    !genericPhrases.includes(rawBackendMessage.trim().toLowerCase())
  ) {
    return rawBackendMessage;
  }

  // 2. Check for backend array of validation errors (e.g. express-validator / Zod)
  const validationErrors = err?.errors || err?.response?.data?.errors;
  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    const first = validationErrors[0];
    if (typeof first === 'string') return first;
    if (first?.msg) return first.msg;
    if (first?.message) return first.message;
  }

  // 3. Check HTTP Status Codes
  const status =
    err?.response?.status ||
    err?.status ||
    (typeof err?.statusCode === 'number' ? err.statusCode : null);

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
  return context === 'login'
    ? 'Unable to sign in. Please verify your email and password.'
    : 'Registration could not be completed. Please review your details and try again.';
}
