'use client'

import React from 'react'
import Topbar from './topbar'
import Sidebar, { SidebarSection } from './sidebar'
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingCart,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Star,
  Ticket,
  Bell,
  BarChart3,
  Settings,
  Percent,
} from 'lucide-react'

const adminSections: SidebarSection[] = [
  {
    label: 'General',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: Users, label: 'Usuarios', href: '/admin/users' },
      { icon: Store, label: 'Tiendas', href: '/admin/stores' },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      { icon: Percent, label: 'Comisiones', href: '/admin/comisiones', badge: { count: '€', color: 'blue' } },
      { icon: ShoppingCart, label: 'Pedidos', href: '/admin/orders' },
      { icon: Package, label: 'Productos', href: '/admin/products' },
      { icon: CreditCard, label: 'Pagos', href: '/admin/payments' },
      { icon: Truck, label: 'Envíos', href: '/admin/shipping' },
    ],
  },
  {
    label: 'Moderación',
    items: [
      { icon: CheckCircle, label: 'Aprobaciones', href: '/admin/approvals', badge: { count: 12, color: 'yellow' } },
      { icon: AlertCircle, label: 'Reportes', href: '/admin/reports', badge: { count: 7, color: 'red' } },
      { icon: Star, label: 'Reseñas', href: '/admin/reviews' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { icon: Ticket, label: 'Cupones', href: '/admin/coupons' },
      { icon: Bell, label: 'Notificaciones', href: '/admin/notifications' },
      { icon: BarChart3, label: 'Analíticas', href: '/admin/analytics' },
      { icon: Settings, label: 'Configuración', href: '/admin/configuracion' },
    ],
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Topbar />
      <Sidebar sections={adminSections} />
      <main className="pt-[72px] lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
