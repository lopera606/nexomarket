'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Package,
  Truck,
  Star,
  Heart,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react'

const STATS = [
  { label: 'Pedidos Totales', value: '12', icon: Package, color: '#0066FF' },
  { label: 'En Tránsito', value: '2', icon: Truck, color: '#0066FF' },
  { label: 'Reseñas Pendientes', value: '3', icon: Star, color: '#0066FF' },
  { label: 'Favoritos', value: '24', icon: Heart, color: '#0066FF' },
]

const ORDERS = [
  {
    id: 'NXM-2026-03-7F8A2D4E',
    date: '12 de marzo, 2026',
    total: 1299.99,
    status: 'Entregado',
    items: [
      { name: 'MacBook Pro 14" M3', qty: 1, price: 1299.99, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop' },
    ],
    timeline: [
      { step: 'Confirmado', date: '10 Mar', completed: true },
      { step: 'Preparando', date: '10 Mar', completed: true },
      { step: 'Enviado', date: '11 Mar', completed: true },
      { step: 'Entregado', date: '12 Mar', completed: true },
    ],
  },
  {
    id: 'NXM-2026-02-3B9C1E6F',
    date: '10 de marzo, 2026',
    total: 129.99,
    status: 'En Tránsito',
    items: [
      { name: 'AirPods Pro 2ª Gen', qty: 1, price: 129.99, img: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=80&h=80&fit=crop' },
    ],
    timeline: [
      { step: 'Confirmado', date: '8 Mar', completed: true },
      { step: 'Preparando', date: '9 Mar', completed: true },
      { step: 'Enviado', date: '10 Mar', completed: true },
      { step: 'Entregado', date: 'Est. 13 Mar', completed: false },
    ],
  },
  {
    id: 'NXM-2026-01-A4D7F832',
    date: '8 de marzo, 2026',
    total: 399.99,
    status: 'Entregado',
    items: [
      { name: 'PlayStation 5 Slim', qty: 1, price: 399.99, img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=80&h=80&fit=crop' },
    ],
    timeline: [
      { step: 'Confirmado', date: '5 Mar', completed: true },
      { step: 'Preparando', date: '5 Mar', completed: true },
      { step: 'Enviado', date: '6 Mar', completed: true },
      { step: 'Entregado', date: '8 Mar', completed: true },
    ],
  },
  {
    id: 'NXM-2025-12-6E1C9B5A',
    date: '5 de marzo, 2026',
    total: 249.98,
    status: 'En Proceso',
    items: [
      { name: 'Teclado Mecánico RGB', qty: 1, price: 149.99, img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=80&h=80&fit=crop' },
      { name: 'Ratón Gaming Pro', qty: 1, price: 99.99, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop' },
    ],
    timeline: [
      { step: 'Confirmado', date: '5 Mar', completed: true },
      { step: 'Preparando', date: 'En curso', completed: false },
      { step: 'Enviado', date: '—', completed: false },
      { step: 'Entregado', date: '—', completed: false },
    ],
  },
]

const TABS = [
  { label: 'Todos', value: null },
  { label: 'En Proceso', value: 'En Proceso' },
  { label: 'Enviados', value: 'En Tránsito' },
  { label: 'Entregados', value: 'Entregado' },
]

const statusStyles: Record<string, string> = {
  'Entregado': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'En Tránsito': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  'En Proceso': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
}

export default function PedidosPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = ORDERS.filter((order) => {
    const matchesStatus = selectedStatus ? order.status === selectedStatus : true
    const matchesSearch = searchQuery
      ? order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">
          Mis Pedidos
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">Gestiona y rastrea todos tus pedidos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-gray-200 p-3 sm:p-5"
              style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs font-medium text-[#4A4A4A] uppercase tracking-wider truncate">{stat.label}</p>
                  <p className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold text-[#000000]">{stat.value}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0066FF] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#4A4A4A]" />
          <input
            type="text"
            placeholder="Buscar pedido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-2xl bg-[#FAFAFA] border border-gray-200 text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#FAFAFA] rounded-2xl border border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              selectedStatus === tab.value
                ? 'bg-[#0066FF] text-white'
                : 'text-[#4A4A4A] hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 text-[#4A4A4A]">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No se encontraron pedidos</p>
          </div>
        )}

        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-gray-200 overflow-hidden hover:border-[#0066FF] transition-all duration-200"
            style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
          >
            {/* Order Header */}
            <div className="p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 border-b border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#0066FF] flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono font-semibold text-[#000000] text-xs sm:text-sm truncate">{order.id}</p>
                  <p className="text-xs text-[#4A4A4A]">{order.date.split(' ').slice(0, 2).join(' ')} · {order.items.length} art.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${statusStyles[order.status] || 'bg-gray-200 text-[#000000]'}`}>
                  {order.status}
                </span>
                <p className="text-base sm:text-lg font-bold text-[#000000]">{order.total.toFixed(2)}€</p>
              </div>
            </div>

            {/* Items */}
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-200 overflow-x-auto">
              <div className="flex gap-2 sm:gap-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3 bg-[#FAFAFA] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0 min-w-max sm:min-w-0 sm:flex-1">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-[#000000] truncate">{item.name}</p>
                      <p className="text-xs text-[#4A4A4A]">Qty:{item.qty} {item.price.toFixed(2)}€</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-200 overflow-x-auto">
              <div className="flex items-center justify-between min-w-max sm:min-w-0">
                {order.timeline.map((step, idx) => (
                  <div key={step.step} className="flex items-center flex-1 min-w-max sm:min-w-0">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.completed
                            ? 'bg-[#0066FF]'
                            : 'bg-gray-200 border-2 border-gray-300'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        ) : (
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#4A4A4A]" />
                        )}
                      </div>
                      <p className={`mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-medium ${step.completed ? 'text-[#000000]' : 'text-[#4A4A4A]'}`}>
                        {step.step}
                      </p>
                      <p className={`text-[8px] sm:text-[10px] ${step.completed ? 'text-[#4A4A4A]' : 'text-gray-400'}`}>
                        {step.date}
                      </p>
                    </div>
                    {idx < order.timeline.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 sm:mx-2 mt-[-18px] sm:mt-[-20px] hidden sm:block ${
                        step.completed && order.timeline[idx + 1].completed
                          ? 'bg-[#0066FF]'
                          : step.completed
                          ? 'bg-gradient-to-r from-[#0066FF] to-gray-300'
                          : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-3 sm:px-5 py-2 sm:py-3 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => router.push(`/${locale}/mi-cuenta/pedidos/${order.id}`)}
                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#FAFAFA] hover:bg-gray-100 text-[#000000] text-xs sm:text-sm font-medium transition-colors duration-200"
              >
                <Eye className="w-4 h-4" />
                Detalles
              </button>
              {order.status === 'Entregado' && (
                <button
                  onClick={() => router.push(`/${locale}/mi-cuenta/resenas?orderId=${order.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-medium transition-colors duration-200"
                >
                  <Star className="w-4 h-4" />
                  Reseña
                </button>
              )}
              {order.status === 'En Tránsito' && (
                <button
                  onClick={() => router.push(`/${locale}/mi-cuenta/pedidos/${order.id}/seguimiento`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-medium transition-colors duration-200"
                >
                  <Truck className="w-4 h-4" />
                  Rastrear
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
