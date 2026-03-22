'use client'

import React from 'react'
import Topbar from './topbar'
import Sidebar, { SidebarSection } from './sidebar'
import {
  ShoppingCart,
  Heart,
  MapPin,
  CreditCard,
  Star,
  MessageSquare,
  User,
  Bell,
  Lock,
} from 'lucide-react'

const customerSections: SidebarSection[] = [
  {
    label: 'Mi Cuenta',
    items: [
      {
        icon: ShoppingCart,
        label: 'Mis Pedidos',
        href: '/mi-cuenta/pedidos',
        badge: { count: 2, color: 'blue' },
      },
      {
        icon: Heart,
        label: 'Favoritos',
        href: '/mi-cuenta/favoritos',
      },
      {
        icon: MapPin,
        label: 'Direcciones',
        href: '/mi-cuenta/direcciones',
      },
      {
        icon: CreditCard,
        label: 'Métodos de Pago',
        href: '/mi-cuenta/metodos-pago',
      },
      {
        icon: Star,
        label: 'Mis Reseñas',
        href: '/mi-cuenta/resenas',
      },
      {
        icon: MessageSquare,
        label: 'Mensajes',
        href: '/mi-cuenta/mensajes',
        badge: { count: 1, color: 'green' },
      },
    ],
  },
  {
    label: 'Configuración',
    items: [
      {
        icon: User,
        label: 'Perfil',
        href: '/mi-cuenta/perfil',
      },
      {
        icon: Bell,
        label: 'Notificaciones',
        href: '/mi-cuenta/notificaciones',
      },
      {
        icon: Lock,
        label: 'Seguridad',
        href: '/mi-cuenta/seguridad',
      },
    ],
  },
]

interface CustomerLayoutProps {
  children: React.ReactNode
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Topbar />
      <Sidebar sections={customerSections} />
      <main className="pt-16 md:pt-16 lg:ml-64 min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
