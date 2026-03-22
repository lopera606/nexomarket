'use client';

import { Link } from '@/i18n/routing';
import { TrendingUp, DollarSign, Clock, BarChart3 } from 'lucide-react';

export default function AffiliatesPage() {
  const benefits = [
    { icon: DollarSign, title: 'Comisión 5-10%', description: 'Gana entre 5% y 10% por cada venta' },
    { icon: Clock, title: 'Cookies 30 días', description: 'Seguimiento de 30 días para conversiones' },
    { icon: TrendingUp, title: 'Pagos Mensuales', description: 'Retiros automáticos cada mes' },
    { icon: BarChart3, title: 'Dashboard Avanzado', description: 'Analítica en tiempo real' },
  ];

  const steps = [
    {
      step: 1,
      title: 'Regístrate',
      description: 'Crea tu cuenta de afiliado en menos de 5 minutos',
      emoji: '📝',
    },
    {
      step: 2,
      title: 'Obtén tu Enlace',
      description: 'Recibe tu código único para rastrear tus referen.',
      emoji: '🔗',
    },
    {
      step: 3,
      title: 'Gana Comisiones',
      description: 'Comparte tus enlaces y comienza a ganar dinero',
      emoji: '💰',
    },
  ];

  const topAffiliates = [
    { name: 'TechBlog España', earnings: '€12,500', emoji: '📱' },
    { name: 'Deals de Oferta', earnings: '€9,300', emoji: '🎁' },
    { name: 'Reviews Honestos', earnings: '€8,750', emoji: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="bg-[#FAFAFA] border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Programa de Afiliados NexoMarket</h1>
          <p className="text-[#4A4A4A] mb-6">
            Gana dinero promocionando productos de NexoMarket. Sin límites, sin cuota mínima.
          </p>
          <Link href="/afiliados/registro" className="inline-block bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-3 rounded-2xl font-semibold transition">
            Únete Ahora - Es Gratis
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-16">
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">€2.5M</div>
            <p className="text-[#4A4A4A]">Pagados a afiliados</p>
          </div>
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">8,500+</div>
            <p className="text-gray-500">Afiliados activos</p>
          </div>
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-[#0066FF] mb-2">7.5%</div>
            <p className="text-gray-500">Comisión promedio</p>
          </div>
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">1.2M</div>
            <p className="text-gray-500">Conversiones mensuales</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Beneficios del Programa</h2>
          <div className="grid grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-white border border-gray-200 rounded-2xl p-6">
                  <Icon className="w-8 h-8 text-[#0066FF] mb-4" />
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-[#4A4A4A] text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Cómo Funciona</h2>
          <div className="grid grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#0066FF] rounded-full flex items-center justify-center font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-3 mt-4">{item.title}</h3>
                  <p className="text-[#4A4A4A]">{item.description}</p>
                </div>
                {item.step < 3 && (
                  <div className="absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-[#0066FF] to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Commission Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Estructura de Comisiones</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left font-bold">Conversiones Mensuales</th>
                  <th className="px-6 py-3 text-center font-bold">Comisión Base</th>
                  <th className="px-6 py-3 text-center font-bold">Comisión Bonus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-[#FAFAFA] transition">
                  <td className="px-6 py-4">0 - 10</td>
                  <td className="px-6 py-4 text-center">5%</td>
                  <td className="px-6 py-4 text-center">-</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-[#FAFAFA] transition">
                  <td className="px-6 py-4">11 - 50</td>
                  <td className="px-6 py-4 text-center">6%</td>
                  <td className="px-6 py-4 text-center">0.5%</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-[#FAFAFA] transition">
                  <td className="px-6 py-4">51 - 100</td>
                  <td className="px-6 py-4 text-center">7%</td>
                  <td className="px-6 py-4 text-center">1%</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-[#FAFAFA] transition">
                  <td className="px-6 py-4">101+</td>
                  <td className="px-6 py-4 text-center">10%</td>
                  <td className="px-6 py-4 text-center">2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Affiliates */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Afiliados Destacados del Mes</h2>
          <div className="grid grid-cols-3 gap-6">
            {topAffiliates.map((affiliate, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-600/10 to-pink-600/10 border border-gray-300 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">{affiliate.emoji}</div>
                <h3 className="text-lg font-bold mb-2">{affiliate.name}</h3>
                <p className="text-2xl font-bold text-green-400">{affiliate.earnings}</p>
                <p className="text-gray-500 text-sm mt-2">Este mes</p>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Materials */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Materiales de Marketing</h2>
          <p className="text-[#4A4A4A] mb-6">
            Te proporcionamos todo lo que necesitas para promocionar NexoMarket:
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="font-semibold mb-2">Banners</p>
              <p className="text-sm text-gray-500">300+ diseños</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">✍️</div>
              <p className="font-semibold mb-2">Textos</p>
              <p className="text-sm text-gray-500">100+ ejemplos</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">📧</div>
              <p className="font-semibold mb-2">Templates Email</p>
              <p className="text-sm text-gray-500">25+ plantillas</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: '¿Cuándo recibo mi primer pago?', a: 'Después de tus primeras 10 conversiones, puedes retirar tu dinero. Los pagos se procesan mensualmente.' },
              { q: '¿Hay límite de ganancias?', a: 'No hay límite. Gana todo lo que puedas. Cuanto mayor sea tu desempeño, mayores son las comisiones.' },
              { q: '¿Qué métodos de pago hay?', a: 'Transferencia bancaria, PayPal, y depósito directo en tu cuenta bancaria.' },
            ].map((item, idx) => (
              <details key={idx} className="group bg-white border border-gray-200 rounded-lg p-6">
                <summary className="flex cursor-pointer items-center justify-between font-bold">
                  {item.q}
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-gray-500 mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para Comenzar?</h2>
          <p className="text-[#4A4A4A] mb-6">Únete a nuestro programa de afiliados completamente gratis hoy mismo.</p>
          <Link href="/afiliados/registro" className="inline-block bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-semibold transition">
            Registrarse Ahora
          </Link>
        </div>
      </div>
    </div>
  );
}
