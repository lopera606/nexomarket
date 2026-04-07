'use client';

import { useState, useEffect, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'comprador' | 'vendedor' | 'admin';
  storeName?: string;
  createdAt: string;
}

function mapRole(backendRole: string | undefined): 'comprador' | 'vendedor' | 'admin' {
  switch (backendRole) {
    case 'ADMIN':
      return 'admin';
    case 'SELLER':
      return 'vendedor';
    case 'CUSTOMER':
    default:
      return 'comprador';
  }
}

export function useAuth() {
  const { data: session, status, update } = useSession();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const isLoading = status === 'loading';

  const user: UserData | null = session?.user
    ? {
        id: (session.user as any).id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        role: mapRole((session.user as any).role),
        createdAt: '',
      }
    : null;

  const isLoggedIn = !!user;
  const isVendedor = user?.role === 'vendedor' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          return {
            success: false,
            error: 'Credenciales incorrectas. Verifica tu correo y contrasena.',
          };
        }

        return { success: true };
      } catch {
        return { success: false, error: 'Error al iniciar sesion' };
      }
    },
    []
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      role: 'comprador' | 'vendedor';
      storeName?: string;
    }): Promise<{ success: boolean; error?: string; user?: UserData }> => {
      try {
        const nameParts = data.name.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            firstName,
            lastName,
            role: data.role === 'vendedor' ? 'SELLER' : 'CUSTOMER',
            storeName: data.storeName,
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          return { success: false, error: json.error || 'Error al crear la cuenta' };
        }

        // Auto-login after successful registration
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          return {
            success: false,
            error: 'Cuenta creada pero no se pudo iniciar sesion automaticamente.',
          };
        }

        return { success: true };
      } catch {
        return { success: false, error: 'Error al crear la cuenta' };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  return {
    user,
    isLoggedIn,
    isVendedor,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
  };
}
