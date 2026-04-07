import type { Metadata } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import AuthProvider from '@/components/auth-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';

const fontClassName = 'font-sans';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexomarket.vercel.app'),
  title: {
    default: 'NexoMarket - Marketplace',
    template: '%s | NexoMarket',
  },
  description:
    'NexoMarket es el marketplace donde descubres lo mejor de cada tienda en un solo lugar. Compra y vende productos de electronica, moda, hogar y mucho mas.',
  keywords: [
    'marketplace',
    'tienda online',
    'comprar',
    'vender',
    'electronica',
    'moda',
    'hogar',
    'nexomarket',
    'ecommerce',
    'productos',
    'ofertas',
  ],
  authors: [{ name: 'NexoMarket' }],
  creator: 'NexoMarket',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://nexomarket.vercel.app',
    siteName: 'NexoMarket',
    title: 'NexoMarket - Descubre lo mejor de cada tienda en un solo lugar',
    description:
      'Marketplace multi-vendedor con miles de productos en electronica, moda, hogar, deportes y mas. Compra segura y envios rapidos.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NexoMarket - Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexoMarket - Marketplace',
    description:
      'Descubre lo mejor de cada tienda en un solo lugar. Compra y vende en NexoMarket.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://nexomarket.vercel.app',
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const RTL_LOCALES = ['ar'];

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={fontClassName}>
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
