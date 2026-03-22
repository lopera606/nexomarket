'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Abierta',
  AWAITING_SELLER: 'Requiere tu respuesta',
  AWAITING_CUSTOMER: 'Esperando al cliente',
  IN_MEDIATION: 'En mediación',
  ESCALATED: 'Escalada a soporte',
  RESOLVED: 'Resuelta',
  CLOSED: 'Cerrada',
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  AWAITING_SELLER: 'bg-red-500/20 text-red-400 border-red-500/30',
  AWAITING_CUSTOMER: 'bg-green-500/20 text-green-400 border-green-500/30',
  IN_MEDIATION: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ESCALATED: 'bg-red-500/20 text-red-400 border-red-500/30',
  RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
  CLOSED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    role: string;
  };
}

interface IncidentDetail {
  id: string;
  incidentNumber: string;
  type: string;
  status: string;
  priority: string;
  subject: string;
  description: string;
  deadlineAt: string | null;
  sellerFirstResponseAt: string | null;
  createdAt: string;
  resolvedAt: string | null;
  resolution: string | null;
  customer: { id: string; firstName: string; lastName: string; email: string };
  store: { id: string; name: string; slug: string; ownerId: string };
  messages: Message[];
}

export default function SellerIncidentDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolution, setResolution] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchIncident(); }, [incidentId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [incident?.messages]);

  const fetchIncident = async () => {
    try {
      const res = await fetch(`/api/incidents/${incidentId}`);
      const data = await res.json();
      setIncident(data.incident);
    } catch {
      console.error('Error fetching incident');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !incident) return;

    setSending(true);
    try {
      await fetch(`/api/incidents/${incidentId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: incident.store.ownerId,
          senderRole: 'SELLER',
          message: newMessage.trim(),
        }),
      });
      setNewMessage('');
      fetchIncident();
    } catch {
      console.error('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const resolveIncident = async () => {
    if (!resolution.trim()) return;
    setResolving(true);
    try {
      await fetch(`/api/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'RESOLVED',
          resolution: resolution.trim(),
          resolvedBy: incident?.store.ownerId,
        }),
      });
      fetchIncident();
      setResolution('');
    } catch {
      console.error('Error resolving incident');
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-64 bg-gray-100 rounded-xl" /></div>;
  }

  if (!incident) {
    return <div className="text-center py-12"><p className="text-gray-400">Incidencia no encontrada</p></div>;
  }

  const isClosed = ['RESOLVED', 'CLOSED'].includes(incident.status);
  const needsResponse = incident.status === 'AWAITING_SELLER';
  const isUrgent = needsResponse && incident.deadlineAt && new Date(incident.deadlineAt) < new Date(Date.now() + 12 * 60 * 60 * 1000);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href={`/${locale}/vendedor/incidencias`} className="hover:text-blue-400">Incidencias</Link>
        <span>/</span>
        <span className="text-gray-600">{incident.incidentNumber}</span>
      </div>

      {/* Urgent warning */}
      {isUrgent && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-sm text-red-300 font-medium">
            Esta incidencia requiere tu respuesta urgente. Plazo: {new Date(incident.deadlineAt!).toLocaleString('es-ES')}.
            No responder a tiempo puede resultar en penalizaciones.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[incident.status]}`}>
                {STATUS_LABELS[incident.status]}
              </span>
              <span className="text-xs font-mono text-gray-500">{incident.incidentNumber}</span>
            </div>
            <h1 className="text-xl font-bold text-black">{incident.subject}</h1>
            <p className="text-sm text-gray-400 mt-2">
              Cliente: <span className="text-gray-600">{incident.customer.firstName} {incident.customer.lastName}</span>
              {' '} — {new Date(incident.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Resolve button */}
          {!isClosed && (
            <button
              onClick={() => {
                const el = document.getElementById('resolve-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-black rounded-lg text-sm font-medium"
            >
              Resolver
            </button>
          )}
        </div>

        {incident.resolution && (
          <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-xs text-green-400 font-medium mb-1">Resolución:</p>
            <p className="text-sm text-green-600">{incident.resolution}</p>
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700/50">
          <h2 className="text-sm font-medium text-gray-600">Conversación</h2>
        </div>

        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {incident.messages.filter(m => !m.isInternal).map((msg) => {
            const isSeller = msg.senderRole === 'SELLER';
            const isAdmin = msg.senderRole === 'ADMIN';
            return (
              <div key={msg.id} className={`flex ${isSeller ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${
                  isSeller ? 'bg-blue-600/20 border-blue-500/30'
                  : isAdmin ? 'bg-blue-600/20 border-blue-500/30'
                  : 'bg-gray-700/50 border-gray-600/30'
                } border rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {msg.sender.firstName} {msg.sender.lastName}
                    </span>
                    {isAdmin && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Soporte</span>}
                    {!isSeller && !isAdmin && <span className="text-[10px] bg-gray-500/20 text-gray-400 px-1.5 py-0.5 rounded">Cliente</span>}
                  </div>
                  <p className="text-sm text-[#4A4A4A] whitespace-pre-wrap">{msg.body}</p>
                  <span className="text-[10px] text-gray-500 mt-2 block">{new Date(msg.createdAt).toLocaleString('es-ES')}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {!isClosed && (
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-700/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu respuesta al cliente..."
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-black rounded-lg text-sm font-medium"
              >
                {sending ? '...' : 'Enviar'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Resolve Section */}
      {!isClosed && (
        <div id="resolve-section" className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-medium text-black mb-3">Resolver Incidencia</h2>
          <p className="text-sm text-gray-400 mb-4">
            Describe la resolución propuesta. El cliente será notificado.
          </p>
          <textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Ej: Se ha enviado un producto de reemplazo con número de seguimiento XXX..."
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none text-sm mb-3"
          />
          <button
            onClick={resolveIncident}
            disabled={!resolution.trim() || resolving}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-black rounded-lg text-sm font-medium"
          >
            {resolving ? 'Resolviendo...' : 'Marcar como Resuelta'}
          </button>
        </div>
      )}
    </div>
  );
}
