
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient, getAuthToken, setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let active = true;
    const token = getAuthToken();

    if (!token) {
      setAuthLoading(false);
      return () => {
        active = false;
      };
    }

    apiClient.get('/auth/me')
      .then((result) => {
        if (active) setUser(result.user);
      })
      .catch((error) => {
        if (active) {
          if (error.status === 401) {
            setAuthToken(null);
            setUser(null);
          } else {
            setAuthError(error.message || 'Unable to verify your session.');
          }
        }
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    setAuthError('');
    const result = await apiClient.post('/auth/login', credentials);
    setAuthToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const signup = useCallback(async (data) => {
    setAuthError('');
    const result = await apiClient.post('/auth/signup', data);
    setAuthToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setAuthError('');
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setAuthError('');
    const result = await apiClient.put('/auth/profile', profileData);
    setUser(result.user);
    return result.user;
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    authLoading,
    authError,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
