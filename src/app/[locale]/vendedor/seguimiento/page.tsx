'use client';

import { useState, useEffect } from 'react';
import { Package, Clock, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ShipmentData {
  id: string;
  shipmentId: string;
  customer: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string | null;
  status: string;
  estimatedDelivery: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  events: { status: string; description: string | null; location: string | null; occurredAt: string }[];
}

interface SummaryData {
  active: number;
  outForDelivery: number;
  delivered: number;
}

const CARRIER_COLORS: Record<string, { bg: string; text: string }> = {
  'Correos': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'DHL': { bg: 'bg-red-100', text: 'text-red-800' },
  'UPS': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'FedEx': { bg: 'bg-blue-100', text: 'text-blue-800' },
};

const STATUS_LABELS: Record<string, string> = {
  'LABEL_CREATED': 'Etiqueta creada',
  'IN_TRANSIT': 'En transito',
  'OUT_FOR_DELIVERY': 'En reparto',
  'DELIVERED': 'Entregado',
  'EXCEPTION': 'Excepcion',
  'RETURNED': 'Devuelto',
};

const STATUS_ORDER = ['LABEL_CREATED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];

function getStages(status: string) {
  const stages = [
    { label: 'Recogido', key: 'LABEL_CREATED' },
    { label: 'En transito', key: 'IN_TRANSIT' },
    { label: 'En reparto', key: 'OUT_FOR_DELIVERY' },
    { label: 'Entregado', key: 'DELIVERED' },
  ];
  const currentIdx = STATUS_ORDER.indexOf(status);
  return stages.map((s, idx) => ({
    ...s,
    status: idx < currentIdx ? 'completed' : idx === currentIdx ? 'current' : 'pending',
  }));
}

export default function SeguimientoPage() {
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [summary, setSummary] = useState<SummaryData>({ active: 0, outForDelivery: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/v2/vendedor/seguimiento');
        if (res.ok) {
          const data = await res.json();
          setShipments(data.shipments || []);
          setSummary(data.summary || { active: 0, outForDelivery: 0, delivered: 0 });
        }
      } catch {
        console.error('Error fetching shipments');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r text-black">
          Seguimiento de Envios
        </h1>
        <p className="text-[#4A4A4A]">Monitorea el estado de todos tus envios activos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Envios Activos</p>
          <p className="mt-3 text-3xl font-bold text-black">{summary.active}</p>
          <p className="text-sm text-blue-600 mt-2">En transito</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-50 border border-orange-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">En Reparto</p>
          <p className="mt-3 text-3xl font-bold text-black">{summary.outForDelivery}</p>
          <p className="text-sm text-orange-600 mt-2">Hoy</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-50 border border-green-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Entregados</p>
          <p className="mt-3 text-3xl font-bold text-black">{summary.delivered}</p>
          <p className="text-sm text-green-600 mt-2">Total entregados</p>
        </Card>
      </div>

      {shipments.length === 0 ? (
        <Card className="p-12 text-center border-0 shadow-sm">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-black mb-2">Sin envios activos</h2>
          <p className="text-[#4A4A4A]">Cuando tengas pedidos enviados, el seguimiento aparecera aqui.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {shipments.map((shipment) => {
            const carrierColor = CARRIER_COLORS[shipment.carrier] || { bg: 'bg-gray-100', text: 'text-gray-800' };
            const stages = getStages(shipment.status);
            return (
              <Card key={shipment.shipmentId} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-300 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-blue-400" />
                        <p className="font-bold text-black">{shipment.id}</p>
                      </div>
                      <p className="text-sm text-[#4A4A4A] mt-2">{shipment.customer}</p>
                      <p className="text-xs text-[#4A4A4A] mt-1">
                        {shipment.shippedAt ? `Enviado: ${new Date(shipment.shippedAt).toLocaleDateString('es-ES')}` : 'Pendiente de envio'}
                      </p>
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
                        <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Numero de Rastreo</p>
                        <p className="mt-2 font-mono font-bold text-black">{shipment.trackingNumber || 'Sin asignar'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Entrega Estimada</p>
                        <p className="mt-2 font-bold text-black">
                          {shipment.estimatedDelivery
                            ? new Date(shipment.estimatedDelivery).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                            : 'Por confirmar'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-6">
                    <div className="relative">
                      <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 rounded-full" />
                      <div className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{
                        width: `${(stages.filter(s => s.status === 'completed').length / stages.length) * 100}%`
                      }} />
                      <div className="relative flex justify-between">
                        {stages.map((stage, idx) => (
                          <div key={stage.label} className="flex flex-col items-center">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                              stage.status === 'completed'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : stage.status === 'current'
                                ? 'bg-yellow-400 text-black ring-4 ring-yellow-200'
                                : 'bg-gray-200 text-[#4A4A4A]'
                            }`}>
                              {stage.status === 'completed' ? '✓' : idx + 1}
                            </div>
                            <p className="mt-2 text-xs font-medium text-[#4A4A4A] text-center w-16">{stage.label}</p>
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
                        <p className="font-semibold text-black">Estado del Envio</p>
                        <p className="text-sm text-[#4A4A4A] mt-1">
                          {STATUS_LABELS[shipment.status] || shipment.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
