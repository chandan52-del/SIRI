import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, Eye, Sparkles } from 'lucide-react';
import { getWhatsAppUrl, buildWhatsAppOrderMessage } from '../../utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { settings, navigateTo } = useStore();

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';

  const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : null;

  // Calculate discount percentage
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : (product.discountPercent || null);

  const isOutOfStock =
    product.stockStatus === 'out_of_stock' || (product.stockCount !== undefined && product.stockCount <= 0);

  // Direct WhatsApp Quick Order
  const handleQuickWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/?page=product-detail&product=${product.id}`;
    const message = buildWhatsAppOrderMessage(product, {
      quantity: 1,
      selectedSize: product.sizes?.[0],
      selectedColor: product.colors?.[0]?.name,
      productUrl,
      currencySymbol: settings.currencySymbol || '₹',
      greeting: settings.whatsappPrefillGreeting,
    });
    const url = getWhatsAppUrl(settings.whatsappNumber, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={() => navigateTo('product-detail', { productId: product.id })}
      className="group relative bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Box with 4:5 Aspect Ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-104 ${
            secondaryImage ? 'group-hover:opacity-0 transition-opacity duration-300' : ''
          }`}
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-100 group-hover:scale-104"
          />
        )}

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide bg-stone-950 text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-xs">
              <Sparkles className="w-3 h-3 fill-stone-950" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-2xs flex items-center justify-center z-20">
            <span className="bg-white text-stone-950 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover Quick Action */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('product-detail', { productId: product.id });
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-950/90 hover:bg-stone-950 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-xs shadow-md transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag & SKU */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500">
              {product.categoryName || 'SIRI'}
            </span>
            {product.sku && (
              <span className="text-[10px] text-stone-400 font-mono">
                {product.sku}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-serif font-bold text-stone-950 text-base leading-snug line-clamp-2 group-hover:text-stone-700 transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price & Action Button Footer */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-stone-950">
                {settings.currencySymbol || '₹'}
                {product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through font-medium">
                  {settings.currencySymbol || '₹'}
                  {product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1 mt-1.5">
                {product.colors.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-stone-400">+{product.colors.length - 4}</span>
                )}
              </div>
            )}
          </div>

          {/* WhatsApp Order Button */}
          <button
            type="button"
            onClick={handleQuickWhatsAppOrder}
            disabled={isOutOfStock}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-950 hover:bg-stone-800 text-white shadow-xs active:scale-95'
            }`}
            title="Order on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-stone-950 shrink-0" />
            <span className="hidden sm:inline">Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
