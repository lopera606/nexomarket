'use client';

import { Link } from '@/i18n/routing';
import { Search, ChevronDown, MessageCircle, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { name: 'Pedidos', emoji: '📦', color: 'from-blue-500 to-blue-600' },
    { name: 'Envíos', emoji: '🚚', color: 'from-green-500 to-green-600' },
    { name: 'Devoluciones', emoji: '↩️', color: 'from-orange-500 to-orange-600' },
    { name: 'Pagos', emoji: '💳', color: 'from-blue-500 to-blue-600' },
    { name: 'Cuenta', emoji: '👤', color: 'from-pink-500 to-pink-600' },
    { name: 'Vendedor', emoji: '🏪', color: 'from-yellow-500 to-yellow-600' },
  ];

  const faqs = [
    {
      question: '¿Cuál es el tiempo de entrega típico?',
      answer: 'Los pedidos se entregan normalmente en 3-7 días hábiles. El tiempo exacto depende de tu ubicación y del vendedor. Puedes rastrear tu pedido en tiempo real desde tu cuenta.',
    },
    {
      question: '¿Puedo cambiar mi dirección de envío después de hacer un pedido?',
      answer: 'Puedes cambiar la dirección hasta 24 horas después de hacer el pedido, siempre que este no haya sido enviado. Accede a tu pedido en "Mis Pedidos" para modificarla.',
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), PayPal, transferencia bancaria y Google Pay. Todos los pagos están protegidos con encriptación SSL.',
    },
    {
      question: '¿Cómo puedo devolver un producto?',
      answer: 'Tienes 30 días para devolver productos en condiciones originales. Inicia el proceso desde "Mis Pedidos" > "Solicitar Devolución" y seguiremos los pasos contigo.',
    },
    {
      question: '¿Hay gastos de envío?',
      answer: 'Los gastos de envío varían según el vendedor y la ubicación. Muchos vendedores ofrecen envío gratis para pedidos superiores a €25. Verás el coste exacto antes de confirmar tu pedido.',
    },
    {
      question: '¿Es seguro comprar en NexoMarket?',
      answer: 'Sí, todos nuestros vendedores son verificados y cumplen con estrictos estándares de calidad. Tu dinero está protegido hasta que confirmes que el producto llegó correctamente.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="bg-[#FAFAFA] border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Centro de Ayuda</h1>
          <p className="text-[#4A4A4A] mb-6">¿Necesitas ayuda? Aquí encontrarás respuestas a tus preguntas.</p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Busca en nuestro centro de ayuda..."
              className="w-full bg-white text-black placeholder-gray-400 rounded-2xl pl-12 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Categorías de Ayuda</h2>
          <div className="grid grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/ayuda/${cat.name.toLowerCase()}`}
                className="group bg-white border border-gray-200 rounded-3xl p-8 text-center hover:border-[#0066FF] transition"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition">{cat.emoji}</div>
                <h3 className="text-lg font-bold text-black group-hover:text-[#0066FF] transition">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 hover:bg-[#FAFAFA] transition text-left"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0066FF] transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-6 text-[#4A4A4A] border-t border-gray-200 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-8 text-center">¿Aún necesitas ayuda?</h2>
          <div className="grid grid-cols-3 gap-6">
            <Link
              href="/ayuda/chat"
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#0066FF] transition text-center"
            >
              <MessageCircle className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Chat en Vivo</h3>
              <p className="text-[#4A4A4A] text-sm mb-4">Habla con nuestro equipo ahora</p>
              <span className="text-blue-400 text-sm font-semibold">Disponible 24/7</span>
            </Link>

            <Link
              href="mailto:soporte@nexomarket.com"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#0066FF]/50 transition text-center"
            >
              <Mail className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Correo Electrónico</h3>
              <p className="text-[#4A4A4A] text-sm mb-4">soporte@nexomarket.com</p>
              <span className="text-green-400 text-sm font-semibold">Respuesta en 24h</span>
            </Link>

            <Link
              href="tel:+34900123456"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#0066FF]/50 transition text-center"
            >
              <Phone className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
              <h3 className="font-bold mb-2">Teléfono</h3>
              <p className="text-[#4A4A4A] text-sm mb-4">+34 900 123 456</p>
              <span className="text-[#0066FF] text-sm font-semibold">L-V 9:00-20:00</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Enlaces Útiles</h3>
            <ul className="space-y-2">
              <li><Link href="/politica-privacidad" className="text-[#0066FF] hover:text-[#0052CC]">Política de Privacidad</Link></li>
              <li><Link href="/terminos-servicio" className="text-[#0066FF] hover:text-[#0066FF]">Términos de Servicio</Link></li>
              <li><Link href="/politica-cookies" className="text-[#0066FF] hover:text-[#0066FF]">Política de Cookies</Link></li>
              <li><Link href="/devoluciones" className="text-[#0066FF] hover:text-[#0066FF]">Política de Devoluciones</Link></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Para Vendedores</h3>
            <ul className="space-y-2">
              <li><Link href="/vendedor/ayuda" className="text-[#0066FF] hover:text-[#0066FF]">Ayuda para Vendedores</Link></li>
              <li><Link href="/vendedor/directrices" className="text-[#0066FF] hover:text-[#0066FF]">Directrices de Listado</Link></li>
              <li><Link href="/vendedor/comisiones" className="text-[#0066FF] hover:text-[#0066FF]">Estructura de Comisiones</Link></li>
              <li><Link href="/afiliados" className="text-[#0066FF] hover:text-[#0066FF]">Programa de Afiliados</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
