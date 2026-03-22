'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-500/20 text-blue-400',
  AWAITING_SELLER: 'bg-yellow-500/20 text-yellow-400',
  AWAITING_CUSTOMER: 'bg-orange-500/20 text-orange-400',
  IN_MEDIATION: 'bg-[#0066FF]/20 text-[#0066FF]',
  ESCALATED: 'bg-red-500/20 text-red-400',
  RESOLVED: 'bg-green-500/20 text-green-400',
  CLOSED: 'bg-gray-500/20 text-gray-400',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Abierta',
  AWAITING_SELLER: 'Esperando vendedor',
  AWAITING_CUSTOMER: 'Esperando tu respuesta',
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
  REFUND_REQUEST: 'Solicitud de reembolso',
  SELLER_NO_RESPONSE: 'Sin respuesta del vendedor',
  OTHER: 'Otro',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'text-gray-400',
  MEDIUM: 'text-yellow-400',
  HIGH: 'text-orange-400',
  URGENT: 'text-red-400',
};

interface Incident {
  id: string;
  incidentNumber: string;
  type: string;
  status: string;
  priority: string;
  subject: string;
  createdAt: string;
  store: { id: string; name: string; slug: string; logoUrl: string | null };
  messages: Array<{ body: string; createdAt: string; senderRole: string }>;
}

export default function CustomerIncidentsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // In production, userId would come from auth session
    const fetchIncidents = async () => {
      try {
        const url = new URL('/api/incidents', window.location.origin);
        url.searchParams.set('role', 'customer');
        // url.searchParams.set('userId', currentUser.id);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">Mis Incidencias</h1>
          <p className="text-[#4A4A4A] text-xs sm:text-sm mt-1">
            Gestiona tus reclamaciones y disputas
          </p>
        </div>
        <Link
          href={`/${locale}/mi-cuenta/incidencias/nueva`}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl sm:rounded-2xl transition-colors duration-200 text-xs sm:text-sm font-medium flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto">
        {['', 'OPEN', 'AWAITING_SELLER', 'AWAITING_CUSTOMER', 'RESOLVED', 'CLOSED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
              statusFilter === status
                ? 'bg-[#0066FF] text-white'
                : 'bg-[#FAFAFA] text-[#4A4A4A] hover:bg-gray-100'
            }`}
          >
            {status === '' ? 'Todas' : STATUS_LABELS[status] || status}
          </button>
        ))}
      </div>

      {/* Incident List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#FAFAFA] rounded-2xl p-6 animate-pulse border border-gray-200">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-300 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : incidents.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-3xl p-12 text-center border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-[#4A4A4A] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-[#000000] mb-2">No tienes incidencias</h3>
          <p className="text-[#4A4A4A] text-sm">
            Si tienes algún problema con un pedido, puedes abrir una incidencia aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {incidents.map((incident) => (
            <Link
              key={incident.id}
              href={`/${locale}/mi-cuenta/incidencias/${incident.id}`}
              className="block bg-[#FFFFFF] hover:bg-[#FAFAFA] border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-all duration-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs font-mono text-[#4A4A4A]">
                      {incident.incidentNumber}
                    </span>
                    <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${STATUS_COLORS[incident.status]}`}>
                      {STATUS_LABELS[incident.status]}
                    </span>
                    <span className={`text-[10px] sm:text-xs ${PRIORITY_COLORS[incident.priority]}`}>
                      {incident.priority}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm text-[#000000] font-medium truncate">{incident.subject}</h3>
                  <div className="flex items-center gap-1.5 sm:gap-3 mt-2 text-[10px] sm:text-xs text-[#4A4A4A] flex-wrap">
                    <span className="bg-[#FAFAFA] px-1.5 sm:px-2 py-0.5 rounded text-[10px] border border-gray-200">
                      {TYPE_LABELS[incident.type]}
                    </span>
                    <span className="truncate">{incident.store.name}</span>
                    <span>{new Date(incident.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                  {incident.messages[0] && (
                    <p className="text-[#4A4A4A] text-[10px] sm:text-xs mt-2 truncate">
                      {incident.messages[0].body.substring(0, 60)}...
                    </p>
                  )}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4A4A] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
