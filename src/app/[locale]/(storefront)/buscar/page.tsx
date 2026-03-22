'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import {
  Search, Star, Grid3X3, List, SlidersHorizontal, X, ChevronDown,
  ShoppingCart, Heart, ArrowUpDown, ChevronRight, Filter, Check,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

// ────── Mock Data ──────
const ALL_CATEGORIES = [
  {
    id: 'electronics', name: 'Electrónica', count: 2543,
    subcategories: [
      { id: 'phones', name: 'Móviles', count: 845 },
      { id: 'tablets', name: 'Tablets', count: 432 },
      { id: 'accessories', name: 'Accesorios', count: 621 },
      { id: 'chargers', name: 'Cargadores', count: 312 },
      { id: 'headphones', name: 'Auriculares', count: 333 },
    ],
  },
  {
    id: 'fashion', name: 'Moda', count: 5421,
    subcategories: [
      { id: 'men', name: 'Hombre', count: 1823 },
      { id: 'women', name: 'Mujer', count: 2134 },
      { id: 'kids', name: 'Niños', count: 967 },
      { id: 'shoes', name: 'Calzado', count: 497 },
    ],
  },
  {
    id: 'home', name: 'Hogar y Cocina', count: 3892,
    subcategories: [
      { id: 'furniture', name: 'Muebles', count: 1234 },
      { id: 'decor', name: 'Decoración', count: 876 },
      { id: 'kitchen', name: 'Cocina', count: 982 },
      { id: 'lighting', name: 'Iluminación', count: 800 },
    ],
  },
  {
    id: 'sports', name: 'Deportes', count: 2156,
    subcategories: [
      { id: 'fitness', name: 'Fitness', count: 654 },
      { id: 'running', name: 'Running', count: 432 },
      { id: 'cycling', name: 'Ciclismo', count: 321 },
      { id: 'outdoor', name: 'Outdoor', count: 749 },
    ],
  },
  {
    id: 'computing', name: 'Informática', count: 2198,
    subcategories: [
      { id: 'laptops', name: 'Portátiles', count: 534 },
      { id: 'components', name: 'Componentes', count: 876 },
      { id: 'peripherals', name: 'Periféricos', count: 432 },
      { id: 'storage', name: 'Almacenamiento', count: 356 },
    ],
  },
  {
    id: 'beauty', name: 'Belleza', count: 4231,
    subcategories: [
      { id: 'skincare', name: 'Cuidado Piel', count: 1456 },
      { id: 'makeup', name: 'Maquillaje', count: 1345 },
      { id: 'fragrances', name: 'Fragancias', count: 876 },
      { id: 'haircare', name: 'Cabello', count: 554 },
    ],
  },
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Xiaomi', 'Nike', 'Adidas', 'Dyson', 'Philips', 'LG', 'Bose'];

const EMOJIS = ['🎧', '📱', '💻', '👟', '📺', '🎮', '⌚', '🧹', '👗', '🏠', '🔌', '🔋', '💾', '🛡️', '📷', '🖥️', '🎒', '👔', '🧴', '💄'];

const PRODUCT_IMAGES_SEARCH = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', // laptop
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', // phone
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', // headphones
  'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', // watch
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', // camera
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', // tv
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', // tablet
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', // speaker
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', // gaming
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', // shoes
  'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop', // keyboard
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', // backpack
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', // sofa
  'https://images.unsplash.com/photo-1517836357463-d25ddfcf2d8b?w=400&h=400&fit=crop', // dumbbells
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', // books
  'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop', // gaming console
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', // beauty
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop', // food
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', // computer
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', // shoes 2
];

function generateMockProducts(query: string, count: number) {
  const brands = BRANDS;
  const adjectives = ['Premium', 'Pro', 'Ultra', 'Deluxe', 'Sport', 'Classic', 'Lite', 'Max', 'Plus', 'Elite', 'Smart', 'Mini'];
  const products = [];
  for (let i = 0; i < count; i++) {
    const price = Math.round((Math.random() * 800 + 10) * 100) / 100;
    const hasDiscount = Math.random() > 0.4;
    const discount = hasDiscount ? Math.floor(Math.random() * 45) + 5 : 0;
    const oldPrice = hasDiscount ? Math.round(price / (1 - discount / 100) * 100) / 100 : null;
    const brand = brands[i % brands.length];
    const categoryIndex = i % ALL_CATEGORIES.length;
    const category = ALL_CATEGORIES[categoryIndex];
    const subIndex = i % category.subcategories.length;
    products.push({
      id: `prod-${i + 1}`,
      name: `${adjectives[i % adjectives.length]} ${brand} ${query || 'Producto'} ${i + 1}`,
      brand,
      price,
      oldPrice,
      discount,
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
      reviews: Math.floor(Math.random() * 2000) + 10,
      totalSold: Math.floor(Math.random() * 5000),
      emoji: EMOJIS[i % EMOJIS.length],
      image: PRODUCT_IMAGES_SEARCH[i % PRODUCT_IMAGES_SEARCH.length],
      category: category.id,
      categoryName: category.name,
      subcategory: category.subcategories[subIndex].id,
      subcategoryName: category.subcategories[subIndex].name,
      isFeatured: Math.random() > 0.8,
      badge: i < 2 ? 'Más vendido' : i === 3 ? 'Oferta' : null,
    });
  }
  return products;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSubcategory = searchParams.get('subcategory') || '';
  const initialSort = searchParams.get('sort') || 'relevancia';
  const initialMinPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0;
  const initialMaxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 1000;
  const initialRating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : 0;
  const initialBrand = searchParams.get('brand') || '';

  const [query, setQuery] = useState(initialQuery);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(initialSubcategory ? [initialSubcategory] : []);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialRating);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [sortBy, setSortBy] = useState(initialSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);

  const ITEMS_PER_PAGE = 24;
  const allProducts = useMemo(() => generateMockProducts(query, 96), [query]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (selectedCategories.length > 0) result = result.filter((p) => selectedCategories.includes(p.category));
    if (selectedSubcategories.length > 0) result = result.filter((p) => selectedSubcategories.includes(p.subcategory));
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);
    if (selectedBrands.length > 0) result = result.filter((p) => selectedBrands.includes(p.brand));
    switch (sortBy) {
      case 'precio-asc': result.sort((a, b) => a.price - b.price); break;
      case 'precio-desc': result.sort((a, b) => b.price - a.price); break;
      case 'valoracion': result.sort((a, b) => b.rating - a.rating); break;
      case 'novedades': result.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1])); break;
      case 'ventas': result.sort((a, b) => b.totalSold - a.totalSold); break;
      default: break;
    }
    return result;
  }, [allProducts, selectedCategories, selectedSubcategories, minPrice, maxPrice, minRating, selectedBrands, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const updateURL = useCallback((newQuery?: string) => {
    const params = new URLSearchParams();
    const q = newQuery !== undefined ? newQuery : query;
    if (q) params.set('q', q);
    if (selectedCategories.length) params.set('category', selectedCategories[0]);
    if (selectedSubcategories.length) params.set('subcategory', selectedSubcategories[0]);
    if (minPrice > 0) params.set('minPrice', String(minPrice));
    if (maxPrice < 1000) params.set('maxPrice', String(maxPrice));
    if (minRating > 0) params.set('rating', String(minRating));
    if (selectedBrands.length) params.set('brand', selectedBrands[0]);
    if (sortBy !== 'relevancia') params.set('sort', sortBy);
    const paramString = params.toString();
    router.replace(`${pathname}${paramString ? '?' + paramString : ''}`, { scroll: false });
  }, [query, selectedCategories, selectedSubcategories, minPrice, maxPrice, minRating, selectedBrands, sortBy, pathname, router]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setQuery(searchInput); setCurrentPage(1); updateURL(searchInput); };
  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) => prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]);
    setExpandedCategories((prev) => prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]);
    setSelectedSubcategories([]); setCurrentPage(1);
  };
  const toggleSubcategory = (subId: string) => { setSelectedSubcategories((prev) => prev.includes(subId) ? prev.filter((s) => s !== subId) : [...prev, subId]); setCurrentPage(1); };
  const toggleBrand = (brand: string) => { setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]); setCurrentPage(1); };
  const clearFilters = () => { setSelectedCategories([]); setSelectedSubcategories([]); setMinPrice(0); setMaxPrice(1000); setMinRating(0); setSelectedBrands([]); setSortBy('relevancia'); setCurrentPage(1); };

  // Update URL whenever filters change
  useEffect(() => {
    updateURL();
  }, [selectedCategories, selectedSubcategories, minPrice, maxPrice, minRating, selectedBrands, sortBy, updateURL]);

  const handleAddToCart = (e: React.MouseEvent, product: { id: any; name: string; price: number }) => {
    e.preventDefault(); e.stopPropagation();
    addToCart({ id: String(product.id), name: product.name, price: product.price });
    setAddedToCart(String(product.id)); setTimeout(() => setAddedToCart(null), 1500);
  };
  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(productId); };

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || minPrice > 0 || maxPrice < 1000 || minRating > 0 || selectedBrands.length > 0;

  const activeFilterChips = [
    ...selectedCategories.map((c) => ({ label: ALL_CATEGORIES.find((cat) => cat.id === c)?.name || c, onRemove: () => toggleCategory(c) })),
    ...selectedSubcategories.map((s) => { const sub = ALL_CATEGORIES.flatMap((c) => c.subcategories).find((sc) => sc.id === s); return { label: sub?.name || s, onRemove: () => toggleSubcategory(s) }; }),
    ...selectedBrands.map((b) => ({ label: b, onRemove: () => toggleBrand(b) })),
    ...(minRating > 0 ? [{ label: `${minRating}+ estrellas`, onRemove: () => setMinRating(0) }] : []),
    ...(minPrice > 0 || maxPrice < 1000 ? [{ label: `€${minPrice} - €${maxPrice}`, onRemove: () => { setMinPrice(0); setMaxPrice(1000); } }] : []),
  ];

  const FiltersPanel = () => (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-black flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" /> Filtros
        </h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-[#0066FF] hover:text-[#0052CC] font-medium">
            Limpiar todo
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-black">Categorías</label>
        <div className="space-y-1">
          {ALL_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => toggleCategory(cat.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  selectedCategories.includes(cat.id)
                    ? 'bg-[#0066FF]/8 text-[#0066FF] font-medium'
                    : 'hover:bg-gray-50 text-[#4A4A4A]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedCategories.includes(cat.id) ? 'bg-[#0066FF] border-[#0066FF]' : 'border-gray-300'
                  }`}>
                    {selectedCategories.includes(cat.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  {cat.name}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">{cat.count}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expandedCategories.includes(cat.id) ? 'rotate-180' : ''}`} />
                </span>
              </button>
              {expandedCategories.includes(cat.id) && (
                <div className="ml-7 mt-1 space-y-0.5">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => toggleSubcategory(sub.id)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                        selectedSubcategories.includes(sub.id) ? 'bg-[#0066FF]/8 text-[#0066FF]' : 'hover:bg-gray-50 text-[#4A4A4A]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedSubcategories.includes(sub.id) ? 'bg-[#0066FF] border-[#0066FF]' : 'border-gray-300'
                        }`}>
                          {selectedSubcategories.includes(sub.id) && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        {sub.name}
                      </span>
                      <span className="text-gray-400">{sub.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-black">Precio</label>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-gray-50 rounded-xl pl-7 pr-2 py-2.5 text-sm text-black focus:ring-2 focus:ring-[#0066FF]/20 focus:outline-none transition-all duration-200" placeholder="Mín" />
            </div>
            <span className="text-gray-300 text-sm">—</span>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(0, parseInt(e.target.value) || 1000))}
                className="w-full bg-gray-50 rounded-xl pl-7 pr-2 py-2.5 text-sm text-black focus:ring-2 focus:ring-[#0066FF]/20 focus:outline-none transition-all duration-200" placeholder="Máx" />
            </div>
          </div>
          <input type="range" min="0" max="1000" step="10" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="w-full accent-[#0066FF]" />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-black">Valoración</label>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((stars) => (
            <button key={stars} onClick={() => setMinRating(minRating === stars ? 0 : stars)}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                minRating === stars ? 'bg-[#0066FF]/8 text-[#0066FF]' : 'hover:bg-gray-50 text-[#4A4A4A]'
              }`}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-xs text-gray-400">y más</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-black">Marca</label>
        <div className="space-y-1">
          {BRANDS.slice(0, 8).map((brand) => (
            <button key={brand} onClick={() => toggleBrand(brand)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                selectedBrands.includes(brand) ? 'bg-[#0066FF]/8 text-[#0066FF] font-medium' : 'hover:bg-gray-50 text-[#4A4A4A]'
              }`}>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                selectedBrands.includes(brand) ? 'bg-[#0066FF] border-[#0066FF]' : 'border-gray-300'
              }`}>
                {selectedBrands.includes(brand) && <Check className="w-3 h-3 text-white" />}
              </div>
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="border-b border-gray-100 sticky top-[72px] z-30 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Buscar productos, marcas, tiendas..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-gray-50 text-black placeholder-gray-400 rounded-2xl pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 transition-all duration-200" />
              {searchInput && (
                <button type="button" onClick={() => { setSearchInput(''); setQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit" className="bg-[#0066FF] hover:bg-[#0052CC] px-4 sm:px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-200 text-sm sm:text-base whitespace-nowrap min-h-[44px]">
              Buscar
            </button>
            <button type="button" onClick={() => setShowMobileFilters(true)} className="lg:hidden bg-gray-50 px-3 py-3 rounded-2xl hover:bg-gray-100 transition-all duration-200">
              <Filter className="w-5 h-5 text-[#4A4A4A]" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-[#4A4A4A] mb-6">
          <Link href="/" className="hover:text-[#0066FF] transition-colors duration-200">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-medium">{query ? `Resultados para "${query}"` : 'Buscar productos'}</span>
        </nav>

        {/* Active filter chips */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilterChips.map((chip, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0066FF]/8 text-[#0066FF] rounded-full text-xs font-medium">
                {chip.label}
                <button onClick={chip.onRemove} className="hover:text-[#0052CC] transition-colors"><X className="w-3 h-3" /></button>
              </span>
            ))}
            <button onClick={clearFilters} className="text-xs text-[#0066FF] hover:text-[#0052CC] font-medium px-2 py-1.5">Limpiar todos</button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 sticky top-[140px]" style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.04)' }}>
              <FiltersPanel />
            </div>
          </div>

          {/* Mobile filters */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-full sm:w-80 bg-white overflow-y-auto p-4 sm:p-6" style={{ boxShadow: '-8px 0 60px rgba(0,0,0,0.08)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-black">Filtros</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-black transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <FiltersPanel />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="text-xl font-bold text-black">{query ? `"${query}"` : 'Todos los productos'}</h1>
                <p className="text-sm text-[#4A4A4A] mt-0.5">{filteredProducts.length.toLocaleString()} productos encontrados</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="bg-transparent text-sm text-black focus:outline-none cursor-pointer">
                    <option value="relevancia">Relevancia</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                    <option value="valoracion">Mejor valoración</option>
                    <option value="novedades">Novedades</option>
                    <option value="ventas">Más vendidos</option>
                  </select>
                </div>
                <div className="flex bg-gray-50 rounded-2xl overflow-hidden">
                  <button onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-all duration-200 ${viewMode === 'grid' ? 'bg-[#0066FF] text-white' : 'text-gray-400 hover:text-black'}`}>
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-all duration-200 ${viewMode === 'list' ? 'bg-[#0066FF] text-white' : 'text-gray-400 hover:text-black'}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {paginatedProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5' : 'space-y-3 sm:space-y-4'}>
                {paginatedProducts.map((product) => (
                  <Link key={product.id} href={`/productos/${product.id}`}
                    className={viewMode === 'grid'
                      ? 'group bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-200'
                      : 'group flex gap-5 bg-white rounded-2xl p-5 hover:scale-[1.01] transition-all duration-200'
                    }
                    style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative aspect-square bg-[#FAFAFA] flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{product.emoji}</div>
                          )}
                          {product.badge && (
                            <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-xl bg-black text-white">{product.badge}</span>
                          )}
                          {product.discount > 0 && (
                            <span className="absolute top-3 right-3 bg-[#0066FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-xl">-{product.discount}%</span>
                          )}
                          <button onClick={(e) => handleToggleFavorite(e, String(product.id))}
                            className="absolute bottom-3 right-3 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                            <Heart className={`w-4 h-4 ${isFavorite(String(product.id)) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </button>
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wide">{product.brand}</p>
                          <h3 className="font-bold text-sm text-black mt-1 line-clamp-2 leading-snug">{product.name}</h3>
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400">({product.reviews})</span>
                          </div>
                          <div className="flex items-baseline gap-2 mt-2.5">
                            <span className="font-extrabold text-lg text-black">€{product.price.toFixed(2)}</span>
                            {product.oldPrice && <span className="text-xs text-gray-400 line-through">€{product.oldPrice.toFixed(2)}</span>}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">{product.categoryName} › {product.subcategoryName}</p>
                          <button onClick={(e) => handleAddToCart(e, product)}
                            className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 md:py-3 font-bold text-xs sm:text-sm rounded-2xl transition-all duration-200 min-h-[44px] ${
                              addedToCart === product.id ? 'bg-green-500 text-white' : 'bg-[#0066FF] hover:bg-[#0052CC] text-white'
                            }`}>
                            {addedToCart === product.id ? <><Check className="w-3.5 h-3.5" /> Añadido</> : <><ShoppingCart className="w-3.5 h-3.5" /> Añadir</>}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-28 h-28 flex-shrink-0 bg-[#FAFAFA] rounded-2xl flex items-center justify-center relative overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl">{product.emoji}</span>
                          )}
                          {product.discount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-[#0066FF] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg">-{product.discount}%</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-[#0066FF] uppercase">{product.brand}</p>
                          <h3 className="font-bold text-black mt-0.5">{product.name}</h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">({product.reviews})</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="font-extrabold text-xl text-black">€{product.price.toFixed(2)}</span>
                            {product.oldPrice && <span className="text-sm text-gray-400 line-through">€{product.oldPrice.toFixed(2)}</span>}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{product.categoryName} › {product.subcategoryName}</p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col gap-2 self-center">
                          <button onClick={(e) => handleAddToCart(e, product)}
                            className={`px-4 sm:px-5 py-2.5 md:py-3 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all duration-200 min-h-[44px] flex items-center justify-center ${
                              addedToCart === product.id ? 'bg-green-500' : 'bg-[#0066FF] hover:bg-[#0052CC]'
                            }`}>
                            {addedToCart === product.id ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                          </button>
                          <button onClick={(e) => handleToggleFavorite(e, String(product.id))}
                            className={`px-4 sm:px-5 py-2.5 md:py-3 rounded-2xl text-xs sm:text-sm transition-all duration-200 min-h-[44px] flex items-center justify-center ${
                              isFavorite(String(product.id)) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}>
                            <Heart className={`w-4 h-4 ${isFavorite(String(product.id)) ? 'fill-red-500' : ''}`} />
                          </button>
                        </div>
                      </>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-black mb-2">No se encontraron productos</h2>
                <p className="text-[#4A4A4A] mb-6">Intenta con otros filtros o términos de búsqueda</p>
                <button onClick={clearFilters} className="px-6 py-3 bg-[#0066FF] text-white font-semibold rounded-2xl hover:bg-[#0052CC] transition-all duration-200">
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                  className="px-5 py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium text-[#4A4A4A]">
                  ← Anterior
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let page: number;
                  if (totalPages <= 5) page = i + 1;
                  else if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                  return (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-2xl text-sm font-bold transition-all duration-200 ${
                        currentPage === page ? 'bg-[#0066FF] text-white' : 'bg-gray-50 text-[#4A4A4A] hover:bg-gray-100'
                      }`}>
                      {page}
                    </button>
                  );
                })}
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                  className="px-5 py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium text-[#4A4A4A]">
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
