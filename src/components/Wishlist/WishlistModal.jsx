import React from 'react';
import { X, Heart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../Product/ProductCard';

export const WishlistModal = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    t
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div className="relative bg-white dark:bg-[#1a1a22] rounded-3xl shadow-2xl border border-[#e8e8ed] dark:border-[#2e2e38] w-full max-w-5xl overflow-hidden z-10 animate-scale-in my-8 transition-colors duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-[#2e2e38] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {t('wishlist')}
              </h2>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-[#7000FF] dark:text-[#c29aff] font-bold px-2.5 py-0.5 rounded-full">
                {wishlistedProducts.length}
              </span>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#282834] hover:bg-gray-200 dark:hover:bg-[#323242] text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
            {wishlistedProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('wishlistEmpty')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {t('wishlistEmptyDesc')}
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-2 bg-[#7000FF] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#6000e0] transition-colors"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {wishlistedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
