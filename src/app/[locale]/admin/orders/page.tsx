'use client';

import { useState } from 'react';
import { Search, Calendar, MoreVertical, Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  status: 'Pendiente' | 'En proceso' | 'Completado' | 'Cancelado';
  date: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'NXM-2026-03-7F8A2D4E',
    customer: 'María García',
    items: 3,
    total: 156.50,
    status: 'Completado',
    date: '2025-03-10',
  },
  {
    id: '2',
    orderNumber: 'NXM-2026-03-3B9C1E6F',
    customer: 'Juan López',
    items: 1,
    total: 89.99,
    status: 'En proceso',
    date: '2025-03-12',
  },
  {
    id: '3',
    orderNumber: 'NXM-2026-02-A4D7F832',
    customer: 'Ana Rodríguez',
    items: 5,
    total: 234.75,
    status: 'Pendiente',
    date: '2025-03-14',
  },
  {
    id: '4',
    orderNumber: 'NXM-2026-02-6E1C9B5A',
    customer: 'Carlos Martínez',
    items: 2,
    total: 128.00,
    status: 'Completado',
    date: '2025-03-13',
  },
  {
    id: '5',
    orderNumber: 'NXM-2026-01-D2F4A8E3',
    customer: 'Laura Sánchez',
    items: 4,
    total: 456.80,
    status: 'En proceso',
    date: '2025-03-11',
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [orders] = useState(mockOrders);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'Pendiente').length,
    inProcess: orders.filter((o) => o.status === 'En proceso').length,
    completed: orders.filter((o) => o.status === 'Completado').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-50 text-green-700';
      case 'En proceso':
        return 'bg-blue-50 text-blue-700';
      case 'Pendiente':
        return 'bg-amber-50 text-amber-700';
      case 'Cancelado':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'En proceso':
        return <Clock className="h-4 w-4" />;
      case 'Pendiente':
        return <Package className="h-4 w-4" />;
      case 'Cancelado':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestión de Pedidos
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {filteredOrders.length} pedidos
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Total</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats.total}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Todos los pedidos
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Pendientes</p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-700">
            {stats.pending}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Esperando confirmación
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            En proceso
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-700">
            {stats.inProcess}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Siendo procesados
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Completados
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-green-700">
            {stats.completed}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Entregados
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por número o cliente..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600 flex-shrink-0" />
            <input
              type="date"
              className="px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent flex-1 sm:flex-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Artículos
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {order.items} art.
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  €{order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                  {new Date(order.date).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
