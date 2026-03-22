'use client';

import { useState } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Percent } from 'lucide-react';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({ from: '2025-03-01', to: '2025-03-15' });

  // Mock data
  const kpis = {
    gmv: 125430.50,
    orders: 542,
    aov: 231.25,
    conversion: 3.45,
  };

  const revenueData = [
    { day: 'Lun', revenue: 8230 },
    { day: 'Mar', revenue: 9120 },
    { day: 'Mié', revenue: 7450 },
    { day: 'Jue', revenue: 10230 },
    { day: 'Vie', revenue: 12450 },
    { day: 'Sáb', revenue: 15670 },
    { day: 'Dom', revenue: 13280 },
  ];

  const topProducts = [
    { name: 'Laptop Gaming ASUS', revenue: 45230.50, orders: 35 },
    { name: 'Camiseta Premium Cotton', revenue: 12540.00, orders: 418 },
    { name: 'Auriculares Bluetooth Pro', revenue: 19875.75, orders: 99 },
    { name: 'Lámpara LED Inteligente', revenue: 8940.25, orders: 178 },
    { name: 'Espejo Decorativo', revenue: 6245.00, orders: 83 },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  const getGrowthColor = (value: number) => {
    return value > 0
      ? 'text-green-600'
      : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Analítica
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Métricas y rendimiento de la plataforma
          </p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
        <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
          Desde:
        </label>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) =>
            setDateRange({ ...dateRange, from: e.target.value })
          }
          className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] flex-1 sm:flex-none"
        />
        <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
          Hasta:
        </label>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) =>
            setDateRange({ ...dateRange, to: e.target.value })
          }
          className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] flex-1 sm:flex-none"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">GMV</p>
            <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-[#0066FF] flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            €{kpis.gmv.toFixed(2)}
          </p>
          <p className={`text-[10px] sm:text-xs mt-2 ${getGrowthColor(12.5)}`}>
            ↑ 12.5% vs período anterior
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">Pedidos</p>
            <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500 flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {kpis.orders}
          </p>
          <p className={`text-[10px] sm:text-xs mt-2 ${getGrowthColor(8.3)}`}>
            ↑ 8.3% vs período anterior
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Ticket Promedio
            </p>
            <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-green-500 flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            €{kpis.aov.toFixed(2)}
          </p>
          <p className={`text-[10px] sm:text-xs mt-2 ${getGrowthColor(5.2)}`}>
            ↑ 5.2% vs período anterior
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Conversión
            </p>
            <Percent className="h-4 sm:h-5 w-4 sm:w-5 text-orange-500 flex-shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {kpis.conversion}%
          </p>
          <p className={`text-[10px] sm:text-xs mt-2 ${getGrowthColor(-0.8)}`}>
            ↓ 0.8% vs período anterior
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Ingresos Diarios
          </h3>
          <div className="flex items-end justify-between h-64 gap-2">
            {revenueData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative h-40 w-full flex items-end justify-center">
                  <div
                    className="w-full bg-gradient-to-t from-[#0066FF] to-[#0052CC] rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${(data.revenue / maxRevenue) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 font-semibold">
                  {data.day}
                </p>
                <p className="text-xs text-gray-900 font-bold">
                  €{(data.revenue / 1000).toFixed(1)}k
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Pie Chart Placeholder */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Ingresos por Categoría
          </h3>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#5B2FE8"
                  strokeWidth="15"
                  strokeDasharray="75.4 251.2"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="15"
                  strokeDasharray="62.8 251.2"
                  strokeDashoffset="-75.4"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="15"
                  strokeDasharray="50.2 251.2"
                  strokeDashoffset="-138.2"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    100%
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0066FF]" />
              <span className="text-gray-600">
                Electrónica: 30%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-gray-600">
                Moda: 25%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">
                Hogar: 20%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Productos Principales
        </h3>
        <div className="space-y-4">
          {topProducts.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {idx + 1}. {product.name}
                </p>
                <p className="text-sm text-gray-600">
                  {product.orders} pedidos
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  €{product.revenue.toFixed(2)}
                </p>
                <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-[#0066FF]"
                    style={{
                      width: `${(product.revenue / topProducts[0].revenue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
