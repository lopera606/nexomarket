'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Package, ShoppingCart, Star, MoreVertical, ArrowUpRight, Upload, Package2, Truck, Settings, Clock, BarChart3, FileSpreadsheet, BookOpen, Percent, Wallet, CircleDollarSign, ArrowDownRight, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';

const QUICK_ACTIONS = [
  { label: 'Subir producto', icon: Upload, color: 'from-blue-500 to-blue-600', href: '/vendedor/subir-producto' },
  { label: 'Subida masiva', icon: FileSpreadsheet, color: 'from-blue-500 to-orange-600', href: '/vendedor/subida-masiva' },
  { label: 'Ver pedidos', icon: ShoppingCart, color: 'from-blue-500 to-cyan-600', href: '/vendedor/pedidos' },
  { label: 'Gestionar envíos', icon: Truck, color: 'from-orange-500 to-red-600', href: '/vendedor/seguimiento' },
  { label: 'Configurar tienda', icon: Settings, color: 'from-green-500 to-emerald-600', href: '/vendedor/configuracion' },
  { label: 'Documentación API', icon: BookOpen, color: 'from-cyan-500 to-blue-600', href: '/vendedor/api-docs' },
];

const getStatusGradient = (status: string) => {
  if (status === 'En Preparación') return 'from-yellow-400/30 to-orange-500/30 border-yellow-400/50';
  if (status === 'Enviado') return 'from-blue-400/30 to-cyan-500/30 border-blue-400/50';
  if (status === 'Entregado') return 'from-green-400/30 to-emerald-500/30 border-green-400/50';
  return 'from-gray-400/30 to-gray-500/30 border-gray-400/50';
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
};

interface DashboardData {
  storeName: string;
  stats: {
    revenue: { value: number; change: number };
    orders: { value: number; change: number };
    products: { value: number; change: number };
    rating: { value: number; totalReviews: number };
  };
  commission: {
    rate: number;
    grossSales: number;
    commissionAmount: number;
    netEarnings: number;
    transactions: number;
    pendingPayout: number;
  };
  chartData: number[];
  recentOrders: { id: string; product: string; amount: number; status: string; date: string }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  fulfillmentRate: number;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'es';

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/vendedor/dashboard')
      .then((r) => {
        if (!r.ok) throw new Error('Error al cargar datos');
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0066FF' }} />
          <p className="text-sm" style={{ color: '#4A4A4A' }}>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: '#000000' }}>Error al cargar el dashboard</p>
          <p className="text-sm mt-2" style={{ color: '#4A4A4A' }}>{error || 'No se pudieron obtener los datos'}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" style={{ backgroundColor: '#0066FF', color: 'white' }}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const STATS = [
    {
      label: 'Ingresos del mes',
      value: formatCurrency(data.stats.revenue.value),
      change: `${data.stats.revenue.change >= 0 ? '+' : ''}${data.stats.revenue.change}%`,
      trend: data.stats.revenue.change >= 0 ? 'up' : 'down',
      icon: TrendingUp,
    },
    {
      label: 'Pedidos',
      value: String(data.stats.orders.value),
      change: `${data.stats.orders.change >= 0 ? '+' : ''}${data.stats.orders.change}%`,
      trend: data.stats.orders.change >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
    },
    {
      label: 'Productos activos',
      value: String(data.stats.products.value),
      change: `${data.stats.products.change >= 0 ? '+' : ''}${data.stats.products.change}`,
      trend: data.stats.products.change >= 0 ? 'up' : 'down',
      icon: Package,
    },
    {
      label: 'Rating',
      value: `${data.stats.rating.value.toFixed(1)}/5`,
      change: `${data.stats.rating.totalReviews} reseñas`,
      trend: 'up',
      icon: Star,
    },
  ];

  const maxChartValue = Math.max(...data.chartData, 1);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      {/* Greeting Banner */}
      <div className="mb-8 rounded-3xl overflow-hidden" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="p-6 sm:p-8 bg-white border border-gray-200">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2" style={{ color: '#000000' }}>¡Hola, {data.storeName}! 👋</h1>
          <p className="text-base sm:text-lg lg:text-xl" style={{ color: '#4A4A4A' }}>Resumen de tu tienda - {today}</p>
          <p className="text-sm mt-2" style={{ color: '#4A4A4A' }}>Estás haciendo un trabajo excelente. Sigue adelante.</p>
        </div>
      </div>

      {/* Glass-morphism Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl bg-white border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200 hover:shadow-lg group cursor-pointer"
              style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{stat.label}</p>
                  <p className="mt-4 text-4xl font-extrabold" style={{ color: '#000000' }}>
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3">
                  <Icon className="h-6 w-6" style={{ color: '#0066FF' }} />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 rounded-full px-3 py-1.5 w-fit border border-green-200">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-xs font-bold text-green-700">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commission & Earnings Breakdown */}
      <div className="mb-8 rounded-3xl bg-white border border-gray-200 overflow-hidden" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#000000' }}>Comisiones y Ganancias</h2>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0066FF]/5 border border-[#0066FF]/10 w-fit">
              <Percent className="h-4 w-4" style={{ color: '#0066FF' }} />
              <span className="text-xs sm:text-sm font-bold" style={{ color: '#0066FF' }}>Comisión: {data.commission.rate}%</span>
            </div>
          </div>
          <p className="text-sm" style={{ color: '#4A4A4A' }}>Desglose de tus ingresos del mes actual</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-blue-50 p-2.5">
                <CircleDollarSign className="h-5 w-5" style={{ color: '#0066FF' }} />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ventas brutas</p>
            </div>
            <p className="text-3xl font-extrabold" style={{ color: '#000000' }}>{formatCurrency(data.commission.grossSales)}</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>{data.commission.transactions} transacciones</p>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-red-50 p-2.5">
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Comisión NexoMarket</p>
            </div>
            <p className="text-3xl font-extrabold text-red-500">-{formatCurrency(data.commission.commissionAmount)}</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>{data.commission.rate}% sobre ventas</p>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-green-50 p-2.5">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ganancia neta</p>
            </div>
            <p className="text-3xl font-extrabold text-green-600">{formatCurrency(data.commission.netEarnings)}</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>{data.commission.grossSales > 0 ? Math.round((data.commission.netEarnings / data.commission.grossSales) * 100) : 0}% de tus ventas</p>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-amber-50 p-2.5">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Próximo pago</p>
            </div>
            <p className="text-3xl font-extrabold" style={{ color: '#000000' }}>{formatCurrency(data.commission.pendingPayout)}</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>Pago pendiente</p>
          </div>
        </div>
        {/* Commission Progress Bar */}
        <div className="px-8 pb-8">
          <div className="rounded-2xl bg-[#FAFAFA] border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>Progreso hacia descuento por volumen</span>
              <span className="text-sm font-bold" style={{ color: '#0066FF' }}>{formatCurrency(data.commission.grossSales)} / €25,000</span>
            </div>
            <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (data.commission.grossSales / 25000) * 100)}%`, backgroundColor: '#0066FF' }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: '#4A4A4A' }}>
              Alcanza €25,000 en ventas mensuales para reducir tu comisión al 4.5%
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mb-8 rounded-3xl bg-white border border-gray-200 p-6 sm:p-8" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: '#000000' }}>Ventas últimos 7 días</h2>
            <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>Tendencia de ingresos diarios</p>
          </div>
          <BarChart3 className="h-6 w-6 mt-4 sm:mt-0" style={{ color: '#0066FF' }} />
        </div>
        <div className="flex items-end justify-center gap-2 sm:gap-3 h-48 sm:h-64 px-2 sm:px-4 overflow-x-auto">
          {data.chartData.map((value, idx) => {
            const percentage = maxChartValue > 0 ? (value / maxChartValue) * 100 : 0;
            const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                <div
                  className="w-full rounded-t-2xl transition-all duration-200 hover:opacity-90"
                  style={{
                    height: `${Math.max(percentage, 2)}%`,
                    backgroundColor: '#0066FF',
                    boxShadow: '0 2px 40px rgba(0,0,0,0.04)',
                  }}
                  title={formatCurrency(value)}
                />
                <span className="text-xs font-semibold" style={{ color: '#4A4A4A' }}>{dayLabels[idx]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 mb-8">
        {/* Recent Orders */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-6" style={{ color: '#000000' }}>Pedidos Recientes</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#4A4A4A' }}>No hay pedidos recientes</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-gray-50 border border-gray-200 p-4 hover:border-gray-300 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold" style={{ color: '#0066FF' }}>{order.id}</p>
                      <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: '#000000' }}>{formatCurrency(order.amount)}</p>
                      <div className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-white bg-green-600`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-6" style={{ color: '#000000' }}>Productos Top</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#4A4A4A' }}>No hay datos de productos</p>
          ) : (
            <div className="space-y-4">
              {data.topProducts.slice(0, 5).map((product) => {
                const maxSales = Math.max(...data.topProducts.map(p => p.sales), 1);
                return (
                  <div key={product.name} className="group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold" style={{ color: '#000000' }}>{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: '#4A4A4A' }}>{product.sales} ventas</span>
                        <span className="text-sm font-bold" style={{ color: '#0066FF' }}>{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${Math.min(100, (product.sales / maxSales) * 100)}%`,
                          backgroundColor: '#0066FF',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => router.push(`/${locale}${action.href}`)}
              className="rounded-2xl bg-white border border-gray-200 p-6 flex flex-col items-center gap-3 group hover:border-gray-300 transition-all duration-200 hover:shadow-lg"
              style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
            >
              <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" style={{ color: '#0066FF' }} />
              <span className="text-sm font-bold text-center" style={{ color: '#000000' }}>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-semibold mb-3">Tasa de cumplimiento</p>
          <div className="mb-4">
            <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>{data.fulfillmentRate}%</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>Pedidos completados a tiempo</p>
          </div>
          <div className="h-3 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            <div
              className="h-full rounded-full bg-green-600"
              style={{ width: `${data.fulfillmentRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-semibold mb-3">Tiempo de respuesta promedio</p>
          <div className="mb-4">
            <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>--</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>Respuesta a clientes</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 border border-blue-200 w-fit">
            <Clock className="h-3.5 w-3.5" style={{ color: '#0066FF' }} />
            <span className="text-xs font-semibold" style={{ color: '#0066FF' }}>Sin datos</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-semibold mb-3">Puntuación de satisfacción</p>
          <div className="mb-4">
            <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>{data.stats.rating.value.toFixed(1)}★</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>De {data.stats.rating.totalReviews.toLocaleString()} reseñas</p>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(data.stats.rating.value) ? 'fill-amber-400 text-blue-400' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
