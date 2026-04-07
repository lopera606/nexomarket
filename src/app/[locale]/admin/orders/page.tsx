'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, MoreVertical, Package, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  currency: string;
  status: string;
  date: string;
}

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PARTIALLY_SHIPPED: 'Parcialmente enviado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Completado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`/api/admin/orders?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch {
        console.error('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [searchTerm, statusFilter]);

  const filteredOrders = orders.filter((order) => {
    if (dateFilter) {
      const orderDate = order.date.substring(0, 10);
      if (orderDate !== dateFilter) return false;
    }
    return true;
  });

  const statusLabel = (s: string) => STATUS_MAP[s] || s;

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    inProcess: orders.filter((o) => ['CONFIRMED', 'PARTIALLY_SHIPPED', 'SHIPPED'].includes(o.status)).length,
    completed: orders.filter((o) => o.status === 'DELIVERED').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-50 text-green-700';
      case 'CONFIRMED':
      case 'PARTIALLY_SHIPPED':
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'CONFIRMED':
      case 'PARTIALLY_SHIPPED':
      case 'SHIPPED':
        return <Clock className="h-4 w-4" />;
      case 'PENDING':
        return <Package className="h-4 w-4" />;
      case 'CANCELLED':
      case 'REFUNDED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestion de Pedidos
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
            Esperando confirmacion
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
              placeholder="Buscar por numero o cliente..."
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
      {filteredOrders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin pedidos</h2>
          <p className="text-gray-500">No se encontraron pedidos con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Articulos</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Acciones</th>
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
                    ${order.total.toFixed(2)} {order.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {statusLabel(order.status)}
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
      )}
    </div>
  );
}
