'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/es');
    } else {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-[0_2px_60px_rgba(0,0,0,0.03)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">
            NexoMarket
          </h1>
          <p className="mt-2 text-[#4A4A4A]">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full rounded-2xl bg-white border border-gray-200 px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-[#0066FF] transition"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-white border border-gray-200 px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-[#0066FF] transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-200 bg-white text-[#0066FF] focus:border-[#0066FF]"
              />
              <span className="ml-2 text-sm text-[#4A4A4A]">Recuérdame</span>
            </label>
            <Link
              href="/ayuda"
              className="text-sm text-[#0066FF] hover:text-[#0052CC] transition"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0066FF] text-white font-semibold py-2 px-4 rounded-2xl hover:bg-[#0052CC] transition disabled:opacity-50"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 border-t border-gray-200 pt-6 text-center">
          <p className="text-[#4A4A4A]">
            ¿No tienes cuenta?{' '}
            <Link
              href="/registro"
              className="font-medium text-[#0066FF] hover:text-[#0052CC] transition"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
