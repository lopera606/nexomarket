'use client';

import { useState } from 'react';
import { Camera, Eye, EyeOff, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Juan García López',
    email: 'juan.garcia@example.com',
    phone: '+34 912 345 678',
    dateOfBirth: '1990-05-15',
    gender: 'male',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message in real implementation
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setPasswords({ current: '', new: '', confirm: '' });
    // Show success message in real implementation
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#000000]">Mi Perfil</h1>
        <p className="mt-1 text-[#4A4A4A]">Gestiona tu información personal</p>
      </div>

      {/* Profile Information */}
      <Card className="p-6 space-y-6 bg-[#FFFFFF] border border-gray-200 rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div>
          <h2 className="text-lg font-extrabold text-[#000000]">Foto de Perfil</h2>
          <div className="mt-4 flex items-center gap-6">
            <div className="w-24 h-24 bg-[#0066FF] rounded-full flex items-center justify-center text-4xl font-bold text-white">
              JG
            </div>
            <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-2xl">
              <Camera className="h-4 w-4 mr-2" />
              Cambiar Foto
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-extrabold text-[#000000] mb-4">Información Personal</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Gender */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Género
              </label>
              <select
                value={profile.gender}
                onChange={(e) => handleProfileChange('gender', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
                <option value="prefer_not">Prefiero no especificar</option>
              </select>
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

      {/* Change Password */}
      <Card className="p-6 space-y-4 bg-[#FFFFFF] border border-gray-200 rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <h2 className="text-lg font-extrabold text-[#000000]">Cambiar Contraseña</h2>
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => handlePasswordChange('current', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
              <button
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-2.5 text-[#4A4A4A]"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
              <button
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-2.5 text-[#4A4A4A]"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-2xl bg-[#FAFAFA] text-[#000000] placeholder-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
              <button
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-2.5 text-[#4A4A4A]"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={isSaving || !passwords.current || !passwords.new || !passwords.confirm}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-2xl w-full"
          >
            {isSaving ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
