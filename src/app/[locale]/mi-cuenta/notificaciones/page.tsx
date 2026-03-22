'use client';

import { useState } from 'react';
import { Bell, Package, Zap, MessageSquare, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface NotificationPreference {
  id: string;
  label: string;
  icon: React.ReactNode;
  email: boolean;
  push: boolean;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  timeAgo: string;
  read: boolean;
}

export default function NotificacionesPage() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'orders',
      label: 'Pedidos',
      icon: <Package className="h-5 w-5 text-[#0066FF]" />,
      email: true,
      push: true,
    },
    {
      id: 'offers',
      label: 'Ofertas y Promociones',
      icon: <Zap className="h-5 w-5 text-[#0066FF]" />,
      email: true,
      push: false,
    },
    {
      id: 'messages',
      label: 'Mensajes',
      icon: <MessageSquare className="h-5 w-5 text-[#0066FF]" />,
      email: true,
      push: true,
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: <Mail className="h-5 w-5 text-[#0066FF]" />,
      email: false,
      push: false,
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Tu pedido ha sido entregado',
      description: 'El pedido NXM-2026-03-7F8A2D4E ha llegado exitosamente. Déjanos tu reseña.',
      icon: <Package className="h-5 w-5 text-emerald-600" />,
      timeAgo: 'Hace 2 horas',
      read: false,
    },
    {
      id: '2',
      title: '¡Gran oferta en Auriculares!',
      description: 'Descuento de 30% en auriculares inalámbricos de calidad premium.',
      icon: <Zap className="h-5 w-5 text-amber-600" />,
      timeAgo: 'Hace 1 día',
      read: false,
    },
    {
      id: '3',
      title: 'Nuevo mensaje de TechStore Pro',
      description: 'El vendedor ha respondido tu consulta sobre el producto.',
      icon: <MessageSquare className="h-5 w-5 text-[#0066FF]" />,
      timeAgo: 'Hace 3 días',
      read: true,
    },
  ]);

  const togglePreference = (id: string, type: 'email' | 'push') => {
    setPreferences(prefs =>
      prefs.map(pref =>
        pref.id === id ? { ...pref, [type]: !pref[type] } : pref
      )
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(notifs =>
      notifs.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifs => notifs.map(notif => ({ ...notif, read: true })));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">Notificaciones</h1>
        <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">Gestiona tus preferencias de notificación</p>
      </div>

      {/* Preferences */}
      <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <h2 className="text-base sm:text-lg font-semibold text-[#000000]">Preferencias de Notificación</h2>
        <p className="text-xs sm:text-sm text-[#4A4A4A]">Elige cómo deseas recibir notificaciones</p>

        <div className="space-y-2 sm:space-y-4">
          {preferences.map((pref) => (
            <div
              key={pref.id}
              className="flex items-center justify-between p-3 sm:p-4 bg-[#FAFAFA] rounded-xl sm:rounded-2xl border border-gray-200 gap-2"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                  {pref.icon}
                </div>
                <span className="font-medium text-xs sm:text-sm text-[#000000] truncate">{pref.label}</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                {/* Email Toggle */}
                <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pref.email}
                    onChange={() => togglePreference(pref.id, 'email')}
                    className="w-4 h-4 text-[#0066FF] rounded focus:ring-[#0066FF]"
                  />
                  <span className="text-[10px] sm:text-sm text-[#4A4A4A]">Email</span>
                </label>

                {/* Push Toggle */}
                <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pref.push}
                    onChange={() => togglePreference(pref.id, 'push')}
                    className="w-4 h-4 text-[#0066FF] rounded focus:ring-[#0066FF]"
                  />
                  <span className="text-[10px] sm:text-sm text-[#4A4A4A]">Push</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Notifications */}
      <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-[#000000]">Notificaciones Recientes</h2>
            {notifications.some(n => !n.read) && (
              <span className="bg-[#0066FF] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                {notifications.filter(n => !n.read).length} nuevas
              </span>
            )}
          </div>
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-xs sm:text-sm text-[#0066FF] hover:text-[#0052CC] font-medium flex-shrink-0"
            >
              Marcar todas
            </button>
          )}
        </div>

        <div className="space-y-2 sm:space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-l-4 cursor-pointer hover:shadow-md transition-shadow duration-200 ${
                  notif.read
                    ? 'bg-[#FAFAFA] border-gray-300'
                    : 'bg-blue-50 border-[#0066FF]'
                }`}
              >
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-1 w-5 h-5 sm:w-6 sm:h-6">{notif.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-xs sm:text-sm ${
                        notif.read ? 'text-[#4A4A4A]' : 'text-[#000000]'
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A4A4A] mt-1">{notif.description}</p>
                    <p className="text-[10px] sm:text-xs text-[#4A4A4A] mt-1 sm:mt-2">{notif.timeAgo}</p>
                  </div>
                  {!notif.read && (
                    <div className="flex-shrink-0 w-2 h-2 bg-[#0066FF] rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bell className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-[#4A4A4A]" />
              <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A]">No tienes notificaciones</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
