'use client';

import { useState, useCallback } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'order' | 'offer' | 'message' | 'system';
  timeAgo: string;
  read: boolean;
  createdAt?: string;
}

const STORAGE_KEY = 'nexomarket_notifications';

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Tu pedido ha sido entregado',
    description: 'El pedido NXM-2026-03-7F8A2D4E ha llegado exitosamente.',
    type: 'order',
    timeAgo: 'Hace 2 horas',
    read: false,
  },
  {
    id: '2',
    title: '¡Gran oferta en Auriculares!',
    description: 'Descuento de 30% en auriculares inalámbricos de calidad premium.',
    type: 'offer',
    timeAgo: 'Hace 1 día',
    read: false,
  },
  {
    id: '3',
    title: 'Nuevo mensaje de TechStore Pro',
    description: 'El vendedor ha respondido tu consulta sobre el producto.',
    type: 'message',
    timeAgo: 'Hace 3 días',
    read: true,
  },
];

/**
 * Simple notifications hook using localStorage.
 * In production, replace with API calls to /api/notifications.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const saveToStorage = (items: NotificationItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
}
