'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Truck, CheckCircle2, MapPin, CreditCard, AlertCircle, Download, HeadphonesIcon } from 'lucide-react';

// Demo orders data (mirrored from parent page)
const ORDERS = [
  {
    id: 'NXM-2026-03-7F8A2D4E',
    date: '12 de marzo, 2026',
    total: 1299.99,
    status: 'Entregado',
    items: [
      {
        name: 'MacBook Pro 14" M3',
        qty: 1,
        price: 1299.99,
        img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop',
      },
    ],
    timeline: [
      { step: 'Confirmado', date: '10 Mar', completed: true },
      { step: 'Preparando', date: '10 Mar', completed: true },
      { step: 'Enviado', date: '11 Mar', completed: true },
      { step: 'Entregado', date: '12 Mar', completed: true },
    ],
  },
  {
    id: 'NXM-2026-02-5A3B1C9F',
    date: '25 de febrero, 2026',
    total: 2450.50,
    status: 'Entregado',
    items: [
      {
        name: 'AirPods Pro (2da Gen)',
        qty: 2,
        price: 249.99,
        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
      },
      {
        name: 'Magic Keyboard',
        qty: 1,
        price: 1950.50,
        img: 'https://images.unsplash.com/photo-1587829191301-72e0f93d133d?w=80&h=80&fit=crop',
      },
    ],
    timeline: [
      { step: 'Confirmado', date: '23 Feb', completed: true },
      { step: 'Preparando', date: '24 Feb', completed: true },
      { step: 'Enviado', date: '25 Feb', completed: true },
      { step: 'Entregado', date: '25 Feb', completed: true },
    ],
  },
  {
    id: 'NXM-2026-03-2E7D9K3L',
    date: '18 de marzo, 2026',
    total: 899.99,
    status: 'En Tránsito',
    items: [
      {
        name: 'iPad Air (11")',
        qty: 1,
        price: 899.99,
        img: 'https://images.unsplash.com/photo-1533011483344-824f0eea0e11?w=80&h=80&fit=crop',
      },
    ],
    timeline: [
      { step: 'Confirmado', date: '16 Mar', completed: true },
      { step: 'Preparando', date: '17 Mar', completed: true },
      { step: 'Enviado', date: '18 Mar', completed: true },
      { step: 'Entregado', date: '21 Mar', completed: false },
    ],
  },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string;
  const id = params?.id as string;

  // Find the order
  const order = ORDERS.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-8">
        <button
          onClick={() => router.push(`/${locale}/mi-cuenta/pedidos`)}
          className="inline-flex items-center gap-2 text-0066FF hover:opacity-80 transition-opacity mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Volver a pedidos</span>
        </button>

        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-000000 mb-2">Pedido no encontrado</h1>
          <p className="text-sm sm:text-base text-4A4A4A mb-8 text-center max-w-sm">
            No pudimos encontrar el pedido que estás buscando. Verifica el número de pedido e intenta de nuevo.
          </p>
          <button
            onClick={() => router.push(`/${locale}/mi-cuenta/pedidos`)}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-0066FF text-white rounded-2xl font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity"
          >
            Volver a pedidos
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregado':
        return 'bg-green-100 text-green-700';
      case 'En Tránsito':
        return 'bg-blue-100 text-blue-700';
      case 'En Proceso':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Entregado':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'En Tránsito':
        return <Truck className="w-5 h-5" />;
      case 'En Proceso':
        return <Package className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0;
  const total = order.total;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/${locale}/mi-cuenta/pedidos`)}
        className="inline-flex items-center gap-2 text-0066FF hover:opacity-80 transition-opacity mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm sm:text-base">Volver a pedidos</span>
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Order Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-000000 mb-1">Pedido {order.id}</h1>
              <p className="text-sm sm:text-base text-4A4A4A">{order.date}</p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-sm sm:text-base w-fit ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8 bg-white rounded-3xl p-4 sm:p-6 shadow-feather">
          <h2 className="text-base sm:text-lg font-bold text-000000 mb-6">Estado del pedido</h2>

          {/* Desktop Timeline (Horizontal) */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between">
              {order.timeline.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-0066FF text-white font-bold mb-3">
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <p className="font-semibold text-000000 text-center text-sm mb-1">{item.step}</p>
                  <p className="text-xs text-4A4A4A text-center">{item.date}</p>
                  {idx < order.timeline.length - 1 && (
                    <div className="absolute w-full h-1 bg-0066FF top-6 left-[60%] -z-10"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline (Vertical) */}
          <div className="sm:hidden">
            {order.timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${item.completed ? 'bg-0066FF' : 'bg-gray-300'}`}>
                    {item.completed ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  {idx < order.timeline.length - 1 && (
                    <div className="w-1 h-12 bg-0066FF my-1"></div>
                  )}
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-000000 text-sm">{item.step}</p>
                  <p className="text-xs text-4A4A4A">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="mb-8 bg-white rounded-3xl p-4 sm:p-6 shadow-feather">
          <h2 className="text-base sm:text-lg font-bold text-000000 mb-4">Productos</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                <img src={item.img} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base text-000000 mb-1">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-4A4A4A mb-2">Cantidad: {item.qty}</p>
                  <p className="font-semibold text-0066FF text-sm sm:text-base">
                    ${(item.price * item.qty).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8 bg-white rounded-3xl p-4 sm:p-6 shadow-feather">
          <h2 className="text-base sm:text-lg font-bold text-000000 mb-4">Resumen del pedido</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-4A4A4A">Subtotal</span>
              <span className="font-semibold text-000000">
                ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-4A4A4A">Envío</span>
              <span className="font-semibold text-green-600">Gratis</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="font-semibold text-000000 text-base sm:text-lg">Total</span>
              <span className="font-bold text-0066FF text-base sm:text-lg">
                ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-8 bg-white rounded-3xl p-4 sm:p-6 shadow-feather">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-0066FF flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-000000">Dirección de envío</h2>
          </div>
          <div className="pl-8 space-y-2">
            <p className="font-semibold text-sm sm:text-base text-000000">Juan García Mendez</p>
            <p className="text-xs sm:text-sm text-4A4A4A">Calle Principal 456, Apartamento 12B</p>
            <p className="text-xs sm:text-sm text-4A4A4A">México, CDMX 06600</p>
            <p className="text-xs sm:text-sm text-4A4A4A">+52 555-1234-5678</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8 bg-white rounded-3xl p-4 sm:p-6 shadow-feather">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-0066FF flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-000000">Método de pago</h2>
          </div>
          <div className="pl-8">
            <p className="font-semibold text-sm sm:text-base text-000000">Visa</p>
            <p className="text-xs sm:text-sm text-4A4A4A">Terminada en 4242</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => alert('Se ha abierto el chat de soporte. Un agente te atenderá en breve.')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-0066FF text-0066FF rounded-2xl font-semibold text-sm sm:text-base hover:bg-blue-50 transition-colors"
          >
            <HeadphonesIcon className="w-5 h-5" />
            Contactar Soporte
          </button>
          <button
            onClick={() => alert('Tu factura ha sido descargada como NXM-2026-03-7F8A2D4E.pdf')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-0066FF text-white rounded-2xl font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity"
          >
            <Download className="w-5 h-5" />
            Descargar Factura
          </button>
        </div>
      </div>
    </div>
  );
}
