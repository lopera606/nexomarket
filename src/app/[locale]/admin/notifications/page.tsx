'use client';

import { useState } from 'react';
import { Plus, Bell, AlertCircle, Megaphone, Send } from 'lucide-react';

interface Notification {
  id: string;
  icon: 'bell' | 'alert' | 'megaphone' | 'send';
  type: 'Sistema' | 'Marketing' | 'Alertas' | 'Marketing';
  title: string;
  message: string;
  sentDate: string;
  recipients: number;
  status: 'Enviado' | 'Programado' | 'Borrador';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    icon: 'bell',
    type: 'Sistema',
    title: 'Mantenimiento programado',
    message:
      'El sistema estará en mantenimiento el próximo martes de 2:00 AM a 4:00 AM',
    sentDate: '2025-03-14',
    recipients: 15420,
    status: 'Enviado',
  },
  {
    id: '2',
    icon: 'megaphone',
    type: 'Marketing',
    title: 'Descuento especial 20%',
    message:
      'Disfruta de 20% de descuento en todos los productos electrónicos este fin de semana',
    sentDate: '2025-03-13',
    recipients: 32150,
    status: 'Enviado',
  },
  {
    id: '3',
    icon: 'alert',
    type: 'Alertas',
    title: 'Nuevos reportes pendientes',
    message: 'Tienes 5 nuevos reportes de usuarios esperando revisión',
    sentDate: '2025-03-15',
    recipients: 1,
    status: 'Enviado',
  },
  {
    id: '4',
    icon: 'send',
    type: 'Marketing',
    title: 'Flash Sale - Próxima semana',
    message:
      'Prepárate para nuestro Flash Sale con descuentos de hasta 50% en miles de productos',
    sentDate: '2025-03-16',
    recipients: 0,
    status: 'Programado',
  },
  {
    id: '5',
    icon: 'bell',
    type: 'Sistema',
    title: 'Nueva actualización disponible',
    message:
      'Hemos lanzado nuevas características y mejoras de seguridad. Actualiza ahora',
    sentDate: '2025-03-15',
    recipients: 28940,
    status: 'Borrador',
  },
];

type Tab = 'Todas' | 'Sistema' | 'Marketing' | 'Alertas';

const iconMap = {
  bell: Bell,
  alert: AlertCircle,
  megaphone: Megaphone,
  send: Send,
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Todas');
  const [notifications] = useState(mockNotifications);

  const filteredNotifications = notifications.filter((notif) =>
    activeTab === 'Todas' ? true : notif.type === activeTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enviado':
        return 'bg-green-50 text-green-700';
      case 'Programado':
        return 'bg-blue-50 text-blue-700';
      case 'Borrador':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sistema':
        return 'bg-blue-100/30 text-blue-600';
      case 'Marketing':
        return 'bg-[#0066FF]/30 text-[#0066FF]';
      case 'Alertas':
        return 'bg-red-100/30 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Centro de Notificaciones
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Envía y gestiona notificaciones a los usuarios
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white font-semibold rounded-lg hover:bg-[#0052CC] transition-all">
          <Plus className="h-5 w-5" />
          Enviar Notificación
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['Todas', 'Sistema', 'Marketing', 'Alertas'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`px-4 py-3 font-medium transition-all border-b-2 ${
              activeTab === tab
                ? 'border-purple-600 text-[#0066FF]'
                : 'border-transparent text-gray-600 hover:text-gray-900:text-gray-300'
            }`}
          >
            {tab}
            <span className="ml-2 inline-block px-2 py-0.5 bg-gray-200 rounded-full text-xs font-semibold">
              {notifications.filter((n) =>
                tab === 'Todas' ? true : n.type === tab
              ).length}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notif) => {
          const IconComponent = iconMap[notif.icon];
          return (
            <div
              key={notif.id}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg:shadow-xl transition-shadow"
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(notif.type)}`}>
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {notif.title}
                      </h3>
                      <p className="text-sm text-sm sm:text-base text-gray-600 mt-1">
                        {notif.message}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                        notif.status
                      )}`}
                    >
                      {notif.status}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <span>
                      📅{' '}
                      {new Date(notif.sentDate).toLocaleDateString('es-ES')}
                    </span>
                    <span>👥 {notif.recipients.toLocaleString('es-ES')} usuarios</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getTypeColor(notif.type)}`}>
                      {notif.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900 mb-2">
            No hay notificaciones
          </p>
          <p className="text-gray-600">
            No hay notificaciones en esta categoría todavía
          </p>
        </div>
      )}
    </div>
  );
}
