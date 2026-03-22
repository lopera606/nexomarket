'use client';

import { useState } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PRODUCTS = [
  {
    id: 1,
    name: 'MacBook Pro 14"',
    price: 1299.99,
    stock: 12,
    status: 'Activo',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop',
    sales: 45,
  },
  {
    id: 2,
    name: 'AirPods Pro',
    price: 249.99,
    stock: 34,
    status: 'Activo',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=80&h=80&fit=crop',
    sales: 78,
  },
  {
    id: 3,
    name: 'iPhone 15 Pro',
    price: 999.99,
    stock: 8,
    status: 'Stock Bajo',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&h=80&fit=crop',
    sales: 32,
  },
  {
    id: 4,
    name: 'iPad Air',
    price: 599.99,
    stock: 0,
    status: 'Agotado',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&h=80&fit=crop',
    sales: 15,
  },
  {
    id: 5,
    name: 'Apple Watch Series 9',
    price: 399.99,
    stock: 22,
    status: 'Activo',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=80&h=80&fit=crop',
    sales: 28,
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    price: 299.99,
    stock: 45,
    status: 'Activo',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=80&h=80&fit=crop',
    sales: 12,
  },
];

const STATUS_COLORS: Record<string, { badge: string; dot: string }> = {
  'Activo': { badge: 'bg-green-50 text-green-700 border border-green-200', dot: 'bg-green-500' },
  'Stock Bajo': { badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-500' },
  'Agotado': { badge: 'bg-red-50 text-red-700 border border-red-200', dot: 'bg-red-500' },
};

export default function ProductosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'edit' | 'delete'; message: string } | null>(null);

  const filteredProducts = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (productId: number) => {
    setEditingProduct(productId);
    setFeedback({ type: 'edit', message: 'Abriendo editor del producto...' });
    setTimeout(() => {
      setFeedback(null);
      console.log('Editing product:', productId);
    }, 1500);
  };

  const handleDeleteClick = (productId: number) => {
    setDeleteConfirmation(productId);
  };

  const handleConfirmDelete = (productId: number) => {
    setFeedback({ type: 'delete', message: 'Eliminando producto...' });
    setTimeout(() => {
      setDeleteConfirmation(null);
      setFeedback(null);
      console.log('Deleted product:', productId);
    }, 1200);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#000000' }}>Mis Productos</h1>
          <p className="mt-1 text-sm sm:text-base" style={{ color: '#4A4A4A' }}>Gestiona tu catálogo de productos</p>
        </div>
        <Button className="gap-2 text-white border-0 rounded-2xl hover:opacity-90 transition-all duration-200 w-full sm:w-auto" style={{ backgroundColor: '#0066FF' }}>
          <Plus className="h-5 w-5" />
          Subir Producto
        </Button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#4A4A4A' }} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': '#0066FF' } as any}
          />
        </div>
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setViewType('grid')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewType === 'grid'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewType('list')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewType === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Products Grid View */}
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200 flex flex-col group" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
              {/* Product Image Area */}
              <div className="relative aspect-square bg-gray-100 border-b border-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-200"
                />
                <button className="absolute right-3 top-3 rounded-full bg-white border border-gray-300 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-5 w-5" style={{ color: '#4A4A4A' }} />
                </button>
                {/* Status Overlay */}
                <div className="absolute top-3 left-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs ${STATUS_COLORS[product.status].badge}`}>
                    <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[product.status].dot}`} />
                    {product.status}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-base line-clamp-2" style={{ color: '#000000' }}>{product.name}</h3>

                {/* Price */}
                <div className="mt-3 mb-4">
                  <span className="text-2xl font-extrabold" style={{ color: '#0066FF' }}>
                    {product.price.toFixed(2)}€
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-gray-200">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Stock</p>
                    <p className="mt-1 text-lg font-bold" style={{ color: '#0066FF' }}>{product.stock}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ventas</p>
                    <p className="mt-1 text-lg font-bold" style={{ color: '#000000' }}>{product.sales}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-2xl border-gray-300 hover:bg-gray-50"
                    size="sm"
                    onClick={() => handleEdit(product.id)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-2xl border-gray-300 hover:bg-gray-50" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Products List View */
        <Card className="overflow-hidden border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Producto</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Precio</th>
                  <th className="px-6 py-4 text-center font-semibold" style={{ color: '#000000' }}>Stock</th>
                  <th className="px-6 py-4 text-center font-semibold" style={{ color: '#000000' }}>Ventas</th>
                  <th className="px-6 py-4 text-left font-semibold" style={{ color: '#000000' }}>Estado</th>
                  <th className="px-6 py-4 text-center font-semibold" style={{ color: '#000000' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold" style={{ color: '#000000' }}>{product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold" style={{ color: '#000000' }}>
                      {product.price.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block rounded-lg bg-blue-50 px-3 py-1 font-semibold" style={{ color: '#0066FF' }}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block rounded-lg bg-gray-100 px-3 py-1 font-semibold" style={{ color: '#4A4A4A' }}>
                        {product.sales}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[product.status].dot}`} />
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[product.status].badge}`}>
                          {product.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="rounded-lg p-2 hover:bg-gray-200 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" style={{ color: '#0066FF' }} />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-gray-200 transition-colors" title="Ver">
                          <Eye className="h-4 w-4" style={{ color: '#4A4A4A' }} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="rounded-lg p-2 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Feedback Message */}
      {feedback && (
        <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 max-w-sm">
          <Card className="bg-blue-50 border border-blue-200 p-4 flex items-center gap-3" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <div className="animate-spin">
              <div className="h-5 w-5 border-2 border-blue-300 border-t-blue-600 rounded-full" />
            </div>
            <p className="text-sm" style={{ color: '#0066FF' }}>{feedback.message}</p>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-50 p-2 flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#000000' }}>Eliminar Producto</h3>
                  <p className="text-sm" style={{ color: '#4A4A4A' }}>Esta acción no se puede deshacer</p>
                </div>
              </div>
              <p className="text-sm" style={{ color: '#4A4A4A' }}>¿Estás seguro de que deseas eliminar este producto? Se eliminará permanentemente de tu tienda.</p>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleCancelDelete}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 flex-1" style={{ color: '#000000' }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleConfirmDelete(deleteConfirmation)}
                  className="text-white rounded-2xl hover:opacity-90 transition-all duration-200 flex-1" style={{ backgroundColor: '#DC2626' }}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
