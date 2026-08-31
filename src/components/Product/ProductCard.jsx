import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Plus, Minus, Eye, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { getFallbackImage } from '../../data/products';

export const ProductCard = ({ product }) => {
  const {
    formatPrice,
    formatInstallment,
    toggleWishlist,
    isWishlisted,
    addToCart,
    cart,
    updateQuantity,
    setSelectedProductDetail,
    t,
    getProductTitle
  } = useShop();

  const [imgSrc, setImgSrc] = useState(product.images[0]);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const wishlisted = isWishlisted(product.id);

  // Check if item is in cart
  const cartItemIndex = cart.findIndex(item => item.product.id === product.id);
  const isInCart = cartItemIndex > -1;
  const cartQuantity = isInCart ? cart[cartItemIndex].quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 450);
    addToCart(product, 1);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 450);
    toggleWishlist(product.id);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 350);
    updateQuantity(cartItemIndex, 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 350);
    updateQuantity(cartItemIndex, -1);
  };

  const handleCardClick = () => {
    setSelectedProductDetail(product);
  };

  const handleImageError = () => {
    setImgSrc(getFallbackImage(product.title, product.category));
  };

  const title = getProductTitle(product);

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white dark:bg-[#1a1a20] rounded-2xl border border-[#e8e8ed] dark:border-[#282832] hover:border-[#c7a6ff] dark:hover:border-[#7000FF] hover:shadow-card-hover dark:hover:shadow-dark-card card-hover-fx flex flex-col justify-between overflow-hidden cursor-pointer relative transition-all duration-300 animate-fade-in-up"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#f7f7f9] dark:bg-[#22222a]">
        <img
          src={imgSrc}
          alt={title}
          onError={handleImageError}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges container */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.discountPercent > 0 && (
            <span className="badge-discount shadow-xs transform group-hover:scale-105 transition-transform duration-300">
              -{product.discountPercent}%
            </span>
          )}
          {product.badge && (
            <span className={`transform group-hover:scale-105 transition-transform duration-300 ${
              product.badgeType === 'nasiya' ? 'badge-nasiya' :
              product.badgeType === 'hit' ? 'badge-hit' :
              'badge-delivery'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button with bouncy pop animation */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-all duration-200 ${
            isHeartAnimating ? 'animate-heart-pop' : ''
          } ${
            wishlisted 
              ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 shadow-md scale-105' 
              : 'bg-white/80 dark:bg-black/60 text-gray-400 hover:text-rose-500 hover:bg-white dark:hover:bg-black/80 hover:scale-110 active:scale-90'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${wishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
        </button>

        {/* Quick View Button on Hover with smooth slide up */}
        <div className="absolute bottom-2 left-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex justify-center transform translate-y-3 group-hover:translate-y-0">
          <span className="bg-white/95 dark:bg-[#1a1a20]/95 hover:bg-[#7000FF] hover:text-white dark:hover:bg-[#7000FF] dark:hover:text-white text-gray-800 dark:text-gray-200 text-xs font-bold py-1.5 px-3 rounded-xl shadow-lg backdrop-blur-xs flex items-center gap-1.5 transition-all duration-200 active:scale-95">
            <Eye className="w-3.5 h-3.5 text-[#7000FF] group-hover:text-white dark:text-[#a366ff]" />
            <span>{t('quickView')}</span>
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Title */}
          <h3 className="text-xs sm:text-[13px] font-normal text-[#141415] dark:text-[#f0f0f5] leading-snug line-clamp-2 min-h-[34px] group-hover:text-[#7000FF] dark:group-hover:text-[#a366ff] transition-colors duration-200">
            {title}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#80808a] dark:text-gray-400">
            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 transition-transform group-hover:rotate-12 duration-300" />
              <span>{product.rating}</span>
            </div>
            <span>•</span>
            <span>({product.reviewsCount} {t('reviews')})</span>
          </div>

          {/* Monthly Installment Pill with subtle shimmer */}
          <div className="mt-2 inline-block">
            <span className="bg-[#fff3db] dark:bg-[#382b12] text-[#804b00] dark:text-[#ffc966] text-[11px] font-bold px-2 py-0.5 rounded transition-transform group-hover:scale-105 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 inline" />
              {formatInstallment(product.price, 12)}
            </span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-[#f5f5f8] dark:border-[#262630] flex items-end justify-between gap-2 mt-auto">
          <div>
            {product.oldPrice && (
              <span className="text-[11px] text-[#80808a] dark:text-gray-500 line-through block leading-none mb-0.5">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-sm sm:text-base font-extrabold text-[#141415] dark:text-white leading-none block">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Cart Button or Counter with animations */}
          {isInCart ? (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className={`flex items-center bg-[#7000FF] text-white rounded-xl overflow-hidden shadow-xs shrink-0 transition-transform ${
                isCartAnimating ? 'animate-cart-bump' : ''
              }`}
            >
              <button 
                onClick={handleDecrement}
                className="p-1.5 hover:bg-[#5c00d4] transition-colors active:scale-75"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold px-1.5 min-w-[20px] text-center">
                {cartQuantity}
              </span>
              <button 
                onClick={handleIncrement}
                className="p-1.5 hover:bg-[#5c00d4] transition-colors active:scale-75"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-[#e8e8ed] dark:border-[#2e2e38] hover:border-[#7000FF] bg-[#f5f0ff] dark:bg-[#28203c] hover:bg-[#7000FF] text-[#7000FF] dark:text-[#c29aff] hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs active:scale-90 shrink-0 ${
                isCartAnimating ? 'animate-cart-bump' : 'hover:scale-110'
              }`}
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
