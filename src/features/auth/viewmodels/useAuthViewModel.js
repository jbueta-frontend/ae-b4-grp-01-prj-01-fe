import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { validateAuthForm } from '../models/authModel';
import { getAuthErrorMessage } from '../../../shared/utils/errorHandler';

export function useAuthViewModel(defaultTab = 'login') {
  const [tab, setTab] = useState(defaultTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Email verification state
  const [isUnverified, setIsUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);

  const { login, register, resendVerification, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setApiError(null);
    setIsUnverified(false);
    setResendStatus(null);
    setRegistrationSuccess(false);
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
    if (isUnverified) setIsUnverified(false);
    if (resendStatus) setResendStatus(null);
    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (apiError) setApiError(null);
    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setIsUnverified(false);
    setResendStatus(null);

    const validation = validateAuthForm({
      name,
      email,
      password,
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
        await login(email, password);
        navigate(redirectPath);
      } else {
        const registrationName = name.trim() || email.split('@')[0];
        const res = await register(email, password, registrationName);
        if (res?.unverified) {
          setRegistrationSuccess(true);
          setRegisteredEmail(email);
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      const isEmailNotVerified =
        err?.code === 'EMAIL_NOT_VERIFIED' ||
        err?.raw?.code === 'EMAIL_NOT_VERIFIED' ||
        err?.response?.data?.code === 'EMAIL_NOT_VERIFIED' ||
        err?.status === 403;

      if (isEmailNotVerified) {
        setIsUnverified(true);
        setUnverifiedEmail(email);
        setApiError(
          'Your email is not verified yet. Please check your inbox.'
        );
      } else {
        setIsUnverified(false);
        setApiError(getAuthErrorMessage(err, tab));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async (targetEmail) => {
    const emailToSend = targetEmail || unverifiedEmail || email;
    if (!emailToSend) return;

    setResendLoading(true);
    setResendStatus(null);
    try {
      await resendVerification(emailToSend);
      setResendStatus({
        type: 'success',
        message: 'Verification link resent! Please check your inbox.',
      });
    } catch (err) {
      setResendStatus({
        type: 'error',
        message:
          getAuthErrorMessage(err, 'resend') ||
          'Failed to resend verification link. Please try again.',
      });
    } finally {
      setResendLoading(false);
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
    errors,
    loading,
    apiError,
    isUnverified,
    unverifiedEmail,
    registrationSuccess,
    registeredEmail,
    resendLoading,
    resendStatus,
    handleResendVerification,
    handleSubmit,
    handleSocialAuth,
    handleGuestCheckout,
  };
}
