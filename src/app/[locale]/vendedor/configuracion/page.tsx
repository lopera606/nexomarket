'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, CreditCard, FileText, Shield, AlertCircle, Save, ExternalLink, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description: string;
  email: string;
  phone: string;
  status: string;
  planTier: string;
  commissionRate: number;
  stripeOnboarded: boolean;
  returnPolicy: any;
  announcement: string;
  announcementActive: boolean;
}

export default function ConfiguracionPage() {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    emailOrders: true,
    emailReviews: true,
    emailPayments: true,
    pushNotifications: true,
    emailMarketing: false,
  });

  useEffect(() => {
    async function loadStore() {
      try {
        const res = await fetch('/api/v2/vendedor/configuracion');
        if (res.ok) {
          const data = await res.json();
          setStore({
            id: data.id,
            name: data.name || '',
            slug: data.slug || '',
            description: data.description || '',
            email: data.email || '',
            phone: data.phone || '',
            status: data.status,
            planTier: data.planTier,
            commissionRate: Number(data.commissionRate),
            stripeOnboarded: data.stripeOnboarded,
            returnPolicy: data.returnPolicy,
            announcement: data.announcement || '',
            announcementActive: data.announcementActive,
          });
        }
      } catch (error) {
        console.error('Error loading store config:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, []);

  const handleToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSave = async () => {
    if (!store) return;
    setSaveStatus('saving');
    setMessage(null);
    try {
      const res = await fetch('/api/v2/vendedor/configuracion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: store.name,
          slug: store.slug,
          description: store.description,
          email: store.email,
          phone: store.phone,
          announcement: store.announcement,
          announcementActive: store.announcementActive,
        }),
      });

      if (res.ok) {
        setSaveStatus('saved');
        setMessage({ type: 'success', text: 'Configuracion guardada correctamente' });
      } else {
        const data = await res.json();
        setSaveStatus('');
        setMessage({ type: 'error', text: data.error || 'Error al guardar' });
      }
    } catch {
      setSaveStatus('');
      setMessage({ type: 'error', text: 'Error de conexion' });
    }
    setTimeout(() => { setSaveStatus(''); setMessage(null); }, 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-[#4A4A4A]">No se encontro la tienda. Verifica tu cuenta de vendedor.</p>
      </div>
    );
  }

  const planLabels: Record<string, string> = { FREE: 'Gratuito', PRO: 'Profesional', ENTERPRISE: 'Enterprise' };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>
          Configuracion
        </h1>
        <p className="text-base sm:text-lg" style={{ color: '#4A4A4A' }}>Gestiona tu perfil y preferencias de vendedor</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

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
                  value={store.name}
                  onChange={(e) => setStore(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>URL de la tienda (slug)</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">nexomarket.com/tienda/</span>
                  <input
                    type="text"
                    value={store.slug}
                    onChange={(e) => setStore(prev => prev ? { ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') } : prev)}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>Descripcion</label>
                <textarea
                  value={store.description}
                  onChange={(e) => setStore(prev => prev ? { ...prev, description: e.target.value } : prev)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-none"
                  placeholder="Describe tu tienda..."
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Correo Electronico</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={store.email}
                      onChange={(e) => setStore(prev => prev ? { ...prev, email: e.target.value } : prev)}
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Telefono</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={store.phone}
                      onChange={(e) => setStore(prev => prev ? { ...prev, phone: e.target.value } : prev)}
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Current Plan */}
          <Card className="p-6 sm:p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <h2 className="text-lg font-bold text-black mb-6">Plan Actual</h2>

            <div className="bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-lg text-black">Plan {planLabels[store.planTier] || store.planTier}</p>
                  <p className="text-sm text-gray-600 mt-1">Comision: {store.commissionRate}% por venta</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                  store.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {store.status === 'ACTIVE' ? 'Activo' : store.status === 'PENDING' ? 'Pendiente' : store.status}
                </span>
              </div>
            </div>

            {store.planTier === 'FREE' && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="font-bold text-black mb-2">Necesitas mas capacidad?</h3>
                <p className="text-sm text-gray-600 mb-4">Actualiza a Plan Premium para acceder a mas productos, mejores comisiones y funciones exclusivas.</p>
                <Button className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0">
                  Ver Planes Premium
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>

          {/* Notifications */}
          <Card className="p-6 sm:p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <h2 className="text-lg font-bold text-black mb-6">Notificaciones</h2>

            <div className="space-y-4">
              {[
                { key: 'emailOrders', label: 'Notificaciones de Pedidos', desc: 'Recibe alertas cuando recibas nuevos pedidos' },
                { key: 'emailReviews', label: 'Notificaciones de Resenas', desc: 'Recibe alertas cuando los clientes dejen resenas' },
                { key: 'emailPayments', label: 'Notificaciones de Pagos', desc: 'Recibe alertas sobre transferencias y pagos' },
                { key: 'pushNotifications', label: 'Notificaciones Push', desc: 'Recibe notificaciones en tiempo real en tu dispositivo' },
                { key: 'emailMarketing', label: 'Emails de Marketing', desc: 'Recibe tips y promociones especiales' },
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                  <div>
                    <p className="font-semibold text-black">{label}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onChange={() => handleToggle(key as keyof typeof notificationSettings)}
                    className="w-6 h-6 rounded-lg border-gray-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </Card>

          {/* Payment Methods */}
          <Card className="p-6 sm:p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <h2 className="text-lg font-bold text-black mb-6">Metodos de Pago</h2>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <CreditCard className="h-6 w-6 text-[#0066FF]" />
                  </div>
                  <div>
                    <p className="font-semibold text-black">Stripe Connect</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {store.stripeOnboarded ? 'Conectado y verificado' : 'Pendiente de configuracion'}
                    </p>
                  </div>
                </div>
                <div className={`rounded-full px-3 py-1 border ${
                  store.stripeOnboarded ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                }`}>
                  <span className={`text-xs font-semibold ${store.stripeOnboarded ? 'text-green-700' : 'text-amber-700'}`}>
                    {store.stripeOnboarded ? 'Conectado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`w-full gap-2 text-white border-0 ${
              saveStatus === 'saved'
                ? 'bg-gradient-to-r from-green-600 to-green-700'
                : 'bg-gradient-to-r from-[#0066FF] to-blue-700 hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            {saveStatus === 'saving' && 'Guardando...'}
            {saveStatus === 'saved' && 'Guardado correctamente'}
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
          <Card className="p-6 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <div className="flex items-start gap-3 mb-4">
              <Shield className="h-5 w-5 text-[#0066FF]" />
              <h3 className="font-bold text-black">Seguridad</h3>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 justify-start">
                Cambiar Contrasena
              </Button>
              <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 justify-start">
                Autenticacion 2FA
              </Button>
              <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 justify-start">
                Sesiones Activas
              </Button>
            </div>
          </Card>

          {/* Account Card */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-50 border border-red-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <h3 className="font-bold text-black mb-4">Peligro</h3>
            <p className="text-sm text-gray-600 mb-4">
              Eliminar tu cuenta es permanente y no se puede deshacer.
            </p>
            <Button className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white border-0">
              Eliminar Cuenta
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
