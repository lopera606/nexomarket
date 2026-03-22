'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, BookOpen, CreditCard, Truck, Package, ShoppingCart,
  Store, ChevronDown, ChevronRight, Copy, Check, Shield,
  Zap, Globe, Key, FileSpreadsheet, Code2, ExternalLink,
} from 'lucide-react';

interface EndpointInfo {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  status: 'operativo' | 'requiere-bd' | 'próximamente';
  auth?: boolean;
  body?: string;
  response?: string;
  params?: string;
  notes?: string;
}

const SECTIONS: { id: string; title: string; icon: any; color: string; endpoints: EndpointInfo[] }[] = [
  {
    id: 'checkout',
    title: 'Pagos — Stripe',
    icon: CreditCard,
    color: 'bg-[#0066FF]',
    endpoints: [
      {
        method: 'POST',
        path: '/api/checkout',
        title: 'Crear sesión de pago',
        description: 'Crea una sesión de Stripe Checkout y devuelve la URL para redirigir al comprador.',
        status: 'operativo',
        body: `{
  "items": [
    {
      "name": "iPhone 15 Pro",
      "price": 1199.99,
      "quantity": 1
    }
  ],
  "locale": "es"
}`,
        response: `{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_a1gvMAz..."
}`,
        notes: 'Los precios están en EUR. El locale puede ser "es" o "en".',
      },
      {
        method: 'GET',
        path: '/api/checkout/verify',
        title: 'Verificar pago',
        description: 'Verifica el estado de una sesión de pago tras la redirección de Stripe.',
        status: 'operativo',
        params: 'session_id=cs_test_...',
        response: `{
  "success": true,
  "sessionId": "cs_test_...",
  "paymentStatus": "paid",
  "customerEmail": "cliente@email.com",
  "amountTotal": 1199.99,
  "currency": "EUR"
}`,
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Envíos — Shippo',
    icon: Truck,
    color: 'bg-orange-500',
    endpoints: [
      {
        method: 'POST',
        path: '/api/shipping/rates',
        title: 'Calcular tarifas de envío',
        description: 'Devuelve tarifas reales de Correos basadas en origen, destino y dimensiones del paquete.',
        status: 'operativo',
        body: `{
  "addressFrom": {
    "name": "Almacén NexoMarket",
    "street1": "Calle de Alcalá 50",
    "city": "Madrid",
    "state": "Madrid",
    "zip": "28014",
    "country": "ES"
  },
  "addressTo": {
    "name": "Cliente",
    "street1": "Gran Vía 28",
    "city": "Madrid",
    "state": "Madrid",
    "zip": "28013",
    "country": "ES"
  },
  "parcel": {
    "length": "30",
    "width": "20",
    "height": "15",
    "weight": "1.5",
    "distance_unit": "cm",
    "mass_unit": "kg"
  }
}`,
        response: `{
  "rates": [
    {
      "object_id": "rate_abc123",
      "provider": "Correos",
      "servicelevel": "Paquete Estándar",
      "amount": "4.99",
      "currency": "EUR",
      "estimated_days": 3
    },
    {
      "object_id": "rate_def456",
      "provider": "Correos",
      "servicelevel": "Paquete Premium",
      "amount": "5.86",
      "currency": "EUR",
      "estimated_days": 1
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/api/shipping/label',
        title: 'Generar etiqueta de envío',
        description: 'Genera una etiqueta PDF de envío a partir de un rate_id obtenido del endpoint de tarifas.',
        status: 'operativo',
        body: `{
  "rateId": "rate_abc123"
}`,
        response: `{
  "labelUrl": "https://shippo-delivery.s3.amazonaws.com/label.pdf",
  "trackingNumber": "TEST3852019630",
  "trackingUrl": "https://correos.es/tracking/...",
  "carrier": "correos",
  "testMode": true
}`,
        notes: 'En modo test (shippo_test_*), genera etiquetas simuladas con tracking de prueba.',
      },
      {
        method: 'GET',
        path: '/api/shipping/track',
        title: 'Rastrear envío',
        description: 'Consulta el estado de seguimiento de un envío por carrier y número de tracking.',
        status: 'operativo',
        params: 'carrier=correos&tracking=TRACKING_NUMBER',
        response: `{
  "tracking_status": {
    "status": "DELIVERED",
    "status_details": "Entregado",
    "status_date": "2026-03-18T10:30:00Z",
    "location": { "city": "Madrid", "country": "ES" }
  },
  "tracking_history": [...]
}`,
      },
    ],
  },
  {
    id: 'products',
    title: 'Productos',
    icon: Package,
    color: 'bg-emerald-500',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/products',
        title: 'Listar productos',
        description: 'Devuelve los productos de tu tienda con paginación y filtros.',
        status: 'requiere-bd',
        auth: true,
        params: 'page=1&limit=20&status=ACTIVE&category=electronics&search=iphone',
        response: `{
  "success": true,
  "data": [{
    "id": "uuid",
    "name": "iPhone 15 Pro",
    "basePrice": "1199.99",
    "status": "ACTIVE",
    "variantCount": 3,
    "imageCount": 5
  }],
  "pagination": { "page": 1, "limit": 20, "total": 67 }
}`,
      },
      {
        method: 'POST',
        path: '/api/v1/products',
        title: 'Crear producto',
        description: 'Crea un nuevo producto en tu tienda con variantes opcionales.',
        status: 'requiere-bd',
        auth: true,
        body: `{
  "name": "Camiseta Algodón Premium",
  "description": "100% algodón orgánico...",
  "basePrice": 29.99,
  "compareAtPrice": 39.99,
  "categoryId": "uuid-categoria",
  "sku": "CAM-ALG-001",
  "variants": [
    {
      "name": "M / Negro",
      "sku": "CAM-ALG-M-BLK",
      "price": 29.99,
      "stockQuantity": 50,
      "options": { "size": "M", "color": "Negro" }
    }
  ]
}`,
        response: `{
  "success": true,
  "data": {
    "id": "uuid-producto",
    "name": "Camiseta Algodón Premium",
    "slug": "camiseta-algodon-premium-1710...",
    "status": "DRAFT",
    "variantCount": 1
  }
}`,
      },
      {
        method: 'POST',
        path: '/api/v1/products/bulk-upload',
        title: 'Subida masiva (Excel)',
        description: 'Procesa un archivo Excel con múltiples productos y variantes. Envía las filas parseadas como JSON.',
        status: 'operativo',
        body: `{
  "rows": [
    {
      "nombre": "iPhone 15 Pro",
      "descripcion": "Smartphone Apple...",
      "categoria": "Electrónica",
      "precio": 1199.99,
      "stock": 50,
      "tags": "apple,smartphone"
    }
  ]
}`,
        response: `{
  "success": true,
  "message": "Se procesaron 10 productos correctamente",
  "summary": {
    "totalRows": 26,
    "productsFound": 10,
    "totalVariants": 16,
    "validationErrors": 0
  },
  "products": [...]
}`,
        notes: 'Máximo 500 filas. Descarga la plantilla desde /plantilla-productos.xlsx',
      },
      {
        method: 'GET',
        path: '/api/v1/products/bulk-upload',
        title: 'Info plantilla Excel',
        description: 'Devuelve la definición de columnas y formato esperado de la plantilla Excel.',
        status: 'operativo',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Pedidos',
    icon: ShoppingCart,
    color: 'bg-[#0066FF]',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/orders',
        title: 'Listar pedidos',
        description: 'Devuelve los pedidos recibidos en tu tienda con filtros por estado y fecha.',
        status: 'requiere-bd',
        auth: true,
        params: 'page=1&limit=20&status=PENDING',
      },
    ],
  },
  {
    id: 'store',
    title: 'Tienda',
    icon: Store,
    color: 'bg-rose-500',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/store/stats',
        title: 'Estadísticas de tienda',
        description: 'Métricas del mes: ingresos, pedidos, productos activos y valoración.',
        status: 'requiere-bd',
        auth: true,
      },
      {
        method: 'GET',
        path: '/api/v1/store/profile',
        title: 'Perfil de tienda',
        description: 'Datos del perfil de tu tienda: nombre, logo, descripción, plan activo.',
        status: 'requiere-bd',
        auth: true,
      },
      {
        method: 'GET',
        path: '/api/v1/store/payouts',
        title: 'Historial de cobros',
        description: 'Pagos recibidos y pendientes de Stripe Connect.',
        status: 'requiere-bd',
        auth: true,
      },
    ],
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  POST: 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20',
  PUT: 'bg-amber-50 text-amber-700 border-amber-200',
  DELETE: 'bg-red-50 text-red-600 border-red-200',
  PATCH: 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20',
};

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  'operativo': { label: '● Operativo', class: 'text-emerald-600' },
  'requiere-bd': { label: '○ Requiere BD', class: 'text-[#0066FF]' },
  'próximamente': { label: '◌ Próximamente', class: 'text-gray-400' },
};

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-500 uppercase">{label}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#0066FF] transition-colors">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 text-sm text-gray-700 overflow-x-auto font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function EndpointCard({ ep }: { ep: EndpointInfo }) {
  const [expanded, setExpanded] = useState(false);
  const badge = STATUS_BADGE[ep.status];

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-200"
      style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
        <code className="text-gray-700 text-sm font-mono flex-1 truncate">{ep.path}</code>
        <span className={`text-xs font-medium ${badge.class} hidden sm:block`}>{badge.label}</span>
        {ep.auth && <span title="Requiere autenticación"><Shield className="w-4 h-4 text-[#0066FF]" /></span>}
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          <div>
            <h4 className="text-black font-semibold text-sm">{ep.title}</h4>
            <p className="text-gray-500 text-sm mt-1">{ep.description}</p>
          </div>

          {ep.params && (
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Query params</span>
              <code className="block mt-1 bg-[#FAFAFA] border border-gray-200 rounded-lg p-2 text-xs text-[#0066FF] font-mono">?{ep.params}</code>
            </div>
          )}

          {ep.body && <CodeBlock code={ep.body} label="Request body" />}
          {ep.response && <CodeBlock code={ep.response} label="Response" />}

          {ep.notes && (
            <div className="flex items-start gap-2 bg-[#0066FF]/5 border border-[#0066FF]/15 rounded-lg p-3">
              <Zap className="w-4 h-4 text-[#0066FF] mt-0.5 flex-shrink-0" />
              <p className="text-gray-600 text-xs">{ep.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'es';
  const [activeSection, setActiveSection] = useState('checkout');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.push(`/${locale}/vendedor/dashboard`)}
            className="p-2 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-black transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-black flex flex-col sm:flex-row sm:items-center gap-2">
              <BookOpen className="w-6 h-6" style={{ color: '#0066FF' }} /> Documentación API
            </h1>
            <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>Referencia completa de endpoints para integrar tu tienda con NexoMarket</p>
          </div>
        </div>

        {/* Auth Info */}
        <div
          className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 sm:mb-8"
          style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0066FF] flex items-center justify-center flex-shrink-0">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-black font-bold text-lg mb-2">Autenticación</h2>
              <p className="text-sm mb-3" style={{ color: '#4A4A4A' }}>
                Los endpoints marcados con <Shield className="w-3.5 h-3.5 text-[#0066FF] inline" /> requieren una API Key de tienda. Inclúyela en el header de cada petición:
              </p>
              <code className="block bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs sm:text-sm text-green-400 font-mono overflow-x-auto">
                Authorization: Bearer tu_api_key_aqui
              </code>
              <p className="text-xs mt-3" style={{ color: '#4A4A4A' }}>
                Base URL: <code className="text-[#0066FF] font-medium">https://tu-dominio.com</code> · Formato: JSON · Moneda: EUR (€)
              </p>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-6">
          <a
            href="/plantilla-productos.xlsx"
            download
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" /> Descargar plantilla Excel
          </a>
          <button
            onClick={() => router.push(`/${locale}/vendedor/subida-masiva`)}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-[#0066FF] rounded-xl text-white text-sm font-medium hover:bg-[#0052CC] transition-colors"
          >
            <Package className="w-4 h-4" /> Subida masiva
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <nav className="lg:w-56 flex-shrink-0 overflow-x-auto">
            <div className="lg:sticky lg:top-24 space-y-1 flex lg:flex-col gap-1 lg:gap-0 pb-2 lg:pb-0">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-1 lg:w-full whitespace-nowrap lg:whitespace-normal flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs lg:text-sm font-medium transition-all flex-shrink-0 lg:flex-shrink ${
                      activeSection === section.id
                        ? 'bg-[#0066FF]/8 text-[#0066FF]'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{section.title}</span>
                    <span className="text-xs text-gray-400 hidden lg:inline ml-auto">{section.endpoints.length}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 space-y-4">
            {SECTIONS.filter(s => s.id === activeSection).map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${section.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-black font-bold text-lg">{section.title}</h2>
                      <p className="text-gray-500 text-xs">{section.endpoints.length} endpoint{section.endpoints.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {section.endpoints.map((ep, i) => (
                      <EndpointCard key={i} ep={ep} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Status legend */}
            <div
              className="bg-white border border-gray-200 rounded-2xl p-4 mt-8"
              style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}
            >
              <h4 className="text-black font-semibold text-sm mb-3">Estados de los endpoints</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-emerald-600 text-sm font-medium">● Operativo</span>
                  <span className="text-gray-500 text-xs">Funcional, listo para usar</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-[#0066FF] text-sm font-medium">○ Requiere BD</span>
                  <span className="text-gray-500 text-xs">Necesita PostgreSQL + Prisma</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-400 text-sm font-medium">◌ Próximamente</span>
                  <span className="text-gray-500 text-xs">En desarrollo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
