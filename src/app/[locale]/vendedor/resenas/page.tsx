'use client';

import { useState } from 'react';
import { Star, Flag, Reply } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const REVIEWS = [
  {
    id: 1,
    author: 'Ana García López',
    avatar: '👩',
    rating: 5,
    date: '15 de marzo de 2026',
    product: 'MacBook Pro 14"',
    comment: 'Producto excelente, llegó a tiempo y bien empaquetado. El vendedor fue muy atento y resolvió rápidamente mis dudas. Totalmente recomendado.',
    verified: true,
    flagged: false,
  },
  {
    id: 2,
    author: 'Carlos López Martín',
    avatar: '👨',
    rating: 4,
    date: '14 de marzo de 2026',
    product: 'AirPods Pro',
    comment: 'Muy buena calidad, aunque el empaque podría mejorar un poco. La entrega fue rápida y el servicio al cliente excelente.',
    verified: true,
    flagged: false,
  },
  {
    id: 3,
    author: 'María Rodríguez González',
    avatar: '👩',
    rating: 5,
    date: '13 de marzo de 2026',
    product: 'iPhone 15 Pro',
    comment: 'Perfecto. Es exactamente lo que esperaba. Recomiendo esta tienda a todos mis amigos.',
    verified: true,
    flagged: false,
  },
  {
    id: 4,
    author: 'Juan Pérez Sánchez',
    avatar: '👨',
    rating: 3,
    date: '12 de marzo de 2026',
    product: 'iPad Air',
    comment: 'El producto es bueno pero tarde más en llegar de lo esperado. Sin embargo, llegó en perfecto estado.',
    verified: true,
    flagged: false,
  },
  {
    id: 5,
    author: 'Elena Ruiz Flores',
    avatar: '👩',
    rating: 5,
    date: '11 de marzo de 2026',
    product: 'Apple Watch Series 9',
    comment: 'Acabo de recibirlo y estoy muy satisfecha. Funciona perfectamente y el precio estaba muy bien.',
    verified: true,
    flagged: true,
  },
];

export default function ReseniasPage() {
  const [reviews, setReviews] = useState(REVIEWS);
  const [expandedReply, setExpandedReply] = useState<number | null>(null);

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const handleFlag = (id: number) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, flagged: !r.flagged } : r));
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold" style={{ color: '#000000' }}>
          Reseñas
        </h1>
        <p className="text-lg" style={{ color: '#4A4A4A' }}>Gestiona las reseñas de tus clientes</p>
      </div>

      {/* Overall Rating */}
      <Card className="p-8 border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Rating Summary */}
          <div className="flex items-start gap-8">
            <div className="text-center">
              <p className="text-6xl font-extrabold" style={{ color: '#000000' }}>{averageRating}</p>
              <div className="flex gap-1 mt-2 justify-center">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className="h-6 w-6 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mt-2" style={{ color: '#4A4A4A' }}>Basado en {reviews.length} reseñas</p>
            </div>

            {/* Rating Breakdown */}
            <div className="flex-1 space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts[rating as keyof typeof ratingCounts];
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8" style={{ color: '#4A4A4A' }}>{rating}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm w-8 text-right" style={{ color: '#4A4A4A' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Reseñas Positivas</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: '#0066FF' }}>{ratingCounts[5] + ratingCounts[4]}</p>
              <p className="text-xs mt-1" style={{ color: '#0066FF' }}>({Math.round(((ratingCounts[5] + ratingCounts[4]) / reviews.length) * 100)}%)</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Promedio Útil</p>
              <p className="mt-2 text-2xl font-bold text-orange-700">92%</p>
              <p className="text-xs mt-1 text-orange-700">Clientes satisfechos</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Respondidas</p>
              <p className="mt-2 text-2xl font-bold text-green-700">8</p>
              <p className="text-xs mt-1 text-green-700">De 13 reseñas</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Reportadas</p>
              <p className="mt-2 text-2xl font-bold text-red-700">1</p>
              <p className="text-xs mt-1 text-red-700">Requiere revisión</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="overflow-hidden border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{review.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold" style={{ color: '#000000' }}>{review.author}</p>
                      {review.verified && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200 font-semibold">
                          Compra Verificada
                        </span>
                      )}
                      {review.flagged && (
                        <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full border border-red-200 font-semibold">
                          <Flag className="h-3 w-3 inline mr-1" />
                          Reportada
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>{review.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex gap-1 justify-end mb-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: '#4A4A4A' }}>{review.rating}.0 / 5.0</p>
                </div>
              </div>

              {/* Product Reference */}
              <p className="text-sm mb-4 pb-4 border-b border-gray-200" style={{ color: '#4A4A4A' }}>
                <span className="font-medium">Producto:</span> {review.product}
              </p>

              {/* Review Comment */}
              <p className="mb-6" style={{ color: '#4A4A4A' }}>{review.comment}</p>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setExpandedReply(expandedReply === review.id ? null : review.id)}
                  variant="outline"
                  className="gap-2 border-gray-300 hover:bg-gray-50"
                  style={{ color: '#000000' }}
                >
                  <Reply className="h-4 w-4" />
                  Responder
                </Button>

                <button
                  onClick={() => handleFlag(review.id)}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    review.flagged
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Flag className="h-4 w-4" />
                  {review.flagged ? 'Reportada' : 'Reportar'}
                </button>
              </div>

              {/* Reply Section */}
              {expandedReply === review.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>Tu Respuesta</label>
                    <textarea
                      placeholder="Escribe una respuesta a esta reseña..."
                      rows={3}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-black focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                      style={{ '--tw-ring-color': '#0066FF' } as any}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      onClick={() => setExpandedReply(null)}
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50"
                      style={{ color: '#000000' }}
                    >
                      Cancelar
                    </Button>
                    <Button className="gap-2 text-white border-0 rounded-2xl hover:opacity-90 transition-all duration-200" style={{ backgroundColor: '#0066FF' }}>
                      Publicar Respuesta
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
