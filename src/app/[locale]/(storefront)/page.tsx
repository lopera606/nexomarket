'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Star, Heart, ArrowRight, Zap, TrendingUp, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

const CATEGORY_KEYS = [
  { key: 'catElectronics', slug: 'electronics', emoji: '📱', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop' },
  { key: 'catFashion', slug: 'fashion', emoji: '👗', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop' },
  { key: 'catHome', slug: 'home', emoji: '🏠', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=300&h=300&fit=crop' },
  { key: 'catSports', slug: 'sports', emoji: '⚽', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcb6a?w=300&h=300&fit=crop' },
  { key: 'catBooks', slug: 'books', emoji: '📚', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop' },
  { key: 'catGames', slug: 'games', emoji: '🎮', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=300&h=300&fit=crop' },
  { key: 'catBeauty', slug: 'beauty', emoji: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop' },
  { key: 'catGroceries', slug: 'groceries', emoji: '🛒', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop' },
  { key: 'catComputing', slug: 'computing', emoji: '💻', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop' },
  { key: 'catAudio', slug: 'audio', emoji: '🎧', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
  { key: 'catWatches', slug: 'watches', emoji: '⌚', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop' },
  { key: 'catPhotography', slug: 'photography', emoji: '📷', image: 'https://images.unsplash.com/photo-1507041957456-9c6e6de6d141?w=300&h=300&fit=crop' },
  { key: 'catTV', slug: 'tv', emoji: '🎬', image: 'https://images.unsplash.com/photo-1533391473527-46d1fb0b928d?w=300&h=300&fit=crop' },
  { key: 'catBaby', slug: 'baby', emoji: '👶', image: 'https://images.unsplash.com/photo-1555075798-9f3f1ef143ca?w=300&h=300&fit=crop' },
];

const FLASH_DEALS = [
  { id: 1, slug: 'airpods-pro-2', name: 'AirPods Pro 2', price: 179.99, oldPrice: 269.99, image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop', discount: 33, sold: 78 },
  { id: 2, slug: 'ipad-air-m2', name: 'iPad Air M2', price: 519.99, oldPrice: 669.99, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', discount: 22, sold: 45 },
  { id: 3, slug: 'nike-dunk-low', name: 'Nike Dunk Low', price: 74.99, oldPrice: 109.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', discount: 32, sold: 91 },
  { id: 4, slug: 'dyson-v15', name: 'Dyson V15', price: 419.99, oldPrice: 599.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop', discount: 30, sold: 62 },
];

const PRODUCTS = [
  { id: 1, slug: 'macbook-pro-14-m3', store: 'TechPro Store', name: 'MacBook Pro 14" M3', price: 1199.99, oldPrice: 1399.99, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', rating: 4.8, reviews: 234, discount: 14, badgeKey: 'bestSeller' },
  { id: 2, slug: 'nike-air-max-90', store: 'SportGear Co', name: 'Nike Air Max 90', price: 119.99, oldPrice: 149.99, image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop', rating: 4.6, reviews: 567, discount: 20, badgeKey: null },
  { id: 3, slug: 'sony-wh-1000xm5', store: 'AudioMax', name: 'Sony WH-1000XM5', price: 279.99, oldPrice: 379.99, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop', rating: 4.9, reviews: 891, discount: 26, badgeKey: 'deal' },
  { id: 4, slug: 'iphone-15-pro-max', store: 'MobileHub', name: 'iPhone 15 Pro Max', price: 1049.99, oldPrice: 1229.99, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', rating: 4.7, reviews: 1203, discount: 15, badgeKey: null },
  { id: 5, slug: 'samsung-65-qled', store: 'ElectroWorld', name: 'Samsung 65" QLED', price: 749.99, oldPrice: 999.99, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', rating: 4.5, reviews: 342, discount: 25, badgeKey: 'lightning' },
  { id: 6, slug: 'playstation-5-slim', store: 'GamingZone', name: 'PlayStation 5 Slim', price: 419.99, oldPrice: 499.99, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', rating: 4.8, reviews: 2145, discount: 16, badgeKey: 'bestSeller' },
  { id: 7, slug: 'robot-aspirador', store: 'HomeStyle', name: 'Robot Aspirador', price: 219.99, oldPrice: 329.99, image: 'https://images.unsplash.com/photo-1589894404892-fac3089e6517?w=400&h=400&fit=crop', rating: 4.4, reviews: 678, discount: 33, badgeKey: null },
  { id: 8, slug: 'apple-watch-ultra-2', store: 'FitPro', name: 'Apple Watch Ultra 2', price: 649.99, oldPrice: 749.99, image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', rating: 4.7, reviews: 456, discount: 13, badgeKey: null },
];

const TRENDING = [
  { name: 'iPhone 16', searches: '45K' },
  { name: 'PS5 Pro', searches: '38K' },
  { name: 'Air Force 1', searches: '32K' },
  { name: 'MacBook Air M3', searches: '28K' },
  { name: 'Galaxy S25', searches: '24K' },
];

export default function HomePage() {
  const t = useTranslations('home');
  const [countdownTime] = useState({ hours: '02', minutes: '34', seconds: '15' });
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleAddToCart = (e: React.MouseEvent, product: { id: number; slug: string; name: string; price: number }) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id: String(product.id), name: product.name, price: product.price });
    setAddedToCart(String(product.id));
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  const handleNewsletter = () => {
    if (newsletterEmail.includes('@')) {
      setNewsletterSent(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSent(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section — Crystal Minimal with Banner Image */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content — Left */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#0066FF]/10 rounded-full px-5 py-2.5 text-sm font-semibold text-[#0066FF] mb-8">
                <Zap className="w-4 h-4" />
                {t('specialOffers')}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 text-black tracking-tight">
                {t('heroTitle')} <span className="text-[#0066FF]">{t('heroHighlight')}</span>
              </h1>
              <p className="text-lg md:text-xl text-[#4A4A4A] mb-10 leading-relaxed">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/categorias" className="px-8 py-4 bg-[#0066FF] text-white font-bold rounded-2xl hover:bg-[#0052CC] hover:scale-[1.02] transition-all duration-200 text-lg text-center" style={{ boxShadow: '0 4px 40px rgba(0,102,255,0.2)' }}>
                  {t('exploreProducts')}
                </Link>
                <Link href="/vendedor/dashboard" className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-50 hover:scale-[1.02] transition-all duration-200 text-lg text-center border border-gray-200" style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.06)' }}>
                  {t('sellOnNexo')}
                </Link>
              </div>
            </div>

            {/* Hero Banner Image — Right */}
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop"
                alt="Shopping banner"
                className="w-full h-auto rounded-3xl object-cover"
                style={{ boxShadow: '0 20px 60px rgba(0,102,255,0.15)' }}
              />
            </div>
          </div>

          {/* Hero Image for Mobile — Full Width on Top */}
          <div className="relative lg:hidden mb-10">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop"
              alt="Shopping banner"
              className="w-full h-auto rounded-3xl object-cover"
              style={{ boxShadow: '0 20px 60px rgba(0,102,255,0.15)' }}
            />
          </div>
        </div>
      </div>

      {/* Quick-Access Category Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="text-sm font-semibold text-[#4A4A4A] mb-6 uppercase tracking-wide">{t('quickAccess') || 'Acceso rápido'}</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 flex-nowrap scrollbar-hide">
            {CATEGORY_KEYS.slice(0, 8).map((cat) => (
              <Link
                key={cat.key}
                href={`/categorias/${cat.slug}`}
                className="flex-shrink-0 flex flex-col items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#FAFAFA] transition-all duration-200 group"
              >
                <div className="w-16 h-16 rounded-full bg-[#FAFAFA] flex items-center justify-center text-3xl group-hover:bg-[#0066FF]/10 transition-all duration-200">
                  {cat.emoji}
                </div>
                <span className="text-xs font-semibold text-black text-center whitespace-nowrap">{t(cat.key)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 space-y-20 mt-16 pb-20 max-w-7xl mx-auto">
        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-black tracking-tight">{t('shopByCategory')}</h2>
            <Link href="/categorias" className="text-[#0066FF] hover:text-[#0052CC] font-semibold flex items-center gap-2 transition-colors duration-200">
              {t('viewAll')} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-5">
            {CATEGORY_KEYS.map((cat) => (
              <Link
                key={cat.key}
                href={`/categorias/${cat.slug}`}
                className="group relative overflow-hidden rounded-3xl cursor-pointer"
                style={{ boxShadow: '0 2px 60px rgba(0,0,0,0.03)' }}
              >
                <div className="aspect-square">
                  <img src={cat.image} alt={cat.key} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-2xl">{cat.emoji}</span>
                  <p className="text-white font-bold text-sm mt-1">{t(cat.key)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash Deals */}
        <section className="rounded-[32px] p-8 md:p-10 bg-black overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0066FF] rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{t('flashDeals')}</h2>
                <p className="text-sm text-gray-400">{t('limitedTime')}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl px-6 py-3">
              <div className="text-xs text-gray-400 mb-1">{t('timeRemaining')}</div>
              <div className="font-mono font-extrabold text-2xl text-white">
                {countdownTime.hours}:{countdownTime.minutes}:{countdownTime.seconds}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FLASH_DEALS.map((deal) => (
              <Link
                key={deal.id}
                href={`/productos/${deal.slug}`}
                className="bg-white rounded-2xl p-5 hover:scale-[1.02] transition-all duration-200 cursor-pointer block"
                style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.04)' }}
              >
                <div className="aspect-square bg-[#FAFAFA] rounded-xl overflow-hidden mb-2">
                  <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="font-bold text-sm text-black truncate">{deal.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-extrabold text-lg text-black">€{deal.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 line-through">€{deal.oldPrice.toFixed(2)}</span>
                </div>
                <div className="inline-block mt-2 px-2 py-0.5 bg-[#0066FF]/10 rounded-lg">
                  <span className="text-xs font-bold text-[#0066FF]">-{deal.discount}%</span>
                </div>
                <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#0066FF] h-full rounded-full transition-all duration-500"
                    style={{ width: `${deal.sold}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#4A4A4A] mt-2 font-medium">{deal.sold}% {t('sold')}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Searches */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-[#0066FF]" />
            <h2 className="text-3xl font-extrabold text-black tracking-tight">{t('trending')}</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 flex-nowrap">
            {TRENDING.map((item, i) => (
              <Link
                key={item.name}
                href={`/buscar?q=${encodeURIComponent(item.name)}`}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-3.5 bg-[#FAFAFA] rounded-2xl hover:bg-white hover:scale-[1.02] transition-all duration-200 whitespace-nowrap"
                style={{ boxShadow: '0 2px 30px rgba(0,0,0,0.02)' }}
              >
                <span className="w-7 h-7 rounded-full bg-[#0066FF] text-white text-xs font-extrabold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="font-bold text-black">{item.name}</span>
                <span className="text-xs text-[#4A4A4A]">{item.searches}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-black tracking-tight">{t('recommendedForYou')}</h2>
            <Link href="/ofertas" className="text-[#0066FF] hover:text-[#0052CC] font-semibold flex items-center gap-2 transition-colors duration-200">
              {t('viewMore')} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={`/productos/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-200"
                style={{ boxShadow: '0 2px 40px rgba(0,0,0,0.04)' }}
              >
                <div className="relative aspect-square bg-[#FAFAFA] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                  {product.badgeKey && (
                    <span className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-xl bg-black text-white">
                      {t(product.badgeKey)}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="absolute top-3 right-3 bg-[#0066FF] text-white text-xs font-bold px-2.5 py-1 rounded-xl">
                      -{product.discount}%
                    </span>
                  )}
                  <button
                    onClick={(e) => handleToggleFavorite(e, String(product.id))}
                    className="absolute bottom-3 right-3 p-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(String(product.id)) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium text-[#0066FF]">{product.store}</p>
                  <h3 className="font-bold text-sm text-black mt-1.5 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#4A4A4A]">({product.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="font-extrabold text-lg text-black">€{product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">€{product.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-3 ${
                      addedToCart === String(product.id)
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-[#0066FF] hover:bg-[#0052CC]'
                    } text-white font-bold rounded-2xl transition-all duration-200`}
                  >
                    {addedToCart === String(product.id) ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    {addedToCart === String(product.id) ? 'Añadido' : t('addToCart')}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="rounded-[32px] overflow-hidden bg-[#FAFAFA] border border-gray-100">
          <div className="p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 tracking-tight">{t('newsletter')}</h2>
            <p className="text-lg text-[#4A4A4A] mb-10 max-w-lg mx-auto">{t('newsletterSubtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNewsletter()}
                placeholder={t('emailPlaceholder')}
                className="flex-1 px-5 py-3.5 rounded-2xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 transition-all duration-200"
                style={{ boxShadow: '0 2px 30px rgba(0,0,0,0.04)' }}
              />
              <button
                onClick={handleNewsletter}
                className={`px-8 py-3.5 font-bold rounded-2xl transition-all duration-200 whitespace-nowrap ${
                  newsletterSent ? 'bg-green-500 text-white' : 'bg-[#0066FF] text-white hover:bg-[#0052CC]'
                }`}
                style={{ boxShadow: '0 4px 30px rgba(0,102,255,0.15)' }}
              >
                {newsletterSent ? '✓ Suscrito' : t('subscribe')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
