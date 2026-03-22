'use client'

import React from 'react'
import Topbar from './topbar'
import Sidebar, { SidebarSection } from './sidebar'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Upload,
  TrendingUp,
  CreditCard,
  FileText,
  Tag,
  Truck,
  Palette,
  Star,
  MessageSquare,
  Settings,
} from 'lucide-react'

const sellerSections: SidebarSection[] = [
  {
    label: 'Dashboard',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        href: '/vendedor/dashboard',
      },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      {
        icon: ShoppingCart,
        label: 'Pedidos',
        href: '/vendedor/pedidos',
        badge: { count: 3, color: 'red' },
      },
      {
        icon: Package,
        label: 'Productos',
        href: '/vendedor/productos',
      },
      {
        icon: Upload,
        label: 'Subir Productos',
        href: '/vendedor/subir-producto',
      },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      {
        icon: TrendingUp,
        label: 'Ingresos',
        href: '/vendedor/ingresos',
      },
      {
        icon: CreditCard,
        label: 'Pagos',
        href: '/vendedor/pagos',
      },
      {
        icon: FileText,
        label: 'Facturas',
        href: '/vendedor/facturas',
      },
    ],
  },
  {
    label: 'Envíos',
    items: [
      {
        icon: Tag,
        label: 'Etiquetas',
        href: '/vendedor/etiquetas',
      },
      {
        icon: Truck,
        label: 'Seguimiento',
        href: '/vendedor/seguimiento',
      },
    ],
  },
  {
    label: 'Tienda',
    items: [
      {
        icon: Palette,
        label: 'Personalizar',
        href: '/vendedor/personalizar',
      },
      {
        icon: Star,
        label: 'Reseñas',
        href: '/vendedor/resenas',
      },
      {
        icon: MessageSquare,
        label: 'Mensajes',
        href: '/vendedor/mensajes',
        badge: { count: 5, color: 'blue' },
      },
      {
        icon: Settings,
        label: 'Configuración',
        href: '/vendedor/configuracion',
      },
    ],
  },
]

interface SellerLayoutProps {
  children: React.ReactNode
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <Sidebar sections={sellerSections} />
      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
