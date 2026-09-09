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

  const { login, register, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

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
      } else {
        const registrationName = name.trim() || email.split('@')[0];
        await register(email, password, registrationName);
      }
      navigate(redirectPath);
    } catch (err) {
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
    errors,
    loading,
    apiError,
    handleSubmit,
    handleSocialAuth,
    handleGuestCheckout,
  };
}
