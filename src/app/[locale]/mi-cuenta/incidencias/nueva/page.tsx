'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const INCIDENT_TYPES = [
  { value: 'NON_DELIVERY', label: 'No he recibido el producto', icon: '📦' },
  { value: 'LATE_DELIVERY', label: 'Entrega muy retrasada', icon: '🕐' },
  { value: 'DAMAGED_ITEM', label: 'Producto dañado', icon: '💔' },
  { value: 'WRONG_ITEM', label: 'Me enviaron un producto diferente', icon: '🔄' },
  { value: 'DEFECTIVE_ITEM', label: 'Producto defectuoso', icon: '⚠️' },
  { value: 'REFUND_REQUEST', label: 'Quiero un reembolso', icon: '💰' },
  { value: 'SELLER_NO_RESPONSE', label: 'El vendedor no responde', icon: '🔇' },
  { value: 'OTHER', label: 'Otro motivo', icon: '📝' },
];

export default function NewIncidentPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: '',
    subject: '',
    description: '',
    storeId: '',
    subOrderId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.subject || !form.description) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'current-user-id', // From auth session
          storeId: form.storeId,
          subOrderId: form.subOrderId || undefined,
          type: form.type,
          subject: form.subject,
          description: form.description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear la incidencia');
      }

      const data = await res.json();
      router.push(`/${locale}/mi-cuenta/incidencias/${data.incident.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#000000]">Nueva Incidencia</h1>
        <p className="text-[#4A4A4A] text-sm mt-1">
          Describe tu problema y nos encargaremos de resolverlo
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s ? 'bg-[#0066FF] text-white' : 'bg-[#FAFAFA] text-[#4A4A4A] border border-gray-200'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-[#0066FF]' : 'bg-gray-300'}`} />}
          </div>
        ))}
        <span className="text-sm text-[#4A4A4A] ml-2">
          {step === 1 ? 'Tipo de problema' : step === 2 ? 'Detalles' : 'Confirmar'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Type selection */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-lg font-medium text-[#000000]">¿Cuál es el problema?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INCIDENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setForm({ ...form, type: type.value });
                    setStep(2);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left ${
                    form.type === type.value
                      ? 'border-[#0066FF] bg-blue-50'
                      : 'border-gray-200 bg-[#FFFFFF] hover:border-[#0066FF]'
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-sm text-[#000000]">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#000000]">Cuéntanos los detalles</h2>

            <div className="bg-[#FAFAFA] rounded-2xl p-4 border border-gray-200">
              <span className="text-xs text-[#4A4A4A]">Tipo de problema:</span>
              <p className="text-sm text-[#0066FF] mt-1">
                {INCIDENT_TYPES.find((t) => t.value === form.type)?.icon}{' '}
                {INCIDENT_TYPES.find((t) => t.value === form.type)?.label}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">
                Asunto <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Ej: No he recibido mi pedido #ORD-2026-001"
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-[#000000] placeholder:text-[#4A4A4A] focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">
                Descripción detallada <span className="text-red-600">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Explica con detalle lo que ha ocurrido. Incluye fechas, números de pedido, y cualquier información relevante..."
                rows={6}
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-2xl text-[#000000] placeholder:text-[#4A4A4A] focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none resize-none"
                required
              />
              <p className="text-xs text-[#4A4A4A] mt-1">Mínimo 20 caracteres</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-[#FAFAFA] hover:bg-gray-100 text-[#000000] rounded-2xl text-sm border border-gray-200"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={() => {
                  if (form.subject && form.description.length >= 20) setStep(3);
                  else setError('Completa el asunto y la descripción (mínimo 20 caracteres)');
                }}
                className="px-6 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-2xl text-sm font-medium"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#000000]">Confirmar incidencia</h2>

            <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-gray-200 space-y-3">
              <div>
                <span className="text-xs text-[#4A4A4A]">Tipo:</span>
                <p className="text-sm text-[#000000]">
                  {INCIDENT_TYPES.find((t) => t.value === form.type)?.icon}{' '}
                  {INCIDENT_TYPES.find((t) => t.value === form.type)?.label}
                </p>
              </div>
              <div>
                <span className="text-xs text-[#4A4A4A]">Asunto:</span>
                <p className="text-sm text-[#000000]">{form.subject}</p>
              </div>
              <div>
                <span className="text-xs text-[#4A4A4A]">Descripción:</span>
                <p className="text-sm text-[#4A4A4A] whitespace-pre-wrap">{form.description}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-[#0066FF] rounded-2xl p-4">
              <p className="text-sm text-[#0066FF]">
                <strong>¿Qué pasará ahora?</strong> El vendedor recibirá una notificación y tendrá
                48 horas para responderte. Si no responde, la incidencia se escalará automáticamente
                a nuestro equipo de soporte.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 bg-[#FAFAFA] hover:bg-gray-100 text-[#000000] rounded-2xl text-sm border border-gray-200"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-[#0066FF]/50 text-white rounded-2xl text-sm font-medium"
              >
                {submitting ? 'Enviando...' : 'Enviar Incidencia'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
