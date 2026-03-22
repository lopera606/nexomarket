'use client';

import { useState, useCallback } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number; // can be decimal for meters/kg
  image?: string;
  variant?: string;
  unit?: string; // 'unidad', 'metro', 'kg', 'litro', 'm2', 'pack'
  step?: number; // quantity step (e.g. 0.5 for half meters)
}

/**
 * Simple cart hook using localStorage.
 * In production, replace with API calls to /api/cart.
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('nexomarket_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveToStorage = (newItems: CartItem[]) => {
    localStorage.setItem('nexomarket_cart', JSON.stringify(newItems));
  };

  const addToCart = useCallback((product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    variant?: string;
    quantity?: number;
    unit?: string;
    step?: number;
  }) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      const initialQuantity = product.quantity ?? (product.step || 1);
      const stepAmount = product.step || 1;
      let updated: CartItem[];
      if (existing) {
        updated = prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + stepAmount }
            : item
        );
      } else {
        updated = [...prev, {
          id: crypto.randomUUID(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: initialQuantity,
          image: product.image,
          variant: product.variant,
          unit: product.unit,
          step: product.step,
        }];
      }
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.productId !== productId);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.productId === productId) {
          let finalQuantity = quantity;
          // Round to step if step is provided
          if (item.step && item.step > 0) {
            finalQuantity = Math.round(quantity / item.step) * item.step;
          }
          return { ...item, quantity: finalQuantity };
        }
        return item;
      });
      saveToStorage(updated);
      return updated;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('nexomarket_cart');
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice };
}
