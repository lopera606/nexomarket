'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  AWAITING_SELLER: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  AWAITING_CUSTOMER: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  IN_MEDIATION: 'bg-[#0066FF]/20 text-[#0066FF] border-[#0066FF]/30',
  ESCALATED: 'bg-red-500/20 text-red-400 border-red-500/30',
  RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
  CLOSED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Abierta',
  AWAITING_SELLER: 'Esperando al vendedor',
  AWAITING_CUSTOMER: 'Esperando tu respuesta',
  IN_MEDIATION: 'En mediación',
  ESCALATED: 'Escalada a soporte',
  RESOLVED: 'Resuelta',
  CLOSED: 'Cerrada',
};

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  body: string;
  attachments: any;
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
  store: { id: string; name: string; slug: string; logoUrl: string | null; ownerId: string };
  messages: Message[];
}

export default function IncidentDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchIncident();
  }, [incidentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [incident?.messages]);

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
          senderId: incident.customer.id,
          senderRole: 'CUSTOMER',
          message: newMessage.trim(),
        }),
      });
      setNewMessage('');
      fetchIncident(); // Refresh
    } catch {
      console.error('Error sending message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 rounded w-1/3" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="text-center py-12">
        <p className="text-[#4A4A4A]">Incidencia no encontrada</p>
      </div>
    );
  }

  const isClosed = ['RESOLVED', 'CLOSED'].includes(incident.status);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
        <Link href={`/${locale}/mi-cuenta/incidencias`} className="hover:text-[#0066FF]">
          Incidencias
        </Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">{incident.incidentNumber}</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[incident.status]}`}>
                {STATUS_LABELS[incident.status]}
              </span>
              <span className="text-xs font-mono text-[#4A4A4A]">{incident.incidentNumber}</span>
            </div>
            <h1 className="text-xl font-bold text-[#000000]">{incident.subject}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-[#4A4A4A]">
              <span>Tienda: <span className="text-[#000000]">{incident.store.name}</span></span>
              <span>Creada: {new Date(incident.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Deadline warning */}
        {incident.status === 'AWAITING_SELLER' && incident.deadlineAt && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3">
            <p className="text-sm text-amber-700">
              El vendedor tiene hasta el{' '}
              <strong>{new Date(incident.deadlineAt).toLocaleString('es-ES')}</strong>{' '}
              para responder. Si no responde, la incidencia se escalará automáticamente.
            </p>
          </div>
        )}

        {/* Resolution */}
        {incident.resolution && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
            <p className="text-xs text-emerald-700 font-medium mb-1">Resolución:</p>
            <p className="text-sm text-emerald-700">{incident.resolution}</p>
          </div>
        )}
      </div>

      {/* Chat / Messages */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-medium text-[#000000]">
            Conversación ({incident.messages.length} mensajes)
          </h2>
        </div>

        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto bg-[#FAFAFA]">
          {incident.messages.filter(m => !m.isInternal).map((msg) => {
            const isCustomer = msg.senderRole === 'CUSTOMER';
            const isAdmin = msg.senderRole === 'ADMIN';
            return (
              <div key={msg.id} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${
                  isCustomer
                    ? 'bg-[#0066FF] border-[#0066FF]'
                    : isAdmin
                    ? 'bg-blue-100 border-blue-200'
                    : 'bg-gray-100 border-gray-200'
                } border rounded-2xl p-4`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${isCustomer ? 'text-white' : 'text-[#000000]'}`}>
                      {msg.sender.firstName} {msg.sender.lastName}
                    </span>
                    {isAdmin && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        Soporte
                      </span>
                    )}
                    {!isCustomer && !isAdmin && (
                      <span className="text-[10px] bg-gray-200 text-[#4A4A4A] px-1.5 py-0.5 rounded">
                        Vendedor
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isCustomer ? 'text-white' : 'text-[#000000]'} whitespace-pre-wrap`}>{msg.body}</p>
                  <span className={`text-[10px] ${isCustomer ? 'text-blue-100' : 'text-[#4A4A4A]'} mt-2 block`}>
                    {new Date(msg.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        {!isClosed ? (
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-[#000000] placeholder:text-[#4A4A4A] focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-gray-300 text-white rounded-2xl text-sm font-medium transition-colors"
              >
                {sending ? '...' : 'Enviar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 border-t border-gray-200 bg-[#FAFAFA]">
            <p className="text-sm text-[#4A4A4A] text-center">
              Esta incidencia está {incident.status === 'RESOLVED' ? 'resuelta' : 'cerrada'}.
              No se pueden enviar más mensajes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
