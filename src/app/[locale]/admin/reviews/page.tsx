'use client';

import { useState, useEffect } from 'react';
import { Search, ThumbsUp, ThumbsDown, Star, Loader2 } from 'lucide-react';

interface Review {
  id: string;
  user: string;
  product: string;
  rating: number;
  title: string | null;
  text: string;
  date: string;
  status: string;
}

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
};

type RatingFilter = 'Todos' | '5' | '4' | '3' | '2' | '1';

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('Todos');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (ratingFilter !== 'Todos') params.set('rating', ratingFilter);
      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch {
      console.error('Error fetching reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [searchTerm, ratingFilter]);

  const handleModerate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch {
      console.error('Error moderating review');
    }
  };

  const statusLabel = (s: string) => STATUS_MAP[s] || s;

  // Calculate stats
  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === 'PENDING').length,
    approved: reviews.filter((r) => r.status === 'APPROVED').length,
    rejected: reviews.filter((r) => r.status === 'REJECTED').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-50 text-green-700';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700';
      case 'REJECTED':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-500';
    return 'text-red-500';
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
            Moderacion de Resenas
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {reviews.length} resenas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Total</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Todas las resenas</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Pendientes</p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-700">{stats.pending}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Esperando revision</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Aprobadas</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">Publicadas</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Rechazadas</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">No publicadas</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por usuario o producto..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Todos', '5', '4', '3', '2', '1'].map((filter) => (
            <button
              key={filter}
              onClick={() => setRatingFilter(filter as RatingFilter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                ratingFilter === filter
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter === 'Todos' ? (
                'Todos'
              ) : (
                <>
                  {filter}
                  <Star className="h-4 w-4 fill-current" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin resenas</h2>
          <p className="text-gray-500">No se encontraron resenas con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{review.product}</h3>
                  <p className="text-sm text-gray-600">Por: {review.user}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(review.status)}`}>
                  {statusLabel(review.status)}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-sm font-semibold ${getRatingColor(review.rating)}`}>
                  {review.rating}/5
                </span>
              </div>

              {/* Review Text */}
              {review.title && <p className="font-semibold text-gray-900 mb-1">{review.title}</p>}
              <p className="text-gray-700 mb-4">{review.text}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString('es-ES')}
                </p>
                {review.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleModerate(review.id, 'APPROVED')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-100/30 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200 transition-all"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleModerate(review.id, 'REJECTED')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-100/30 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition-all"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
