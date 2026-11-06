import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistIds(new Set());
      setWishlistProducts([]);
      return;
    }
    try {
      setLoading(true);
      const [idsRes, fullRes] = await Promise.all([
        wishlistService.getWishlistIds(),
        wishlistService.getWishlist(),
      ]);
      if (idsRes.data?.success) {
        setWishlistIds(new Set(idsRes.data.data));
      }
      if (fullRes.data?.success) {
        setWishlistProducts(fullRes.data.data);
      }
    } catch (err) {
      console.warn('Failed to load wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      alert('Please log in to save items to your wishlist!');
      return false;
    }

    const productId = product._id || product.id || product;
    const isCurrentlySaved = wishlistIds.has(productId);

    // Optimistic UI update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    try {
      const res = await wishlistService.toggleWishlist(productId);
      if (res.data?.success) {
        // Refresh product list
        fetchWishlist();
        return res.data.inWishlist;
      }
    } catch (err) {
      // Revert on error
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) next.add(productId);
        else next.delete(productId);
        return next;
      });
      console.error('Wishlist toggle error:', err);
    }
    return !isCurrentlySaved;
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    const id = typeof productId === 'object' ? (productId._id || productId.id) : productId;
    return wishlistIds.has(id);
  };

  const value = {
    wishlistIds,
    wishlistProducts,
    wishlistCount: wishlistIds.size,
    loading,
    toggleWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
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
