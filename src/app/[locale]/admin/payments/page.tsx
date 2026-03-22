'use client';

import { useState } from 'react';
import { Search, MoreVertical, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

interface Transaction {
  id: string;
  store: string;
  amount: number;
  commission: number;
  status: 'Completado' | 'Pendiente' | 'Fallido';
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TX-001',
    store: 'TechPro Store',
    amount: 5230.50,
    commission: 5.0,
    status: 'Completado',
    date: '2025-03-10',
  },
  {
    id: 'TX-002',
    store: 'Fashion World',
    amount: 2150.00,
    commission: 6.0,
    status: 'Pendiente',
    date: '2025-03-12',
  },
  {
    id: 'TX-003',
    store: 'Books Paradise',
    amount: 8900.00,
    commission: 4.0,
    status: 'Completado',
    date: '2025-03-08',
  },
  {
    id: 'TX-004',
    store: 'Home & Garden',
    amount: 3450.75,
    commission: 6.0,
    status: 'Completado',
    date: '2025-03-09',
  },
  {
    id: 'TX-005',
    store: 'TechPro Store',
    amount: 1200.00,
    commission: 5.0,
    status: 'Fallido',
    date: '2025-03-11',
  },
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions] = useState(mockTransactions);

  const filteredTransactions = transactions.filter((tx) =>
    tx.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate balance
  const totalBalance = transactions
    .filter((tx) => tx.status === 'Completado')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const stats = {
    collectedCommissions: transactions
      .filter((tx) => tx.status === 'Completado')
      .reduce((sum, tx) => sum + (tx.amount * tx.commission) / 100, 0),
    pendingPayments: transactions
      .filter((tx) => tx.status === 'Pendiente')
      .reduce((sum, tx) => sum + tx.amount, 0),
    totalPaid: transactions
      .filter((tx) => tx.status === 'Completado')
      .reduce((sum, tx) => sum + tx.amount, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-50 text-green-700';
      case 'Pendiente':
        return 'bg-amber-50 text-amber-700';
      case 'Fallido':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Pendiente':
        return <Clock className="h-4 w-4" />;
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
            Gestión de Pagos
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Saldo de plataforma y transacciones
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="rounded-lg border border-gray-200 bg-[#0066FF] p-6 sm:p-8 text-white">
        <p className="text-xs sm:text-sm opacity-90 mb-2">Saldo Total</p>
        <p className="text-3xl sm:text-4xl font-bold mb-4">€{totalBalance.toFixed(2)}</p>
        <p className="text-xs sm:text-sm opacity-75">
          Ingresos completados del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Comisiones Cobradas
            </p>
            <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-orange-500 flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            €{stats.collectedCommissions.toFixed(2)}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Ingresos de comisión
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Pendientes de Pago
            </p>
            <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500 flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            €{stats.pendingPayments.toFixed(2)}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            En proceso de transferencia
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Pagos Realizados
            </p>
            <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-green-500 flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            €{stats.totalPaid.toFixed(2)}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Transferencias completadas
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por tienda o ID..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                ID Transacción
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Tienda
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Comisión
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
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  {tx.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {tx.store}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  €{tx.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {tx.commission}%
                  <span className="ml-2 text-xs text-gray-500">
                    (€{((tx.amount * tx.commission) / 100).toFixed(2)})
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      tx.status
                    )}`}
                  >
                    {getStatusIcon(tx.status)}
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                  {new Date(tx.date).toLocaleDateString('es-ES')}
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
