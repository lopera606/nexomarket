'use client';

import { useState } from 'react';
import { Save, Upload } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General
    platformName: 'NexoMarket',
    description: 'Marketplace global de comercio electrónico',
    logoUrl: '',
    // Commissions
    freeTierCommission: 6,
    proTierCommission: 4,
    enterpriseTierCommission: 3,
    // Payments
    stripeKey: '',
    stripeSecret: '',
    // Shipping
    shippoKey: '',
    // Emails
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpFrom: 'noreply@nexomarket.com',
    // SEO
    seoTitle: 'NexoMarket - Tu Marketplace de Confianza',
    seoDescription:
      'Compra y vende productos en NexoMarket, el marketplace global más confiable',
    seoKeywords: 'marketplace, ecommerce, tienda online',
  });

  const [activeSection, setActiveSection] = useState('general');
  const [saveStatus, setSaveStatus] = useState('');

  const handleInputChange = (key: string, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    setSaveStatus('Guardando...');
    setTimeout(() => {
      setSaveStatus('✓ Configuración guardada exitosamente');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'commissions', label: 'Comisiones', icon: '💰' },
    { id: 'payments', label: 'Pagos', icon: '💳' },
    { id: 'shipping', label: 'Envíos', icon: '📦' },
    { id: 'emails', label: 'Emails', icon: '📧' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Configuración de Plataforma
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona todos los ajustes de NexoMarket
        </p>
      </div>

      {/* Status Message */}
      {saveStatus && (
        <div className="p-4 bg-green-100/30 text-green-800 rounded-lg border border-green-200">
          {saveStatus}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden sticky top-8">
            <nav className="space-y-0">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full px-4 py-3 text-left transition-all border-l-4 ${
                    activeSection === section.id
                      ? 'bg-[#0066FF]/20 border-purple-600 text-[#0066FF] font-semibold'
                      : 'border-transparent text-gray-700 hover:bg-gray-50:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white p-8 space-y-6">
            {/* General Section */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nombre de la Plataforma
                  </label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) =>
                      handleInputChange('platformName', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={settings.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300:bg-gray-600 transition-all">
                      <Upload className="h-5 w-5" />
                      Subir Logo
                    </button>
                    <p className="text-sm text-gray-600">
                      PNG, JPG, máx 2MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Commissions Section */}
            {activeSection === 'commissions' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50/20 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Las comisiones se aplican a los ingresos de las tiendas.
                    Estos porcentajes definen cuánto retiene la plataforma.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Plan Free - Comisión
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.freeTierCommission}
                      onChange={(e) =>
                        handleInputChange('freeTierCommission', e.target.value)
                      }
                      className="w-20 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    />
                    <span className="text-gray-600">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Plan Pro - Comisión
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.proTierCommission}
                      onChange={(e) =>
                        handleInputChange('proTierCommission', e.target.value)
                      }
                      className="w-20 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    />
                    <span className="text-gray-600">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Plan Enterprise - Comisión
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.enterpriseTierCommission}
                      onChange={(e) =>
                        handleInputChange('enterpriseTierCommission', e.target.value)
                      }
                      className="w-20 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    />
                    <span className="text-gray-600">%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Section */}
            {activeSection === 'payments' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50/20 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Configura tus credenciales de Stripe para procesar pagos
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Stripe API Key
                  </label>
                  <input
                    type="password"
                    placeholder="pk_live_..."
                    value={settings.stripeKey}
                    onChange={(e) =>
                      handleInputChange('stripeKey', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Stripe Secret Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk_live_..."
                    value={settings.stripeSecret}
                    onChange={(e) =>
                      handleInputChange('stripeSecret', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>
            )}

            {/* Shipping Section */}
            {activeSection === 'shipping' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50/20 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Integra Shippo para gestionar envíos y rastreo
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Shippo API Key
                  </label>
                  <input
                    type="password"
                    placeholder="shippo_..."
                    value={settings.shippoKey}
                    onChange={(e) =>
                      handleInputChange('shippoKey', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>
            )}

            {/* Emails Section */}
            {activeSection === 'emails' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50/20 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Configura tus credenciales SMTP para enviar emails
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) =>
                      handleInputChange('smtpHost', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) =>
                      handleInputChange('smtpPort', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Usuario
                  </label>
                  <input
                    type="email"
                    value={settings.smtpUser}
                    onChange={(e) =>
                      handleInputChange('smtpUser', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Contraseña SMTP
                  </label>
                  <input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) =>
                      handleInputChange('smtpPassword', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Origen
                  </label>
                  <input
                    type="email"
                    value={settings.smtpFrom}
                    onChange={(e) =>
                      handleInputChange('smtpFrom', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>
            )}

            {/* SEO Section */}
            {activeSection === 'seo' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50/20 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Configura los metadatos SEO para mejorar el posicionamiento
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Título SEO
                  </label>
                  <input
                    type="text"
                    value={settings.seoTitle}
                    onChange={(e) =>
                      handleInputChange('seoTitle', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máx 60 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Descripción SEO
                  </label>
                  <textarea
                    value={settings.seoDescription}
                    onChange={(e) =>
                      handleInputChange('seoDescription', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] h-20"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Máx 160 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Palabras Clave
                  </label>
                  <input
                    type="text"
                    value={settings.seoKeywords}
                    onChange={(e) =>
                      handleInputChange('seoKeywords', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    placeholder="palabra1, palabra2, palabra3"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-[#0066FF] text-white font-semibold rounded-lg hover:bg-[#0052CC] transition-all"
              >
                <Save className="h-5 w-5" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
