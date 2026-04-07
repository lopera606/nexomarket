'use client';

import { useState, useEffect } from 'react';
import { Star, Flag, Reply, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewData {
  id: string;
  author: string;
  rating: number;
  title: string | null;
  body: string | null;
  product: string;
  isVerifiedPurchase: boolean;
  status: string;
  createdAt: string;
}

interface SummaryData {
  totalReviews: number;
  avgRating: number;
  ratingCounts: Record<number, number>;
}

export default function ReseniasPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedReply, setExpandedReply] = useState<string | null>(null);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/v2/vendedor/resenas');
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
          setSummary(data.summary || null);
        }
      } catch {
        console.error('Error fetching reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleFlag = (id: string) => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  const averageRating = summary?.avgRating?.toFixed(1) || '0.0';
  const totalReviews = summary?.totalReviews || 0;
  const ratingCounts = summary?.ratingCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const positiveCount = (ratingCounts[5] || 0) + (ratingCounts[4] || 0);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold" style={{ color: '#000000' }}>
          Resenas
        </h1>
        <p className="text-lg" style={{ color: '#4A4A4A' }}>Gestiona las resenas de tus clientes</p>
      </div>

      {totalReviews === 0 ? (
        <Card className="p-12 border border-gray-200 text-center" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin resenas todavia</h2>
          <p className="text-gray-500">Cuando tus clientes dejen resenas de tus productos, apareceran aqui.</p>
        </Card>
      ) : (
        <>
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
                        className={`h-6 w-6 ${i <= Math.round(Number(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm mt-2" style={{ color: '#4A4A4A' }}>Basado en {totalReviews} resenas</p>
                </div>

                {/* Rating Breakdown */}
                <div className="flex-1 space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingCounts[rating] || 0;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8" style={{ color: '#4A4A4A' }}>{rating}*</span>
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
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Resenas Positivas</p>
                  <p className="mt-2 text-2xl font-bold" style={{ color: '#0066FF' }}>{positiveCount}</p>
                  <p className="text-xs mt-1" style={{ color: '#0066FF' }}>({totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0}%)</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Promedio</p>
                  <p className="mt-2 text-2xl font-bold text-orange-700">{averageRating}/5</p>
                  <p className="text-xs mt-1 text-orange-700">Valoracion media</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total</p>
                  <p className="mt-2 text-2xl font-bold text-green-700">{totalReviews}</p>
                  <p className="text-xs mt-1 text-green-700">Resenas recibidas</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Reportadas</p>
                  <p className="mt-2 text-2xl font-bold text-red-700">{flagged.size}</p>
                  <p className="text-xs mt-1 text-red-700">Requiere revision</p>
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
                      <div className="text-3xl">
                        {review.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold" style={{ color: '#000000' }}>{review.author}</p>
                          {review.isVerifiedPurchase && (
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200 font-semibold">
                              Compra Verificada
                            </span>
                          )}
                          {flagged.has(review.id) && (
                            <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full border border-red-200 font-semibold">
                              <Flag className="h-3 w-3 inline mr-1" />
                              Reportada
                            </span>
                          )}
                        </div>
                        <p className="text-sm mt-1" style={{ color: '#4A4A4A' }}>
                          {new Date(review.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
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
                  {review.title && (
                    <p className="font-semibold mb-2" style={{ color: '#000000' }}>{review.title}</p>
                  )}
                  <p className="mb-6" style={{ color: '#4A4A4A' }}>{review.body || 'Sin comentario'}</p>

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
                        flagged.has(review.id)
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Flag className="h-4 w-4" />
                      {flagged.has(review.id) ? 'Reportada' : 'Reportar'}
                    </button>
                  </div>

                  {/* Reply Section */}
                  {expandedReply === review.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>Tu Respuesta</label>
                        <textarea
                          placeholder="Escribe una respuesta a esta resena..."
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
        </>
      )}
    </div>
  );
}
