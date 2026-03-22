'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Search,
  Star,
  Heart,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

interface TrendingSearch {
  id: string;
  term: string;
  searches: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

interface TrendingProduct {
  id: string;
  name: string;
  price: number;
  emoji: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  trendScore: number;
  searchVolume: number;
}

const trendingSearches: TrendingSearch[] = [
  {
    id: 'ts-1',
    term: 'iPhone 15 Pro Max',
    searches: 234512,
    trend: 'up',
    category: 'Electrónica',
  },
  {
    id: 'ts-2',
    term: 'MacBook Air M3',
    searches: 187643,
    trend: 'up',
    category: 'Informática',
  },
  {
    id: 'ts-3',
    term: 'AirPods Pro',
    searches: 156234,
    trend: 'up',
    category: 'Audio',
  },
  {
    id: 'ts-4',
    term: 'Samsung TV 65"',
    searches: 145892,
    trend: 'up',
    category: 'TV y Cine',
  },
  {
    id: 'ts-5',
    term: 'Monitor Gaming 4K',
    searches: 134567,
    trend: 'stable',
    category: 'Informática',
  },
  {
    id: 'ts-6',
    term: 'Smartwatch Deportivo',
    searches: 123456,
    trend: 'up',
    category: 'Relojes',
  },
  {
    id: 'ts-7',
    term: 'Laptop Gaming',
    searches: 112345,
    trend: 'down',
    category: 'Informática',
  },
  {
    id: 'ts-8',
    term: 'Auriculares Bluetooth',
    searches: 98765,
    trend: 'up',
    category: 'Audio',
  },
];

const trendingProducts: TrendingProduct[] = [
  {
    id: 'tp-1',
    name: 'Smartwatch Premium AI',
    price: 199.99,
    emoji: '⌚',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 5234,
    category: 'Relojes',
    trendScore: 98,
    searchVolume: 54321,
  },
  {
    id: 'tp-2',
    name: 'Auriculares Inalámbricos Active Noise',
    price: 149.99,
    emoji: '🎧',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 7892,
    category: 'Audio',
    trendScore: 95,
    searchVolume: 48765,
  },
  {
    id: 'tp-3',
    name: 'Monitor Gaming Ultrawide',
    price: 399.99,
    emoji: '🖥️',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 3456,
    category: 'Informática',
    trendScore: 92,
    searchVolume: 42156,
  },
  {
    id: 'tp-4',
    name: 'Cámara Digital Mirrorless',
    price: 799.99,
    emoji: '📷',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 2134,
    category: 'Fotografía',
    trendScore: 89,
    searchVolume: 38945,
  },
  {
    id: 'tp-5',
    name: 'Teclado Mecánico RGB',
    price: 129.99,
    emoji: '⌨️',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 4567,
    category: 'Informática',
    trendScore: 87,
    searchVolume: 35234,
  },
  {
    id: 'tp-6',
    name: 'Tablet Ultrafina 12"',
    price: 449.99,
    emoji: '📱',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 3321,
    category: 'Electrónica',
    trendScore: 85,
    searchVolume: 32156,
  },
  {
    id: 'tp-7',
    name: 'Powerbank Solar 20000mAh',
    price: 59.99,
    emoji: '🔋',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 6234,
    category: 'Accesorios',
    trendScore: 83,
    searchVolume: 29875,
  },
  {
    id: 'tp-8',
    name: 'Mochila Inteligente Antirrobo',
    price: 79.99,
    emoji: '🎒',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 5123,
    category: 'Accesorios',
    trendScore: 81,
    searchVolume: 26543,
  },
  {
    id: 'tp-9',
    name: 'Router WiFi 6E Ultra',
    price: 189.99,
    emoji: '📡',
    image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 2987,
    category: 'Informática',
    trendScore: 79,
    searchVolume: 23456,
  },
  {
    id: 'tp-10',
    name: 'Altavoz Bluetooth Premium',
    price: 99.99,
    emoji: '🔊',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 7654,
    category: 'Audio',
    trendScore: 77,
    searchVolume: 21234,
  },
  {
    id: 'tp-11',
    name: 'Webcam 4K Pro',
    price: 129.99,
    emoji: '📹',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf18c4b0c9?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 3421,
    category: 'Fotografía',
    trendScore: 75,
    searchVolume: 18765,
  },
  {
    id: 'tp-12',
    name: 'Lámpara LED Inteligente RGB',
    price: 49.99,
    emoji: '💡',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 4892,
    category: 'Hogar',
    trendScore: 73,
    searchVolume: 15432,
  },
];

export default function TendenciasPage() {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleAddToCart = (product: TrendingProduct) => {
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

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <TrendingUp className="w-7 sm:w-8 h-7 sm:h-8 text-[#FF6B35]" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
              Tendencias Ahora
            </h1>
          </div>
          <p className="text-gray-400">
            Descubre los productos y búsquedas más populares en este momento
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Trending Searches Section */}
        <section className="mb-8 sm:mb-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Search className="w-6 h-6 text-[#0066FF]400" />
              <h2 className="text-2xl font-bold text-black">
                Búsquedas Populares
              </h2>
            </div>
            <p className="text-gray-400">
              Los términos de búsqueda más activos en NexoMarket
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {trendingSearches.map((search, index) => (
              <Link
                key={search.id}
                href={`/search?q=${encodeURIComponent(search.term)}`}
                className="group"
              >
                <div className="bg-white rounded-lg border border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300 p-4 sm:p-6 hover:-translate-y-1 cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 sm:mb-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xl sm:text-2xl font-bold text-[#0066FF]400 min-w-[2rem]">
                          #{index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-black group-hover:text-[#0066FF]300 transition-colors">
                          {search.term}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-gray-400">
                          {search.searches.toLocaleString()} búsquedas
                        </span>
                        <span className="text-xs bg-blue-600/40 text-[#0066FF]300 px-2 py-1 rounded border border-gray-200/30">
                          {search.category}
                        </span>
                      </div>
                    </div>

                    {/* Trend Indicator */}
                    <div className="ml-0 sm:ml-4">
                      {search.trend === 'up' && (
                        <div className="flex items-center gap-1 text-green-400">
                          <TrendingUp className="w-5 h-5" />
                          <span className="text-sm font-semibold">Sube</span>
                        </div>
                      )}
                      {search.trend === 'down' && (
                        <div className="flex items-center gap-1 text-red-400">
                          <TrendingUp className="w-5 h-5 rotate-180" />
                          <span className="text-sm font-semibold">Baja</span>
                        </div>
                      )}
                      {search.trend === 'stable' && (
                        <div className="text-gray-400 text-sm font-semibold">
                          Estable
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300">
                    <div
                      className="bg-gradient-to-r from-gray-600 to-[#FF6B35] h-full transition-all duration-300"
                      style={{
                        width: `${(search.searches / 234512) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Products Section */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-2xl font-bold text-black">
                Productos en Tendencia
              </h2>
            </div>
            <p className="text-gray-400">
              Los productos más buscados y populares
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {trendingProducts.map((product) => (
              <TrendingProductCard
                key={product.id}
                product={product}
                isFavorite={isFavorite(product.id)}
                onFavoriteClick={() => handleToggleFavorite(product.id)}
                onAddToCart={() => handleAddToCart(product)}
                isAdded={addedItems.has(product.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

interface TrendingProductCardProps {
  product: TrendingProduct;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onAddToCart: () => void;
  isAdded: boolean;
}

function TrendingProductCard({
  product,
  isFavorite,
  onFavoriteClick,
  onAddToCart,
  isAdded,
}: TrendingProductCardProps) {
  return (
    <Link href={`/producto/${product.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 overflow-hidden group h-full hover:-translate-y-1 cursor-pointer">
        {/* Image */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-[#5B2FE8] to-gray-600 flex items-center justify-center overflow-hidden">
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Trend Badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-black font-bold px-3 py-1 rounded-full text-sm z-10 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            #{product.trendScore}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavoriteClick();
            }}
            className="absolute bottom-3 right-3 bg-white text-black p-2 rounded-full hover:bg-gray-100 transition-colors z-10 border border-gray-300"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? 'fill-[#FF6B35] text-[#FF6B35]'
                  : 'text-black'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-black mb-2 line-clamp-2 group-hover:text-[#0066FF]300 transition-colors">
            {product.name}
          </h3>

          {/* Category */}
          <div className="mb-2">
            <span className="text-xs bg-blue-600/40 text-[#0066FF]300 px-2 py-1 rounded border border-gray-200/30">
              {product.category}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              ({product.reviews.toLocaleString()})
            </span>
          </div>

          {/* Search Volume */}
          <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Search className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-400">
                {product.searchVolume.toLocaleString()} búsquedas
              </span>
            </div>
          </div>

          {/* Price and Button */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              {product.price.toFixed(2)}€
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart();
              }}
              className={`${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-gray-500 to-pink-500 text-black'
              } p-2.5 sm:p-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110 min-h-[44px] flex items-center justify-center`}
            >
              {isAdded ? (
                <span className="text-sm font-semibold">✓ Añadido</span>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
