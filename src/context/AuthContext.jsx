import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('campuscycle_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('campuscycle_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync state and verify current user on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('campuscycle_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data?.success) {
            setUser(res.data.data);
            localStorage.setItem('campuscycle_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleAuthChange = () => {
      const newToken = localStorage.getItem('campuscycle_token');
      const newUser = localStorage.getItem('campuscycle_user');
      setToken(newToken);
      setUser(newUser ? JSON.parse(newUser) : null);
    };

    window.addEventListener('campuscycle_auth_change', handleAuthChange);
    return () => window.removeEventListener('campuscycle_auth_change', handleAuthChange);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data?.success) {
      const { token: receivedToken, ...userData } = res.data.data;
      localStorage.setItem('campuscycle_token', receivedToken);
      localStorage.setItem('campuscycle_user', JSON.stringify(userData));
      setToken(receivedToken);
      setUser(userData);
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    if (res.data?.success) {
      const { token: receivedToken, ...userData } = res.data.data;
      localStorage.setItem('campuscycle_token', receivedToken);
      localStorage.setItem('campuscycle_user', JSON.stringify(userData));
      setToken(receivedToken);
      setUser(userData);
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('campuscycle_token');
    localStorage.removeItem('campuscycle_user');
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event('campuscycle_auth_change'));
  };

  const updateProfile = async (updates) => {
    const res = await authService.updateProfile(updates);
    if (res.data?.success) {
      const updated = res.data.data;
      setUser(updated);
      localStorage.setItem('campuscycle_user', JSON.stringify(updated));
      return updated;
    }
    throw new Error(res.data?.message || 'Update failed');
  };

  const verifyCollege = async (data) => {
    const res = await authService.verifyCollege(data);
    if (res.data?.success) {
      const updated = res.data.data;
      setUser(updated);
      localStorage.setItem('campuscycle_user', JSON.stringify(updated));
      return updated;
    }
    throw new Error(res.data?.message || 'Verification failed');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    verifyCollege,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
