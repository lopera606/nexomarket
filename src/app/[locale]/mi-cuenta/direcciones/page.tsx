'use client';

import { useState, useEffect } from 'react';
import { MapPin, Edit, Trash2, Plus, Home, Building2, CheckCircle, Loader2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Address {
  id: string;
  label: string;
  fullName: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

const EMPTY_FORM = {
  label: 'Casa',
  fullName: '',
  streetLine1: '',
  streetLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'MX',
  phone: '',
  isDefault: false,
};

export default function DireccionesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadAddresses = async () => {
    try {
      const res = await fetch('/api/v2/mi-cuenta/direcciones');
      if (res.ok) {
        setAddresses(await res.json());
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Estas seguro de eliminar esta direccion?')) return;
    try {
      const res = await fetch(`/api/v2/mi-cuenta/direcciones?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(addresses.filter(addr => addr.id !== id));
        setMessage({ type: 'success', text: 'Direccion eliminada' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al eliminar' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch('/api/v2/mi-cuenta/direcciones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDefault: true }),
      });
      if (res.ok) {
        setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al actualizar' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/v2/mi-cuenta/direcciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Direccion agregada' });
        setFormData(EMPTY_FORM);
        setShowForm(false);
        await loadAddresses();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Error al guardar' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexion' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">Mis Direcciones</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">Gestiona tus direcciones de entrega</p>
        </div>
        <Button
          onClick={() => { setShowForm(!showForm); setFormData(EMPTY_FORM); }}
          className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm flex-shrink-0"
        >
          {showForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1 sm:mr-2" />}
          {showForm ? 'Cancelar' : 'Agregar'}
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* New Address Form */}
      {showForm && (
        <Card className="p-4 sm:p-6 bg-[#FFFFFF] border border-[#0066FF]/30 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <h2 className="text-lg font-bold text-[#000000] mb-4">Nueva Direccion</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Etiqueta</label>
              <select
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="Casa">Casa</option>
                <option value="Oficina">Oficina</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nombre completo</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                placeholder="Nombre del destinatario"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Direccion (linea 1)</label>
              <input
                type="text"
                value={formData.streetLine1}
                onChange={(e) => setFormData(prev => ({ ...prev, streetLine1: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                placeholder="Calle, numero, colonia"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Direccion (linea 2, opcional)</label>
              <input
                type="text"
                value={formData.streetLine2}
                onChange={(e) => setFormData(prev => ({ ...prev, streetLine2: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                placeholder="Interior, edificio, piso"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Ciudad</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Estado/Provincia</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Codigo Postal</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Pais</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="MX">Mexico</option>
                <option value="ES">Espana</option>
                <option value="CO">Colombia</option>
                <option value="AR">Argentina</option>
                <option value="CL">Chile</option>
                <option value="US">Estados Unidos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Telefono (opcional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-[#FAFAFA] text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF]"
              />
              <label htmlFor="isDefault" className="text-sm text-[#4A4A4A]">Establecer como predeterminada</label>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={saving || !formData.fullName || !formData.streetLine1 || !formData.city || !formData.state || !formData.postalCode}
            className="mt-4 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl w-full sm:w-auto"
          >
            {saving ? 'Guardando...' : 'Guardar Direccion'}
          </Button>
        </Card>
      )}

      {/* Address List */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {addresses.map((address) => {
          const Icon = address.label === 'Oficina' ? Building2 : Home;
          return (
            <Card key={address.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="p-1.5 sm:p-2 bg-[#0066FF] rounded-full flex-shrink-0">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs sm:text-base text-[#000000]">{address.label}</h3>
                      {address.isDefault && (
                        <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                          <CheckCircle className="h-3 w-3 text-[#0066FF] flex-shrink-0" />
                          <span className="text-[10px] sm:text-xs font-medium text-[#0066FF]">Predeterminada</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <p className="font-medium text-[#000000]">{address.fullName}</p>
                  <div className="flex gap-2 text-[#4A4A4A]">
                    <MapPin className="h-3 w-3 sm:w-4 sm:h-4 flex-shrink-0 text-[#4A4A4A] mt-0.5" />
                    <span>{address.streetLine1}{address.streetLine2 ? `, ${address.streetLine2}` : ''}</span>
                  </div>
                  <p className="text-[#4A4A4A] text-xs">{address.city}, {address.state}</p>
                  <p className="text-[#4A4A4A] text-xs">CP: {address.postalCode}, {address.country}</p>
                  {address.phone && <p className="text-[#4A4A4A] text-xs">{address.phone}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 sm:pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 rounded-lg sm:rounded-2xl"
                  >
                    <Trash2 className="h-3 w-3 sm:w-4 sm:h-4" />
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-[#0066FF] hover:text-[#0052CC] hover:bg-blue-50 border-gray-200 rounded-lg sm:rounded-2xl text-xs"
                    >
                      Predeterminada
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {addresses.length === 0 && !showForm && (
        <Card className="p-8 sm:p-12 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-[#4A4A4A]" />
            <p className="mt-4 text-base sm:text-lg font-semibold text-[#4A4A4A]">No tienes direcciones</p>
            <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A]">Agrega una direccion para poder realizar compras</p>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-6 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              Agregar Direccion
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
