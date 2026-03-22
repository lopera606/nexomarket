'use client';

import { useState } from 'react';
import { FileText, Download, Plus, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const INVOICES = [
  {
    id: 'NXM-FAC-2026-8B3E7A12',
    date: '15 de marzo de 2026',
    customer: 'Ana García López',
    items: 3,
    subtotal: '1,299.99€',
    iva: '273.00€',
    total: '1,572.99€',
    status: 'Pagada',
  },
  {
    id: 'NXM-FAC-2026-5D1F9C4E',
    date: '14 de marzo de 2026',
    customer: 'Carlos López Martín',
    items: 1,
    subtotal: '249.99€',
    iva: '52.50€',
    total: '302.49€',
    status: 'Pagada',
  },
  {
    id: 'NXM-FAC-2026-A7C2E8F6',
    date: '13 de marzo de 2026',
    customer: 'María Rodríguez González',
    items: 2,
    subtotal: '999.99€',
    iva: '210.00€',
    total: '1,209.99€',
    status: 'Pagada',
  },
  {
    id: 'NXM-FAC-2026-3F6B1D9A',
    date: '12 de marzo de 2026',
    customer: 'Juan Pérez Sánchez',
    items: 1,
    subtotal: '599.99€',
    iva: '126.00€',
    total: '725.99€',
    status: 'Pendiente',
  },
  {
    id: 'NXM-FAC-2025-E4A8C2D7',
    date: '11 de marzo de 2026',
    customer: 'Elena Ruiz Flores',
    items: 4,
    subtotal: '1,899.96€',
    iva: '399.99€',
    total: '2,299.95€',
    status: 'Vencida',
  },
  {
    id: 'NXM-FAC-2025-7B5F3E91',
    date: '10 de marzo de 2026',
    customer: 'David Fernández López',
    items: 2,
    subtotal: '699.98€',
    iva: '147.00€',
    total: '846.98€',
    status: 'Pagada',
  },
];

const STATUS_CONFIG: Record<string, { badge: string; color: string }> = {
  'Pagada': { badge: 'bg-green-50 text-green-700 border border-green-200', color: 'text-green-400' },
  'Pendiente': { badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200', color: 'text-yellow-400' },
  'Vencida': { badge: 'bg-red-50 text-red-700 border border-red-200', color: 'text-red-400' },
};

export default function FacturasPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = INVOICES.filter(invoice =>
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r text-black ">
            Facturas
          </h1>
          <p className="text-[#4A4A4A]">Gestiona tus facturas de venta</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-black border-0">
          <Plus className="h-5 w-5" />
          Generar Factura
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4A4A4A]" />
        <input
          type="text"
          placeholder="Buscar por número de factura o cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Total Facturas</p>
          <p className="mt-3 text-3xl font-bold text-black">247</p>
          <p className="text-sm text-blue-400 mt-2">+12 este mes</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-50 border border-green-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Pagadas</p>
          <p className="mt-3 text-3xl font-bold text-black">235</p>
          <p className="text-sm text-green-400 mt-2">95% de total</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-50 border border-yellow-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Pendientes</p>
          <p className="mt-3 text-3xl font-bold text-black">8</p>
          <p className="text-sm text-yellow-400 mt-2">3,240€ pendiente</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-50 border border-red-200 border-0 shadow-sm">
          <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Vencidas</p>
          <p className="mt-3 text-3xl font-bold text-black">4</p>
          <p className="text-sm text-red-400 mt-2">2,299€ vencido</p>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 bg-white">
                <th className="px-6 py-4 text-left font-semibold text-black">Factura</th>
                <th className="px-6 py-4 text-left font-semibold text-black">Fecha</th>
                <th className="px-6 py-4 text-left font-semibold text-black">Cliente</th>
                <th className="px-6 py-4 text-center font-semibold text-black">Productos</th>
                <th className="px-6 py-4 text-right font-semibold text-black">Subtotal</th>
                <th className="px-6 py-4 text-right font-semibold text-black">IVA 21%</th>
                <th className="px-6 py-4 text-right font-semibold text-black">Total</th>
                <th className="px-6 py-4 text-left font-semibold text-black">Estado</th>
                <th className="px-6 py-4 text-center font-semibold text-black">Descargar</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-300 hover:bg-blue-500/10 hover:to-transparent transition-colors">
                  <td className="px-6 py-4 font-semibold text-blue-400">{invoice.id}</td>
                  <td className="px-6 py-4 text-black text-sm">{invoice.date}</td>
                  <td className="px-6 py-4 text-black">{invoice.customer}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-lg bg-gray-100 px-3 py-1 font-semibold text-gray-600">
                      {invoice.items}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-black">{invoice.subtotal}</td>
                  <td className="px-6 py-4 text-right text-black">{invoice.iva}</td>
                  <td className="px-6 py-4 text-right font-bold text-black">{invoice.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[invoice.status].badge}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[#0066FF] hover:text-[#0052CC] transition-colors p-2 hover:bg-gray-200 rounded-lg">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* No results message */}
      {filteredInvoices.length === 0 && (
        <Card className="p-12 border-0 shadow-sm text-center">
          <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <p className="text-[#4A4A4A] font-medium">No se encontraron facturas que coincidan con tu búsqueda</p>
        </Card>
      )}
    </div>
  );
}
