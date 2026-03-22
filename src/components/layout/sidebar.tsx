'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon, X, Menu } from 'lucide-react'

export interface SidebarItem {
  icon: LucideIcon
  label: string
  href: string
  badge?: {
    count?: number | string
    color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple'
  }
}

export interface SidebarSection {
  label: string
  items: SidebarItem[]
}

interface SidebarProps {
  sections: SidebarSection[]
}

const badgeColorMap = {
  red: 'bg-red-50 text-red-500',
  blue: 'bg-[#0066FF]/10 text-[#0066FF]',
  green: 'bg-green-50 text-green-500',
  yellow: 'bg-amber-50 text-amber-500',
  purple: 'bg-[#0066FF]/10 text-[#0066FF]',
}

export default function Sidebar({ sections }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const sidebarContent = (
    <nav className="p-4 space-y-6">
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-[10px] font-bold uppercase text-[#4A4A4A] tracking-widest">
              {section.label}
            </h3>
          </div>
          <div className="space-y-0.5">
            {section.items.map((item, itemIdx) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    active
                      ? 'bg-[#0066FF]/8 text-[#0066FF]'
                      : 'text-[#4A4A4A] hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] flex-shrink-0 ${
                      active ? 'text-[#0066FF]' : 'text-gray-400 group-hover:text-[#4A4A4A]'
                    }`}
                  />
                  <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        badgeColorMap[item.badge.color || 'red']
                      }`}
                    >
                      {item.badge.count || '!'}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-50 w-14 h-14 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center hover:bg-[#0052CC] transition-all duration-200"
        style={{ boxShadow: '0 4px 30px rgba(0,102,255,0.25)' }}
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ boxShadow: mobileOpen ? '8px 0 60px rgba(0,0,0,0.08)' : 'none' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <span className="text-lg font-bold text-black">Menú</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-[#4A4A4A] hover:text-black transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {sidebarContent}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-[72px] h-[calc(100vh-72px)] w-64 bg-white border-r border-gray-100 overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  )
}
