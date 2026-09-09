import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getAuthErrorMessage } from '../shared/utils/errorHandler';

const AuthContext = createContext(null);

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

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.user || res;
          setUser(userData);
          localStorage.setItem('fiddlemania_user', JSON.stringify(userData));
        } catch {
          // Token may be expired, api interceptor handles refresh or cleans up
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

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
      const res = await api.post('/auth/register', { email, password, name });
      const token = res.accessToken;
      const refreshToken = res.refreshToken;
      const userData = res.user || { email, role: 'CUSTOMER', name };

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
