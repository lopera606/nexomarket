'use client';

import { useState, useEffect } from 'react';
import { Search, Star, AlertCircle, CheckCircle, Loader2, Ban, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Store {
  id: string;
  name: string;
  slug: string;
  status: string;
  planTier: string;
  avgRating: number;
  totalReviews: number;
  commissionRate: number;
  createdAt: string;
  approvedAt: string | null;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count: {
    products: number;
    subOrders: number;
  };
  revenue: number;
}

type StatusFilter = 'Todos' | 'ACTIVE' | 'PENDING' | 'SUSPENDED';

const statusLabels: Record<string, string> = {
  ACTIVE: 'Activa',
  PENDING: 'Pendiente',
  SUSPENDED: 'Suspendida',
};

export default function StoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function loadStores() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'Todos') params.set('status', statusFilter);
        if (searchTerm) params.set('search', searchTerm);

        const res = await fetch(`/api/admin/stores?${params.toString()}`);
        if (res.ok) {
          setStores(await res.json());
        }
      } catch (error) {
        console.error('Error loading stores:', error);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(loadStores, searchTerm ? 300 : 0);
    return () => clearTimeout(timer);
  }, [statusFilter, searchTerm]);

  const handleStatusChange = async (storeId: string, newStatus: string) => {
    setActionLoading(storeId);
    try {
      const res = await fetch('/api/admin/stores', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: storeId, status: newStatus }),
      });

      if (res.ok) {
        setStores(stores.map(s =>
          s.id === storeId ? { ...s, status: newStatus } : s
        ));
      }
    } catch (error) {
      console.error('Error updating store status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-700';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700';
      case 'SUSPENDED':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4" />;
      case 'SUSPENDED':
        return <Ban className="h-4 w-4" />;
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
            Gestion de Tiendas
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {stores.length} tiendas
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
          {(['Todos', 'ACTIVE', 'PENDING', 'SUSPENDED'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'Todos' ? 'Todos' : statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 hover:shadow-lg transition-shadow"
              style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}
            >
              {/* Logo and Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 sm:h-14 w-12 sm:w-14 rounded-lg bg-[#0066FF] flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                  {store.name.charAt(0)}{store.name.charAt(1)?.toUpperCase() || ''}
                </div>
              </div>

              {/* Store Name and Owner */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                {store.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-1">
                {store.owner.firstName} {store.owner.lastName} ({store.owner.email})
              </p>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(store.status)}`}
                >
                  {getStatusIcon(store.status)}
                  {statusLabels[store.status] || store.status}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600 mb-1">Productos</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{store._count.products}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-600 mb-1">Ingresos</p>
                  <p className="text-lg sm:text-xl font-bold text-green-700 truncate">
                    ${store.revenue.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 sm:h-4 w-3 sm:w-4 ${
                        i < Math.floor(Number(store.avgRating))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  {Number(store.avgRating) > 0 ? Number(store.avgRating).toFixed(1) : 'Sin cal.'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {store.status === 'PENDING' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(store.id, 'ACTIVE')}
                    disabled={actionLoading === store.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {actionLoading === store.id ? '...' : 'Aprobar'}
                  </Button>
                )}
                {store.status === 'ACTIVE' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(store.id, 'SUSPENDED')}
                    disabled={actionLoading === store.id}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 text-xs rounded-lg"
                  >
                    <Ban className="h-3 w-3 mr-1" />
                    {actionLoading === store.id ? '...' : 'Suspender'}
                  </Button>
                )}
                {store.status === 'SUSPENDED' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(store.id, 'ACTIVE')}
                    disabled={actionLoading === store.id}
                    className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs rounded-lg"
                  >
                    <PlayCircle className="h-3 w-3 mr-1" />
                    {actionLoading === store.id ? '...' : 'Reactivar'}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {stores.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No se encontraron tiendas
            </div>
          )}
        </div>
      )}
    </div>
  );
}
