'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, Tag, Star, Grid3X3, TrendingUp } from 'lucide-react'

const categories = [
  { icon: Home, label: 'Inicio', href: '/' },
  { icon: TrendingUp, label: 'Tendencias', href: '/tendencias' },
  { icon: Tag, label: 'Ofertas', href: '/ofertas' },
  { icon: Grid3X3, label: 'Categorías', href: '/categorias' },
  { icon: Star, label: 'Mejor valorados', href: '/mejor-valorados' },
  { icon: ShoppingBag, label: 'Tiendas', href: '/tiendas' },
]

export function StorefrontSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname.endsWith('/') || pathname.match(/^\/[a-z]{2}$/)
    }
    return pathname.includes(href)
  }

  return (
    <aside className="hidden md:block w-56 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4">
      <nav className="space-y-1">
        {categories.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
