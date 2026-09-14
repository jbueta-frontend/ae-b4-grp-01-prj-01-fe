import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getAuthErrorMessage } from '../shared/utils/errorHandler';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fiddlemania_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('fiddlemania_is_guest') === 'true';
  });

  const [loading, setLoading] = useState(true);
  const [verifiedNotification, setVerifiedNotification] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      // Normal session restoration from localStorage
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.user || res;
          userData.isEmailVerified = true;

          // Attempt to load user's real address from backend /addresses
          const userKey = userData.userId || userData.id || userData.email;
          try {
            const addresses = await api.get('/addresses');
            if (Array.isArray(addresses) && addresses.length > 0) {
              const defaultAddr =
                addresses.find((a) => a.isDefaultShipping || a.isDefault) || addresses[0];
              if (defaultAddr) {
                userData.address = {
                  id: defaultAddr.addressId || defaultAddr.id || '',
                  addressId: defaultAddr.addressId || defaultAddr.id || '',
                  recipientName: defaultAddr.recipientName || '',
                  phone: defaultAddr.phone || '',
                  addressLine1: defaultAddr.addressLine1 || '',
                  addressLine2: defaultAddr.addressLine2 || '',
                  city: defaultAddr.city || '',
                  stateProvince: defaultAddr.stateProvince || '',
                  postalCode: defaultAddr.postalCode || '',
                  country: defaultAddr.country || 'Philippines',
                };
              }
            }
          } catch {}

          // Fallback to user-scoped cache if backend didn't return one
          if (!userData.address && userKey) {
            try {
              const raw = localStorage.getItem(`fiddlemania_user_address_${userKey}`);
              if (raw) userData.address = JSON.parse(raw);
            } catch {}
          }
          // Remove legacy un-scoped address so it never leaks across accounts
          localStorage.removeItem('fiddlemania_user_address');

          setUser(userData);
          localStorage.setItem('fiddlemania_user', JSON.stringify(userData));
          setIsGuest(false);
        } catch {
          // Token may be expired, api interceptor handles refresh or cleans up
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const setAuthSession = async (token, refreshToken = null, customUserData = null) => {
    if (token) localStorage.setItem('accessToken', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    localStorage.removeItem('fiddlemania_is_guest');
    setIsGuest(false);

    let initial = customUserData;
    if (!initial && token) {
      const claims = parseJwt(token);
      const userEmail = claims?.email || claims?.user_metadata?.email || '';
      const userName =
        claims?.user_metadata?.name ||
        claims?.user_metadata?.full_name ||
        (userEmail ? userEmail.split('@')[0] : 'Member');

      initial = {
        userId: claims?.sub || claims?.id || 'user-' + Date.now(),
        email: userEmail,
        name: userName,
        fullName: userName,
        role: claims?.app_metadata?.role || claims?.role || 'CUSTOMER',
        isEmailVerified: true,
      };
    }

    if (initial) {
      setUser(initial);
      localStorage.setItem('fiddlemania_user', JSON.stringify(initial));
    }

    try {
      const res = await api.get('/auth/me');
      const liveData = res.user || res;
      liveData.isEmailVerified = true;
      setUser(liveData);
      localStorage.setItem('fiddlemania_user', JSON.stringify(liveData));
      return liveData;
    } catch {
      return initial;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      // api interceptor unwraps res.data.data -> res = { user, accessToken, refreshToken }
      const token = res.accessToken;
      const refreshToken = res.refreshToken;
      const userData = res.user || { email, role: 'CUSTOMER' };

      if (token) localStorage.setItem('accessToken', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('fiddlemania_user', JSON.stringify(userData));
      localStorage.removeItem('fiddlemania_is_guest');
      localStorage.removeItem('fiddlemania_user_address');

      setUser(userData);
      setIsGuest(false);
      return { success: true, user: userData };
    } catch (err) {
      throw new Error(getAuthErrorMessage(err, 'login'));
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await api.post('/auth/register', {
        email,
        password,
        name,
        fullName: name,
        firstName: name.split(' ')[0],
      });
      const token = res.accessToken;
      const refreshToken = res.refreshToken;
      const userData = res.user || { email, role: 'CUSTOMER', name, fullName: name };

      if (token) localStorage.setItem('accessToken', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('fiddlemania_user', JSON.stringify(userData));
      localStorage.removeItem('fiddlemania_is_guest');
      localStorage.removeItem('fiddlemania_user_address');
      // Flag that a newly registered account needs initial setup once verified
      localStorage.setItem('fiddlemania_new_account_setup_pending', 'true');

      setUser(userData);
      setIsGuest(false);
      return { success: true, user: userData };
    } catch (err) {
      throw new Error(getAuthErrorMessage(err, 'register'));
    }
  };

  const continueAsGuest = (email = 'guest@fiddlemania.com') => {
    const guestUser = {
      userId: 'guest-' + Date.now(),
      email,
      name: 'Guest Shopper',
      role: 'GUEST',
    };
    localStorage.setItem('fiddlemania_user', JSON.stringify(guestUser));
    localStorage.setItem('fiddlemania_is_guest', 'true');
    setUser(guestUser);
    setIsGuest(true);
    return guestUser;
  };

  const logout = () => {
    const userKey = user?.userId || user?.id || user?.email;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('fiddlemania_user');
    localStorage.removeItem('fiddlemania_is_guest');
    localStorage.removeItem('fiddlemania_user_address');
    if (userKey) {
      localStorage.removeItem(`fiddlemania_user_address_${userKey}`);
    }
    setUser(null);
    setIsGuest(false);
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('fiddlemania_user', JSON.stringify(merged));
      const userKey = merged.userId || merged.id || merged.email;
      if (updatedFields.address && userKey) {
        try {
          localStorage.setItem(`fiddlemania_user_address_${userKey}`, JSON.stringify(updatedFields.address));
        } catch {}
      }
      return merged;
    });
  };

  const deactivateAccount = async () => {
    try {
      await api.post('/auth/deactivate').catch(() => {});
    } finally {
      logout();
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/delete-account').catch(() => {});
    } finally {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        isAuthenticated: !!user && !isGuest,
        login,
        register,
        continueAsGuest,
        logout,
        updateProfile,
        deactivateAccount,
        deleteAccount,
        setAuthSession,
        verifiedNotification,
        closeVerifiedNotification: () => setVerifiedNotification(null),
        showVerifiedNotification: (notif) => setVerifiedNotification(notif),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
