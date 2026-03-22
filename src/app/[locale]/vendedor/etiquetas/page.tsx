'use client';

import { Plus, Printer, Copy, X, Package, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SHIPPING_LABELS = [
  {
    id: 'NXM-ENV-7C4D9E2F6A',
    orderId: 'NXM-2026-03-7F8A2D4E',
    carrier: 'Correos',
    trackingNumber: 'ES123456789',
    status: 'Impresa',
    weight: '0.85 kg',
    dimensions: '22 x 15 x 5 cm',
    origin: 'Madrid, 28001',
    destination: 'Barcelona, 08002',
    date: '15 de marzo de 2026',
  },
  {
    id: 'NXM-ENV-3A8B1E5D7F',
    orderId: 'NXM-2026-03-3B9C1E6F',
    carrier: 'DHL',
    trackingNumber: 'DHL987654321',
    status: 'Impresa',
    weight: '0.35 kg',
    dimensions: '12 x 10 x 3 cm',
    origin: 'Madrid, 28001',
    destination: 'Valencia, 46001',
    date: '14 de marzo de 2026',
  },
  {
    id: 'NXM-ENV-9F2C6A4E8B',
    orderId: 'NXM-2026-02-A4D7F832',
    carrier: 'UPS',
    trackingNumber: 'UPS555555555',
    status: 'Pendiente',
    weight: '1.20 kg',
    dimensions: '30 x 20 x 10 cm',
    origin: 'Madrid, 28001',
    destination: 'Bilbao, 48001',
    date: '13 de marzo de 2026',
  },
  {
    id: 'NXM-ENV-5D7E3B1F9C',
    orderId: 'NXM-2026-02-6E1C9B5A',
    carrier: 'Correos',
    trackingNumber: 'ES111222333',
    status: 'Impresa',
    weight: '0.60 kg',
    dimensions: '18 x 14 x 6 cm',
    origin: 'Madrid, 28001',
    destination: 'Sevilla, 41001',
    date: '12 de marzo de 2026',
  },
  {
    id: 'NXM-ENV-1A4F8C6E2D',
    orderId: 'NXM-2026-01-D2F4A8E3',
    carrier: 'FedEx',
    trackingNumber: 'FedEx444555666',
    status: 'Impresa',
    weight: '2.10 kg',
    dimensions: '40 x 25 x 15 cm',
    origin: 'Madrid, 28001',
    destination: 'Málaga, 29001',
    date: '11 de marzo de 2026',
  },
];

const CARRIER_COLORS: Record<string, string> = {
  'Correos': 'bg-yellow-100 text-yellow-800',
  'DHL': 'bg-red-100 text-red-800',
  'UPS': 'bg-blue-100 text-blue-800',
  'FedEx': 'bg-blue-100 text-blue-800',
};

const STATUS_CONFIG: Record<string, { badge: string; dot: string }> = {
  'Impresa': { badge: 'bg-green-50 text-green-700 border border-green-200', dot: 'bg-green-400' },
  'Pendiente': { badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-400' },
};

export default function EtiquetasPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r text-black ">
            Etiquetas de Envío
          </h1>
          <p className="text-[#4A4A4A]">Crea e imprime etiquetas de envío para tus pedidos</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-black border-0">
          <Plus className="h-5 w-5" />
          Crear Etiqueta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Total Etiquetas</p>
          <p className="mt-3 text-3xl font-bold text-black">124</p>
          <p className="text-sm text-blue-400 mt-2">Este mes</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-50 border border-green-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Impresas</p>
          <p className="mt-3 text-3xl font-bold text-black">118</p>
          <p className="text-sm text-green-400 mt-2">95% completado</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-50 border border-yellow-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Pendientes</p>
          <p className="mt-3 text-3xl font-bold text-black">6</p>
          <p className="text-sm text-yellow-400 mt-2">Listas para imprimir</p>
        </Card>
      </div>

      {/* Shipping Labels List */}
      <div className="space-y-4">
        {SHIPPING_LABELS.map((label) => (
          <Card key={label.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 pb-6 border-b border-gray-300">
                <div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-400" />
                    <p className="font-bold text-black">{label.id}</p>
                    <span className="text-sm text-[#4A4A4A]">•</span>
                    <p className="text-sm text-blue-400 font-semibold">{label.orderId}</p>
                  </div>
                  <p className="text-sm text-[#4A4A4A] mt-2">{label.date}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${CARRIER_COLORS[label.carrier]}`}>
                    <span className="font-semibold text-xs">{label.carrier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${STATUS_CONFIG[label.status].dot}`} />
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[label.status].badge}`}>
                      {label.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
                {/* Tracking Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Número de Rastreo</p>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="font-mono font-bold text-black">{label.trackingNumber}</p>
                      <button className="text-gray-500 hover:text-[#4A4A4A] p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Peso</p>
                    <p className="mt-2 font-semibold text-black">{label.weight}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Dimensiones</p>
                    <p className="mt-2 font-semibold text-black">{label.dimensions}</p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Origen</p>
                    <div className="mt-2 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#4A4A4A] mt-0.5 flex-shrink-0" />
                      <p className="font-semibold text-black">{label.origin}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Destino</p>
                    <div className="mt-2 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="font-semibold text-black">{label.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                {label.status === 'Pendiente' && (
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-black border-0 flex-1 sm:flex-none">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                )}
                {label.status === 'Impresa' && (
                  <Button className="gap-2 bg-gray-600 hover:bg-gray-700 text-black border-0 flex-1 sm:flex-none" disabled>
                    <Printer className="h-4 w-4" />
                    Imprimida
                  </Button>
                )}
                <Button variant="outline" className="gap-2 border-gray-300 hover:bg-gray-100 flex-1 sm:flex-none">
                  Ver Detalles
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
