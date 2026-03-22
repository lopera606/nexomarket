'use client';

import { Link } from '@/i18n/routing';
import { TrendingUp, BarChart3, Zap, Award } from 'lucide-react';

export default function AdvertisingPage() {
  const adFormats = [
    {
      name: 'Banner Premium',
      description: 'Anuncios en la homepage y páginas de categoría',
      positions: 'Header, Sidebar, Footer',
      impression: '1M+ impresiones/mes',
      price: 'desde €500',
      emoji: '🎨',
    },
    {
      name: 'Producto Destacado',
      description: 'Promoción de productos individuales',
      positions: 'Primeras búsquedas, Categoría',
      impression: '500K+ impresiones/mes',
      price: 'desde €300',
      emoji: '⭐',
    },
    {
      name: 'Búsqueda Patrocinada',
      description: 'Anuncios en resultados de búsqueda',
      positions: 'Tope de resultados',
      impression: '250K+ impresiones/mes',
      price: 'desde €200',
      emoji: '🔍',
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '€500/mes',
      features: ['1 formato de anuncio', '500K+ impresiones', 'Soporte básico', 'Reportes mensuales'],
      emoji: '🚀',
    },
    {
      name: 'Profesional',
      price: '€1,500/mes',
      features: ['2 formatos de anuncio', '1.5M+ impresiones', 'Soporte prioritario', 'Reportes semanales', 'A/B testing'],
      emoji: '💼',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Personalizado',
      features: ['Todos los formatos', 'Ilimitado', 'Account manager dedicado', 'Reportes en tiempo real', 'Estrategia personalizada'],
      emoji: '👑',
    },
  ];

  const benefits = [
    { icon: TrendingUp, title: 'Retorno Garantizado', description: 'ROI promedio de 3:1' },
    { icon: BarChart3, title: 'Analítica Detallada', description: 'Tracking de cada click' },
    { icon: Zap, title: 'Setup Rápido', description: 'Comienza en 24 horas' },
    { icon: Award, title: 'Equipo Experto', description: 'Optimización continua' },
  ];

  const successStories = [
    { brand: 'TechStore Premium', increase: '+250%', revenue: '+€125K/mes', emoji: '📱' },
    { brand: 'Fashion Hub Global', increase: '+180%', revenue: '+€89K/mes', emoji: '👗' },
    { brand: 'Home Solutions', increase: '+320%', revenue: '+€156K/mes', emoji: '🏠' },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-600/20 to-pink-600/20 border-b border-gray-200/20 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Publicidad en NexoMarket</h1>
          <p className="text-[#4A4A4A] mb-6">
            Alcanza a 500K+ clientes activos y acelera el crecimiento de tu negocio
          </p>
          <Link href="/publicidad/contacto" className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition">
            Solicitar Demostración
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Ad Formats */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Formatos de Anuncios</h2>
          <div className="grid grid-cols-3 gap-6">
            {adFormats.map((format) => (
              <div key={format.name} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-5xl mb-4">{format.emoji}</div>
                <h3 className="text-lg font-bold mb-2">{format.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{format.description}</p>
                <div className="space-y-2 mb-4 text-sm">
                  <p><span className="text-[#0066FF]400">Posición:</span> {format.positions}</p>
                  <p><span className="text-[#0066FF]400">Alcance:</span> {format.impression}</p>
                </div>
                <div className="pt-4 border-t border-gray-200/20">
                  <p className="text-2xl font-bold text-green-400">{format.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">¿Por qué Publicidad en NexoMarket?</h2>
          <div className="grid grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <Icon className="w-8 h-8 text-[#0066FF]400 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Plataforma Publicitaria Self-Serve</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-[#0066FF]300">Características</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Crear campañas en minutos</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Control de presupuesto flexible</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Segmentación de audiencia</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Reportes en tiempo real</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-6 flex items-center justify-center">
              <div className="text-5xl">🖥️</div>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Planes de Publicidad</h2>
          <div className="grid grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-lg overflow-hidden transition ${
                  tier.highlighted
                    ? 'border-2 border-gray-400 bg-white scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 right-0 bg-blue-600 px-3 py-1 text-xs font-bold">
                    Popular
                  </div>
                )}
                <div className="p-8">
                  <div className="text-5xl mb-4">{tier.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold text-[#0066FF]400 mb-6">{tier.price}</div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/publicidad/${tier.name.toLowerCase()}`}
                    className={`block text-center py-2 rounded-lg font-semibold transition ${
                      tier.highlighted
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'border border-gray-200/50 hover:border-gray-200'
                    }`}
                  >
                    Comenzar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Casos de Éxito</h2>
          <div className="grid grid-cols-3 gap-6">
            {successStories.map((story, idx) => (
              <div key={idx} className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">{story.emoji}</div>
                <h3 className="text-lg font-bold mb-4">{story.brand}</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-3xl font-bold text-green-400">{story.increase}</p>
                    <p className="text-sm text-gray-500">aumento en ventas</p>
                  </div>
                  <div className="text-2xl font-bold text-[#0066FF]400">{story.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Cómo Comenzar</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="font-bold mb-2">Regístrate</h3>
              <p className="text-sm text-gray-500">Crea tu cuenta publicitaria</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="font-bold mb-2">Crea Campaña</h3>
              <p className="text-sm text-gray-500">Configura tus anuncios</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="font-bold mb-2">Financia</h3>
              <p className="text-sm text-gray-500">Establece tu presupuesto</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">4️⃣</div>
              <h3 className="font-bold mb-2">Monitorea</h3>
              <p className="text-sm text-gray-500">Ve resultados en vivo</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: '¿Cuál es el presupuesto mínimo?', a: 'El presupuesto mínimo es €200/mes. Puedes aumentar o disminuir en cualquier momento.' },
              { q: '¿Cómo se factura?', a: 'Se factura mensualmente. Acepta tarjeta de crédito, transferencia bancaria y PayPal.' },
              { q: '¿Hay contrato a largo plazo?', a: 'No, todos nuestros planes son sin contrato. Puedes cancelar en cualquier momento.' },
              { q: '¿Obtengo un account manager?', a: 'Sí, en los planes Profesional y Enterprise incluye soporte dedicado.' },
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
        <div className="bg-gradient-to-r from-gray-600/20 to-pink-600/20 border border-gray-200/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Comienza Tu Campaña Hoy</h2>
          <p className="text-[#4A4A4A] mb-6">
            Únete a cientos de negocios que crecen con publicidad en NexoMarket
          </p>
          <Link href="/publicidad/registro" className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition">
            Acceder a la Plataforma
          </Link>
        </div>
      </div>
    </div>
  );
}
