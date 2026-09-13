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
      // 1. Inspect URL hash and query string for incoming session tokens (from email verification)
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.substring(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const searchParams = new URLSearchParams(window.location.search);

      const type = hashParams.get('type') || searchParams.get('type') || '';
      const isRecovery =
        type === 'recovery' ||
        type === 'reset' ||
        hash.includes('type=recovery') ||
        window.location.search.includes('type=recovery');

      // If it is a password recovery link, do not treat as a storefront session;
      // AuthRecoveryRedirect in App.jsx will forward to /reset-password
      let tokenFromUrl = null;
      let refreshTokenFromUrl = null;

      if (!isRecovery) {
        tokenFromUrl =
          hashParams.get('access_token') ||
          searchParams.get('access_token') ||
          ((type === 'signup' || type === 'email_verification') &&
            (hashParams.get('token') || searchParams.get('token')));

        refreshTokenFromUrl =
          hashParams.get('refresh_token') ||
          searchParams.get('refresh_token');
      }

      let activeToken = tokenFromUrl || localStorage.getItem('accessToken');

      if (tokenFromUrl) {
        localStorage.setItem('accessToken', tokenFromUrl);
        if (refreshTokenFromUrl) {
          localStorage.setItem('refreshToken', refreshTokenFromUrl);
        }
        localStorage.removeItem('fiddlemania_is_guest');
        setIsGuest(false);

        // Immediate optimistic hydration from JWT claims
        const claims = parseJwt(tokenFromUrl);
        const userEmail =
          claims?.email ||
          claims?.user_metadata?.email ||
          searchParams.get('email') ||
          hashParams.get('email') ||
          '';
        const userName =
          claims?.user_metadata?.name ||
          claims?.user_metadata?.full_name ||
          (userEmail ? userEmail.split('@')[0] : 'Member');

        const initialUser = {
          userId:
            claims?.sub ||
            claims?.id ||
            claims?.user_id ||
            'user-' + Date.now(),
          email: userEmail,
          name: userName,
          fullName: userName,
          firstName: userName.split(' ')[0],
          role: claims?.app_metadata?.role || claims?.role || 'CUSTOMER',
          isEmailVerified: true,
        };

        setUser(initialUser);
        localStorage.setItem('fiddlemania_user', JSON.stringify(initialUser));

        // Trigger confirmation success notification state
        setVerifiedNotification({
          isOpen: true,
          message: 'Email verified successfully! You are now signed in.',
          email: userEmail,
          user: initialUser,
        });

        // Clean up hash fragment / tokens from browser history
        try {
          const cleanUrl =
            window.location.pathname +
            (window.location.search
              ? window.location.search.replace(
                  /([?&])(access_token|refresh_token)=[^&#]*/g,
                  ''
                )
              : '');
          window.history.replaceState(null, '', cleanUrl || '/');
        } catch {}
      }

      if (activeToken) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.user || res;
          // Merge locally-cached address if backend didn't return one
          if (!userData.address) {
            try {
              const raw = localStorage.getItem('fiddlemania_user_address');
              if (raw) userData.address = JSON.parse(raw);
            } catch {}
          }
          userData.isEmailVerified = true;
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('fiddlemania_user');
    localStorage.removeItem('fiddlemania_is_guest');
    setUser(null);
    setIsGuest(false);
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('fiddlemania_user', JSON.stringify(merged));
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
