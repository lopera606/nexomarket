'use client';

import { TrendingUp, MapPin, Package, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const SHIPMENTS = [
  {
    id: 'NXM-2026-03-7F8A2D4E',
    customer: 'Ana García López',
    carrier: 'Correos',
    trackingNumber: 'ES123456789',
    estimatedDelivery: '18 de marzo de 2026',
    lastUpdate: 'Hace 2 horas',
    stages: [
      { label: 'Recogido', status: 'completed', date: '15 de marzo' },
      { label: 'En tránsito', status: 'completed', date: '16 de marzo' },
      { label: 'En reparto', status: 'current', date: 'Hoy' },
      { label: 'Entregado', status: 'pending', date: 'Próximamente' },
    ],
  },
  {
    id: 'NXM-2026-03-3B9C1E6F',
    customer: 'Carlos López Martín',
    carrier: 'DHL',
    trackingNumber: 'DHL987654321',
    estimatedDelivery: '20 de marzo de 2026',
    lastUpdate: 'Hace 8 horas',
    stages: [
      { label: 'Recogido', status: 'completed', date: '14 de marzo' },
      { label: 'En tránsito', status: 'current', date: 'Hoy' },
      { label: 'En reparto', status: 'pending', date: 'Próximamente' },
      { label: 'Entregado', status: 'pending', date: 'Próximamente' },
    ],
  },
  {
    id: 'NXM-2026-02-A4D7F832',
    customer: 'María Rodríguez González',
    carrier: 'UPS',
    trackingNumber: 'UPS555555555',
    estimatedDelivery: '22 de marzo de 2026',
    lastUpdate: 'Hace 1 día',
    stages: [
      { label: 'Recogido', status: 'completed', date: '13 de marzo' },
      { label: 'En tránsito', status: 'completed', date: '15 de marzo' },
      { label: 'En reparto', status: 'pending', date: 'Próximamente' },
      { label: 'Entregado', status: 'pending', date: 'Próximamente' },
    ],
  },
  {
    id: 'NXM-2026-02-6E1C9B5A',
    customer: 'Juan Pérez Sánchez',
    carrier: 'Correos',
    trackingNumber: 'ES111222333',
    estimatedDelivery: '19 de marzo de 2026',
    lastUpdate: 'Hace 4 horas',
    stages: [
      { label: 'Recogido', status: 'completed', date: '12 de marzo' },
      { label: 'En tránsito', status: 'completed', date: '14 de marzo' },
      { label: 'En reparto', status: 'current', date: 'Hoy' },
      { label: 'Entregado', status: 'pending', date: 'Próximamente' },
    ],
  },
];

const CARRIER_COLORS: Record<string, { bg: string; text: string }> = {
  'Correos': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'DHL': { bg: 'bg-red-100', text: 'text-red-800' },
  'UPS': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'FedEx': { bg: 'bg-blue-100', text: 'text-blue-800' },
};

export default function SeguimientoPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r text-black ">
          Seguimiento de Envíos
        </h1>
        <p className="text-[#4A4A4A]">Monitorea el estado de todos tus envíos activos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Envíos Activos</p>
          <p className="mt-3 text-3xl font-bold text-black">42</p>
          <p className="text-sm text-blue-600 mt-2">En tránsito</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-50 border border-orange-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">En Reparto</p>
          <p className="mt-3 text-3xl font-bold text-black">18</p>
          <p className="text-sm text-orange-600 mt-2">Hoy</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-50 border border-green-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Entregados Este Mes</p>
          <p className="mt-3 text-3xl font-bold text-black">156</p>
          <p className="text-sm text-green-600 mt-2">+12% vs mes anterior</p>
        </Card>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {SHIPMENTS.map((shipment) => {
          const carrierColor = CARRIER_COLORS[shipment.carrier] || CARRIER_COLORS['Correos'];
          return (
            <Card key={shipment.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-300 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-blue-400" />
                      <p className="font-bold text-black">{shipment.id}</p>
                    </div>
                    <p className="text-sm text-[#4A4A4A] mt-2">{shipment.customer}</p>
                    <p className="text-xs text-[#4A4A4A] mt-1">Última actualización: {shipment.lastUpdate}</p>
                  </div>

                  <div className="flex gap-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${carrierColor.bg} ${carrierColor.text}`}>
                      {shipment.carrier}
                    </div>
                  </div>
                </div>

                {/* Tracking Info */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Número de Rastreo</p>
                      <p className="mt-2 font-mono font-bold text-black">{shipment.trackingNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Entrega Estimada</p>
                      <p className="mt-2 font-bold text-black">{shipment.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                  <div className="relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 rounded-full" />

                    {/* Dynamic Progress */}
                    <div className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{
                      width: `${(shipment.stages.filter(s => s.status === 'completed').length / shipment.stages.length) * 100}%`
                    }} />

                    {/* Stages */}
                    <div className="relative flex justify-between">
                      {shipment.stages.map((stage, idx) => (
                        <div key={stage.label} className="flex flex-col items-center">
                          {/* Circle */}
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                            stage.status === 'completed'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-black'
                              : stage.status === 'current'
                              ? 'bg-yellow-400 text-black ring-4 ring-yellow-200'
                              : 'bg-gray-200 text-[#4A4A4A]'
                          }`}>
                            {stage.status === 'completed' ? '✓' : idx + 1}
                          </div>
                          {/* Label */}
                          <p className="mt-2 text-xs font-medium text-[#4A4A4A] text-center w-16">{stage.label}</p>
                          <p className="text-xs text-[#4A4A4A] text-center w-16">{stage.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/50 rounded-lg p-4 border border-gray-300">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-black">Estado del Envío</p>
                      <p className="text-sm text-[#4A4A4A] mt-1">
                        {shipment.stages.find(s => s.status === 'current')?.label || shipment.stages[shipment.stages.length - 1].label}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
