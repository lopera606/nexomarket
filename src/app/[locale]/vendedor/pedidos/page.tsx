'use client';

import { useState } from 'react';
import { Printer, Eye, MoreVertical, CheckCircle, Truck, Clock, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ORDERS = [
  {
    id: 'NXM-2026-03-7F8A2D4E',
    customer: 'Ana García',
    products: 'MacBook Pro 14"',
    total: '1,299.99€',
    status: 'En Preparación',
    date: '2024-03-12',
  },
  {
    id: 'NXM-2026-03-3B9C1E6F',
    customer: 'Carlos López',
    products: 'AirPods Pro x 2',
    total: '499.98€',
    status: 'Enviado',
    date: '2024-03-11',
  },
  {
    id: 'NXM-2026-02-A4D7F832',
    customer: 'María Rodríguez',
    products: 'iPhone 15 Pro',
    total: '999.99€',
    status: 'Entregado',
    date: '2024-03-10',
  },
  {
    id: 'NXM-2026-02-6E1C9B5A',
    customer: 'Juan Pérez',
    products: 'iPad Air, Magic Keyboard',
    total: '899.98€',
    status: 'En Preparación',
    date: '2024-03-09',
  },
  {
    id: 'NXM-2026-01-D2F4A8E3',
    customer: 'Laura Sánchez',
    products: 'Apple Watch Series 9',
    total: '399.99€',
    status: 'Enviado',
    date: '2024-03-08',
  },
  {
    id: 'NXM-2026-01-9C3B7D1F',
    customer: 'Roberto García',
    products: 'MacBook Pro 14" x 3',
    total: '3,899.97€',
    status: 'Entregado',
    date: '2024-03-07',
  },
];

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
};

export default function PedidosPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredOrders = selectedStatus
    ? ORDERS.filter(order => order.status === selectedStatus)
    : ORDERS;

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
          <p className="mt-2 text-2xl sm:text-3xl font-bold" style={{ color: '#000000' }}>{ORDERS.length}</p>
        </Card>

        {/* Status Filters */}
        {statuses.map(status => {
          const count = ORDERS.filter(o => o.status === status).length;
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
                  <td className="px-6 py-4 font-bold" style={{ color: '#000000' }}>{order.total}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${STATUS_CONFIG[order.status].dot}`} />
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[order.status].badge}`}>
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
          <p style={{ color: '#4A4A4A' }} className="text-lg">No hay pedidos con este estado</p>
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
