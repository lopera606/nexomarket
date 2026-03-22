'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();

  const breadcrumbs = {
    es: { home: 'Inicio', legal: 'Legal' },
    en: { home: 'Home', legal: 'Legal' },
    fr: { home: 'Accueil', legal: 'Légal' },
  };

  const crumbs = breadcrumbs[locale as keyof typeof breadcrumbs] || breadcrumbs.es;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-[#4A4A4A] mb-6">
            <Link href="/" className="hover:text-[#0066FF] transition-colors">
              {crumbs.home}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">{crumbs.legal}</span>
          </nav>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
              {crumbs.legal}
            </h1>
            <p className="text-[#4A4A4A]">
              Información legal, términos y políticas de NexoMarket
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center text-sm text-[#4A4A4A]">
            <div className="flex gap-4">
              <Link href={`/${locale}/legal/aviso-legal`} className="hover:text-[#0066FF] transition-colors">
                Aviso Legal
              </Link>
              <Link href={`/${locale}/legal/privacidad`} className="hover:text-[#0066FF] transition-colors">
                Privacidad
              </Link>
              <Link href={`/${locale}/legal/cookies`} className="hover:text-[#0066FF] transition-colors">
                Cookies
              </Link>
            </div>
            <p>© 2026 NexoMarket. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
