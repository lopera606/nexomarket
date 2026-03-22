'use client';

import { useState } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  productName: string;
  productImage: string;
  rating: number;
  date: string;
  text: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    productName: 'Auriculares Inalámbricos Premium',
    productImage: '🎧',
    rating: 5,
    date: '2024-03-10',
    text: 'Excelente producto. La calidad de sonido es increíble y la batería dura mucho. Muy recomendado para quien busca auriculares de calidad.',
  },
  {
    id: '2',
    productName: 'Mochila Impermeable 30L',
    productImage: '🎒',
    rating: 4,
    date: '2024-03-05',
    text: 'Muy buena mochila. Resistente y con buen almacenamiento. El único detalle es que el cierre es un poco difícil al principio.',
  },
  {
    id: '3',
    productName: 'Cable Cargador USB-C 3m',
    productImage: '🔌',
    rating: 4,
    date: '2024-02-28',
    text: 'Cable de buena calidad. Funciona perfectamente y la longitud es adecuada. Llegó rápido y bien empaquetado.',
  },
];

function StarRating({ rating, readonly = true }: { rating: number; readonly?: boolean }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function ResenaPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#000000]">Mis Reseñas</h1>
        <p className="mt-1 text-[#4A4A4A]">Reseñas que has escrito sobre productos</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-[#FFFFFF] border border-gray-200 rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <div className="p-6 space-y-4">
              {/* Product Header */}
              <div className="flex gap-4">
                <div className="aspect-square w-16 h-16 bg-[#FAFAFA] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border border-gray-200">
                  {review.productImage}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#000000]">{review.productName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-[#4A4A4A]">({review.rating}.0)</span>
                  </div>
                  <p className="text-xs text-[#4A4A4A] mt-1">{formatDate(review.date)}</p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-[#4A4A4A] leading-relaxed">{review.text}</p>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="flex-1 border-gray-200 text-[#000000] hover:bg-gray-50 rounded-2xl">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(review.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 rounded-2xl"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card className="p-12 bg-[#FFFFFF] border border-gray-200 rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="text-center">
            <Star className="mx-auto h-16 w-16 text-[#4A4A4A]" />
            <p className="mt-4 text-lg font-semibold text-[#4A4A4A]">No tienes reseñas</p>
            <p className="mt-2 text-[#4A4A4A]">Las reseñas que escribas aparecerán aquí</p>
          </div>
        </Card>
      )}
    </div>
  );
}
