'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, LogOut, Trash2, AlertTriangle, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
}

export default function SeguridadPage() {
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

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome 122',
      location: 'Madrid, España',
      lastActive: 'Ahora',
    },
    {
      id: '2',
      device: 'iPhone 15',
      browser: 'Safari',
      location: 'Madrid, España',
      lastActive: 'Hace 2 horas',
    },
    {
      id: '3',
      device: 'Windows 11 PC',
      browser: 'Firefox 123',
      location: 'Barcelona, España',
      lastActive: 'Hace 3 días',
    },
  ]);

  const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
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
    alert('Contraseña actualizada exitosamente');
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleLogoutSession = (id: string) => {
    setActiveSessions(sessions => sessions.filter(s => s.id !== id));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro? Esta acción no se puede deshacer. Se eliminará tu cuenta y todos tus datos.')) {
      alert('Solicitud de eliminación enviada. Recibirás un email de confirmación.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#000000]">Seguridad</h1>
        <p className="mt-1 text-[#4A4A4A]">Protege tu cuenta y tus datos</p>
      </div>

      {/* Change Password */}
      <Card className="p-6 space-y-4 bg-[#FFFFFF] border border-gray-200 rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-[#0066FF]" />
          <h2 className="text-lg font-semibold text-[#000000]">Cambiar Contraseña</h2>
        </div>

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

      {/* Two-Factor Authentication */}
      <Card className="p-6 space-y-4 bg-[#FFFFFF] border border-gray-200 rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#0066FF]" />
            <div>
              <h2 className="text-lg font-semibold text-[#000000]">Autenticación en Dos Pasos</h2>
              <p className="text-sm text-[#4A4A4A] mt-1">
                Añade una capa extra de seguridad a tu cuenta
              </p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={handleToggleTwoFactor}
              className="w-5 h-5 text-[#0066FF] rounded"
            />
          </label>
        </div>

        {twoFactorEnabled && (
          <div className="p-4 bg-blue-50 rounded-2xl border border-[#0066FF]">
            <p className="text-sm text-[#0066FF]">
              La autenticación en dos pasos está habilitada. Recibirás un código en tu teléfono cuando inicies sesión.
            </p>
          </div>
        )}
      </Card>

      {/* Active Sessions */}
      <Card className="p-6 space-y-4 bg-[#FFFFFF] border border-gray-200 rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-[#0066FF]" />
          <h2 className="text-lg font-semibold text-[#000000]">Sesiones Activas</h2>
        </div>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-2xl border border-gray-200"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-[#000000]">{session.device}</h3>
                <p className="text-sm text-[#4A4A4A]">{session.browser}</p>
                <p className="text-xs text-[#4A4A4A] mt-1">
                  {session.location} • {session.lastActive}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLogoutSession(session.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 rounded-2xl"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="p-6 space-y-4 border-red-200 bg-red-50 rounded-3xl">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-semibold text-red-600">Zona de Peligro</h2>
        </div>

        <div className="space-y-3 bg-[#FFFFFF] p-4 rounded-2xl border border-red-200">
          <div>
            <h3 className="font-semibold text-[#000000]">Eliminar Cuenta</h3>
            <p className="text-sm text-[#4A4A4A] mt-2">
              Esta acción es permanente. Se eliminarán todos tus datos, pedidos e historial de la plataforma.
            </p>
          </div>

          <Button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white rounded-2xl w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Mi Cuenta
          </Button>
        </div>
      </Card>
    </div>
  );
}
