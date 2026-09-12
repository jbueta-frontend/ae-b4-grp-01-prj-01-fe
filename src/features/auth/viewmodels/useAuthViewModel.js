import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { validateAuthForm, validateForgotPasswordForm } from '../models/authModel';
import { getAuthErrorMessage } from '../../../shared/utils/errorHandler';
import api from '../../../services/api';

export function useAuthViewModel(defaultTab = 'login') {
  const [tab, setTab] = useState(defaultTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Forgot Password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotErrors, setForgotErrors] = useState({});
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState(null);
  const [forgotError, setForgotError] = useState(null);

  const { user, isAuthenticated, login, register, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  // Automatically redirect active admin users to admin dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      navigate('/admin/reports', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setIsForgotPassword(false);
    setApiError(null);
    setErrors({});
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (apiError) setApiError(null);
    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (apiError) setApiError(null);
    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (apiError) setApiError(null);
    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (apiError) setApiError(null);
    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
  };

  const handleForgotEmailChange = (e) => {
    setForgotEmail(e.target.value);
    if (forgotError) setForgotError(null);
    if (forgotErrors.email) setForgotErrors((prev) => ({ ...prev, email: null }));
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError(null);
    setForgotMessage(null);

    const validation = validateForgotPasswordForm({ email: forgotEmail.trim() });
    if (!validation.isValid) {
      setForgotErrors(validation.errors);
      return;
    }

    setForgotErrors({});
    setForgotLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail.trim() });
      // Use the backend's actual message — it is intentionally neutral for security
      const msg =
        res?.data?.message ||
        res?.message ||
        'If an account exists with this email address, a password reset link has been sent. Please check your inbox.';
      setForgotMessage(msg);
    } catch (err) {
      setForgotError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Unable to process password reset request. Please check your email and try again.'
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const validation = validateAuthForm({
      name,
      email,
      password,
      confirmPassword,
      isRegister: tab === 'register',
    });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await login(email, password);
        if (res?.user?.role === 'ADMIN') {
          navigate('/admin/reports', { replace: true });
          return;
        }
      } else {
        const registrationName = name.trim() || email.split('@')[0];
        const res = await register(email, password, registrationName);
        if (res?.user?.role === 'ADMIN') {
          navigate('/admin/reports', { replace: true });
          return;
        }
        // After registration, redirect to verify-email instructions page
        navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true });
        return;
      }
      navigate(redirectPath);
    } catch (err) {
      // Detect unverified email: backend may return 403 or a message containing 'verif'
      const status = err?.response?.status || err?.status;
      const backendMsg = (
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        ''
      ).toLowerCase();
      const backendCode = (
        err?.response?.data?.error?.code ||
        err?.error?.code ||
        ''
      ).toLowerCase();

      const isUnverified =
        status === 403 ||
        backendCode.includes('unverified') ||
        backendCode.includes('verify') ||
        backendMsg.includes('verify') ||
        backendMsg.includes('verified') ||
        backendMsg.includes('email confirmation') ||
        backendMsg.includes('not verified');

      if (isUnverified && tab === 'login') {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }

      setApiError(getAuthErrorMessage(err, tab));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    setLoading(true);
    setTimeout(() => {
      login(`${provider.toLowerCase()}.user@example.com`, 'Password123!');
      navigate(redirectPath);
    }, 600);
  };

  const handleGuestCheckout = () => {
    continueAsGuest(email || 'guest@fiddlemania.com');
    navigate('/checkout');
  };

  return {
    tab,
    setTab: handleTabSwitch,
    name,
    setName,
    handleNameChange,
    email,
    setEmail,
    handleEmailChange,
    password,
    setPassword,
    handlePasswordChange,
    confirmPassword,
    setConfirmPassword,
    handleConfirmPasswordChange,
    showPassword,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    isForgotPassword,
    setIsForgotPassword,
    forgotEmail,
    handleForgotEmailChange,
    forgotErrors,
    forgotLoading,
    forgotMessage,
    forgotError,
    handleForgotPasswordSubmit,
    errors,
    loading,
    apiError,
    handleSubmit,
    handleSocialAuth,
    handleGuestCheckout,
  };
}
