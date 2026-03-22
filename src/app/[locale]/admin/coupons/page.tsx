'use client';

import { useState } from 'react';
import { Search, MoreVertical, Plus, ToggleRight, ToggleLeft } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: '%' | '€';
  value: number;
  minPurchase: number;
  uses: number;
  limit: number;
  validFrom: string;
  validTo: string;
  status: boolean;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'SAVE20',
    type: '%',
    value: 20,
    minPurchase: 50,
    uses: 45,
    limit: 100,
    validFrom: '2025-01-01',
    validTo: '2025-04-01',
    status: true,
  },
  {
    id: '2',
    code: 'WELCOME10',
    type: '€',
    value: 10,
    minPurchase: 30,
    uses: 128,
    limit: 200,
    validFrom: '2025-02-15',
    validTo: '2025-05-15',
    status: true,
  },
  {
    id: '3',
    code: 'SPRING15',
    type: '%',
    value: 15,
    minPurchase: 75,
    uses: 23,
    limit: 50,
    validFrom: '2025-03-01',
    validTo: '2025-03-31',
    status: true,
  },
  {
    id: '4',
    code: 'SUMMER25',
    type: '%',
    value: 25,
    minPurchase: 100,
    uses: 0,
    limit: 500,
    validFrom: '2025-06-01',
    validTo: '2025-08-31',
    status: false,
  },
  {
    id: '5',
    code: 'PROMO5',
    type: '€',
    value: 5,
    minPurchase: 20,
    uses: 342,
    limit: 500,
    validFrom: '2025-03-10',
    validTo: '2025-03-20',
    status: true,
  },
];

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [coupons, setCoupons] = useState(mockCoupons);

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setCoupons(
      coupons.map((coupon) =>
        coupon.id === id ? { ...coupon, status: !coupon.status } : coupon
      )
    );
  };

  const isExpired = (validTo: string) => {
    return new Date(validTo) < new Date();
  };

  const getUsagePercentage = (uses: number, limit: number) => {
    return Math.round((uses / limit) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestión de Cupones
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {filteredCoupons.length} cupones
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-[#0066FF] text-white font-semibold rounded-lg hover:bg-[#0052CC] transition-all whitespace-nowrap flex-shrink-0">
          <Plus className="h-4 sm:h-5 w-4 sm:w-5" />
          Crear Cupón
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por código..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Descuento
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Compra Mín.
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Usos
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Válido
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCoupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-block px-3 py-1 bg-[#0066FF]/30 text-[#0066FF] font-bold rounded-lg text-sm">
                    {coupon.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  {coupon.value}
                  {coupon.type === '%' ? '%' : '€'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  €{coupon.minPurchase.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-gray-900 font-semibold">
                      {coupon.uses}/{coupon.limit}
                    </p>
                    <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-[#0066FF]"
                        style={{
                          width: `${getUsagePercentage(coupon.uses, coupon.limit)}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div>
                    <p className="font-semibold">
                      {new Date(coupon.validFrom).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-xs">
                      hasta{' '}
                      {new Date(coupon.validTo).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleStatus(coupon.id)}
                    className="flex items-center gap-2"
                  >
                    {coupon.status ? (
                      <>
                        <ToggleRight className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          Activo
                        </span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          Inactivo
                        </span>
                      </>
                    )}
                  </button>
                  {isExpired(coupon.validTo) && (
                    <p className="text-xs text-red-600 mt-1">
                      Expirado
                    </p>
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
