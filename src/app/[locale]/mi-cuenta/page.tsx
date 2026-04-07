'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, Heart, Star, MapPin, Settings, ChevronRight, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  grandTotal: number;
  createdAt: string;
}

export default function MiCuentaPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          fetch('/api/v2/mi-cuenta/perfil'),
          fetch('/api/v2/mi-cuenta/pedidos?limit=5'),
        ]);

        if (profileRes.ok) {
          setProfile(await profileRes.json());
        }
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : ordersData.orders?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error('Error loading account data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    CONFIRMED: 'bg-blue-50 text-blue-700',
    SHIPPED: 'bg-indigo-50 text-indigo-700',
    DELIVERED: 'bg-green-50 text-green-700',
    CANCELLED: 'bg-red-50 text-red-700',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  const quickLinks = [
    { href: '/es/mi-cuenta/pedidos', icon: ShoppingBag, label: 'Mis Pedidos', desc: 'Ver historial de compras' },
    { href: '/es/mi-cuenta/favoritos', icon: Heart, label: 'Favoritos', desc: 'Productos guardados' },
    { href: '/es/mi-cuenta/resenas', icon: Star, label: 'Mis Resenas', desc: 'Resenas que has escrito' },
    { href: '/es/mi-cuenta/direcciones', icon: MapPin, label: 'Direcciones', desc: 'Gestiona tus direcciones' },
    { href: '/es/mi-cuenta/perfil', icon: User, label: 'Mi Perfil', desc: 'Editar informacion personal' },
    { href: '/es/mi-cuenta/seguridad', icon: Settings, label: 'Seguridad', desc: 'Contrasena y sesiones' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">Mi Cuenta</h1>
        <p className="mt-1 text-sm text-[#4A4A4A]">
          {profile ? `Hola, ${profile.firstName} ${profile.lastName}` : 'Bienvenido a tu cuenta'}
        </p>
      </div>

      {/* Profile Summary */}
      {profile && (
        <Card className="p-4 sm:p-6 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0066FF] rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-[#000000] truncate">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-[#4A4A4A] truncate">{profile.email}</p>
              <p className="text-xs text-[#4A4A4A] mt-1">
                Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Link
              href="/es/mi-cuenta/perfil"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0066FF] hover:text-[#0052CC]"
            >
              Editar perfil
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="p-4 sm:p-5 bg-[#FFFFFF] border border-gray-200 rounded-2xl hover:shadow-md hover:border-[#0066FF]/30 transition-all cursor-pointer h-full" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                <Icon className="h-6 w-6 text-[#0066FF] mb-2 sm:mb-3" />
                <h3 className="font-semibold text-sm sm:text-base text-[#000000]">{link.label}</h3>
                <p className="text-xs text-[#4A4A4A] mt-0.5 hidden sm:block">{link.desc}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#000000]">Pedidos Recientes</h2>
          <Link href="/es/mi-cuenta/pedidos" className="text-sm font-medium text-[#0066FF] hover:text-[#0052CC]">
            Ver todos
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card className="p-6 sm:p-8 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl text-center" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <ShoppingBag className="mx-auto h-12 w-12 text-[#4A4A4A] mb-3" />
            <p className="text-[#4A4A4A] font-medium">No tienes pedidos aun</p>
            <Link
              href="/es"
              className="inline-block mt-4 px-6 py-2 bg-[#0066FF] text-white rounded-xl text-sm font-medium hover:bg-[#0052CC]"
            >
              Explorar productos
            </Link>
          </Card>
        ) : (
          <Card className="bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/es/mi-cuenta/pedidos/${order.id}`}
                  className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#000000]">#{order.orderNumber}</p>
                    <p className="text-xs text-[#4A4A4A] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-50 text-gray-700'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="font-bold text-sm text-[#000000]">
                      ${Number(order.grandTotal).toFixed(2)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#4A4A4A] flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
