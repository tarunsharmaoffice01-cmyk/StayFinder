import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'stayfinder_demo_user_v1';

const DEFAULT_DEMO_USER = {
  id: 'usr-student-01',
  name: 'Alex Rivera',
  email: 'alex.rivera@stayfinder.edu',
  phone: '+1 (555) 489-2041',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  role: 'Traveler & Host',
  memberSince: 'October 2024',
  location: 'San Francisco, CA'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }
    return DEFAULT_DEMO_USER;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  const login = useCallback((credentials) => {
    const loggedUser = {
      id: user?.id || `usr-${Date.now()}`,
      name: credentials.name || credentials.email?.split('@')[0] || 'Demo Traveler',
      email: credentials.email || 'traveler@stayfinder.edu',
      phone: credentials.phone || '+1 (555) 019-2834',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      role: 'Traveler & Host',
      memberSince: 'November 2026',
      location: 'New York, NY'
    };
    setUser(loggedUser);
    return loggedUser;
  }, [user]);

  const signup = useCallback((data) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: data.name || 'New Member',
      email: data.email,
      phone: data.phone || '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      role: data.role || 'Traveler',
      memberSince: 'November 2026',
      location: data.location || 'United States'
    };
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((profileData) => {
    setUser(prev => ({
      ...prev,
      ...profileData
    }));
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
    updateProfile
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

export default AuthContext;

