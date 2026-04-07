'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, BarChart3, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MonthlyStats {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  newClients: number;
  avgTicket: number;
}

interface TopProduct {
  name: string;
  productId: string;
  revenue: number;
  quantity: number;
}

interface StatsData {
  monthly: MonthlyStats;
  topProducts: TopProduct[];
  revenueByDay: Record<string, number>;
}

export default function EstadisticasPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/v2/vendedor/estadisticas');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        console.error('Error fetching stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  const monthly = data?.monthly || { revenue: 0, revenueChange: 0, orders: 0, ordersChange: 0, newClients: 0, avgTicket: 0 };
  const topProducts = data?.topProducts || [];
  const revenueByDay = data?.revenueByDay || { Lun: 0, Mar: 0, Mie: 0, Jue: 0, Vie: 0, Sab: 0, Dom: 0 };
  const maxDayRevenue = Math.max(...Object.values(revenueByDay), 1);

  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-black">Estadisticas</h1>
        <p className="text-[#4A4A4A]">Analiza el rendimiento de tu tienda en los ultimos 30 dias</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-green-50">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Ingresos</p>
          </div>
          <p className="text-2xl font-bold text-black">{formatCurrency(monthly.revenue)}</p>
          <div className="flex items-center gap-1 mt-2">
            {monthly.revenueChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${monthly.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthly.revenueChange > 0 ? '+' : ''}{monthly.revenueChange}%
            </span>
            <span className="text-xs text-[#4A4A4A] ml-1">vs mes anterior</span>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-blue-50">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Pedidos</p>
          </div>
          <p className="text-2xl font-bold text-black">{monthly.orders}</p>
          <div className="flex items-center gap-1 mt-2">
            {monthly.ordersChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${monthly.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthly.ordersChange > 0 ? '+' : ''}{monthly.ordersChange}%
            </span>
            <span className="text-xs text-[#4A4A4A] ml-1">vs mes anterior</span>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-purple-50">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Nuevos clientes</p>
          </div>
          <p className="text-2xl font-bold text-black">{monthly.newClients}</p>
          <p className="text-xs text-[#4A4A4A] mt-2">Clientes unicos este mes</p>
        </Card>

        <Card className="p-6 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-orange-50">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">Ticket promedio</p>
          </div>
          <p className="text-2xl font-bold text-black">{formatCurrency(monthly.avgTicket)}</p>
          <p className="text-xs text-[#4A4A4A] mt-2">Por pedido</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card className="p-6 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-lg font-bold text-black mb-4">Top Productos</h2>
          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-[#4A4A4A] text-sm">Aun no hay datos de ventas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={product.productId} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{product.name}</p>
                    <p className="text-xs text-[#4A4A4A]">{product.quantity} unidades vendidas</p>
                  </div>
                  <p className="text-sm font-bold text-black">{formatCurrency(product.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Revenue by Day of Week */}
        <Card className="p-6 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-lg font-bold text-black mb-4">Ingresos por dia de la semana</h2>
          <div className="flex items-end gap-3 h-48">
            {Object.entries(revenueByDay).map(([day, value]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[#0066FF] to-[#3388FF] transition-all duration-500"
                  style={{
                    height: `${maxDayRevenue > 0 ? (value / maxDayRevenue) * 100 : 0}%`,
                    minHeight: value > 0 ? '4px' : '0',
                  }}
                />
                <span className="text-xs text-[#4A4A4A] font-medium">{day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-xs text-[#4A4A4A]">
              <span>Mejor dia: {Object.entries(revenueByDay).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}</span>
              <span>
                {formatCurrency(Math.max(...Object.values(revenueByDay)))}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
