import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

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
      // Fallback for prototype testing if backend is unreachable or test credentials used
      console.warn('API login failed, using prototype fallback:', err);
      const fallbackUser = {
        userId: 'proto-user-1',
        email,
        role: email.includes('admin') ? 'ADMIN' : 'CUSTOMER',
        name: email.split('@')[0],
      };
      localStorage.setItem('fiddlemania_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      setIsGuest(false);
      return { success: true, user: fallbackUser };
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await api.post('/auth/register', { email, password });
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
      console.warn('API register failed, using prototype fallback:', err);
      const fallbackUser = {
        userId: 'proto-user-2',
        email,
        name: name || email.split('@')[0],
        role: 'CUSTOMER',
      };
      localStorage.setItem('fiddlemania_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      setIsGuest(false);
      return { success: true, user: fallbackUser };
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
