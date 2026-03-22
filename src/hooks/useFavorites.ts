'use client';

import { useState, useCallback } from 'react';

/**
 * Simple favorites hook using localStorage.
 * In production, replace with API calls to /api/wishlist.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('nexomarket_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveToStorage = (newFavs: string[]) => {
    localStorage.setItem('nexomarket_favorites', JSON.stringify(newFavs));
  };

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
