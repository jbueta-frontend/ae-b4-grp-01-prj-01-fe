import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './shared/components/ErrorBoundary';

// Synchronously intercept auth recovery & verification links BEFORE React router mounts
(function handlePreMountAuthRedirect() {
  try {
    const rawHash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(rawHash);
    const searchParams = new URLSearchParams(window.location.search);

    const type = (
      hashParams.get('type') ||
      searchParams.get('type') ||
      ''
    ).toLowerCase();

    const isRecovery =
      type === 'recovery' ||
      type === 'reset' ||
      rawHash.toLowerCase().includes('type=recovery') ||
      rawHash.toLowerCase().includes('type=reset') ||
      window.location.search.toLowerCase().includes('type=recovery') ||
      window.location.search.toLowerCase().includes('type=reset') ||
      sessionStorage.getItem('fiddlemania_auth_action') === 'forgot_password';

    if (isRecovery) {
      const token =
        hashParams.get('access_token') ||
        hashParams.get('token') ||
        hashParams.get('token_hash') ||
        searchParams.get('token') ||
        searchParams.get('token_hash') ||
        searchParams.get('access_token') ||
        searchParams.get('code') ||
        '';

      sessionStorage.removeItem('fiddlemania_auth_action');
      if (token) {
        sessionStorage.setItem('fiddlemania_recovery_token', token);
      }

      const forwardParams = new URLSearchParams();
      if (token) forwardParams.set('token', token);
      forwardParams.set('type', 'recovery');

      const targetPath = `/reset-password?${forwardParams.toString()}${window.location.hash ? window.location.hash : ''}`;
      if (
        window.location.pathname !== '/reset-password' &&
        window.location.pathname !== '/resetPassword'
      ) {
        window.history.replaceState(null, '', targetPath);
      }
      return;
    }

    const isSignup =
      type === 'signup' ||
      type === 'email_verification' ||
      type === 'invite' ||
      rawHash.toLowerCase().includes('type=signup') ||
      rawHash.toLowerCase().includes('type=email_verification') ||
      searchParams.get('isEmailVerified') === 'true' ||
      searchParams.get('verified') === 'true';

    const verificationToken =
      searchParams.get('token') ||
      searchParams.get('token_hash') ||
      hashParams.get('access_token') ||
      searchParams.get('access_token');

    if (
      (isSignup || (verificationToken && !isRecovery)) &&
      window.location.pathname !== '/login'
    ) {
      const email =
        searchParams.get('email') || hashParams.get('email') || '';
      const forwardParams = new URLSearchParams();
      forwardParams.set('verified', 'true');
      if (verificationToken) forwardParams.set('token', verificationToken);
      if (email) forwardParams.set('email', email);

      const targetPath = `/login?${forwardParams.toString()}${window.location.hash ? window.location.hash : ''}`;
      window.history.replaceState(null, '', targetPath);
    }
  } catch {
    // Fail-safe
  }
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
