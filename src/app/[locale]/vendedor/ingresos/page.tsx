'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, Download, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

const CATEGORY_COLORS = [
  'from-blue-500 to-blue-600',
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
];

interface RevenueData {
  revenue: { total: number; change: number; trend: string };
  chart: { daily: number[]; days?: string[] };
  categories: { name: string; revenue: number; percentage: number }[];
  topProducts: { name: string; revenue: number; orders: number }[];
  summary: { avgTicket: number; ordersCount: number; ordersChange: number; conversionRate: number };
}

export default function IngresosPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '12m'>('7d');
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v2/vendedor/ingresos?period=${period}`)
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar datos');
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0066FF' }} />
          <p className="text-sm" style={{ color: '#4A4A4A' }}>Cargando datos de ingresos...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: '#000000' }}>Error al cargar ingresos</p>
          <p className="text-sm mt-2" style={{ color: '#4A4A4A' }}>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" style={{ backgroundColor: '#0066FF', color: 'white' }}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isTrendUp = data.revenue.trend === 'up';

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
            <p className="mt-3 text-5xl font-extrabold" style={{ color: '#0066FF' }}>{formatCurrency(data.revenue.total)}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className={`flex items-center gap-1 rounded-full px-3 py-1 ${isTrendUp ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {isTrendUp ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-sm font-semibold ${isTrendUp ? 'text-green-400' : 'text-red-400'}`}>
                  {data.revenue.change >= 0 ? '+' : ''}{data.revenue.change}% vs período anterior
                </span>
              </div>
            </div>
          </div>
          <div style={{ color: '#0066FF', opacity: 0.1 }}>
            <TrendingUp className="h-24 w-24" />
          </div>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#0066FF' }} />
          </div>
        )}
      </Card>

      {/* Revenue Chart */}
      <Card className="p-8 border border-gray-200 relative" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="mb-8">
          <h2 className="text-lg font-bold" style={{ color: '#000000' }}>Ingresos por {period === '7d' ? 'Día' : period === '30d' ? 'Día' : period === '90d' ? 'Semana' : 'Mes'}</h2>
          <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>Tendencia de ingresos diarios/semanales</p>
        </div>

        <div className="flex items-end justify-center gap-2 h-80 px-4">
          {data.chart.daily.map((value, idx) => {
            const maxValue = Math.max(...data.chart.daily, 1);
            const percentage = (value / maxValue) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className="w-full max-w-12 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ height: `${Math.max(percentage, 2)}%`, backgroundColor: '#0066FF' }}
                  title={formatCurrency(value)}
                />
                {data.chart.daily.length <= 12 && data.chart.days && (
                  <span className="text-xs text-center" style={{ color: '#4A4A4A' }}>{data.chart.days[idx] || (idx + 1)}</span>
                )}
              </div>
            );
          })}
        </div>
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#0066FF' }} />
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <Card className="p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: '#000000' }}>Ingresos por Categoría</h2>
          {data.categories.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#4A4A4A' }}>No hay datos de categorías</p>
          ) : (
            <div className="space-y-6">
              {data.categories.map((category, idx) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold" style={{ color: '#000000' }}>{category.name}</p>
                    <p className="font-bold" style={{ color: '#000000' }}>{formatCurrency(category.revenue)}</p>
                  </div>
                  <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: '#4A4A4A' }}>{category.percentage}% del total</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Selling Products */}
        <Card className="p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: '#000000' }}>Productos Más Vendidos</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#4A4A4A' }}>No hay datos de productos</p>
          ) : (
            <div className="space-y-4">
              {data.topProducts.map((product, idx) => (
                <div
                  key={product.name}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow border border-gray-200"
                >
                  <span className="text-3xl">📦</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold" style={{ color: '#000000' }}>{product.name}</p>
                        <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>{product.orders} pedidos</p>
                      </div>
                      <p className="font-bold" style={{ color: '#000000' }}>{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                  <div className="text-lg font-bold" style={{ color: '#0066FF' }}>#{idx + 1}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="p-6 bg-blue-50 border border-blue-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ticket Promedio</p>
          <p className="mt-3 text-3xl font-bold" style={{ color: '#0066FF' }}>{formatCurrency(data.summary.avgTicket)}</p>
          <p className="text-sm mt-2" style={{ color: '#0066FF' }}>Basado en {data.summary.ordersCount} pedidos</p>
        </Card>
        <Card className="p-6 bg-green-50 border border-green-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Número de Pedidos</p>
          <p className="mt-3 text-3xl font-bold text-green-700">{data.summary.ordersCount.toLocaleString()}</p>
          <p className="text-sm mt-2 text-green-700">{data.summary.ordersChange >= 0 ? '+' : ''}{data.summary.ordersChange}% vs período anterior</p>
        </Card>
        <Card className="p-6 bg-orange-50 border border-orange-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Tasa de Conversión</p>
          <p className="mt-3 text-3xl font-bold text-orange-700">{data.summary.conversionRate}%</p>
          <p className="text-sm mt-2 text-orange-700">Tasa estimada</p>
        </Card>
      </div>
    </div>
  );
}
