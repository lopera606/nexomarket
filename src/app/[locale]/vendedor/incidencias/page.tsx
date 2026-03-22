'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-500/20 text-blue-400',
  AWAITING_SELLER: 'bg-red-500/20 text-red-400',
  AWAITING_CUSTOMER: 'bg-green-500/20 text-green-400',
  IN_MEDIATION: 'bg-blue-500/20 text-blue-400',
  ESCALATED: 'bg-red-500/20 text-red-400',
  RESOLVED: 'bg-green-500/20 text-green-400',
  CLOSED: 'bg-gray-500/20 text-[#4A4A4A]',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Nueva',
  AWAITING_SELLER: 'Requiere tu respuesta',
  AWAITING_CUSTOMER: 'Esperando al cliente',
  IN_MEDIATION: 'En mediación',
  ESCALATED: 'Escalada',
  RESOLVED: 'Resuelta',
  CLOSED: 'Cerrada',
};

const TYPE_LABELS: Record<string, string> = {
  NON_DELIVERY: 'No entregado',
  LATE_DELIVERY: 'Entrega retrasada',
  DAMAGED_ITEM: 'Producto dañado',
  WRONG_ITEM: 'Producto incorrecto',
  DEFECTIVE_ITEM: 'Producto defectuoso',
  REFUND_REQUEST: 'Reembolso',
  SELLER_NO_RESPONSE: 'Sin respuesta',
  OTHER: 'Otro',
};

interface Incident {
  id: string;
  incidentNumber: string;
  type: string;
  status: string;
  priority: string;
  subject: string;
  deadlineAt: string | null;
  createdAt: string;
  customer: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
  messages: Array<{ body: string; createdAt: string; senderRole: string }>;
}

export default function SellerIncidentsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const url = new URL('/api/incidents', window.location.origin);
        url.searchParams.set('role', 'seller');
        // url.searchParams.set('storeId', currentStore.id);
        if (statusFilter) url.searchParams.set('status', statusFilter);

        const res = await fetch(url.toString());
        const data = await res.json();
        setIncidents(data.incidents || []);
      } catch {
        console.error('Error fetching incidents');
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, [statusFilter]);

  const urgentCount = incidents.filter(
    (i) => i.status === 'AWAITING_SELLER' && i.deadlineAt && new Date(i.deadlineAt) < new Date(Date.now() + 12 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Incidencias de la Tienda</h1>
          <p className="text-[#4A4A4A] text-sm mt-1">
            Gestiona las reclamaciones de tus clientes
          </p>
        </div>
        <Link
          href={`/${locale}/vendedor/salud-tienda`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-[#4A4A4A] rounded-lg transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Salud de la Tienda
        </Link>
      </div>

      {/* Urgent Alert */}
      {urgentCount > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-300">
              {urgentCount} incidencia{urgentCount > 1 ? 's' : ''} con plazo próximo a vencer
            </p>
            <p className="text-xs text-red-400/70">
              Responde antes del plazo para evitar penalizaciones en tu tienda.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['', 'AWAITING_SELLER', 'AWAITING_CUSTOMER', 'ESCALATED', 'RESOLVED', 'CLOSED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-black'
                : 'bg-white text-[#4A4A4A] hover:bg-gray-50'
            }`}
          >
            {status === '' ? 'Todas' : STATUS_LABELS[status] || status}
            {status === 'AWAITING_SELLER' && (
              <span className="ml-1.5 bg-red-500/30 text-red-300 px-1.5 py-0.5 rounded-full text-[10px]">
                {incidents.filter((i) => i.status === 'AWAITING_SELLER').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Incident List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : incidents.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">No hay incidencias</h3>
          <p className="text-gray-500 text-sm">
            {statusFilter ? 'No hay incidencias con este filtro.' : 'Tu tienda no tiene incidencias abiertas.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((incident) => {
            const isUrgent = incident.status === 'AWAITING_SELLER' &&
              incident.deadlineAt &&
              new Date(incident.deadlineAt) < new Date(Date.now() + 12 * 60 * 60 * 1000);

            return (
              <Link
                key={incident.id}
                href={`/${locale}/vendedor/incidencias/${incident.id}`}
                className={`block rounded-xl p-5 transition-all border ${
                  isUrgent
                    ? 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-gray-500">{incident.incidentNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[incident.status]}`}>
                        {STATUS_LABELS[incident.status]}
                      </span>
                      {isUrgent && (
                        <span className="text-xs text-red-400 animate-pulse font-medium">URGENTE</span>
                      )}
                    </div>
                    <h3 className="text-black font-medium truncate">{incident.subject}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-[#4A4A4A]">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{TYPE_LABELS[incident.type]}</span>
                      <span>Cliente: {incident.customer.firstName} {incident.customer.lastName}</span>
                      {incident.deadlineAt && incident.status === 'AWAITING_SELLER' && (
                        <span className={`text-xs ${isUrgent ? 'text-red-400' : 'text-yellow-400'}`}>
                          Plazo: {new Date(incident.deadlineAt).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
