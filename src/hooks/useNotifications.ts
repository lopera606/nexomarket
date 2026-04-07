'use client';

import { useState, useCallback, useEffect } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'order' | 'offer' | 'message' | 'system';
  timeAgo: string;
  read: boolean;
  createdAt?: string;
}

function mapType(apiType: string): NotificationItem['type'] {
  switch (apiType) {
    case 'ORDER_UPDATE': return 'order';
    case 'MESSAGE': return 'message';
    case 'PROMO': return 'offer';
    case 'SYSTEM': return 'system';
    default: return 'system';
  }
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 30) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  return date.toLocaleDateString('es-ES');
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notificaciones');
      if (!res.ok) {
        setNotifications([]);
        return;
      }
      const data = await res.json();
      const mapped: NotificationItem[] = (data.notifications || []).map(
        (n: any) => ({
          id: n.id,
          title: n.title,
          description: n.body || '',
          type: mapType(n.type),
          timeAgo: formatTimeAgo(n.createdAt),
          read: n.isRead,
          createdAt: n.createdAt,
        })
      );
      setNotifications(mapped);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch('/api/notificaciones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch {
      // Optimistic update already applied
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/notificaciones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
    } catch {
      // Optimistic update already applied
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    loading,
  };
}
