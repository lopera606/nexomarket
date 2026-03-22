'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import {
  Smartphone, Shirt, Sofa, Dumbbell, Book, Gamepad2, Sparkles,
  ShoppingCart, Cpu, Headphones, Watch, Camera, Tv, Baby, Leaf,
  PawPrint, Hammer, Heart, Briefcase, Car, Search, ChevronRight,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  image?: string;
  productCount: number;
  subcategories: { id: string; name: string; count: number }[];
  gradient: string;
}

const categories: Category[] = [
  {
    id: 'electronics', name: 'Electrónica', icon: <Smartphone className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', productCount: 2543,
    subcategories: [
      { id: 'phones', name: 'Móviles', count: 845 },
      { id: 'tablets', name: 'Tablets', count: 432 },
      { id: 'accessories', name: 'Accesorios', count: 621 },
      { id: 'chargers', name: 'Cargadores', count: 312 },
      { id: 'headphones-cat', name: 'Auriculares', count: 333 },
    ],
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'fashion', name: 'Moda', icon: <Shirt className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop', productCount: 5421,
    subcategories: [
      { id: 'men', name: 'Hombre', count: 1823 },
      { id: 'women', name: 'Mujer', count: 2134 },
      { id: 'kids', name: 'Niños', count: 967 },
      { id: 'shoes', name: 'Calzado', count: 497 },
    ],
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'home', name: 'Hogar y Cocina', icon: <Sofa className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=300&fit=crop', productCount: 3892,
    subcategories: [
      { id: 'furniture', name: 'Muebles', count: 1234 },
      { id: 'decor', name: 'Decoración', count: 876 },
      { id: 'kitchen', name: 'Cocina', count: 982 },
      { id: 'lighting', name: 'Iluminación', count: 800 },
    ],
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'sports', name: 'Deportes', icon: <Dumbbell className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcb6a?w=400&h=300&fit=crop', productCount: 2156,
    subcategories: [
      { id: 'fitness', name: 'Fitness', count: 654 },
      { id: 'running', name: 'Running', count: 432 },
      { id: 'cycling', name: 'Ciclismo', count: 321 },
      { id: 'outdoor', name: 'Outdoor', count: 749 },
    ],
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'books', name: 'Libros', icon: <Book className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop', productCount: 1834,
    subcategories: [
      { id: 'fiction', name: 'Ficción', count: 678 },
      { id: 'nonfiction', name: 'No Ficción', count: 534 },
      { id: 'children', name: 'Infantil', count: 321 },
      { id: 'academic', name: 'Académico', count: 301 },
    ],
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'games', name: 'Videojuegos', icon: <Gamepad2 className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop', productCount: 987,
    subcategories: [
      { id: 'ps5', name: 'PS5', count: 234 },
      { id: 'xbox', name: 'Xbox', count: 198 },
      { id: 'nintendo', name: 'Nintendo', count: 276 },
      { id: 'pc-gaming', name: 'PC Gaming', count: 279 },
    ],
    gradient: 'from-blue-500 to-fuchsia-500',
  },
  {
    id: 'beauty', name: 'Belleza', icon: <Sparkles className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', productCount: 4231,
    subcategories: [
      { id: 'skincare', name: 'Cuidado Piel', count: 1456 },
      { id: 'makeup', name: 'Maquillaje', count: 1345 },
      { id: 'fragrances', name: 'Fragancias', count: 876 },
      { id: 'haircare', name: 'Cabello', count: 554 },
    ],
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    id: 'groceries', name: 'Supermercado', icon: <ShoppingCart className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop', productCount: 6543,
    subcategories: [
      { id: 'fresh', name: 'Frescos', count: 2134 },
      { id: 'drinks', name: 'Bebidas', count: 1456 },
      { id: 'snacks', name: 'Snacks', count: 987 },
      { id: 'cleaning', name: 'Limpieza', count: 1966 },
    ],
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'computing', name: 'Informática', icon: <Cpu className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', productCount: 2198,
    subcategories: [
      { id: 'laptops', name: 'Portátiles', count: 534 },
      { id: 'components', name: 'Componentes', count: 876 },
      { id: 'peripherals', name: 'Periféricos', count: 432 },
      { id: 'storage', name: 'Almacenamiento', count: 356 },
    ],
    gradient: 'from-slate-500 to-gray-600',
  },
  {
    id: 'audio', name: 'Audio', icon: <Headphones className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', productCount: 1567,
    subcategories: [
      { id: 'headphones', name: 'Auriculares', count: 543 },
      { id: 'speakers', name: 'Altavoces', count: 432 },
      { id: 'microphones', name: 'Micrófonos', count: 321 },
      { id: 'soundbars', name: 'Barras de sonido', count: 271 },
    ],
    gradient: 'from-red-500 to-rose-600',
  },
  {
    id: 'watches', name: 'Relojes', icon: <Watch className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop', productCount: 892,
    subcategories: [
      { id: 'sport-watches', name: 'Deportivos', count: 321 },
      { id: 'classic-watches', name: 'Clásicos', count: 234 },
      { id: 'smart-watches', name: 'Inteligentes', count: 337 },
    ],
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'photography', name: 'Fotografía', icon: <Camera className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop', productCount: 1234,
    subcategories: [
      { id: 'cameras', name: 'Cámaras', count: 432 },
      { id: 'lenses', name: 'Objetivos', count: 321 },
      { id: 'tripods', name: 'Trípodes', count: 234 },
      { id: 'drones', name: 'Drones', count: 247 },
    ],
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'tv', name: 'TV y Cine', icon: <Tv className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop', productCount: 654,
    subcategories: [
      { id: 'televisions', name: 'Televisores', count: 234 },
      { id: 'projectors', name: 'Proyectores', count: 156 },
      { id: 'home-cinema', name: 'Home Cinema', count: 132 },
      { id: 'streaming', name: 'Streaming', count: 132 },
    ],
    gradient: 'from-gray-600 to-gray-700',
  },
  {
    id: 'baby', name: 'Bebé', icon: <Baby className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop', productCount: 3421,
    subcategories: [
      { id: 'baby-clothes', name: 'Ropa', count: 987 },
      { id: 'toys', name: 'Juguetes', count: 876 },
      { id: 'baby-food', name: 'Alimentación', count: 654 },
      { id: 'strollers', name: 'Paseo', count: 904 },
    ],
    gradient: 'from-sky-400 to-blue-400',
  },
  {
    id: 'garden', name: 'Jardín', icon: <Leaf className="w-8 h-8" />, productCount: 1789,
    subcategories: [
      { id: 'plants', name: 'Plantas', count: 543 },
      { id: 'garden-tools', name: 'Herramientas', count: 432 },
      { id: 'garden-decor', name: 'Decoración', count: 456 },
      { id: 'watering', name: 'Riego', count: 358 },
    ],
    gradient: 'from-lime-500 to-green-500',
  },
  {
    id: 'pets', name: 'Mascotas', icon: <PawPrint className="w-8 h-8" />, productCount: 2543,
    subcategories: [
      { id: 'dogs', name: 'Perros', count: 987 },
      { id: 'cats', name: 'Gatos', count: 876 },
      { id: 'pet-food', name: 'Alimentación', count: 432 },
      { id: 'pet-toys', name: 'Juguetes', count: 248 },
    ],
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    id: 'diy', name: 'Bricolaje', icon: <Hammer className="w-8 h-8" />, productCount: 3156,
    subcategories: [
      { id: 'tools', name: 'Herramientas', count: 1234 },
      { id: 'materials', name: 'Materiales', count: 876 },
      { id: 'paint', name: 'Pintura', count: 543 },
      { id: 'electrical', name: 'Electricidad', count: 503 },
    ],
    gradient: 'from-stone-500 to-stone-600',
  },
  {
    id: 'health', name: 'Salud', icon: <Heart className="w-8 h-8" />, productCount: 2987,
    subcategories: [
      { id: 'supplements', name: 'Suplementos', count: 876 },
      { id: 'devices', name: 'Dispositivos', count: 543 },
      { id: 'personal-care', name: 'Cuidado personal', count: 987 },
      { id: 'optics', name: 'Óptica', count: 581 },
    ],
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'office', name: 'Oficina', icon: <Briefcase className="w-8 h-8" />, productCount: 1654,
    subcategories: [
      { id: 'office-furniture', name: 'Muebles', count: 432 },
      { id: 'supplies', name: 'Suministros', count: 543 },
      { id: 'printers', name: 'Impresoras', count: 321 },
      { id: 'organization', name: 'Organización', count: 358 },
    ],
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'automotive', name: 'Automóvil', icon: <Car className="w-8 h-8" />, productCount: 2234,
    subcategories: [
      { id: 'car-accessories', name: 'Accesorios', count: 654 },
      { id: 'maintenance', name: 'Mantenimiento', count: 543 },
      { id: 'car-electronics', name: 'Electrónica', count: 432 },
      { id: 'interior', name: 'Interior', count: 605 },
    ],
    gradient: 'from-red-600 to-red-700',
  },
];

export default function CategoriasPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.subcategories.some((sub) => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#0066FF]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
            Todas las Categorías
          </h1>
          <p className="text-white/90 text-lg mb-2">
            Explora nuestro catálogo completo con más de {totalProducts.toLocaleString()} productos
          </p>
          <p className="text-white/80 text-sm mb-8">
            {categories.length} categorías · {categories.reduce((sum, c) => sum + c.subcategories.length, 0)} subcategorías
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Buscar categorías o subcategorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-white focus:bg-white transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-[#4A4A4A] mb-6">
          <Link href="/" className="hover:text-[#0066FF] transition-colors">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-medium">Categorías</span>
        </nav>

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.id}`}
                className="group"
              >
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:border-[#0066FF] transition-all duration-300 hover:shadow-[0_2px_60px_rgba(0,0,0,0.08)] hover:scale-[1.02]">
                  {/* Image or Icon Background */}
                  <div className={`relative h-32 bg-gradient-to-br ${category.gradient} flex items-center justify-center overflow-hidden`}>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-white group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-black mb-2 group-hover:text-[#0066FF] transition-colors">
                      {category.name}
                    </h3>

                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-2xl font-black text-[#0066FF]">
                        {category.productCount.toLocaleString()}
                      </p>
                      <p className="text-sm text-[#4A4A4A]">productos</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-[#4A4A4A] uppercase tracking-wide">
                        Subcategorías ({category.subcategories.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {category.subcategories.map((sub) => (
                          <span
                            key={sub.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAFAFA] text-[#4A4A4A] text-xs rounded-full border border-gray-200 group-hover:border-[#0066FF] transition-colors"
                          >
                            {sub.name}
                            <span className="text-gray-400 text-[10px]">({sub.count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-[#4A4A4A] text-lg">
              No se encontraron categorías para &ldquo;{searchTerm}&rdquo;
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-6 py-2.5 bg-[#0066FF] text-white rounded-2xl font-semibold hover:bg-[#0052CC] transition-colors"
            >
              Mostrar todas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
