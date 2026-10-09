import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  MessageCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ChevronRight,
  PackageOpen,
} from 'lucide-react';
import { getWhatsAppUrl, buildGeneralChatMessage } from '../utils/whatsapp';

export const HomePage: React.FC = () => {
  const { settings, categories, products, navigateTo } = useStore();

  const publishedProducts = products.filter((p) => p.status === 'published');
  const featuredProducts = publishedProducts.filter((p) => p.isFeatured).slice(0, 4);
  const trendingProducts = publishedProducts.filter((p) => p.isTrending).slice(0, 4);
  const newArrivals = publishedProducts.filter((p) => p.isNewArrival).slice(0, 4);

  const whatsAppHeroUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    buildGeneralChatMessage(settings.storeName)
  );

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 shadow-2xl border border-stone-800">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/30 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 transform scale-105"
          style={{
            backgroundImage: `url('${
              settings.heroImageUrl ||
              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80'
            }')`,
          }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24 lg:py-28 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/80 border border-stone-700/80 text-stone-200 text-xs font-bold tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Official SIRI Brand Store</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.15] text-stone-50">
              {settings.heroTitle || 'Curated Elegance, Defined by You'}
            </h1>

            <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed max-w-xl">
              {settings.heroSubtitle ||
                'Discover hand-picked collections curated for elegance, everyday style, and uncompromising quality. Direct personal shopping via WhatsApp.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <button
                onClick={() => navigateTo('products')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
              >
                <span>{settings.heroButtonText || 'Explore Collections'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={whatsAppHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-900 text-stone-100 border border-stone-700 font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400 text-stone-900" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Micro assurances */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-800 text-left">
              <div>
                <span className="block text-xl font-serif font-extrabold text-stone-100">100%</span>
                <span className="text-xs text-stone-400 tracking-wide">Authentic Curation</span>
              </div>
              <div>
                <span className="block text-xl font-serif font-extrabold text-stone-100">Direct</span>
                <span className="text-xs text-stone-400 tracking-wide">WhatsApp Order</span>
              </div>
              <div>
                <span className="block text-xl font-serif font-extrabold text-stone-100">Personal</span>
                <span className="text-xs text-stone-400 tracking-wide">Customer Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-[0.25em] block mb-1">
                Curated Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-950 tracking-tight">
                Shop by Category
              </h2>
            </div>
            <button
              onClick={() => navigateTo('categories')}
              className="text-xs sm:text-sm font-bold text-stone-900 hover:text-stone-600 flex items-center gap-1 group cursor-pointer uppercase tracking-wider"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigateTo('products', { categorySlug: cat.id })}
                className="group relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-2xs hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={
                      cat.image ||
                      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* When no products are yet published: Clean, attractive Empty State */}
      {publishedProducts.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-stone-200/90 shadow-sm text-center max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-stone-100 text-stone-800 flex items-center justify-center mx-auto border border-stone-200 shadow-2xs">
              <PackageOpen className="w-10 h-10 stroke-[1.6]" />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold uppercase tracking-[0.2em] border border-stone-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Catalog Coming Soon</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-950 tracking-tight">
                Products Coming Soon
              </h2>
              <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                We are currently curating our exclusive items for SIRI. Every piece is hand-picked for quality and elegance.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsAppHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-stone-950/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400 text-stone-950" />
                <span>Chat with SIRI on WhatsApp</span>
              </a>

              <button
                onClick={() => navigateTo('contact')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Contact Store
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Products (Only shown when products exist) */}
          {featuredProducts.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                    Handpicked Specials
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Featured Products
                  </h2>
                </div>
                <button
                  onClick={() => navigateTo('products')}
                  className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group cursor-pointer"
                >
                  <span>Explore All</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Trending Products */}
          {trendingProducts.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
                      Customer Favorites
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Trending Now
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo('products')}
                  className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group cursor-pointer"
                >
                  <span>See More</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
                      Fresh Inventory
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      New Arrivals
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo('products')}
                  className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Why Shop on WhatsApp Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-[11px] font-bold tracking-[0.2em] uppercase border border-stone-700">
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-stone-900" />
              <span>Direct Shopping with SIRI</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white">
              Why Shop & Order Directly on WhatsApp?
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Skip cumbersome account signups, credit card forms, and payment checkout friction. Chat directly with the store owner, confirm availability or variations, and place your order in seconds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-950/50 border border-stone-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-stone-100">Zero Account Creation</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Order immediately without passwords or verification codes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-950/50 border border-stone-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-stone-100">Direct Personal Care</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Ask questions, request extra photos, or customize your selection directly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-950/50 border border-stone-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-stone-100">Direct Dispatch Updates</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Receive instant dispatch photos, courier tracking links, and updates.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-950/50 border border-stone-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-stone-100">Tailored Assistance</h4>
                  <p className="text-xs text-stone-400 mt-0.5">Direct answers from the store team on size, fit, and materials.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
