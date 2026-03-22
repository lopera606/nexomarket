'use client'

import { useState } from 'react'
import { Save, AlertCircle } from 'lucide-react'

interface Settings {
  general: {
    platformName: string
    defaultCommission: number
    supportEmail: string
  }
  pagos: {
    payoutFrequency: 'daily' | 'weekly' | 'monthly'
    minimumPayout: number
    bankTransfer: boolean
  }
  comisiones: {
    minimumRate: number
    maximumRate: number
    volumeThreshold: number
  }
  notificaciones: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    dailyDigest: boolean
  }
}

const INITIAL_SETTINGS: Settings = {
  general: {
    platformName: 'NexoMarket',
    defaultCommission: 8,
    supportEmail: 'support@nexomarket.com',
  },
  pagos: {
    payoutFrequency: 'weekly',
    minimumPayout: 50,
    bankTransfer: true,
  },
  comisiones: {
    minimumRate: 2,
    maximumRate: 25,
    volumeThreshold: 1000,
  },
  notificaciones: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    dailyDigest: false,
  },
}

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS)
  const [savedSection, setSavedSection] = useState<string | null>(null)
  const [unsavedChanges, setUnsavedChanges] = useState<string[]>([])

  const handleChange = (section: keyof Settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
    if (!unsavedChanges.includes(section)) {
      setUnsavedChanges([...unsavedChanges, section])
    }
  }

  const handleSave = (section: keyof Settings) => {
    setSavedSection(section)
    setUnsavedChanges(unsavedChanges.filter(s => s !== section))
    setTimeout(() => setSavedSection(null), 2000)
  }

  const isSectionChanged = (section: string) => unsavedChanges.includes(section)

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">
          Configuración de la Plataforma
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A]">
          Administra los parámetros generales y comportamiento de NexoMarket
        </p>
      </div>

      {/* General Settings */}
      <div className="rounded-3xl bg-[#FFFFFF] p-6 sm:p-8 border border-gray-100 space-y-6" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#000000]">General</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">Configuración básica de la plataforma</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#000000] mb-2">
              Nombre de la Plataforma
            </label>
            <input
              type="text"
              value={settings.general.platformName}
              onChange={(e) => handleChange('general', 'platformName', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#000000] mb-2">
              Comisión por Defecto (%)
            </label>
            <input
              type="number"
              value={settings.general.defaultCommission}
              onChange={(e) => handleChange('general', 'defaultCommission', parseFloat(e.target.value))}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 sm:px-4 py-2 text-sm rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#000000] mb-2">
              Email de Soporte
            </label>
            <input
              type="email"
              value={settings.general.supportEmail}
              onChange={(e) => handleChange('general', 'supportEmail', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
          {savedSection === 'general' && (
            <span className="text-sm text-green-600 font-medium">✓ Guardado correctamente</span>
          )}
          <button
            onClick={() => handleSave('general')}
            disabled={!isSectionChanged('general')}
            className="sm:ml-auto inline-flex items-center gap-2 px-4 sm:px-6 py-2 text-sm rounded-2xl bg-[#0066FF] text-white font-medium hover:bg-[#0052CC] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="rounded-3xl bg-[#FFFFFF] p-6 sm:p-8 border border-gray-100 space-y-6" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#000000]">Pagos</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">Configuración de pagos y transferencias</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#000000] mb-2">
              Frecuencia de Payout
            </label>
            <select
              value={settings.pagos.payoutFrequency}
              onChange={(e) => handleChange('pagos', 'payoutFrequency', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="daily">Diariamente</option>
              <option value="weekly">Semanalmente</option>
              <option value="monthly">Mensualmente</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[#000000] mb-2">
              Monto Mínimo de Payout (€)
            </label>
            <input
              type="number"
              value={settings.pagos.minimumPayout}
              onChange={(e) => handleChange('pagos', 'minimumPayout', parseFloat(e.target.value))}
              min="0"
              step="0.01"
              className="w-full px-3 sm:px-4 py-2 text-sm rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
            <p className="mt-2 text-[10px] sm:text-xs text-[#4A4A4A]">
              Las comisiones menores a este monto se acumularán en la próxima transferencia
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="bankTransfer"
              checked={settings.pagos.bankTransfer}
              onChange={(e) => handleChange('pagos', 'bankTransfer', e.target.checked)}
              className="w-4 h-4 rounded border-gray-200 text-[#0066FF] focus:ring-[#0066FF]"
            />
            <label htmlFor="bankTransfer" className="text-xs sm:text-sm font-medium text-[#000000]">
              Habilitar Transferencia Bancaria
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
          {savedSection === 'pagos' && (
            <span className="text-xs sm:text-sm text-green-600 font-medium">✓ Guardado correctamente</span>
          )}
          <button
            onClick={() => handleSave('pagos')}
            disabled={!isSectionChanged('pagos')}
            className="sm:ml-auto inline-flex items-center gap-2 px-4 sm:px-6 py-2 text-sm rounded-2xl bg-[#0066FF] text-white font-medium hover:bg-[#0052CC] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Commission Settings */}
      <div className="rounded-3xl bg-[#FFFFFF] p-6 sm:p-8 border border-gray-100 space-y-6" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#000000]">Comisiones</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">Límites y umbrales de comisión</p>
        </div>

        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Los cambios en estos valores afectarán a los nuevos niveles de comisión creados
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#000000] mb-2">
              Tasa Mínima (%)
            </label>
            <input
              type="number"
              value={settings.comisiones.minimumRate}
              onChange={(e) => handleChange('comisiones', 'minimumRate', parseFloat(e.target.value))}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-2 rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#000000] mb-2">
              Tasa Máxima (%)
            </label>
            <input
              type="number"
              value={settings.comisiones.maximumRate}
              onChange={(e) => handleChange('comisiones', 'maximumRate', parseFloat(e.target.value))}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-2 rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#000000] mb-2">
              Umbral de Volumen para Descuento (€)
            </label>
            <input
              type="number"
              value={settings.comisiones.volumeThreshold}
              onChange={(e) => handleChange('comisiones', 'volumeThreshold', parseFloat(e.target.value))}
              min="0"
              step="1"
              className="w-full px-4 py-2 rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
            <p className="mt-2 text-xs text-[#4A4A4A]">
              A partir de este volumen mensual, se aplicarán descuentos automáticos
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {savedSection === 'comisiones' && (
            <span className="text-sm text-green-600 font-medium">✓ Guardado correctamente</span>
          )}
          <button
            onClick={() => handleSave('comisiones')}
            disabled={!isSectionChanged('comisiones')}
            className="ml-auto inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-[#0066FF] text-white font-medium hover:bg-[#0052CC] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-3xl bg-[#FFFFFF] p-8 border border-gray-100 space-y-6" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div>
          <h2 className="text-xl font-extrabold text-[#000000]">Notificaciones</h2>
          <p className="mt-1 text-sm text-[#4A4A4A]">Preferencias de notificación del sistema</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emailNotif"
              checked={settings.notificaciones.emailNotifications}
              onChange={(e) => handleChange('notificaciones', 'emailNotifications', e.target.checked)}
              className="w-4 h-4 rounded border-gray-200 text-[#0066FF] focus:ring-[#0066FF]"
            />
            <label htmlFor="emailNotif" className="text-sm font-medium text-[#000000]">
              Notificaciones por Email
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="smsNotif"
              checked={settings.notificaciones.smsNotifications}
              onChange={(e) => handleChange('notificaciones', 'smsNotifications', e.target.checked)}
              className="w-4 h-4 rounded border-gray-200 text-[#0066FF] focus:ring-[#0066FF]"
            />
            <label htmlFor="smsNotif" className="text-sm font-medium text-[#000000]">
              Notificaciones por SMS
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="pushNotif"
              checked={settings.notificaciones.pushNotifications}
              onChange={(e) => handleChange('notificaciones', 'pushNotifications', e.target.checked)}
              className="w-4 h-4 rounded border-gray-200 text-[#0066FF] focus:ring-[#0066FF]"
            />
            <label htmlFor="pushNotif" className="text-sm font-medium text-[#000000]">
              Notificaciones Push
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="dailyDigest"
              checked={settings.notificaciones.dailyDigest}
              onChange={(e) => handleChange('notificaciones', 'dailyDigest', e.target.checked)}
              className="w-4 h-4 rounded border-gray-200 text-[#0066FF] focus:ring-[#0066FF]"
            />
            <label htmlFor="dailyDigest" className="text-sm font-medium text-[#000000]">
              Resumen Diario
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {savedSection === 'notificaciones' && (
            <span className="text-sm text-green-600 font-medium">✓ Guardado correctamente</span>
          )}
          <button
            onClick={() => handleSave('notificaciones')}
            disabled={!isSectionChanged('notificaciones')}
            className="ml-auto inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-[#0066FF] text-white font-medium hover:bg-[#0052CC] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}
