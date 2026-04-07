'use client';

import { useState, useEffect } from 'react';
import { Search, MoreVertical, Image, Loader2, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  store: string;
  price: number;
  stock: number;
  status: string;
  imageUrl: string | null;
}

const STATUS_MAP: Record<string, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activo',
  PAUSED: 'Pausado',
  DELETED: 'Eliminado',
};

type CategoryFilter = 'Todos' | 'Activos' | 'Pendientes' | 'Rechazados';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Todos');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        const res = await fetch(`/api/admin/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch {
        console.error('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm]);

  const statusLabel = (s: string) => STATUS_MAP[s] || s;

  const filteredProducts = products.filter((product) => {
    if (categoryFilter === 'Activos' && product.status !== 'ACTIVE') return false;
    if (categoryFilter === 'Pendientes' && product.status !== 'DRAFT') return false;
    if (categoryFilter === 'Rechazados' && product.status !== 'DELETED') return false;
    return true;
  });

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'ACTIVE').length,
    pending: products.filter((p) => p.status === 'DRAFT').length,
    rejected: products.filter((p) => p.status === 'DELETED' || p.status === 'PAUSED').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-700';
      case 'DRAFT':
        return 'bg-amber-50 text-amber-700';
      case 'PAUSED':
      case 'DELETED':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestion de Productos
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
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Todos los productos</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Activos</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-700">{stats.active}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Publicados</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Pendientes</p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-700">{stats.pending}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Aguardando revision</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Rechazados</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-700">{stats.rejected}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">No aprobados</p>
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
      {filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin productos</h2>
          <p className="text-gray-500">No se encontraron productos con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Tienda</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.store}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {product.stock} un.
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                      {statusLabel(product.status)}
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
      )}
    </div>
  );
}
