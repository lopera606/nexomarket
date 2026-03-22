'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Topbar from '@/components/layout/topbar';
import { Link } from '@/i18n/routing';

// Lazy load cookie consent to avoid SSR issues with localStorage
const CookieConsent = dynamic(() => import('@/components/cookie-consent'), { ssr: false });
const CookieSettingsBtn = dynamic(
  () => import('@/components/cookie-consent').then(mod => ({ default: mod.CookieSettingsButton })),
  { ssr: false }
);

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <main>
        {children}
      </main>
      {/* Footer — Crystal Minimal 2026 */}
      <footer className="mt-24 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
            <div>
              <h4 className="font-bold text-sm text-black mb-5">Conócenos</h4>
              <ul className="space-y-3 text-sm text-[#4A4A4A]">
                <li><Link href="/sobre-nosotros" className="hover:text-[#0066FF] transition-colors duration-200">Sobre NexoMarket</Link></li>
                <li><Link href="/empleo" className="hover:text-[#0066FF] transition-colors duration-200">Trabaja con nosotros</Link></li>
                <li><Link href="/prensa" className="hover:text-[#0066FF] transition-colors duration-200">Prensa</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-black mb-5">Gana dinero</h4>
              <ul className="space-y-3 text-sm text-[#4A4A4A]">
                <li><Link href="/vendedor/dashboard" className="hover:text-[#0066FF] transition-colors duration-200">Vende en NexoMarket</Link></li>
                <li><Link href="/afiliados" className="hover:text-[#0066FF] transition-colors duration-200">Programa de afiliados</Link></li>
                <li><Link href="/publicidad" className="hover:text-[#0066FF] transition-colors duration-200">Publicita tus productos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-black mb-5">Ayuda</h4>
              <ul className="space-y-3 text-sm text-[#4A4A4A]">
                <li><Link href="/mi-cuenta/pedidos" className="hover:text-[#0066FF] transition-colors duration-200">Tu cuenta</Link></li>
                <li><Link href="/devoluciones" className="hover:text-[#0066FF] transition-colors duration-200">Devoluciones</Link></li>
                <li><Link href="/ayuda" className="hover:text-[#0066FF] transition-colors duration-200">Centro de ayuda</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-black mb-5">Legal</h4>
              <ul className="space-y-3 text-sm text-[#4A4A4A]">
                <li><Link href="/legal/aviso-legal" className="hover:text-[#0066FF] transition-colors duration-200">Aviso Legal</Link></li>
                <li><Link href="/legal/terminos" className="hover:text-[#0066FF] transition-colors duration-200">Términos y Condiciones</Link></li>
                <li><Link href="/legal/privacidad" className="hover:text-[#0066FF] transition-colors duration-200">Política de Privacidad</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-[#0066FF] transition-colors duration-200">Política de Cookies</Link></li>
                <li><Link href="/legal/condiciones-vendedor" className="hover:text-[#0066FF] transition-colors duration-200">Condiciones Vendedor</Link></li>
                <li><Suspense fallback={null}><CookieSettingsBtn /></Suspense></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-black mb-5">Pagos seguros</h4>
              <div className="flex gap-2 flex-wrap">
                {['Visa', 'MC', 'Amex', 'PayPal'].map(p => (
                  <span key={p} className="px-3 py-1.5 bg-white rounded-xl text-xs font-medium text-[#4A4A4A]" style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-[#4A4A4A]">
            <p>&copy; 2026 NexoMarket. Todos los derechos reservados.</p>
            <p className="mt-3 text-xs text-gray-400">
              <Link href="/legal/aviso-legal" className="hover:text-[#0066FF] transition-colors duration-200">Aviso Legal</Link>
              {' · '}
              <Link href="/legal/terminos" className="hover:text-[#0066FF] transition-colors duration-200">Términos</Link>
              {' · '}
              <Link href="/legal/privacidad" className="hover:text-[#0066FF] transition-colors duration-200">Privacidad</Link>
              {' · '}
              <Link href="/legal/cookies" className="hover:text-[#0066FF] transition-colors duration-200">Cookies</Link>
            </p>
          </div>
        </div>
      </footer>
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
    </div>
  );
}
