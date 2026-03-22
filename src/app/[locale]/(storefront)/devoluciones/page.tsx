'use client';

import { Link } from '@/i18n/routing';
import { CheckCircle, AlertCircle, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function ReturnsPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const returnProcess = [
    {
      step: 1,
      title: 'Solicita la Devolución',
      description: 'Accede a "Mis Pedidos", selecciona el producto y haz clic en "Solicitar Devolución".',
      emoji: '📝',
    },
    {
      step: 2,
      title: 'Envía el Producto',
      description: 'Empaca el producto en condiciones originales y envíalo al vendedor. Te proporcionaremos una etiqueta de envío.',
      emoji: '📦',
    },
    {
      step: 3,
      title: 'Recibe tu Reembolso',
      description: 'Una vez que el vendedor reciba el producto, procesaremos tu reembolso en 5-7 días hábiles.',
      emoji: '✅',
    },
  ];

  const policies = [
    { icon: Clock, title: '30 Días', description: 'Tienes 30 días desde la recepción para devolver' },
    { icon: CheckCircle, title: 'Gratis', description: 'El envío de devolución es gratuito siempre' },
    { icon: AlertCircle, title: 'Condiciones Originales', description: 'El producto debe estar sin usar y en su embalaje original' },
    { icon: CheckCircle, title: 'Reembolso Completo', description: 'Te devolvemos el 100% del precio del producto' },
  ];

  const faqs = [
    {
      question: '¿Cuándo puedo devolver un producto?',
      answer: 'Tienes 30 días desde que recibas el producto para solicitar una devolución. Este plazo se aplica a todos los productos, excepto los artículos personalizados o sin embalaje original.',
    },
    {
      question: '¿Hay algún coste asociado con la devolución?',
      answer: 'No, el envío de devolución es completamente gratuito. Te proporcionaremos una etiqueta de envío prepagada que puedes usar en cualquier punto de envío.',
    },
    {
      question: '¿Qué pasa si cambio de opinión después de abrir el producto?',
      answer: 'Puedes devolver el producto incluso si lo has abierto, siempre que esté en condiciones de reventa. Esto significa que debe estar completo, sin uso y con todos los accesorios originales.',
    },
    {
      question: '¿Cuánto tiempo tarda en procesarse el reembolso?',
      answer: 'Una vez que recibamos el producto devuelto, procesamos el reembolso en 5-7 días hábiles. El dinero llegará a tu cuenta original de pago.',
    },
    {
      question: '¿Puedo devolver un producto dañado o defectuoso?',
      answer: 'Sí, si el producto llega dañado o defectuoso, puedes devolver sin limitaciones. No necesita estar en condiciones originales si fue dañado por transporte o fabricación.',
    },
    {
      question: '¿Qué documentación necesito para hacer una devolución?',
      answer: 'Necesitarás el número de pedido y una razón para la devolución. Si fotografías el producto antes de empacarlo, facilitará el proceso.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="bg-[#FAFAFA] border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Política de Devoluciones</h1>
          <p className="text-[#4A4A4A]">
            En NexoMarket queremos que estés 100% satisfecho. Si cambias de opinión, devolver es fácil y gratis.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Start CTA */}
        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas Devolver un Producto?</h2>
          <p className="text-[#4A4A4A] mb-6">Inicia el proceso en tres simples pasos:</p>
          <Link href="/mi-cuenta/pedidos" className="inline-block bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-3 rounded-2xl font-semibold transition">
            Ir a Mis Pedidos
          </Link>
        </div>

        {/* Return Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8">Proceso de Devolución</h2>
          <div className="grid grid-cols-3 gap-6">
            {returnProcess.map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center h-full">
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <div className="flex items-center justify-center w-8 h-8 bg-[#0066FF] rounded-full mx-auto mb-4 text-white">
                    <span className="font-bold">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-[#4A4A4A] text-sm">{item.description}</p>
                </div>
                {item.step < 3 && (
                  <div className="absolute top-1/2 -right-8 w-8 h-1 bg-gradient-to-r from-[#0066FF] to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Policy Details */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Detalles de la Política</h2>
          <div className="grid grid-cols-2 gap-6">
            {policies.map((policy) => {
              const Icon = policy.icon;
              return (
                <div key={policy.title} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-start gap-4">
                  <Icon className="w-8 h-8 text-[#0066FF] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{policy.title}</h3>
                    <p className="text-gray-500">{policy.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conditions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            Condiciones para Devoluciones Válidas
          </h3>
          <ul className="space-y-3 text-[#4A4A4A]">
            <li className="flex gap-3">
              <span className="text-[#0066FF]">✓</span>
              <span>El producto está en su embalaje original o en condiciones de reventa</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#0066FF]">✓</span>
              <span>Todos los accesorios, documentos y manuales están incluidos</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#0066FF]">✓</span>
              <span>Sin signos de uso o daño causado por el comprador</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#0066FF]">✓</span>
              <span>La solicitud se realiza dentro de 30 días de recepción</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#0066FF]">✓</span>
              <span>Incluye comprobante de compra (número de pedido)</span>
            </li>
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes sobre Devoluciones</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-700/50 transition text-left"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0066FF] transition-transform flex-shrink-0 ${expandedFaq === idx ? 'rotate-180' : ''}`}
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

        {/* Support Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">¿Tienes más preguntas?</h3>
          <p className="text-[#4A4A4A] mb-6">Nuestro equipo de soporte está aquí para ayudarte con cualquier duda sobre devoluciones.</p>
          <Link href="/ayuda" className="inline-block border border-gray-400 hover:border-[#0066FF] px-8 py-3 rounded-lg font-semibold transition">
            Ir al Centro de Ayuda
          </Link>
        </div>
      </div>
    </div>
  );
}
