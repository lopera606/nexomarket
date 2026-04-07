'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const t = useTranslations();
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Comprador');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTermsAndPrivacy, setAcceptTermsAndPrivacy] = useState(false);
  const [acceptCookies, setAcceptCookies] = useState(false);
  const [acceptSellerTerms, setAcceptSellerTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    const newFieldErrors: Record<string, string> = {};

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    if (!acceptTermsAndPrivacy) {
      newFieldErrors.termsAndPrivacy = 'Debes aceptar los términos y la política de privacidad';
    }

    if (!acceptCookies) {
      newFieldErrors.cookies = 'Debes aceptar el uso de cookies';
    }

    if (role === 'Vendedor' && !acceptSellerTerms) {
      newFieldErrors.sellerTerms = 'Debes aceptar los términos de vendedor';
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsLoading(true);

    const result = await registerUser({
      name: nombre,
      email,
      password,
      role: role.toLowerCase() as 'comprador' | 'vendedor',
      storeName: role === 'Vendedor' ? storeName : undefined,
    });

    setIsLoading(false);

    if (result.success) {
      // Auto-logged in, redirect to home (or seller dashboard for vendors)
      if (role === 'Vendedor') {
        router.push('/es/vendedor/dashboard');
      } else {
        router.push('/es');
      }
    } else {
      setErrorMessage(result.error || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-[0_2px_60px_rgba(0,0,0,0.03)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">
            NexoMarket
          </h1>
          <p className="mt-2 text-[#4A4A4A]">Crea tu cuenta</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full rounded-2xl bg-white border border-gray-200 px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-[#0066FF] transition"
              required
            />
          </div>

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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-white border border-gray-200 px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-[#0066FF] transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Tipo de Cuenta
            </label>
            <div className="flex gap-3">
              <label
                className={`flex items-center gap-2 flex-1 p-3 border rounded-2xl cursor-pointer transition ${
                  role === 'Comprador'
                    ? 'border-[#0066FF] bg-[#0066FF]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value="Comprador"
                  checked={role === 'Comprador'}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-[#0066FF]"
                />
                <span className="font-medium text-black">Comprador</span>
              </label>
              <label
                className={`flex items-center gap-2 flex-1 p-3 border rounded-2xl cursor-pointer transition ${
                  role === 'Vendedor'
                    ? 'border-[#0066FF] bg-[#0066FF]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value="Vendedor"
                  checked={role === 'Vendedor'}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-[#0066FF]"
                />
                <span className="font-medium text-black">Vendedor</span>
              </label>
            </div>
          </div>

          {/* Store Name (only for sellers) */}
          {role === 'Vendedor' && (
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Nombre de la Tienda
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Mi Tienda Online"
                className="w-full rounded-2xl bg-white border border-gray-200 px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-[#0066FF] transition"
                required
              />
            </div>
          )}

          {/* Legal Acceptance Section */}
          <div className="mt-6 p-4 border border-gray-200 rounded-2xl bg-[#FAFAFA]">
            <h3 className="text-sm font-semibold text-black mb-4">
              Aceptación de Términos Legales
            </h3>

            {/* Terms and Privacy Checkbox */}
            <label className="flex items-start gap-3 mb-3">
              <input
                type="checkbox"
                checked={acceptTermsAndPrivacy}
                onChange={(e) => setAcceptTermsAndPrivacy(e.target.checked)}
                className="mt-1 rounded border-gray-200 bg-white text-[#0066FF] focus:border-[#0066FF]"
              />
              <div className="flex-1">
                <span className="text-sm text-[#4A4A4A]">
                  {t('legal.acceptTerms')}{' '}
                  <Link
                    href="/legal/terminos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066FF] hover:text-[#0052CC] underline transition"
                  >
                    {t('legal.termsAndConditions')}
                  </Link>
                  {' '}
                  {t('legal.and')}{' '}
                  <Link
                    href="/legal/privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066FF] hover:text-[#0052CC] underline transition"
                  >
                    {t('legal.privacyPolicy')}
                  </Link>
                </span>
                {fieldErrors.termsAndPrivacy && (
                  <p className="text-red-600 text-xs mt-1">{fieldErrors.termsAndPrivacy}</p>
                )}
              </div>
            </label>

            {/* Cookie Policy Checkbox */}
            <label className="flex items-start gap-3 mb-3">
              <input
                type="checkbox"
                checked={acceptCookies}
                onChange={(e) => setAcceptCookies(e.target.checked)}
                className="mt-1 rounded border-gray-200 bg-white text-[#0066FF] focus:border-[#0066FF]"
              />
              <div className="flex-1">
                <span className="text-sm text-[#4A4A4A]">
                  {t('legal.acceptCookies')}{' '}
                  <Link
                    href="/legal/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066FF] hover:text-[#0052CC] underline transition"
                  >
                    {t('legal.cookiePolicy')}
                  </Link>
                </span>
                {fieldErrors.cookies && (
                  <p className="text-red-600 text-xs mt-1">{fieldErrors.cookies}</p>
                )}
              </div>
            </label>

            {/* Seller Terms Checkbox (only for sellers) */}
            {role === 'Vendedor' && (
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptSellerTerms}
                  onChange={(e) => setAcceptSellerTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-200 bg-white text-[#0066FF] focus:border-[#0066FF]"
                />
                <div className="flex-1">
                  <span className="text-sm text-[#4A4A4A]">
                    {t('legal.acceptSellerTerms')}{' '}
                    <Link
                      href="/legal/condiciones-vendedor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0066FF] hover:text-[#0052CC] underline transition"
                    >
                      {t('legal.sellerTerms')}
                    </Link>
                  </span>
                  {fieldErrors.sellerTerms && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.sellerTerms}</p>
                  )}
                </div>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0066FF] text-white font-semibold py-2 px-4 rounded-2xl hover:bg-[#0052CC] transition disabled:opacity-50 mt-6"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 border-t border-gray-200 pt-6 text-center">
          <p className="text-[#4A4A4A]">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-medium text-[#0066FF] hover:text-[#0052CC] transition"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
