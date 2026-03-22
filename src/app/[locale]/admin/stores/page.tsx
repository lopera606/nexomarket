'use client';

import { useState } from 'react';
import { Search, MoreVertical, Star, AlertCircle, CheckCircle } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  owner: string;
  logo: string;
  productsCount: number;
  revenue: number;
  rating: number;
  status: 'Activa' | 'Pendiente' | 'Suspendida';
}

const mockStores: Store[] = [
  {
    id: '1',
    name: 'TechPro Store',
    owner: 'Juan Martínez',
    logo: 'TP',
    productsCount: 145,
    revenue: 45230.50,
    rating: 4.8,
    status: 'Activa',
  },
  {
    id: '2',
    name: 'Fashion World',
    owner: 'María Rodríguez',
    logo: 'FW',
    productsCount: 89,
    revenue: 32150.00,
    rating: 4.5,
    status: 'Activa',
  },
  {
    id: '3',
    name: 'Home & Garden',
    owner: 'Carlos López',
    logo: 'HG',
    productsCount: 234,
    revenue: 0,
    rating: 0,
    status: 'Pendiente',
  },
  {
    id: '4',
    name: 'Electronics Hub',
    owner: 'Ana García',
    logo: 'EH',
    productsCount: 0,
    revenue: 0,
    rating: 0,
    status: 'Suspendida',
  },
  {
    id: '5',
    name: 'Books Paradise',
    owner: 'Pedro Sánchez',
    logo: 'BP',
    productsCount: 567,
    revenue: 78900.00,
    rating: 4.9,
    status: 'Activa',
  },
];

type StatusFilter = 'Todos' | 'Activa' | 'Pendiente' | 'Suspendida';

export default function StoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [stores] = useState(mockStores);

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'Todos' || store.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activa':
        return 'bg-green-50 text-green-700';
      case 'Pendiente':
        return 'bg-amber-50 text-amber-700';
      case 'Suspendida':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Activa':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pendiente':
        return <AlertCircle className="h-4 w-4" />;
      case 'Suspendida':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestión de Tiendas
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {filteredStores.length} tiendas
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar tienda o propietario..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Todos', 'Activa', 'Pendiente', 'Suspendida'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as StatusFilter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 hover:shadow-lg transition-shadow"
            style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}
          >
            {/* Logo and Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 sm:h-14 w-12 sm:w-14 rounded-lg bg-[#0066FF] flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                {store.logo}
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                <MoreVertical className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600" />
              </button>
            </div>

            {/* Store Name and Owner */}
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2">
              {store.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-1">
              Propietario: {store.owner}
            </p>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  store.status
                )}`}
              >
                {getStatusIcon(store.status)}
                {store.status}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-1">
                  Productos
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {store.productsCount}
                </p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-1">
                  Ingresos
                </p>
                <p className="text-lg sm:text-xl font-bold text-green-700 truncate">
                  €{store.revenue.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 sm:gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 sm:h-4 w-3 sm:w-4 ${
                      i < Math.floor(store.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {store.rating > 0 ? store.rating : 'Sin cal.'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
