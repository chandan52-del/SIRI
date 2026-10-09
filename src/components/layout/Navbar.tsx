import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SiriLogo } from '../common/SiriLogo';
import {
  Search,
  Menu,
  X,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Tag,
  Info,
  PhoneCall,
  Home,
} from 'lucide-react';
import { getWhatsAppUrl, buildGeneralChatMessage } from '../../utils/whatsapp';

export const Navbar: React.FC = () => {
  const { settings, currentPage, navigateTo, filters, updateFilter, isAdmin, categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({ search: searchInput });
    if (currentPage !== 'products') {
      navigateTo('products');
    }
  };

  const navLinks = [
    { label: 'Home', page: 'home' as const, icon: Home },
    { label: 'Collections', page: 'products' as const, icon: ShoppingBag },
    { label: 'Categories', page: 'categories' as const, icon: Tag },
    { label: 'About SIRI', page: 'about' as const, icon: Info },
    { label: 'Contact', page: 'contact' as const, icon: PhoneCall },
  ];

  const whatsAppGeneralUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    buildGeneralChatMessage(settings.storeName)
  );

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center group text-left focus:outline-none cursor-pointer"
            >
              <SiriLogo size="md" theme="dark" showSubtitle={true} />
            </button>
          </div>

          {/* Prominent Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-6 relative items-center"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search collections, apparel, accessories..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-stone-100 hover:bg-stone-100/80 focus:bg-white text-xs font-medium rounded-full border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/10 focus:outline-none transition-all placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateFilter({ search: '' });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold rounded-full transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition-colors cursor-pointer ${
                    isActive
                      ? 'text-stone-950 bg-stone-200/60 font-black'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Actions: WhatsApp Direct + Admin shortcut */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={whatsAppGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold tracking-wide uppercase shadow-sm transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-400 text-stone-950" />
              <span>WhatsApp Chat</span>
            </a>

            {/* Admin entry link */}
            <button
              onClick={() => navigateTo(isAdmin ? 'admin-dashboard' : 'admin-login')}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-transparent'
              }`}
              title={isAdmin ? 'SIRI Admin Panel (Authenticated)' : 'Admin Sign In'}
            >
              <ShieldCheck className="w-5 h-5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search SIRI collections..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-stone-100 text-xs rounded-full border border-stone-200 focus:border-stone-900 focus:outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateFilter({ search: '' });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-stone-950 text-white text-xs font-bold rounded-full"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Slide Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-fade-in">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => {
                    navigateTo(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-stone-100 text-stone-950 font-black'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-stone-500" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Categories Bar in Mobile Menu */}
          {categories.length > 0 && (
            <div className="mt-4 pt-4 border-t border-stone-100">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                Browse Departments
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      navigateTo('products', { categorySlug: cat.id });
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile WhatsApp Action */}
          <div className="mt-5 pt-3 border-t border-stone-100 flex flex-col gap-2">
            <a
              href={whatsAppGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wide shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-400 text-stone-950" />
              <span>Contact SIRI on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                navigateTo(isAdmin ? 'admin-dashboard' : 'admin-login');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-stone-600" />
              <span>{isAdmin ? 'Store Owner Dashboard' : 'Administrator Sign In'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
