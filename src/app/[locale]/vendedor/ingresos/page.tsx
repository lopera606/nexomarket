'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const REVENUE_DATA = {
  '7d': {
    total: '3,450€',
    change: '+12%',
    trend: 'up',
    daily: [420, 380, 510, 480, 520, 440, 500],
    days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  },
  '30d': {
    total: '14,320€',
    change: '+8%',
    trend: 'up',
    daily: [450, 480, 420, 510, 490, 530, 460, 500, 470, 540, 420, 530, 490, 470, 520, 480, 510, 450, 540, 460, 530, 490, 470, 450, 520, 480, 510, 490, 470, 520],
  },
  '90d': {
    total: '41,850€',
    change: '-3%',
    trend: 'down',
    daily: [1450, 1480, 1420, 1510, 1490, 1530, 1460, 1500, 1470, 1540, 1420, 1530, 1490, 1470, 1520, 1480, 1510, 1450, 1540, 1460, 1530, 1490, 1470, 1450, 1520, 1480, 1510, 1490, 1470, 1520, 1480, 1520, 1480, 1450, 1480, 1520, 1490, 1470, 1520, 1510, 1480, 1520, 1490, 1470, 1520, 1480, 1450, 1480, 1520, 1490, 1470, 1520, 1480, 1450, 1480, 1520, 1490, 1470, 1520, 1480, 1520, 1480, 1510, 1490, 1470, 1520, 1480, 1450, 1480, 1520, 1490, 1470, 1520, 1480, 1450, 1480, 1520, 1490, 1470, 1520, 1480, 1520, 1480, 1510, 1490, 1470, 1520, 1480, 1450, 1480, 1520],
  },
  '12m': {
    total: '156,420€',
    change: '+24%',
    trend: 'up',
    daily: [12450, 13200, 12800, 14100, 13500, 14200, 13800, 14500, 13200, 15100, 13400, 14800],
  },
};

const CATEGORIES = [
  { name: 'Electrónica', revenue: '8,450€', percentage: 35, color: 'from-blue-500 to-blue-600' },
  { name: 'Ropa y Accesorios', revenue: '5,320€', percentage: 22, color: 'from-blue-500 to-blue-600' },
  { name: 'Hogar y Jardín', revenue: '4,850€', percentage: 20, color: 'from-green-500 to-green-600' },
  { name: 'Deportes', revenue: '3,200€', percentage: 13, color: 'from-orange-500 to-orange-600' },
  { name: 'Libros', revenue: '2,200€', percentage: 10, color: 'from-pink-500 to-pink-600' },
];

const TOP_PRODUCTS = [
  { name: 'MacBook Pro 14"', revenue: '5,850€', orders: 45, image: '💻' },
  { name: 'AirPods Pro', revenue: '3,200€', orders: 78, image: '🎧' },
  { name: 'iPhone 15 Pro', revenue: '2,998€', orders: 32, image: '📱' },
  { name: 'iPad Air', revenue: '1,799€', orders: 15, image: '📱' },
  { name: 'Apple Watch Series 9', revenue: '1,598€', orders: 28, image: '⌚' },
];

export default function IngresosPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '12m'>('7d');
  const data = REVENUE_DATA[period];
  const isTrendUp = data.trend === 'up';

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold" style={{ color: '#000000' }}>
            Ingresos
          </h1>
          <p style={{ color: '#4A4A4A' }}>Análisis de tus ingresos y ventas</p>
        </div>
        <Button className="gap-2 text-white border-0 rounded-2xl hover:opacity-90 transition-all duration-200" style={{ backgroundColor: '#0066FF' }}>
          <Download className="h-5 w-5" />
          Descargar Reporte
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        {(['7d', '30d', '90d', '12m'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              period === p
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {p === '7d' ? '7 días' : p === '30d' ? '30 días' : p === '90d' ? '90 días' : '12 meses'}
          </button>
        ))}
      </div>

      {/* Main Revenue Card */}
      <Card className="relative overflow-hidden p-8 bg-blue-50 border border-blue-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Ingresos Totales</p>
            <p className="mt-3 text-5xl font-extrabold" style={{ color: '#0066FF' }}>{data.total}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className={`flex items-center gap-1 rounded-full px-3 py-1 ${isTrendUp ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {isTrendUp ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-sm font-semibold ${isTrendUp ? 'text-green-400' : 'text-red-400'}`}>
                  {data.change} vs período anterior
                </span>
              </div>
            </div>
          </div>
          <div style={{ color: '#0066FF', opacity: 0.1 }}>
            <TrendingUp className="h-24 w-24" />
          </div>
        </div>
      </Card>

      {/* Revenue Chart */}
      <Card className="p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="mb-8">
          <h2 className="text-lg font-bold" style={{ color: '#000000' }}>Ingresos por {period === '7d' ? 'Día' : period === '30d' ? 'Día' : period === '90d' ? 'Semana' : 'Mes'}</h2>
          <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>Tendencia de ingresos diarios/semanales</p>
        </div>

        <div className="flex items-end justify-center gap-2 h-80 px-4">
          {data.daily.map((value, idx) => {
            const maxValue = Math.max(...data.daily);
            const percentage = (value / maxValue) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className="w-full max-w-12 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${percentage}%`, backgroundColor: '#0066FF' }}
                  title={`€${(value).toLocaleString()}`}
                />
                {data.daily.length <= 12 && (
                  <span className="text-xs text-center" style={{ color: '#4A4A4A' }}>{(data as any).days ? (data as any).days[idx] : idx + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <Card className="p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: '#000000' }}>Ingresos por Categoría</h2>
          <div className="space-y-6">
            {CATEGORIES.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold" style={{ color: '#000000' }}>{category.name}</p>
                  <p className="font-bold" style={{ color: '#000000' }}>{category.revenue}</p>
                </div>
                <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <p className="text-xs" style={{ color: '#4A4A4A' }}>{category.percentage}% del total</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Selling Products */}
        <Card className="p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: '#000000' }}>Productos Más Vendidos</h2>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((product, idx) => (
              <div
                key={product.name}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow border border-gray-200"
              >
                <span className="text-3xl">{product.image}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold" style={{ color: '#000000' }}>{product.name}</p>
                      <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>{product.orders} pedidos</p>
                    </div>
                    <p className="font-bold" style={{ color: '#000000' }}>{product.revenue}</p>
                  </div>
                </div>
                <div className="text-lg font-bold" style={{ color: '#0066FF' }}>#{idx + 1}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="p-6 bg-blue-50 border border-blue-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ticket Promedio</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: '#0066FF' }}>450€</p>
          <p className="text-sm mt-2" style={{ color: '#0066FF' }}>+5% vs período anterior</p>
        </Card>
        <Card className="p-6 bg-green-50 border border-green-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Número de Pedidos</p>
          <p className="mt-3 text-3xl font-bold text-green-700">{period === '7d' ? '132' : period === '30d' ? '512' : period === '90d' ? '1,548' : '5,840'}</p>
          <p className="text-sm mt-2 text-green-700">+8% vs período anterior</p>
        </Card>
        <Card className="p-6 bg-orange-50 border border-orange-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Tasa de Conversión</p>
          <p className="mt-3 text-3xl font-bold text-orange-700">3.2%</p>
          <p className="text-sm mt-2 text-orange-700">+0.4% vs período anterior</p>
        </Card>
      </div>
    </div>
  );
}
