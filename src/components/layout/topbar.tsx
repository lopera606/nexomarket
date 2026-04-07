'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell, Search, ShoppingCart, User, Menu, X, MapPin,
  Store, ChevronRight, Globe, Heart, LogOut, LogIn, UserPlus,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useNotifications } from '@/hooks/useNotifications'

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

export default function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoggedIn, logout, isLoading: authLoading } = useAuth()
  const { totalItems: cartCount } = useCart()
  const { unreadCount: notifCount } = useNotifications()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const langRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await logout()
    setAccountMenuOpen(false)
    router.push(localePath('/'))
  }

  // Extract current locale from pathname
  const segments = pathname.split('/')
  const currentLocale = LANGUAGES.find(l => l.code === segments[1])?.code || 'es'
  const currentLang = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0]

  const isStorefront = !pathname.includes('/vendedor') && !pathname.includes('/admin') && !pathname.includes('/mi-cuenta')

  // Build locale-aware path helper
  const localePath = (path: string) => `/${currentLocale}${path}`

  // Switch language: replace locale segment in current URL
  const switchLanguage = (newLocale: string) => {
    const newSegments = [...segments]
    if (LANGUAGES.find(l => l.code === newSegments[1])) {
      newSegments[1] = newLocale
    } else {
      newSegments.splice(1, 0, newLocale)
    }
    router.push(newSegments.join('/') || '/')
    setLangMenuOpen(false)
  }

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Allow search by category alone, or by query, or by both
    if (!searchQuery.trim() && !searchCategory) return
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (searchCategory) params.set('category', searchCategory)
    router.push(localePath(`/buscar?${params.toString()}`))
    setMobileSearchOpen(false)
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false)
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .categories-scroll {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl" style={{ boxShadow: '0 1px 60px rgba(0,0,0,0.03)' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center h-16 sm:h-[72px] px-4 sm:px-6 lg:px-8 gap-3 sm:gap-5">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-1 rounded-2xl hover:bg-gray-50 text-gray-500 transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link href={localePath('/')} className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#0066FF] rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
                <span className="text-white font-black text-sm sm:text-base">N</span>
              </div>
              <span className="hidden md:block text-xl font-extrabold tracking-tight text-black">
                Nexo<span className="text-[#0066FF]">Market</span>
              </span>
            </Link>

            {/* Delivery location - desktop only */}
            <button className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-gray-50 text-sm transition-all duration-200">
              <MapPin className="w-4 h-4 text-[#0066FF]" />
              <div className="text-left">
                <span className="block text-[10px] text-[#4A4A4A] leading-tight">Enviar a</span>
                <span className="block font-semibold text-black leading-tight">Madrid 28001</span>
              </div>
            </button>

            {/* Search bar - full on sm+ */}
            <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl mx-3 lg:mx-6">
              <div className="flex items-center w-full rounded-2xl bg-gray-50 hover:bg-gray-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0066FF]/20 transition-all duration-200" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="hidden sm:block text-xs font-medium text-[#4A4A4A] bg-transparent border-r border-gray-200 rounded-l-2xl px-3 lg:px-4 py-3 focus:outline-none cursor-pointer appearance-none"
                  style={{
                    backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%234A4A4A%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%3e%3c/polyline%3e%3c/svg%3e')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.25em',
                    paddingRight: '2rem'
                  }}
                >
                  <option value="">Todos</option>
                  <option value="electronics">Electrónica</option>
                  <option value="computing">Informática</option>
                  <option value="fashion">Moda</option>
                  <option value="home">Hogar y Cocina</option>
                  <option value="sports">Deportes</option>
                  <option value="beauty">Belleza</option>
                  <option value="books">Libros</option>
                  <option value="games">Juguetes</option>
                  <option value="health">Salud</option>
                  <option value="auto">Automóvil</option>
                  <option value="toys">Bebé</option>
                  <option value="groceries">Supermercado</option>
                  <option value="garden">Jardín</option>
                  <option value="music">Música</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos, marcas y tiendas..."
                  className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent text-black placeholder-gray-400 focus:outline-none"
                />
                <button type="submit" className="px-4 py-3 bg-[#0066FF] rounded-r-2xl hover:bg-[#0052CC] transition-colors duration-200 flex-shrink-0">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>

            {/* Mobile: search toggle + spacer */}
            <div className="flex-1 sm:hidden" />
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden p-2 rounded-2xl hover:bg-gray-50 text-gray-500 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              {/* Language selector */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-2xl hover:bg-gray-50 text-sm transition-all duration-200"
                  title="Cambiar idioma"
                >
                  <Globe className="w-4 h-4 text-[#4A4A4A]" />
                  <span className="hidden sm:inline text-xs font-medium text-[#4A4A4A]">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
                  <span className="sm:hidden text-xs">{currentLang.flag}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl py-2 z-50 max-h-80 overflow-y-auto" style={{ boxShadow: '0 8px 60px rgba(0,0,0,0.08)' }}>
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-all duration-200 ${
                          lang.code === currentLocale ? 'text-[#0066FF] font-semibold bg-[#0066FF]/5' : 'text-[#4A4A4A]'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.label}</span>
                        {lang.code === currentLocale && <span className="ml-auto text-[#0066FF] text-xs">&#10003;</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Account - desktop (lg+) */}
              {!authLoading && isLoggedIn ? (
                <div ref={accountRef} className="relative hidden lg:block">
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-gray-50 text-sm transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-[#0066FF]/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#0066FF]">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-[#4A4A4A] leading-tight">Hola, {user?.name?.split(' ')[0]}</span>
                      <span className="block font-semibold text-black leading-tight text-xs">Mi cuenta</span>
                    </div>
                  </button>
                  {accountMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl py-2 z-50" style={{ boxShadow: '0 8px 60px rgba(0,0,0,0.08)' }}>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-sm text-black">{user?.name}</p>
                        <p className="text-xs text-[#4A4A4A]">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-[#0066FF]/10 text-[#0066FF] px-2 py-0.5 rounded-full">
                          {user?.role}
                        </span>
                      </div>
                      <Link href={localePath('/mi-cuenta/pedidos')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-gray-50 transition-all" onClick={() => setAccountMenuOpen(false)}>
                        <User className="w-4 h-4" /> Mi Cuenta
                      </Link>
                      <Link href={localePath('/mi-cuenta/favoritos')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-gray-50 transition-all" onClick={() => setAccountMenuOpen(false)}>
                        <Heart className="w-4 h-4" /> Favoritos
                      </Link>
                      {(user?.role === 'vendedor' || user?.role === 'admin') && (
                        <Link href={localePath('/vendedor/dashboard')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-gray-50 transition-all" onClick={() => setAccountMenuOpen(false)}>
                          <Store className="w-4 h-4" /> Mi Tienda
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all">
                          <LogOut className="w-4 h-4" /> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : !authLoading ? (
                <div className="hidden lg:flex items-center gap-2">
                  <Link href={localePath('/login')} className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-gray-50 text-sm font-medium text-[#4A4A4A] transition-all duration-200">
                    <LogIn className="w-4 h-4" /> Iniciar Sesión
                  </Link>
                  <Link href={localePath('/registro')} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0066FF] text-white text-sm font-semibold hover:bg-[#0052CC] transition-all duration-200">
                    <UserPlus className="w-4 h-4" /> Registrarse
                  </Link>
                </div>
              ) : null}

              {/* Account - mobile (icon only) */}
              {!authLoading && isLoggedIn ? (
                <Link href={localePath('/mi-cuenta/pedidos')} className="lg:hidden p-2.5 rounded-2xl hover:bg-gray-50 transition-all duration-200">
                  <div className="w-7 h-7 bg-[#0066FF]/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-[#0066FF]">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                </Link>
              ) : !authLoading ? (
                <Link href={localePath('/login')} className="lg:hidden p-2.5 rounded-2xl hover:bg-gray-50 transition-all duration-200">
                  <User className="w-5 h-5 text-[#4A4A4A]" />
                </Link>
              ) : null}

              {/* Bell */}
              <Link href={localePath('/mi-cuenta/notificaciones')} className="relative p-2.5 rounded-2xl hover:bg-gray-50 transition-all duration-200">
                <Bell className="w-5 h-5 text-[#4A4A4A]" />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#0066FF] rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{notifCount > 9 ? '9+' : notifCount}</span>
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href={localePath('/carrito')} className="relative p-2.5 rounded-2xl hover:bg-gray-50 transition-all duration-200">
                <ShoppingCart className="w-5 h-5 text-[#4A4A4A]" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-[18px] h-[18px] bg-[#0066FF] rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{cartCount > 9 ? '9+' : cartCount}</span>
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile search - expandable */}
          {mobileSearchOpen && (
            <form onSubmit={handleSearch} className="sm:hidden px-4 pb-3">
              <div className="flex items-center rounded-2xl bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0066FF]/20 transition-all duration-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent text-black placeholder-gray-400 focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="px-4 py-3 bg-[#0066FF] rounded-r-2xl hover:bg-[#0052CC] transition-colors duration-200">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          )}

          {/* Categories bar - storefront */}
          {isStorefront && (
            <div className="flex items-center gap-1 px-4 sm:px-8 py-2 border-t border-gray-100 text-sm overflow-x-auto scrollbar-hide categories-scroll">
              <Link href={localePath('/vendedor/dashboard')} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full hover:bg-[#0066FF]/5 hover:text-[#0066FF] font-semibold text-xs whitespace-nowrap text-black transition-all duration-200">
                <Store className="w-3.5 h-3.5" /> Vender
              </Link>
              <span className="w-px h-4 bg-gray-200 mx-1 flex-shrink-0" />
              {[
                { name: 'Electrónica', slug: 'electronics' },
                { name: 'Moda', slug: 'fashion' },
                { name: 'Hogar y Cocina', slug: 'home' },
                { name: 'Deportes', slug: 'sports' },
                { name: 'Libros', slug: 'books' },
                { name: 'Juguetes', slug: 'games' },
                { name: 'Belleza', slug: 'beauty' },
                { name: 'Supermercado', slug: 'groceries' },
                { name: 'Ofertas del día', slug: '' },
              ].map(cat => (
                <Link key={cat.name} href={cat.slug ? localePath(`/categorias/${cat.slug}`) : localePath('/ofertas')} className="px-4 py-1.5 rounded-full hover:bg-gray-50 text-xs whitespace-nowrap font-medium text-[#4A4A4A] hover:text-black transition-all duration-200 flex-shrink-0">
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white overflow-y-auto" style={{ boxShadow: '8px 0 60px rgba(0,0,0,0.08)' }}>
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-[#0066FF] to-[#0052CC]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-extrabold text-xl tracking-tight">NexoMarket</span>
                <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              {isLoggedIn && user ? (
                <>
                  <p className="text-white font-semibold text-lg">Hola, {user.name.split(' ')[0]}</p>
                  <p className="text-white/70 text-sm">{user.email}</p>
                </>
              ) : (
                <>
                  <p className="text-white font-semibold text-lg">Bienvenido</p>
                  <div className="flex gap-2 mt-3">
                    <Link href={localePath('/login')} className="px-4 py-2 bg-white text-[#0066FF] rounded-xl text-sm font-semibold" onClick={() => setMobileMenuOpen(false)}>
                      Iniciar Sesión
                    </Link>
                    <Link href={localePath('/registro')} className="px-4 py-2 bg-white/20 text-white rounded-xl text-sm font-semibold" onClick={() => setMobileMenuOpen(false)}>
                      Registrarse
                    </Link>
                  </div>
                </>
              )}
            </div>

            <nav className="p-4 space-y-1">
              {/* Language selector in mobile */}
              <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-widest px-3 pt-3 pb-2">Idioma</p>
              <div className="grid grid-cols-2 gap-1.5 px-2 pb-3">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { switchLanguage(lang.code); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                      lang.code === currentLocale ? 'bg-[#0066FF]/10 text-[#0066FF] font-semibold' : 'text-[#4A4A4A] hover:bg-gray-50'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 my-4" />

              {/* Account links */}
              <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-widest px-3 pt-2 pb-2">Cuenta</p>
              {[
                { href: localePath('/mi-cuenta/pedidos'), icon: User, label: 'Mi Cuenta' },
                { href: localePath('/vendedor/dashboard'), icon: Store, label: 'Panel Vendedor' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-[#4A4A4A] hover:bg-gray-50 hover:text-black transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-4.5 h-4.5 text-[#4A4A4A]" />
                  {item.label}
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />
                </Link>
              ))}

              <div className="border-t border-gray-100 my-4" />

              {/* Categories */}
              <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-widest px-3 pt-2 pb-2">Categorías</p>
              {[
                { name: 'Electrónica', slug: 'electronics' },
                { name: 'Moda', slug: 'fashion' },
                { name: 'Hogar y Cocina', slug: 'home' },
                { name: 'Deportes', slug: 'sports' },
                { name: 'Libros', slug: 'books' },
                { name: 'Juguetes', slug: 'games' },
                { name: 'Belleza', slug: 'beauty' },
                { name: 'Supermercado', slug: 'groceries' },
              ].map(cat => (
                <Link
                  key={cat.slug}
                  href={localePath(`/categorias/${cat.slug}`)}
                  className="block px-3 py-3 rounded-2xl text-sm font-medium text-[#4A4A4A] hover:bg-gray-50 hover:text-black transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 my-4" />

              {/* Quick links */}
              <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-widest px-3 pt-2 pb-2">Destacados</p>
              {[
                { href: localePath('/ofertas'), label: 'Ofertas Flash' },
                { href: localePath('/tendencias'), label: 'Tendencias' },
                { href: localePath('/carrito'), label: 'Mi Carrito' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-3 rounded-2xl text-sm font-medium text-[#4A4A4A] hover:bg-gray-50 hover:text-black transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {isLoggedIn && (
                <>
                  <div className="border-t border-gray-100 my-4" />
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 w-full"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export const topbarHeight = 72
