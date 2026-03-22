'use client';

import { useState } from 'react';
import { Search, MoreVertical, Truck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface Shipment {
  id: string;
  tracking: string;
  order: string;
  carrier: string;
  origin: string;
  destination: string;
  status: 'En tránsito' | 'Entregado' | 'Incidencia';
  estimatedDelivery: string;
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    tracking: 'NXMTRK-ES84729163845',
    order: 'NXM-2026-03-7F8A2D4E',
    carrier: 'DHL Express',
    origin: 'Madrid',
    destination: 'Barcelona',
    status: 'Entregado',
    estimatedDelivery: '2025-03-14',
  },
  {
    id: '2',
    tracking: 'NXMTRK-ES63518274936',
    order: 'NXM-2026-03-3B9C1E6F',
    carrier: 'Correos',
    origin: 'Valencia',
    destination: 'Sevilla',
    status: 'En tránsito',
    estimatedDelivery: '2025-03-16',
  },
  {
    id: '3',
    tracking: 'NXMTRK-ES29471836502',
    order: 'NXM-2026-02-A4D7F832',
    carrier: 'UPS',
    origin: 'Bilbao',
    destination: 'Madrid',
    status: 'En tránsito',
    estimatedDelivery: '2025-03-15',
  },
  {
    id: '4',
    tracking: 'NXMTRK-ES75283641927',
    order: 'NXM-2026-02-6E1C9B5A',
    carrier: 'FedEx',
    origin: 'Málaga',
    destination: 'Murcia',
    status: 'Incidencia',
    estimatedDelivery: '2025-03-17',
  },
  {
    id: '5',
    tracking: 'NXMTRK-ES41627385914',
    order: 'NXM-2026-01-D2F4A8E3',
    carrier: 'Correos',
    origin: 'Zaragoza',
    destination: 'Alicante',
    status: 'Entregado',
    estimatedDelivery: '2025-03-13',
  },
];

export default function ShippingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shipments] = useState(mockShipments);

  const filteredShipments = shipments.filter((shipment) =>
    shipment.tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats = {
    today: shipments.filter((s) => {
      const today = new Date().toISOString().split('T')[0];
      return s.estimatedDelivery === today;
    }).length,
    inTransit: shipments.filter((s) => s.status === 'En tránsito').length,
    delivered: shipments.filter((s) => s.status === 'Entregado').length,
    incidents: shipments.filter((s) => s.status === 'Incidencia').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregado':
        return 'bg-green-50 text-green-700';
      case 'En tránsito':
        return 'bg-blue-50 text-blue-700';
      case 'Incidencia':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Entregado':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'En tránsito':
        return <Truck className="h-4 w-4" />;
      case 'Incidencia':
        return <AlertTriangle className="h-4 w-4" />;
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
            Gestión de Envíos
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Seguimiento y estado de entregas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Envíos Hoy
            </p>
            <Truck className="h-4 sm:h-5 w-4 sm:w-5 text-[#0066FF] flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats.today}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Programados para hoy
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              En Tránsito
            </p>
            <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500 flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats.inTransit}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            En camino
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Entregados
            </p>
            <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-green-500 flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats.delivered}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Completados
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Incidencias
            </p>
            <AlertTriangle className="h-4 sm:h-5 w-4 sm:w-5 text-red-500 flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats.incidents}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Requieren atención
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por seguimiento, pedido o transportista..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Seguimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Transportista
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Origen
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Destino
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Entrega Est.
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredShipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  {shipment.tracking}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {shipment.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {shipment.carrier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {shipment.origin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {shipment.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {getStatusIcon(shipment.status)}
                    {shipment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                  {new Date(shipment.estimatedDelivery).toLocaleDateString(
                    'es-ES'
                  )}
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
