'use client';

import { useState, useEffect } from 'react';
import { Search, ToggleRight, ToggleLeft, Loader2 } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  store?: {
    id: string;
    name: string;
    status: string;
  } | null;
  _count: {
    orders: number;
    reviews: number;
  };
}

type FilterTab = 'Todos' | 'Clientes' | 'Vendedores' | 'Admins';

const roleMap: Record<FilterTab, string | undefined> = {
  Todos: undefined,
  Clientes: 'CUSTOMER',
  Vendedores: 'SELLER',
  Admins: 'ADMIN',
};

const roleLabels: Record<string, string> = {
  CUSTOMER: 'Cliente',
  SELLER: 'Vendedor',
  ADMIN: 'Admin',
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const filters: FilterTab[] = ['Todos', 'Clientes', 'Vendedores', 'Admins'];

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const role = roleMap[activeFilter];
        if (role) params.set('role', role);
        if (searchTerm) params.set('search', searchTerm);

        const res = await fetch(`/api/v2/admin-users?${params.toString()}`);
        if (res.ok) {
          setUsers(await res.json());
        }
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(loadUsers, searchTerm ? 300 : 0);
    return () => clearTimeout(timer);
  }, [activeFilter, searchTerm]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-50 text-red-700';
      case 'SELLER':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestion de Usuarios
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {users.length} usuarios
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Pedidos</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Registrado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Tienda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#0066FF] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 block">
                          {user.firstName} {user.lastName}
                        </span>
                        {user.isVerified && (
                          <span className="text-xs text-green-600">Verificado</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {user._count.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.store ? (
                      <span className="text-gray-900 font-medium">{user.store.name}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
