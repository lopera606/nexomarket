'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const FAVORITES = [
  {
    id: '1',
    name: 'Auriculares Inalámbricos Premium',
    price: 89.99,
    storeName: 'TechStore Pro',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
  },
  {
    id: '2',
    name: 'Mochila Impermeable 30L',
    price: 54.99,
    storeName: 'Adventure Gear',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop',
  },
  {
    id: '3',
    name: 'Lámpara LED Inteligente RGB',
    price: 42.50,
    storeName: 'HomeLight Solutions',
    image: 'https://images.unsplash.com/photo-1565636192335-14f6ce7ce288?w=80&h=80&fit=crop',
  },
  {
    id: '4',
    name: 'Cable Cargador USB-C 3m',
    price: 15.99,
    storeName: 'TechStore Pro',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=80&h=80&fit=crop',
  },
  {
    id: '5',
    name: 'Funda Protectora para Laptop 15"',
    price: 28.75,
    storeName: 'Tech Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop',
  },
  {
    id: '6',
    name: 'Teclado Mecánico RGB',
    price: 119.99,
    storeName: 'GamerZone Shop',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=80&h=80&fit=crop',
  },
];

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState(FAVORITES);
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleRemove = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const handleAddToCart = (product: typeof FAVORITES[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    // Show visual feedback
    setAddedItems(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItems(prev => {
        const updated = new Set(prev);
        updated.delete(product.id);
        return updated;
      });
    }, 2000);
  };

  if (favorites.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">Mis Favoritos</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">Guarda tus productos preferidos</p>
        </div>
        <Card className="p-8 sm:p-12 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-[#4A4A4A]" />
            <p className="mt-4 text-base sm:text-lg font-semibold text-[#4A4A4A]">No tienes favoritos</p>
            <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A]">Agrega productos a tu lista de favoritos para acceder rápidamente</p>
            <Button className="mt-6 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-2xl text-sm">
              Explorar Productos
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000000]">Mis Favoritos</h1>
        <p className="mt-1 text-xs sm:text-sm text-[#4A4A4A]">{favorites.length} artículos guardados</p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-[#FFFFFF] border border-gray-200 rounded-2xl sm:rounded-3xl" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
            <div className="aspect-square bg-[#FAFAFA] flex items-center justify-center relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-[#FFFFFF] rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 fill-red-500" />
              </button>
            </div>

            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-[#4A4A4A] truncate">{product.storeName}</p>
                <h3 className="font-semibold text-xs sm:text-sm text-[#000000] line-clamp-2">{product.name}</h3>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg sm:text-xl font-bold text-[#000000]">€{product.price.toFixed(2)}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddToCart(product)}
                  className={`flex-1 ${
                    addedItems.has(product.id)
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-[#0066FF] hover:bg-[#0052CC]'
                  } text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-colors duration-300`}
                >
                  {addedItems.has(product.id) ? (
                    <>
                      <span>✓ Añadido</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Carrito
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemove(product.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 rounded-xl sm:rounded-2xl"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
