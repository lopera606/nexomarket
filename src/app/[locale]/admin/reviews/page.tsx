'use client';

import { useState } from 'react';
import { Search, ThumbsUp, ThumbsDown, Star } from 'lucide-react';

interface Review {
  id: string;
  user: string;
  product: string;
  rating: number;
  text: string;
  date: string;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada';
}

const mockReviews: Review[] = [
  {
    id: '1',
    user: 'María García',
    product: 'Laptop Gaming ASUS ROG',
    rating: 5,
    text: 'Excelente producto, muy rápido y cumple todas las expectativas. Entrega rápida.',
    date: '2025-03-10',
    status: 'Pendiente',
  },
  {
    id: '2',
    user: 'Juan López',
    product: 'Camiseta Premium Cotton',
    rating: 4,
    text: 'Buena calidad, aunque la talla es un poco grande.',
    date: '2025-03-11',
    status: 'Aprobada',
  },
  {
    id: '3',
    user: 'Ana Rodríguez',
    product: 'Auriculares Bluetooth Pro',
    rating: 3,
    text: 'Funciona bien pero la batería no dura tanto como dice.',
    date: '2025-03-09',
    status: 'Aprobada',
  },
  {
    id: '4',
    user: 'Carlos Martínez',
    product: 'Lámpara LED Inteligente',
    rating: 1,
    text: 'Producto roto al llegar, peor compra que he hecho.',
    date: '2025-03-12',
    status: 'Pendiente',
  },
  {
    id: '5',
    user: 'Laura Sánchez',
    product: 'Espejo Decorativo de Pared',
    rating: 2,
    text: 'Calidad muy pobre, no lo recomiendo.',
    date: '2025-03-13',
    status: 'Rechazada',
  },
];

type RatingFilter = 'Todos' | '5' | '4' | '3' | '2' | '1';

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('Todos');
  const [reviews] = useState(mockReviews);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === 'Todos' || review.rating === parseInt(ratingFilter);

    return matchesSearch && matchesRating;
  });

  // Calculate stats
  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === 'Pendiente').length,
    approved: reviews.filter((r) => r.status === 'Aprobada').length,
    rejected: reviews.filter((r) => r.status === 'Rechazada').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprobada':
        return 'bg-green-50 text-green-700';
      case 'Pendiente':
        return 'bg-amber-50 text-amber-700';
      case 'Rechazada':
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Moderación de Reseñas
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {filteredReviews.length} reseñas
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
            Todas las reseñas
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
            Esperando revisión
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Aprobadas
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {stats.approved}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Publicadas
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Rechazadas
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">
            {stats.rejected}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            No publicadas
          </p>
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

        {/* Rating Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Todos', '5', '4', '3', '2', '1'].map((filter) => (
            <button
              key={filter}
              onClick={() => setRatingFilter(filter as RatingFilter)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                ratingFilter === filter
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300:bg-gray-600'
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
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {review.product}
                </h3>
                <p className="text-sm text-gray-600">
                  Por: {review.user}
                </p>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  review.status
                )}`}
              >
                {review.status}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? `fill-orange-400 text-orange-400`
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-sm font-semibold ${getRatingColor(review.rating)}`}>
                {review.rating}/5
              </span>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 mb-4">
              {review.text}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {new Date(review.date).toLocaleDateString('es-ES')}
              </p>
              {review.status === 'Pendiente' && (
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-green-100/30 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200:bg-green-900/50 transition-all">
                    <ThumbsUp className="h-4 w-4" />
                    Aprobar
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-red-100/30 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200:bg-red-900/50 transition-all">
                    <ThumbsDown className="h-4 w-4" />
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
