'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface PendingItem {
  id: string;
  name: string;
  submittedBy: string;
  submittedDate: string;
  reason?: string;
}

const mockStoresApprovals: PendingItem[] = [
  {
    id: 'ST-001',
    name: 'Nueva Tienda Electronics',
    submittedBy: 'Juan García',
    submittedDate: '2025-03-10',
    reason: 'Verificación de documentos pendiente',
  },
  {
    id: 'ST-002',
    name: 'Online Fashion Boutique',
    submittedBy: 'María López',
    submittedDate: '2025-03-12',
  },
];

const mockProductsApprovals: PendingItem[] = [
  {
    id: 'PR-001',
    name: 'Smartwatch Ultra Pro 2025',
    submittedBy: 'TechPro Store',
    submittedDate: '2025-03-11',
    reason: 'Necesita información de garantía',
  },
  {
    id: 'PR-002',
    name: 'Zapatillas Running Max',
    submittedBy: 'Fashion World',
    submittedDate: '2025-03-13',
  },
  {
    id: 'PR-003',
    name: 'Lámpara LED Inteligente',
    submittedBy: 'Home & Garden',
    submittedDate: '2025-03-14',
  },
];

const mockSellersApprovals: PendingItem[] = [
  {
    id: 'VD-001',
    name: 'Carlos Mendoza Ruiz',
    submittedBy: 'Auto-registro',
    submittedDate: '2025-03-09',
    reason: 'Verificación de identidad requerida',
  },
];

type Tab = 'Tiendas' | 'Productos' | 'Vendedores';

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Tiendas');

  const getItemsByTab = (tab: Tab) => {
    switch (tab) {
      case 'Tiendas':
        return mockStoresApprovals;
      case 'Productos':
        return mockProductsApprovals;
      case 'Vendedores':
        return mockSellersApprovals;
    }
  };

  const items = getItemsByTab(activeTab);

  const handleApprove = (id: string) => {
    console.log(`Aprobado: ${id}`);
  };

  const handleReject = (id: string) => {
    console.log(`Rechazado: ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Aprobaciones Pendientes
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {items.length} elementos esperando revisión
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['Tiendas', 'Productos', 'Vendedores'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`px-4 py-3 font-medium transition-all border-b-2 ${
              activeTab === tab
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
            <span className="ml-2 inline-block px-2 py-0.5 bg-gray-100 rounded-full text-xs font-semibold">
              {getItemsByTab(tab as Tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
            style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}
          >
            {/* Item Info */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enviado por: {item.submittedBy}
                  </p>
                </div>
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
                  Pendiente
                </span>
              </div>

              {/* Reason if exists */}
              {item.reason && (
                <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    {item.reason}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Enviado el{' '}
                {new Date(item.submittedDate).toLocaleDateString('es-ES')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleApprove(item.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
              >
                <CheckCircle2 className="h-5 w-5" />
                Aprobar
              </button>
              <button
                onClick={() => handleReject(item.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-all"
              >
                <XCircle className="h-5 w-5" />
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Todo aprobado
          </p>
          <p className="text-gray-600">
            No hay elementos pendientes de aprobación en esta categoría
          </p>
        </div>
      )}
    </div>
  );
}
