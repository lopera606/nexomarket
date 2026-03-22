'use client';

import { TrendingUp, Package, ShoppingCart, Star, MoreVertical, ArrowUpRight, Upload, Package2, Truck, Settings, Clock, BarChart3, FileSpreadsheet, BookOpen, Percent, Wallet, CircleDollarSign, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';

const STATS = [
  {
    label: 'Ingresos del mes',
    value: '€12,450',
    change: '+23%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    label: 'Pedidos',
    value: '142',
    change: '+12%',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    label: 'Productos activos',
    value: '67',
    change: '+5',
    trend: 'up',
    icon: Package,
  },
  {
    label: 'Rating',
    value: '4.8/5',
    change: '+0.2',
    trend: 'up',
    icon: Star,
  },
];

const TOP_PRODUCTS = [
  { name: 'MacBook Pro 14"', sales: 45, revenue: '€53,950' },
  { name: 'AirPods Pro', sales: 78, revenue: '€19,494' },
  { name: 'iPhone 15 Pro', sales: 32, revenue: '€33,600' },
  { name: 'iPad Air M2', sales: 28, revenue: '€14,560' },
  { name: 'Apple Watch Series 9', sales: 54, revenue: '€32,940' },
];

const RECENT_ORDERS = [
  {
    id: 'NXM-2026-03-7F8A2D4E',
    product: 'MacBook Pro 14"',
    amount: '€1,299.99',
    status: 'En Preparación',
    statusColor: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'NXM-2026-03-3B9C1E6F',
    product: 'AirPods Pro',
    amount: '€249.99',
    status: 'Enviado',
    statusColor: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'NXM-2026-02-A4D7F832',
    product: 'iPhone 15 Pro',
    amount: '€999.99',
    status: 'Entregado',
    statusColor: 'from-green-400 to-emerald-500',
  },
  {
    id: 'NXM-2026-02-6E1C9B5A',
    product: 'iPad Air',
    amount: '€599.99',
    status: 'En Preparación',
    statusColor: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'NXM-2026-01-D2F4A8E3',
    product: 'Sony Headphones',
    amount: '€349.99',
    status: 'Entregado',
    statusColor: 'from-green-400 to-emerald-500',
  },
];

const QUICK_ACTIONS = [
  { label: 'Subir producto', icon: Upload, color: 'from-blue-500 to-blue-600', href: '/vendedor/subir-producto' },
  { label: 'Subida masiva', icon: FileSpreadsheet, color: 'from-blue-500 to-orange-600', href: '/vendedor/subida-masiva' },
  { label: 'Ver pedidos', icon: ShoppingCart, color: 'from-blue-500 to-cyan-600', href: '/vendedor/pedidos' },
  { label: 'Gestionar envíos', icon: Truck, color: 'from-orange-500 to-red-600', href: '/vendedor/seguimiento' },
  { label: 'Configurar tienda', icon: Settings, color: 'from-green-500 to-emerald-600', href: '/vendedor/configuracion' },
  { label: 'Documentación API', icon: BookOpen, color: 'from-cyan-500 to-blue-600', href: '/vendedor/api-docs' },
];

const CHART_DATA = [45, 52, 38, 65, 72, 58, 88];

const getStatusGradient = (status: string) => {
  if (status === 'En Preparación') return 'from-yellow-400/30 to-orange-500/30 border-yellow-400/50';
  if (status === 'Enviado') return 'from-blue-400/30 to-cyan-500/30 border-blue-400/50';
  if (status === 'Entregado') return 'from-green-400/30 to-emerald-500/30 border-green-400/50';
  return 'from-gray-400/30 to-gray-500/30 border-gray-400/50';
};

export default function SellerDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'es';

  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const maxChartValue = Math.max(...CHART_DATA);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      {/* Greeting Banner */}
      <div className="mb-8 rounded-3xl overflow-hidden" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="p-6 sm:p-8 bg-white border border-gray-200">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2" style={{ color: '#000000' }}>¡Hola, TechPro Electronics! 👋</h1>
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
              <span className="text-xs sm:text-sm font-bold" style={{ color: '#0066FF' }}>Comisión: 6.0%</span>
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
            <p className="text-3xl font-extrabold" style={{ color: '#000000' }}>€12,450</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>142 transacciones</p>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-red-50 p-2.5">
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Comisión NexoMarket</p>
            </div>
            <p className="text-3xl font-extrabold text-red-500">-€747</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>6.0% sobre ventas</p>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-green-50 p-2.5">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ganancia neta</p>
            </div>
            <p className="text-3xl font-extrabold text-green-600">€11,703</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>94% de tus ventas</p>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-amber-50 p-2.5">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Próximo pago</p>
            </div>
            <p className="text-3xl font-extrabold" style={{ color: '#000000' }}>€4,280</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>Viernes 27 de marzo</p>
          </div>
        </div>
        {/* Commission Progress Bar */}
        <div className="px-8 pb-8">
          <div className="rounded-2xl bg-[#FAFAFA] border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>Progreso hacia descuento por volumen</span>
              <span className="text-sm font-bold" style={{ color: '#0066FF' }}>€12,450 / €25,000</span>
            </div>
            <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: '49.8%', backgroundColor: '#0066FF' }}
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
          {CHART_DATA.map((value, idx) => {
            const percentage = (value / maxChartValue) * 100;
            const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                <div
                  className="w-full rounded-t-2xl transition-all duration-200 hover:opacity-90"
                  style={{
                    height: `${percentage}%`,
                    backgroundColor: '#0066FF',
                    boxShadow: '0 2px 40px rgba(0,0,0,0.04)',
                  }}
                  title={`€${value * 100}`}
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
          <div className="space-y-3">
            {RECENT_ORDERS.slice(0, 5).map((order) => (
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
                    <p className="font-bold" style={{ color: '#000000' }}>{order.amount}</p>
                    <div className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-white bg-green-600`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-6" style={{ color: '#000000' }}>Productos Top</h2>
          <div className="space-y-4">
            {TOP_PRODUCTS.slice(0, 5).map((product, idx) => (
              <div key={product.name} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold" style={{ color: '#000000' }}>{product.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#4A4A4A' }}>{product.sales} ventas</span>
                    <span className="text-sm font-bold" style={{ color: '#0066FF' }}>{product.revenue}</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${Math.min(100, (product.sales / 100) * 100)}%`,
                      backgroundColor: '#0066FF',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
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
            <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>94.2%</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>Pedidos completados a tiempo</p>
          </div>
          <div className="h-3 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            <div
              className="h-full rounded-full bg-green-600"
              style={{ width: '94.2%' }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-semibold mb-3">Tiempo de respuesta promedio</p>
          <div className="mb-4">
            <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>1.2h</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>Respuesta a clientes</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 border border-blue-200 w-fit">
            <Clock className="h-3.5 w-3.5" style={{ color: '#0066FF' }} />
            <span className="text-xs font-semibold" style={{ color: '#0066FF' }}>Excelente</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider font-semibold mb-3">Puntuación de satisfacción</p>
          <div className="mb-4">
            <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>4.8★</p>
            <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>De 1,247 reseñas</p>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-blue-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
