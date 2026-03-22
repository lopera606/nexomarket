'use client';

import { useState } from 'react';
import { Search, MoreVertical, Image } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  store: string;
  price: number;
  stock: number;
  status: 'Activo' | 'Pendiente' | 'Rechazado';
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Gaming ASUS ROG',
    store: 'TechPro Store',
    price: 1299.99,
    stock: 12,
    status: 'Activo',
  },
  {
    id: '2',
    name: 'Camiseta Premium Cotton',
    store: 'Fashion World',
    price: 29.99,
    stock: 45,
    status: 'Activo',
  },
  {
    id: '3',
    name: 'Lámpara LED Inteligente',
    store: 'Home & Garden',
    price: 49.99,
    stock: 8,
    status: 'Pendiente',
  },
  {
    id: '4',
    name: 'Auriculares Bluetooth Pro',
    store: 'TechPro Store',
    price: 199.99,
    stock: 0,
    status: 'Activo',
  },
  {
    id: '5',
    name: 'Espejo Decorativo de Pared',
    store: 'Home & Garden',
    price: 79.99,
    stock: 3,
    status: 'Rechazado',
  },
];

type CategoryFilter = 'Todos' | 'Activos' | 'Pendientes' | 'Rechazados';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Todos');
  const [products] = useState(mockProducts);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.store.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      categoryFilter === 'Todos' ||
      (categoryFilter === 'Activos' && product.status === 'Activo') ||
      (categoryFilter === 'Pendientes' && product.status === 'Pendiente') ||
      (categoryFilter === 'Rechazados' && product.status === 'Rechazado');

    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'Activo').length,
    pending: products.filter((p) => p.status === 'Pendiente').length,
    rejected: products.filter((p) => p.status === 'Rechazado').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-50 text-green-700';
      case 'Pendiente':
        return 'bg-amber-50 text-amber-700';
      case 'Rechazado':
        return 'bg-red-50 text-red-700';
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
            Gestión de Productos
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {filteredProducts.length} productos
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Total</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats.total}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Todos los productos
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Activos</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-700">
            {stats.active}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Publicados
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Pendientes
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-700">
            {stats.pending}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Aguardando revisión
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Rechazados
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-red-700">
            {stats.rejected}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            No aprobados
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o tienda..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Todos', 'Activos', 'Pendientes', 'Rechazados'].map((filter) => (
            <button
              key={filter}
              onClick={() => setCategoryFilter(filter as CategoryFilter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                categoryFilter === filter
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
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Tienda
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                Stock
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
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {['Laptop', 'ASUS ROG'].some(term => product.name.includes(term)) ? (
                        <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=40&h=40&fit=crop" alt={product.name} className="w-full h-full object-cover" />
                      ) : ['Camiseta', 'Cotton'].some(term => product.name.includes(term)) ? (
                        <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=40&h=40&fit=crop" alt={product.name} className="w-full h-full object-cover" />
                      ) : ['Auriculares', 'Bluetooth'].some(term => product.name.includes(term)) ? (
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=40&h=40&fit=crop" alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Image className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {product.store}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                  €{product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      product.stock > 0
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {product.stock} un.
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
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
