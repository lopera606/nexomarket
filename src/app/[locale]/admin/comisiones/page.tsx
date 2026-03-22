'use client'

import { useState } from 'react'
import { Plus, Edit2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react'

interface CommissionTier {
  id: string
  name: string
  category: string
  baseRate: number
  volumeDiscount: number
  status: 'active' | 'inactive'
}

interface CommissionLog {
  id: string
  fecha: string
  tienda: string
  pedido: string
  total: number
  comisionPorcentaje: number
  importeComision: number
  estado: 'completed' | 'pending' | 'failed'
}

const MOCK_TIERS: CommissionTier[] = [
  {
    id: '1',
    name: 'Standard Electronics',
    category: 'Electrónica',
    baseRate: 8,
    volumeDiscount: 0.5,
    status: 'active',
  },
  {
    id: '2',
    name: 'Standard Fashion',
    category: 'Moda',
    baseRate: 6,
    volumeDiscount: 0.3,
    status: 'active',
  },
  {
    id: '3',
    name: 'Premium Services',
    category: 'Servicios',
    baseRate: 12,
    volumeDiscount: 1,
    status: 'active',
  },
  {
    id: '4',
    name: 'Basic Groceries',
    category: 'Supermercado',
    baseRate: 4,
    volumeDiscount: 0.2,
    status: 'inactive',
  },
]

const MOCK_LOGS: CommissionLog[] = [
  {
    id: '1',
    fecha: '2026-03-21',
    tienda: 'TechStore Pro',
    pedido: 'PED-2026-0001',
    total: 299.99,
    comisionPorcentaje: 8,
    importeComision: 24.0,
    estado: 'completed',
  },
  {
    id: '2',
    fecha: '2026-03-21',
    tienda: 'Fashion Hub',
    pedido: 'PED-2026-0002',
    total: 89.50,
    comisionPorcentaje: 6,
    importeComision: 5.37,
    estado: 'completed',
  },
  {
    id: '3',
    fecha: '2026-03-20',
    tienda: 'HomeLight Solutions',
    pedido: 'PED-2026-0003',
    total: 450.0,
    comisionPorcentaje: 12,
    importeComision: 54.0,
    estado: 'completed',
  },
  {
    id: '4',
    fecha: '2026-03-20',
    tienda: 'Adventure Gear',
    pedido: 'PED-2026-0004',
    total: 120.0,
    comisionPorcentaje: 8,
    importeComision: 9.6,
    estado: 'pending',
  },
]

export default function ComisionesPage() {
  const [tiers, setTiers] = useState<CommissionTier[]>(MOCK_TIERS)
  const [showNewTierForm, setShowNewTierForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [logs] = useState<CommissionLog[]>(MOCK_LOGS)
  const [newTier, setNewTier] = useState({
    name: '',
    category: '',
    baseRate: 0,
    volumeDiscount: 0,
  })

  const activeTiers = tiers.filter(t => t.status === 'active')
  const totalCommissionsMonth = logs
    .filter(l => l.fecha.startsWith('2026-03'))
    .reduce((sum, l) => sum + l.importeComision, 0)
  const averageRate = activeTiers.length > 0
    ? (activeTiers.reduce((sum, t) => sum + t.baseRate, 0) / activeTiers.length).toFixed(2)
    : '0'
  const activeStores = new Set(logs.map(l => l.tienda)).size
  const pendingAmount = logs
    .filter(l => l.estado === 'pending')
    .reduce((sum, l) => sum + l.importeComision, 0)

  const handleAddTier = () => {
    if (newTier.name && newTier.category && newTier.baseRate > 0) {
      const tier: CommissionTier = {
        id: String(tiers.length + 1),
        ...newTier,
        status: 'active',
      }
      setTiers([...tiers, tier])
      setNewTier({ name: '', category: '', baseRate: 0, volumeDiscount: 0 })
      setShowNewTierForm(false)
    }
  }

  const handleToggleTier = (id: string) => {
    setTiers(
      tiers.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' }
          : t
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'pending':
        return 'text-amber-600 bg-amber-50'
      case 'failed':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'pending':
        return 'Pendiente'
      case 'failed':
        return 'Fallida'
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#000000]">
          Gestión de Comisiones
        </h1>
        <p className="mt-2 text-[#4A4A4A]">
          Administra las tasas de comisión y consulta el historial
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl bg-[#FFFFFF] p-6 border border-gray-100" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-sm font-medium text-[#4A4A4A]">Total Comisiones (Este mes)</p>
          <p className="mt-3 text-2xl font-extrabold text-[#000000]">
            €{totalCommissionsMonth.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-[#4A4A4A]">+12% vs mes anterior</p>
        </div>

        <div className="rounded-3xl bg-[#FFFFFF] p-6 border border-gray-100" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-sm font-medium text-[#4A4A4A]">Tasa Media</p>
          <p className="mt-3 text-2xl font-extrabold text-[#000000]">
            {averageRate}%
          </p>
          <p className="mt-2 text-xs text-[#4A4A4A]">{activeTiers.length} niveles activos</p>
        </div>

        <div className="rounded-3xl bg-[#FFFFFF] p-6 border border-gray-100" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-sm font-medium text-[#4A4A4A]">Tiendas Activas</p>
          <p className="mt-3 text-2xl font-extrabold text-[#000000]">
            {activeStores}
          </p>
          <p className="mt-2 text-xs text-[#4A4A4A]">Con comisiones aplicadas</p>
        </div>

        <div className="rounded-3xl bg-[#FFFFFF] p-6 border border-gray-100" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <p className="text-sm font-medium text-[#4A4A4A]">Pendiente de Cobro</p>
          <p className="mt-3 text-2xl font-extrabold text-[#000000]">
            €{pendingAmount.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-[#4A4A4A]">En proceso</p>
        </div>
      </div>

      {/* Commission Tiers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#000000]">
            Niveles de Comisión
          </h2>
          <button
            onClick={() => setShowNewTierForm(!showNewTierForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0066FF] text-white font-medium hover:bg-[#0052CC] transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Nuevo Nivel
          </button>
        </div>

        {/* New Tier Form */}
        {showNewTierForm && (
          <div className="rounded-3xl bg-[#FFFFFF] p-6 border border-gray-100 space-y-4" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <h3 className="font-extrabold text-[#000000]">Crear Nuevo Nivel de Comisión</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre del nivel"
                value={newTier.name}
                onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                className="px-4 py-2 rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
              <input
                type="text"
                placeholder="Categoría"
                value={newTier.category}
                onChange={(e) => setNewTier({ ...newTier, category: e.target.value })}
                className="px-4 py-2 rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
              <input
                type="number"
                placeholder="Tasa base (%)"
                value={newTier.baseRate}
                onChange={(e) => setNewTier({ ...newTier, baseRate: parseFloat(e.target.value) })}
                className="px-4 py-2 rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
              <input
                type="number"
                placeholder="Descuento por volumen (%)"
                value={newTier.volumeDiscount}
                onChange={(e) => setNewTier({ ...newTier, volumeDiscount: parseFloat(e.target.value) })}
                className="px-4 py-2 rounded-2xl border border-gray-200 bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddTier}
                className="px-6 py-2 rounded-2xl bg-[#0066FF] text-white font-medium hover:bg-[#0052CC] transition-colors duration-200"
              >
                Crear
              </button>
              <button
                onClick={() => setShowNewTierForm(false)}
                className="px-6 py-2 rounded-2xl border border-gray-200 text-[#000000] font-medium hover:bg-[#FAFAFA] transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Tiers Table */}
        <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-[#FFFFFF]" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Nombre</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Categoría</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Tasa Base</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Descuento Volumen</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Estado</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.id} className="border-b border-gray-100 hover:bg-[#FAFAFA] transition-colors duration-200">
                  <td className="px-6 py-4 font-semibold text-[#000000]">{tier.name}</td>
                  <td className="px-6 py-4 text-[#4A4A4A]">{tier.category}</td>
                  <td className="px-6 py-4 text-[#000000]">{tier.baseRate}%</td>
                  <td className="px-6 py-4 text-[#000000]">{tier.volumeDiscount}%</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        tier.status === 'active'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-[#4A4A4A]'
                      }`}
                    >
                      {tier.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="p-2 rounded-xl hover:bg-gray-100 text-[#4A4A4A] hover:text-[#000000] transition-colors duration-200">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleTier(tier.id)}
                        className="text-[#0066FF] hover:text-[#0052CC] transition-colors duration-200"
                      >
                        {tier.status === 'active' ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Logs Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#000000]">
          Historial de Comisiones
        </h2>

        <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-[#FFFFFF]" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Fecha</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Tienda</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Pedido</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Total</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Comisión %</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Importe</th>
                <th className="px-6 py-4 text-left font-extrabold text-[#000000]">Estado</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-[#FAFAFA] transition-colors duration-200">
                  <td className="px-6 py-4 text-[#000000]">{log.fecha}</td>
                  <td className="px-6 py-4 font-semibold text-[#000000]">{log.tienda}</td>
                  <td className="px-6 py-4 text-[#4A4A4A] font-mono">{log.pedido}</td>
                  <td className="px-6 py-4 text-[#000000]">€{log.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-[#000000]">{log.comisionPorcentaje}%</td>
                  <td className="px-6 py-4 font-semibold text-[#000000]">€{log.importeComision.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.estado)}`}>
                      {getStatusLabel(log.estado)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
