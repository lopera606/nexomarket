'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'comprador' | 'vendedor' | 'admin';
  storeName?: string;
  createdAt: string;
}

const AUTH_KEY = 'nexomarket_auth';
const USERS_KEY = 'nexomarket_users';

// Event to sync auth across components
const AUTH_EVENT = 'nexomarket_auth_change';

function getStoredUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function getStoredUsers(): UserData[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);

    const handleAuthChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_EVENT, handleAuthChange);
  }, []);

  const login = useCallback((email: string, _password: string): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: 'No se encontró una cuenta con ese correo electrónico' };
    }
    // In a real app we'd check password hash — here we just accept any password
    localStorage.setItem(AUTH_KEY, JSON.stringify(found));
    setUser(found);
    window.dispatchEvent(new Event(AUTH_EVENT));
    return { success: true };
  }, []);

  const register = useCallback((data: {
    name: string;
    email: string;
    password: string;
    role: 'comprador' | 'vendedor';
    storeName?: string;
  }): { success: boolean; error?: string; user?: UserData } => {
    const users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Ya existe una cuenta con ese correo electrónico' };
    }

    const newUser: UserData = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: data.name,
      email: data.email,
      role: data.role,
      storeName: data.storeName,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // Auto-login after registration
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setUser(newUser);
    window.dispatchEvent(new Event(AUTH_EVENT));
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  const isLoggedIn = !!user;
  const isVendedor = user?.role === 'vendedor' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

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
