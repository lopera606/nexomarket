'use client';

import { useState, useEffect } from 'react';
import { Printer, Eye, MoreVertical, CheckCircle, Truck, Clock, Download, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG: Record<string, { badge: string; dot: string; icon: React.ReactNode }> = {
  'En Preparación': {
    badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    dot: 'bg-yellow-500',
    icon: <Clock className="h-4 w-4" />
  },
  'Enviado': {
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
    icon: <Truck className="h-4 w-4" />
  },
  'Entregado': {
    badge: 'bg-green-50 text-green-700 border border-green-200',
    dot: 'bg-green-500',
    icon: <CheckCircle className="h-4 w-4" />
  },
  'Cancelado': {
    badge: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
    icon: <Clock className="h-4 w-4" />
  },
};

interface Order {
  id: string;
  customer: string;
  products: string;
  total: number;
  status: string;
  date: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

export default function PedidosPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v2/vendedor/pedidos')
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar pedidos');
        return r.json();
      })
      .then((data) => setOrders(data.orders || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = selectedStatus
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

  const statuses = ['En Preparación', 'Enviado', 'Entregado'];

  const handlePrint = (orderId: string) => {
    setActionFeedback(`Generando etiqueta de envío para ${orderId}...`);
    setTimeout(() => {
      setActionFeedback(null);
      console.log('Print label for order:', orderId);
    }, 1500);
  };

  const handleViewDetails = (orderId: string) => {
    setActionFeedback(`Cargando detalles del pedido ${orderId}...`);
    setTimeout(() => {
      setActionFeedback(null);
      console.log('View details for order:', orderId);
    }, 1200);
  };

  const handleMoreOptions = (orderId: string) => {
    setActionFeedback(`Abriendo opciones para ${orderId}...`);
    setTimeout(() => {
      setActionFeedback(null);
      console.log('More options for order:', orderId);
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0066FF' }} />
          <p className="text-sm" style={{ color: '#4A4A4A' }}>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: '#000000' }}>Error al cargar pedidos</p>
          <p className="text-sm mt-2" style={{ color: '#4A4A4A' }}>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" style={{ backgroundColor: '#0066FF', color: 'white' }}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>Pedidos</h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: '#4A4A4A' }}>Gestiona todos tus pedidos de venta</p>
      </div>

      {/* Status Cards Filter */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Todos */}
        <Card
          onClick={() => setSelectedStatus(null)}
          className={`cursor-pointer border-0 transition-all p-4 ${
            selectedStatus === null
              ? 'ring-2 bg-blue-50'
              : 'hover:shadow-md'
          }`}
          style={{
            backgroundColor: selectedStatus === null ? '#f0f6ff' : '#ffffff',
            border: selectedStatus === null ? '2px solid #0066FF' : '1px solid #e5e7eb',
            boxShadow: '0 2px 40px rgba(0,0,0,0.04)',
          }}
        >
          <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">Todos</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold" style={{ color: '#000000' }}>{orders.length}</p>
        </Card>

        {/* Status Filters */}
        {statuses.map(status => {
          const count = orders.filter(o => o.status === status).length;
          const config = STATUS_CONFIG[status];
          return (
            <Card
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`cursor-pointer border-0 transition-all p-4`}
              style={{
                backgroundColor: selectedStatus === status ? '#f0f6ff' : '#ffffff',
                border: selectedStatus === status ? '2px solid #0066FF' : '1px solid #e5e7eb',
                boxShadow: '0 2px 40px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{status}</p>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold" style={{ color: '#000000' }}>{count}</p>
                </div>
                <div className={`${config.dot} rounded-full p-2.5 flex-shrink-0`}>
                  <div className="text-white">
                    {config.icon}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Pedido</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Cliente</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Productos</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Total</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Estado</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Fecha</th>
                <th className="px-6 py-4 text-center font-semibold" style={{ color: '#000000' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold" style={{ color: '#0066FF' }}>{order.id}</td>
                  <td className="px-6 py-4 font-medium" style={{ color: '#000000' }}>{order.customer}</td>
                  <td className="px-6 py-4" style={{ color: '#4A4A4A' }}>{order.products}</td>
                  <td className="px-6 py-4 font-bold" style={{ color: '#000000' }}>{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${(STATUS_CONFIG[order.status] || STATUS_CONFIG['En Preparación']).dot}`} />
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${(STATUS_CONFIG[order.status] || STATUS_CONFIG['En Preparación']).badge}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: '#4A4A4A' }}>{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handlePrint(order.id)}
                        className="rounded-lg p-2 hover:bg-blue-50 transition-colors"
                        title="Generar Etiqueta"
                      >
                        <Printer className="h-4 w-4" style={{ color: '#0066FF' }} />
                      </button>
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                        title="Ver Detalles"
                      >
                        <Eye className="h-4 w-4" style={{ color: '#4A4A4A' }} />
                      </button>
                      <button
                        onClick={() => handleMoreOptions(order.id)}
                        className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                        title="Más opciones"
                      >
                        <MoreVertical className="h-4 w-4" style={{ color: '#4A4A4A' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card className="border border-gray-200 p-8 text-center" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p style={{ color: '#4A4A4A' }} className="text-lg">No hay pedidos {selectedStatus ? `con estado "${selectedStatus}"` : ''}</p>
        </Card>
      )}

      {/* Action Feedback */}
      {actionFeedback && (
        <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 max-w-sm">
          <Card className="bg-blue-50 border border-blue-200 p-4 flex items-center gap-3" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <div className="animate-spin flex-shrink-0">
              <div className="h-5 w-5 border-2 border-blue-300 border-t-blue-600 rounded-full" />
            </div>
            <p className="text-sm" style={{ color: '#0066FF' }}>{actionFeedback}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
