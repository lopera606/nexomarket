'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Clock,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  X,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

interface Product {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  emoji: string;
  image?: string;
  rating: number;
  reviews: number;
  category: string;
  timeLeft?: string;
}

const flashDeals: Product[] = [
  {
    id: 'flash-1',
    name: 'Smartwatch Premium',
    originalPrice: 299.99,
    salePrice: 149.99,
    discount: 50,
    emoji: '⌚',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 2341,
    category: 'Electrónica',
    timeLeft: '2h 45m',
  },
  {
    id: 'flash-2',
    name: 'Auriculares Bluetooth',
    originalPrice: 189.99,
    salePrice: 89.99,
    discount: 53,
    emoji: '🎧',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 1852,
    category: 'Audio',
    timeLeft: '4h 12m',
  },
  {
    id: 'flash-3',
    name: 'Cámara Digital',
    originalPrice: 799.99,
    salePrice: 549.99,
    discount: 31,
    emoji: '📷',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 892,
    category: 'Fotografía',
    timeLeft: '1h 30m',
  },
  {
    id: 'flash-4',
    name: 'Tablet Ultrafina',
    originalPrice: 599.99,
    salePrice: 399.99,
    discount: 33,
    emoji: '📱',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 1523,
    category: 'Electrónica',
    timeLeft: '3h 20m',
  },
];

const regularOffers: Product[] = [
  {
    id: 'offer-1',
    name: 'Monitor Gaming 4K',
    originalPrice: 449.99,
    salePrice: 349.99,
    discount: 22,
    emoji: '🖥️',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 634,
    category: 'Informática',
  },
  {
    id: 'offer-2',
    name: 'Teclado Mecánico RGB',
    originalPrice: 129.99,
    salePrice: 89.99,
    discount: 31,
    emoji: '⌨️',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 1125,
    category: 'Informática',
  },
  {
    id: 'offer-3',
    name: 'Ratón Inalámbrico',
    originalPrice: 59.99,
    salePrice: 34.99,
    discount: 42,
    emoji: '🖱️',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    rating: 4.4,
    reviews: 2015,
    category: 'Informática',
  },
  {
    id: 'offer-4',
    name: 'Cable USB-C Premium',
    originalPrice: 39.99,
    salePrice: 19.99,
    discount: 50,
    emoji: '🔌',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 3242,
    category: 'Accesorios',
  },
  {
    id: 'offer-5',
    name: 'Mochila Laptop',
    originalPrice: 79.99,
    salePrice: 49.99,
    discount: 37,
    emoji: '🎒',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 856,
    category: 'Accesorios',
  },
  {
    id: 'offer-6',
    name: 'Powerbank Rápido',
    originalPrice: 69.99,
    salePrice: 44.99,
    discount: 36,
    emoji: '🔋',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 2543,
    category: 'Accesorios',
  },
  {
    id: 'offer-7',
    name: 'Lámpara LED Inteligente',
    originalPrice: 89.99,
    salePrice: 59.99,
    discount: 33,
    emoji: '💡',
    image: 'https://images.unsplash.com/photo-1565636192335-14c0d48fbb35?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 1234,
    category: 'Hogar',
  },
  {
    id: 'offer-8',
    name: 'Altavoz Portátil',
    originalPrice: 119.99,
    salePrice: 79.99,
    discount: 33,
    emoji: '🔊',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 1876,
    category: 'Audio',
  },
];

export default function OfertasPage() {
  const [discountFilter, setDiscountFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize hooks
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filterProducts = (products: Product[]) => {
    return products.filter((product) => {
      if (discountFilter && product.discount < discountFilter) {
        return false;
      }
      if (categoryFilter && product.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  };

  const filteredFlashDeals = filterProducts(flashDeals);
  const filteredOffers = filterProducts(regularOffers);

  const categories = Array.from(
    new Set([...flashDeals, ...regularOffers].map((p) => p.category))
  ).sort();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 sm:mb-6 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black flex items-center gap-2 sm:gap-3">
                <Zap className="w-8 h-8 text-[#FF6B35]" />
                <span>
                  Ofertas y <span className="text-[#0066FF]400">Descuentos</span>
                </span>
              </h1>
              <p className="text-gray-400 mt-2">
                Descubre nuestras mejores ofertas de hoy
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 bg-blue-600 text-black px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? 'block' : 'hidden'
            } lg:block`}
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-black">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Discount Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-black mb-4">
                  Descuento Mínimo
                </h4>
                <div className="space-y-3">
                  {[20, 30, 40, 50].map((discount) => (
                    <label
                      key={discount}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      <input
                        type="radio"
                        name="discount"
                        value={discount}
                        checked={discountFilter === discount}
                        onChange={(e) =>
                          setDiscountFilter(
                            e.target.checked ? parseInt(e.target.value) : null
                          )
                        }
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-gray-300">
                        {discount}% o más
                      </span>
                    </label>
                  ))}
                  {discountFilter && (
                    <button
                      onClick={() => setDiscountFilter(null)}
                      className="text-sm text-[#0066FF]400 hover:text-[#FF6B35] transition-colors mt-2"
                    >
                      Limpiar filtro
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="font-semibold text-black mb-4">Categoría</h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={categoryFilter === category}
                        onChange={(e) =>
                          setCategoryFilter(
                            e.target.checked ? e.target.value : null
                          )
                        }
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-gray-300">{category}</span>
                    </label>
                  ))}
                  {categoryFilter && (
                    <button
                      onClick={() => setCategoryFilter(null)}
                      className="text-sm text-[#0066FF]400 hover:text-[#FF6B35] transition-colors mt-2"
                    >
                      Limpiar filtro
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 space-y-12">
            {/* Flash Deals Section */}
            {filteredFlashDeals.length > 0 && (
              <section>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-[#FF6B35]" />
                    <h2 className="text-2xl font-bold text-black">
                      Ofertas Relámpago
                    </h2>
                  </div>
                  <p className="text-gray-400">
                    Ofertas especiales con tiempo limitado
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  {filteredFlashDeals.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={isFavorite(product.id)}
                      onFavoriteClick={() => toggleFavorite(product.id)}
                      onAddToCart={addToCart}
                      isFlashDeal={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Offers Section */}
            {filteredOffers.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Todas las Ofertas
                  </h2>
                  <p className="text-gray-400">
                    Productos seleccionados con descuento
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {filteredOffers.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={isFavorite(product.id)}
                      onFavoriteClick={() => toggleFavorite(product.id)}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredFlashDeals.length === 0 && filteredOffers.length === 0 && (
              <div className="text-center py-16">
                <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  No se encontraron ofertas con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onAddToCart: (product: { id: string; name: string; price: number; image?: string }) => void;
  isFlashDeal?: boolean;
}

function ProductCard({
  product,
  isFavorite,
  onFavoriteClick,
  onAddToCart,
  isFlashDeal = false,
}: ProductCardProps) {
  const [cartAdded, setCartAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice,
      image: product.image,
    });

    // Show confirmation feedback
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  return (
    <Link href={`/producto/${product.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 overflow-hidden group h-full hover:-translate-y-1 cursor-pointer">
        {/* Image and Badge */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-[#5B2FE8] to-gray-600 flex items-center justify-center overflow-hidden">
          {/* Product Image or Emoji */}
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
              {product.emoji}
            </div>
          )}

          {/* Discount Badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FF6B35] to-orange-500 text-black font-bold px-3 py-1 rounded-full text-sm z-10">
            -{product.discount}%
          </div>

          {/* Flash Deal Badge */}
          {isFlashDeal && (
            <div className="absolute top-3 right-3 bg-red-600 text-black font-bold px-2 py-1 rounded-full text-xs z-10 flex items-center gap-1 animate-pulse">
              <Clock className="w-3 h-3" />
              {product.timeLeft}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavoriteClick();
            }}
            className="absolute bottom-3 right-3 bg-white text-black p-2 rounded-full hover:bg-gray-100 transition-colors z-10 border border-gray-200"
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

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
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

          {/* Prices */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {product.salePrice.toFixed(2)}€
              </span>
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice.toFixed(2)}€
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 min-h-[44px] ${
              cartAdded
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-gray-500 to-pink-500 text-black'
            }`}
          >
            {cartAdded ? (
              <>
                <span className="text-xl">✓</span>
                Añadido
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Añadir al carrito
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
