'use client';

import { useState, useEffect } from 'react';
import { Camera, Save, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: null,
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/v2/mi-cuenta/perfil');
        if (res.ok) {
          const data = await res.json();
          setProfile({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            avatarUrl: data.avatarUrl || null,
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/v2/mi-cuenta/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Error al guardar' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexion' });
    } finally {
      setIsSaving(false);
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

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#000000]">Mi Perfil</h1>
        <p className="mt-1 text-[#4A4A4A]">Gestiona tu informacion personal</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <Card className="p-6 space-y-6 bg-[#FFFFFF] border border-gray-200 rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div>
          <h2 className="text-lg font-extrabold text-[#000000]">Foto de Perfil</h2>
          <div className="mt-4 flex items-center gap-6">
            <div className="w-24 h-24 bg-[#0066FF] rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {initials || '?'}
            </div>
            <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-2xl">
              <Camera className="h-4 w-4 mr-2" />
              Cambiar Foto
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-extrabold text-[#000000] mb-4">Informacion Personal</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nombre</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Apellidos</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Correo Electronico</label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl bg-gray-100 text-[#4A4A4A] cursor-not-allowed"
              />
              <p className="text-xs text-[#4A4A4A] mt-1">El correo no se puede cambiar</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Telefono</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+52 55 1234 5678"
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="mt-6 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-2xl w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
