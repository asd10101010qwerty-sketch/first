import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Zap, 
  Truck, 
  Plus, 
  Minus, 
  Share2, 
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { getFallbackImage } from '../../data/products';

export const ProductDetailModal = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    formatPrice,
    formatInstallment,
    toggleWishlist,
    isWishlisted,
    addToCart,
    setIsCheckoutOpen,
    user,
    setIsAuthOpen,
    showToast,
    t,
    getProductTitle
  } = useShop();

  const product = selectedProductDetail;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'Standart');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Standart');
  const [quantity, setQuantity] = useState(1);
  const [installmentMonths, setInstallmentMonths] = useState(12);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'reviews' | 'description'

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const title = getProductTitle(product);

  const handleAddToCart = () => {
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
  };

  const handleBuyNow = () => {
    if (!user.isLoggedIn) {
      showToast("Xarid qilish uchun avval hisobingizga kiring / Войдите в аккаунт", "info");
      setIsAuthOpen(true);
      return;
    }
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
    setSelectedProductDetail(null);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied!", "success");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setSelectedProductDetail(null)}
      />

      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="relative bg-white dark:bg-[#1a1a22] rounded-3xl shadow-2xl border border-[#e8e8ed] dark:border-[#2e2e38] w-full max-w-5xl overflow-hidden z-10 animate-scale-in my-8 transition-colors duration-200">
          
          {/* Close Button */}
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 dark:bg-[#282834] hover:bg-gray-200 dark:hover:bg-[#323242] text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 md:p-8">
            
            {/* Left: Product Images Gallery (5 cols) */}
            <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-3">
              {/* Thumbnails */}
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-[#7000FF] shadow-xs' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="preview" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getFallbackImage(product.title, product.category);
                      }}
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 aspect-square rounded-2xl bg-[#f7f7f9] dark:bg-[#22222c] overflow-hidden relative border border-[#f0f0f4] dark:border-[#2a2a36] flex items-center justify-center">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getFallbackImage(product.title, product.category);
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Discount Badge */}
                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#7000FF] text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    -{product.discountPercent}%
                  </span>
                )}
              </div>
            </div>

            {/* Right: Product Details & Purchase Form (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Seller & Rating Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-[#80808a] dark:text-gray-400 pb-2 border-b border-[#f0f0f4] dark:border-[#2a2a36]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span>•</span>
                    <span className="text-[#7000FF] dark:text-[#a366ff] font-medium cursor-pointer hover:underline">
                      {product.reviewsCount} {t('reviews')}
                    </span>
                    <span>•</span>
                    <span>{product.ordersCount} {t('orders')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-1 hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-lg sm:text-2xl font-extrabold text-[#141415] dark:text-white mt-3 leading-snug">
                  {title}
                </h1>

                {/* Seller Info */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-[#80808a] dark:text-gray-400">{t('seller')}:</span>
                  <span className="text-xs font-bold text-[#7000FF] dark:text-[#a366ff] hover:underline cursor-pointer">
                    {product.seller}
                  </span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                    ★ {product.sellerRating}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-4 rounded-2xl bg-[#faf9fe] dark:bg-[#201d2a] border border-[#ece6ff] dark:border-[#352854]">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-[#141415] dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm sm:text-base text-[#80808a] dark:text-gray-400 line-through font-medium">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  {/* Installment Calculator */}
                  <div className="mt-3 pt-3 border-t border-[#ebdfff] dark:border-[#352854]">
                    <div className="flex items-center justify-between text-xs font-bold text-[#404040] dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-1 text-[#7000FF] dark:text-[#a366ff]">
                        <Sparkles className="w-4 h-4" />
                        <span>{t('nasiyaShelfTitle')}:</span>
                      </div>
                      <span className="text-sm font-black text-[#7000FF] dark:text-[#c29aff]">
                        {formatPrice(Math.round(product.price / installmentMonths))}
                      </span>
                    </div>

                    {/* Months selector */}
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 6, 12, 24].map((m) => (
                        <button
                          key={m}
                          onClick={() => setInstallmentMonths(m)}
                          className={`py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                            installmentMonths === m
                              ? 'bg-[#7000FF] text-white border-[#7000FF] shadow-xs'
                              : 'bg-white dark:bg-[#181820] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-300'
                          }`}
                        >
                          {m} {t('city') === 'Shahar' ? 'oy' : t('city') === 'Город' ? 'мес' : 'mo'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Variations */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-bold text-[#141415] dark:text-gray-200 block mb-1.5">
                      {t('color')}: <span className="text-[#7000FF] dark:text-[#a366ff]">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            selectedColor === c
                              ? 'border-[#7000FF] bg-[#f5f0ff] dark:bg-[#2c2045] text-[#7000FF] dark:text-[#c29aff] font-bold shadow-xs'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size / Capacity Variations */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-bold text-[#141415] dark:text-gray-200 block mb-1.5">
                      {t('size')}: <span className="text-[#7000FF] dark:text-[#a366ff]">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            selectedSize === s
                              ? 'border-[#7000FF] bg-[#f5f0ff] dark:bg-[#2c2045] text-[#7000FF] dark:text-[#c29aff] font-bold shadow-xs'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Delivery Guarantee */}
                <div className="mt-4 flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">{t('feature1Title')}</p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">{t('feature1Desc')}</p>
                    </div>
                  </div>
                  
                  {/* Quantity selector */}
                  <div className="flex items-center bg-white dark:bg-[#181820] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-gray-800 dark:text-gray-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#f0f0f4] dark:border-[#2a2a36] flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 bg-[#7000FF] hover:bg-[#6000e0] active:scale-95 text-white py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sprint hover:shadow-sprint-hover transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t('addToCart')}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full sm:w-auto bg-[#ff9e00] hover:bg-[#e68e00] active:scale-95 text-black font-extrabold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>{t('buyNow')}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    wishlisted
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Tabs: Description / Specs / Reviews */}
          <div className="border-t border-[#e8e8ed] dark:border-[#2a2a36] bg-[#fafafc] dark:bg-[#14141a] p-4 sm:p-6">
            <div className="flex gap-4 border-b border-[#e8e8ed] dark:border-[#2a2a36] pb-2 text-sm font-bold">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'specs'
                    ? 'border-[#7000FF] text-[#7000FF] dark:text-[#a366ff]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('specs')}
              </button>
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'description'
                    ? 'border-[#7000FF] text-[#7000FF] dark:text-[#a366ff]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('description')}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'reviews'
                    ? 'border-[#7000FF] text-[#7000FF] dark:text-[#a366ff]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('customerReviews')} ({product.reviewsCount})
              </button>
            </div>

            <div className="mt-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(product.specs || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1.5 border-b border-gray-200 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400">{key}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'description' && (
                <div className="leading-relaxed space-y-2">
                  <p>{product.description}</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="bg-white dark:bg-[#1a1a22] p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-[#7000FF] dark:text-[#c29aff] font-bold flex items-center justify-center shrink-0">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900 dark:text-white">Azizbek Q.</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400">2 days ago</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        High quality product! Super fast 1-day delivery. Thanks Sprint team!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
