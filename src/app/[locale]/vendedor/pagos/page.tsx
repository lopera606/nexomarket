'use client';

import { ArrowUpRight, Calendar, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PAYOUTS = [
  {
    id: '#PAY-001245',
    date: '15 de marzo de 2026',
    amount: '2,450€',
    status: 'Completado',
    method: 'Stripe',
    transactionId: 'pi_3OoKJ2HQz7vF8j3a',
  },
  {
    id: '#PAY-001244',
    date: '01 de marzo de 2026',
    amount: '3,850€',
    status: 'Completado',
    method: 'Stripe',
    transactionId: 'pi_3OoKJ2HQz7vF8j3b',
  },
  {
    id: '#PAY-001243',
    date: '15 de febrero de 2026',
    amount: '2,120€',
    status: 'Completado',
    method: 'Stripe',
    transactionId: 'pi_3OoKJ2HQz7vF8j3c',
  },
  {
    id: '#PAY-001242',
    date: '01 de febrero de 2026',
    amount: '3,420€',
    status: 'Completado',
    method: 'Stripe',
    transactionId: 'pi_3OoKJ2HQz7vF8j3d',
  },
  {
    id: '#PAY-001241',
    date: '15 de enero de 2026',
    amount: '2,890€',
    status: 'Completado',
    method: 'Stripe',
    transactionId: 'pi_3OoKJ2HQz7vF8j3e',
  },
];

const STATUS_CONFIG: Record<string, { badge: string; icon: any }> = {
  'Completado': { badge: 'bg-green-50 text-green-700 border border-green-200', icon: CheckCircle },
  'Pendiente': { badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200', icon: Clock },
  'Fallido': { badge: 'bg-red-50 text-red-700 border border-red-200', icon: AlertCircle },
};

export default function PagosPage() {
  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>
          Pagos y Transferencias
        </h1>
        <p className="text-base sm:text-lg" style={{ color: '#4A4A4A' }}>Gestiona tus pagos y transferencias bancarias</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 gap-6 sm:gap-6 lg:grid-cols-3">
        {/* Available Balance */}
        <Card className="relative overflow-hidden p-6 sm:p-8 bg-blue-50 border border-blue-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">Saldo Disponible</p>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold" style={{ color: '#0066FF' }}>4,850€</p>
            <div className="mt-4 flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Listo para transferencia</span>
            </div>
          </div>
          <CreditCard className="absolute top-6 right-6 h-12 w-12 text-blue-600 opacity-10" />
        </Card>

        {/* Pending Balance */}
        <Card className="relative overflow-hidden p-6 sm:p-8 bg-orange-50 border border-orange-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">Saldo Pendiente</p>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-orange-700">1,320€</p>
            <div className="mt-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-600">En proceso</span>
            </div>
          </div>
          <CreditCard className="absolute top-6 right-6 h-12 w-12 text-orange-300 opacity-10" />
        </Card>

        {/* Next Payout */}
        <Card className="relative overflow-hidden p-6 sm:p-8 bg-green-50 border border-green-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">Próxima Transferencia</p>
            <p className="mt-3 text-xl sm:text-2xl font-extrabold text-green-900">30 de marzo</p>
            <div className="mt-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-600">En 15 días</span>
            </div>
          </div>
          <CreditCard className="absolute top-6 right-6 h-12 w-12 text-green-600 opacity-10" />
        </Card>
      </div>

      {/* Connected Payment Methods */}
      <Card className="p-6 sm:p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-6">
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#000000' }}>Métodos de Pago Conectados</h2>
            <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>Cuenta Stripe para recibir transferencias</p>
          </div>
          <Button className="gap-2 text-white border-0 rounded-2xl hover:opacity-90 transition-all duration-200 w-full sm:w-auto" style={{ backgroundColor: '#0066FF' }}>
            + Añadir Método
          </Button>
        </div>

        <div className="rounded-xl p-6 border border-gray-300 bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-300">
                <CreditCard className="h-6 w-6" style={{ color: '#0066FF' }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#000000' }}>Stripe Connect</p>
                <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>Cuenta conectada desde 15 de enero de 2026</p>
                <p className="text-xs mt-2" style={{ color: '#4A4A4A' }}>Cuenta: acct_1OoKJ2HQz7vF8j3a</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-full px-3 py-1 border border-green-200">
              <span className="text-xs font-semibold text-green-700">Conectado</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payout History */}
      <Card className="overflow-hidden border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold" style={{ color: '#000000' }}>Historial de Transferencias</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>ID Transferencia</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Fecha</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Cantidad</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Método</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Estado</th>
                <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>ID Transacción</th>
                <th className="px-6 py-4 text-center font-semibold" style={{ color: '#000000' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((payout) => {
                const StatusIcon = STATUS_CONFIG[payout.status].icon;
                return (
                  <tr key={payout.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold" style={{ color: '#0066FF' }}>{payout.id}</td>
                    <td className="px-6 py-4" style={{ color: '#000000' }}>{payout.date}</td>
                    <td className="px-6 py-4 font-bold" style={{ color: '#000000' }}>{payout.amount}</td>
                    <td className="px-6 py-4" style={{ color: '#4A4A4A' }}>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" style={{ color: '#4A4A4A' }} />
                        {payout.method}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[payout.status].badge}`}>
                          {payout.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs" style={{ color: '#4A4A4A' }}>{payout.transactionId}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="font-semibold text-sm" style={{ color: '#0066FF' }}>
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payout Schedule Info */}
      <Card className="p-6 sm:p-8 bg-blue-50 border border-blue-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="flex gap-3 sm:gap-4">
          <AlertCircle className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: '#0066FF' }} />
          <div>
            <h3 className="font-bold mb-2" style={{ color: '#000000' }}>Cronograma de Transferencias</h3>
            <p className="text-sm" style={{ color: '#4A4A4A' }}>
              Las transferencias se procesan cada 15 días. El saldo disponible se transfiere automáticamente a tu cuenta Stripe conectada. El saldo pendiente incluye fondos en proceso de verificación o sujetos a períodos de retención.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
