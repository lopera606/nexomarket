'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, ToggleRight, ToggleLeft, ChevronDown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Cliente' | 'Vendedor' | 'Admin';
  status: boolean;
  registeredAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'María García López',
    email: 'maria@example.com',
    avatar: 'MG',
    role: 'Cliente',
    status: true,
    registeredAt: '2025-01-15',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    avatar: 'CR',
    role: 'Vendedor',
    status: true,
    registeredAt: '2025-02-20',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    avatar: 'AM',
    role: 'Admin',
    status: true,
    registeredAt: '2024-12-10',
  },
  {
    id: '4',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    avatar: 'JP',
    role: 'Cliente',
    status: false,
    registeredAt: '2025-01-05',
  },
  {
    id: '5',
    name: 'Laura Sánchez',
    email: 'laura@example.com',
    avatar: 'LS',
    role: 'Vendedor',
    status: true,
    registeredAt: '2025-03-01',
  },
];

type FilterTab = 'Todos' | 'Clientes' | 'Vendedores' | 'Admins';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Todos');
  const [users, setUsers] = useState(mockUsers);

  const filters: FilterTab[] = ['Todos', 'Clientes', 'Vendedores', 'Admins'];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Clientes' && user.role === 'Cliente') ||
      (activeFilter === 'Vendedores' && user.role === 'Vendedor') ||
      (activeFilter === 'Admins' && user.role === 'Admin');

    return matchesSearch && matchesFilter;
  });

  const toggleStatus = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: !user.status } : user
      )
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-50 text-red-700';
      case 'Vendedor':
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
            Gestión de Usuarios
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {filteredUsers.length} usuarios
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
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
        <table className="w-full min-w-[500px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Registrado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0066FF] flex items-center justify-center text-white font-semibold text-sm">
                      {user.avatar}
                    </div>
                    <span className="font-medium text-gray-900">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                  {new Date(user.registeredAt).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    {user.status ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                    <span
                      className={
                        user.status
                          ? 'text-green-700'
                          : 'text-gray-600'
                      }
                    >
                      {user.status ? 'Activo' : 'Inactivo'}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
