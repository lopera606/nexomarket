'use client';

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Store, Package, AlertCircle, CheckCircle, XCircle, BarChart3, Clock, Activity, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STATS = [
  {
    label: 'GMV',
    value: '€245,890',
    change: '+18%',
    icon: DollarSign,
    trend: 'up',
    gradient: 'linear-gradient(135deg, #5B2FE8 0%, #7C3AED 100%)',
  },
  {
    label: 'Comisiones',
    value: '€14,753',
    change: '+15%',
    icon: TrendingUp,
    trend: 'up',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
  },
  {
    label: 'Pedidos',
    value: '1,847',
    change: '+22%',
    icon: ShoppingCart,
    trend: 'up',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  },
  {
    label: 'Usuarios',
    value: '12,450',
    change: '+8%',
    icon: Users,
    trend: 'up',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
  },
  {
    label: 'Tiendas',
    value: '342',
    change: '+5%',
    icon: Store,
    trend: 'up',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
  },
  {
    label: 'Productos',
    value: '28,900',
    change: '+12%',
    icon: Package,
    trend: 'up',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
  },
];

const REVENUE_DATA = [
  { month: 'Ene', value: 28000 },
  { month: 'Feb', value: 35000 },
  { month: 'Mar', value: 32000 },
  { month: 'Abr', value: 42000 },
  { month: 'May', value: 45000 },
  { month: 'Jun', value: 52000 },
  { month: 'Jul', value: 48000 },
  { month: 'Ago', value: 55000 },
  { month: 'Sep', value: 58000 },
  { month: 'Oct', value: 62000 },
  { month: 'Nov', value: 68000 },
  { month: 'Dic', value: 75000 },
];

const PENDING_STORES = [
  {
    id: 1,
    name: 'TechWorld Store',
    owner: 'David Chen',
    appliedDate: '2026-03-10',
    category: 'Electrónica',
  },
  {
    id: 2,
    name: 'Fashion Hub',
    owner: 'Sofia Martinez',
    appliedDate: '2026-03-11',
    category: 'Ropa',
  },
  {
    id: 3,
    name: 'Sports Gear Co',
    owner: 'James Wilson',
    appliedDate: '2026-03-12',
    category: 'Deportes',
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'store_registered',
    title: 'Nueva tienda registrada',
    description: 'TechPro Electronics',
    time: 'hace 2 horas',
    dotColor: '#5B2FE8',
  },
  {
    id: 2,
    type: 'order_completed',
    title: 'Pedido completado',
    description: 'Orden #4521 - €1,250',
    time: 'hace 4 horas',
    dotColor: '#10B981',
  },
  {
    id: 3,
    type: 'user_joined',
    title: 'Nuevo usuario',
    description: 'María García se registró',
    time: 'hace 6 horas',
    dotColor: '#FF6B35',
  },
  {
    id: 4,
    type: 'store_approved',
    title: 'Tienda aprobada',
    description: 'Fashion Boutique activada',
    time: 'hace 8 horas',
    dotColor: '#10B981',
  },
  {
    id: 5,
    type: 'payment_received',
    title: 'Comisión recibida',
    description: '€3,450 de SportWorld',
    time: 'hace 10 horas',
    dotColor: '#5B2FE8',
  },
];

const TOP_STORES = [
  {
    id: 1,
    rank: 1,
    name: 'TechPro Store',
    revenue: '€24,500',
    orders: 342,
    rating: 4.8,
  },
  {
    id: 2,
    rank: 2,
    name: 'Fashion Hub',
    revenue: '€32,100',
    orders: 521,
    rating: 4.7,
  },
  {
    id: 3,
    rank: 3,
    name: 'SportGear Co',
    revenue: '€18,200',
    orders: 278,
    rating: 4.6,
  },
  {
    id: 4,
    rank: 4,
    name: 'AudioMax',
    revenue: '€15,800',
    orders: 198,
    rating: 4.9,
  },
  {
    id: 5,
    rank: 5,
    name: 'ElectroWorld',
    revenue: '€28,600',
    orders: 445,
    rating: 4.5,
  },
];

const PLATFORM_HEALTH = [
  { metric: 'API', value: '99.98%', status: 'good' },
  { metric: 'Base de datos', value: '99.95%', status: 'good' },
  { metric: 'Pagos', value: '99.99%', status: 'good' },
  { metric: 'Envíos', value: '99.92%', status: 'good' },
];

const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.value));

const getMedalEmoji = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
};

const getHealthColor = (status: string) => {
  if (status === 'good') return 'bg-gradient-to-br from-green-400 to-emerald-500';
  if (status === 'warning') return 'bg-gradient-to-br from-yellow-400 to-orange-500';
  return 'bg-gradient-to-br from-red-400 to-rose-500';
};

export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="mb-6 sm:mb-8 rounded-3xl overflow-hidden shadow-lg" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)', background: '#0066FF' }}>
        <div className="p-6 sm:p-8 text-white">
          <div className="flex flex-col justify-between sm:flex-row sm:items-start gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2">¡Bienvenido, Admin!</h1>
              <p className="text-base sm:text-lg lg:text-xl opacity-90">Hoy es {today}</p>
              <p className="text-xs sm:text-sm opacity-75 mt-1">Panel de control general de NexoMarket</p>
            </div>
            <div className="mt-2 sm:mt-0 text-right flex-shrink-0">
              <div className="inline-block bg-white rounded-2xl px-4 sm:px-6 py-2 sm:py-3 border border-gray-200">
                <p className="text-xs sm:text-sm opacity-90">Sesión activa</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Alert Banner */}
      {PENDING_STORES.length > 0 && (
        <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-amber-100 p-3 flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-amber-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-lg">
                {PENDING_STORES.length} tiendas pendientes de aprobación
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                Revisa y aprueba las nuevas tiendas que están esperando verificación
              </p>
            </div>
            <Button
              size="sm"
              className="whitespace-nowrap bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-6"
            >
              Revisar
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid - Responsive */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <div
              key={stat.label}
              className="rounded-3xl border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer"
              style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}
            >
              <div className="p-6 text-gray-900 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="mt-3 text-4xl font-black text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-blue-50 p-3">
                      <Icon className="h-6 w-6 text-[#0066FF]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 rounded-full px-3 py-1 w-fit">
                    <TrendIcon className="h-4 w-4 text-[#0066FF]" />
                    <span className="text-sm font-bold text-[#0066FF]">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 mb-8">
        {/* Revenue Chart - 2 columns */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-white border border-gray-200 p-8" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Ingresos mensuales</h2>
                <p className="mt-1 text-sm text-gray-600">Últimos 12 meses</p>
              </div>
              <BarChart3 className="h-6 w-6 text-[#0066FF]" />
            </div>

            {/* CSS Bar Chart */}
            <div className="flex h-48 sm:h-64 items-end justify-between gap-1 sm:gap-2 overflow-x-auto pb-2">
              {REVENUE_DATA.map((data, idx) => {
                const gradients = [
                  '#0066FF',
                  '#0052CC',
                  '#0066FF',
                ];
                const gradient = gradients[idx % 3];
                return (
                  <div key={data.month} className="flex flex-col items-center gap-2 flex-shrink-0" style={{ minWidth: '2rem' }}>
                    <div className="relative h-40 sm:h-48 w-6 sm:w-8">
                      <div
                        className="absolute bottom-0 w-full rounded-t-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:brightness-110"
                        style={{
                          height: `${(data.value / maxRevenue) * 100}%`,
                          background: gradient,
                        }}
                        title={`€${data.value.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-400 whitespace-nowrap">{data.month}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 pt-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total</p>
                <p className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">€645,000</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Promedio</p>
                <p className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">€53,750</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pico</p>
                <p className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">€75,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="rounded-3xl bg-white border border-gray-200 p-8" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Salud de plataforma</h2>
            <Activity className="h-6 w-6 text-[#0066FF]" />
          </div>

          <div className="space-y-4">
            {PLATFORM_HEALTH.map((item) => (
              <div key={item.metric} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.metric}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 text-sm">{item.value}</span>
                  <div className={`h-3 w-3 rounded-full shadow-lg ${getHealthColor(item.status)}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-800">
              <span className="font-bold">✓ Todo bien</span> - Todos los sistemas operando normalmente
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity and Top Stores */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 mb-8">
        {/* Recent Activity Feed */}
        <div className="rounded-3xl bg-white border border-gray-200 p-8" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Actividad reciente</h2>
            <Clock className="h-6 w-6 text-[#0066FF]" />
          </div>

          <div className="space-y-6">
            {RECENT_ACTIVITY.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="h-4 w-4 rounded-full shadow-lg"
                    style={{ backgroundColor: activity.dotColor }}
                  />
                  {idx !== RECENT_ACTIVITY.length - 1 && (
                    <div className="mt-2 h-8 w-0.5 bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stores Leaderboard */}
        <div className="rounded-3xl bg-white border border-gray-200 p-8" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Top 5 Tiendas</h2>
            <Zap className="h-6 w-6 text-amber-500" />
          </div>

          <div className="space-y-3">
            {TOP_STORES.map((store) => (
              <div
                key={store.id}
                className="rounded-2xl bg-gray-50 border border-gray-200 p-4 transition-all duration-300 hover:shadow-lg group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="text-lg sm:text-2xl flex-shrink-0">{getMedalEmoji(store.rank)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{store.name}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs gap-1 flex-wrap">
                        <span className="text-gray-600 whitespace-nowrap">{store.orders} ped.</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(store.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-xs font-semibold text-gray-600">
                            {store.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm sm:text-lg whitespace-nowrap">{store.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
