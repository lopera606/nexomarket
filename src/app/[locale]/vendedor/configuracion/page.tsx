'use client';

import { useState } from 'react';
import { Mail, Phone, CreditCard, FileText, Shield, AlertCircle, Save, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ConfiguracionPage() {
  const [saveStatus, setSaveStatus] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    emailOrders: true,
    emailReviews: true,
    emailPayments: true,
    pushNotifications: true,
    emailMarketing: false,
  });

  const handleToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>
          Configuración
        </h1>
        <p className="text-base sm:text-lg" style={{ color: '#4A4A4A' }}>Gestiona tu perfil y preferencias de vendedor</p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Profile */}
          <Card className="p-6 sm:p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <h2 className="text-lg font-bold mb-6" style={{ color: '#000000' }}>Perfil de Negocio</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>Nombre de Negocio</label>
                <input
                  type="text"
                  defaultValue="Mi Tienda Premium"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0066FF' } as any}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">CIF/NIF</label>
                  <input
                    type="text"
                    defaultValue="A12345678"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Tipo de Entidad</label>
                  <select className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Autónomo</option>
                    <option>Pequeña Empresa</option>
                    <option>Empresa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Correo Electrónico</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      defaultValue="contacto@mitienda.com"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Teléfono</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      defaultValue="+34 123 456 789"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Current Plan */}
          <Card className="p-6 sm:p-8 border-0 shadow-sm">
            <h2 className="text-lg font-bold text-black mb-6">Plan Actual</h2>

            <div className="bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 rounded-xl p-6 border border-blue-600/50 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-lg text-black">Plan Profesional</p>
                  <p className="text-sm text-gray-600 mt-1">Tu plan actual incluye:</p>
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-black px-4 py-1 rounded-full text-sm font-bold">Activo</span>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="text-sm text-gray-600">✓ Hasta 1,000 productos</li>
                <li className="text-sm text-gray-600">✓ Comisión del 5% por venta</li>
                <li className="text-sm text-gray-600">✓ Soporte prioritario</li>
                <li className="text-sm text-gray-600">✓ Analíticas avanzadas</li>
                <li className="text-sm text-gray-600">✓ Acceso a cupones y promociones</li>
              </ul>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-black">9.99€/mes</p>
                  <p className="text-xs text-gray-500">Renovación: 15 de abril de 2026</p>
                </div>
                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-black border-0">
                  Cambiar Plan
                </Button>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-50 border border-orange-200 rounded-xl p-6 border border-orange-600/50">
              <h3 className="font-bold text-black mb-2">¿Necesitas más capacidad?</h3>
              <p className="text-sm text-gray-600 mb-4">Actualiza a Plan Premium para acceder a más productos, mejores comisiones y funciones exclusivas.</p>
              <Button className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black border-0">
                Ver Planes Premium
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 sm:p-8 border-0 shadow-sm">
            <h2 className="text-lg font-bold text-black mb-6">Notificaciones</h2>

            <div className="space-y-4">
              {[
                { key: 'emailOrders', label: 'Notificaciones de Pedidos', desc: 'Recibe alertas cuando recibas nuevos pedidos' },
                { key: 'emailReviews', label: 'Notificaciones de Reseñas', desc: 'Recibe alertas cuando los clientes dejen reseñas' },
                { key: 'emailPayments', label: 'Notificaciones de Pagos', desc: 'Recibe alertas sobre transferencias y pagos' },
                { key: 'pushNotifications', label: 'Notificaciones Push', desc: 'Recibe notificaciones en tiempo real en tu dispositivo' },
                { key: 'emailMarketing', label: 'Emails de Marketing', desc: 'Recibe tips y promociones especiales' },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-black">{label}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onChange={() => handleToggle(key as keyof typeof notificationSettings)}
                    className="w-6 h-6 rounded-lg border-gray-600 text-blue-400 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </Card>

          {/* Payment Methods */}
          <Card className="p-6 sm:p-8 border-0 shadow-sm">
            <h2 className="text-lg font-bold text-black mb-6">Métodos de Pago</h2>

            <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/50 rounded-xl p-6 border border-gray-700/50 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-black">Stripe Connect</p>
                    <p className="text-sm text-gray-600 mt-1">Conectado desde 15 de enero de 2026</p>
                    <p className="text-xs text-gray-500 mt-2 font-mono">acct_1OoKJ2HQz7vF8j3a</p>
                  </div>
                </div>
                <div className="bg-green-500/20 rounded-full px-3 py-1 border border-green-600/50">
                  <span className="text-xs font-semibold text-green-400">Conectado</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="gap-2 border-gray-700/50 hover:bg-gray-700/50 w-full">
              + Añadir Nuevo Método
            </Button>
          </Card>

          {/* Return Policy */}
          <Card className="p-6 sm:p-8 border-0 shadow-sm">
            <h2 className="text-lg font-bold text-black mb-6">Política de Devoluciones</h2>

            <textarea
              defaultValue="Los clientes pueden devolver productos dentro de 30 días desde la fecha de entrega. Los productos deben estar en perfecto estado, sin usar y con su empaque original. Los gastos de envío corren a cargo del cliente para devoluciones que no sean por defecto del producto."
              rows={5}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
            />

            <div className="flex gap-3 items-center p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-700">Esta política se mostrará en tu tienda y en todas tus ventas</p>
            </div>

            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-black border-0">
              Actualizar Política
            </Button>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`w-full gap-2 text-black border-0 ${
              saveStatus === 'saved'
                ? 'bg-gradient-to-r from-green-600 to-green-700'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            {saveStatus === 'saving' && '⏳ Guardando...'}
            {saveStatus === 'saved' && '✓ Guardado correctamente'}
            {!saveStatus && (
              <>
                <Save className="h-5 w-5" />
                Guardar Todos los Cambios
              </>
            )}
          </Button>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Security Card */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-black">Seguridad</h3>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full border-gray-700/50 hover:bg-gray-700/50 justify-start">
                Cambiar Contraseña
              </Button>
              <Button variant="outline" className="w-full border-gray-700/50 hover:bg-gray-700/50 justify-start">
                Autenticación 2FA
              </Button>
              <Button variant="outline" className="w-full border-gray-700/50 hover:bg-gray-700/50 justify-start">
                Sesiones Activas
              </Button>
            </div>
          </Card>

          {/* Account Card */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-50 border border-red-200 border-0 shadow-sm">
            <h3 className="font-bold text-black mb-4">Peligro</h3>
            <p className="text-sm text-gray-600 mb-4">
              Eliminar tu cuenta es permanente y no se puede deshacer.
            </p>
            <Button className="w-full gap-2 bg-red-600 hover:bg-red-700 text-black border-0">
              Eliminar Cuenta
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
