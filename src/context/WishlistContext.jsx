import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, authLoading } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState('');

  const loadWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setWishlistError('');
      return;
    }

    setWishlistLoading(true);
    setWishlistError('');
    try {
      const result = await apiClient.get('/wishlist');
      setWishlist(result.data.map((item) => item.propertyId));
    } catch (error) {
      setWishlistError(error.message || 'Unable to load wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) loadWishlist();
  }, [authLoading, loadWishlist]);

  const toggleWishlist = useCallback(async (propertyId) => {
    if (!user) throw new Error('Please sign in to save properties to your wishlist.');

    if (wishlist.includes(propertyId)) {
      await apiClient.delete(`/wishlist/${encodeURIComponent(propertyId)}`);
      setWishlist((previous) => previous.filter((id) => id !== propertyId));
    } else {
      await apiClient.put(`/wishlist/${encodeURIComponent(propertyId)}`, {});
      setWishlist((previous) => previous.includes(propertyId)
        ? previous
        : [...previous, propertyId]);
    }
  }, [user, wishlist]);

  const isInWishlist = useCallback(
    (propertyId) => wishlist.includes(propertyId),
    [wishlist]
  );

  const clearWishlist = useCallback(async () => {
    if (!user) throw new Error('Please sign in to manage your wishlist.');
    for (const propertyId of wishlist) {
      await apiClient.delete(`/wishlist/${encodeURIComponent(propertyId)}`);
      setWishlist((previous) => previous.filter((id) => id !== propertyId));
    }
  }, [user, wishlist]);

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    wishlistLoading,
    wishlistError,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist: loadWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
