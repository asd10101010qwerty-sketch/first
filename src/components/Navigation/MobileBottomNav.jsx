import React from 'react';
import { 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  Heart, 
  User, 
  Crown 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const MobileBottomNav = () => {
  const {
    isCatalogOpen,
    setIsCatalogOpen,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isAuthOpen,
    setIsAuthOpen,
    cart,
    wishlist,
    user,
    isAdmin,
    setSelectedCategory,
    setSelectedSubcategory,
    setSearchQuery,
    language
  } = useShop();

  const isRu = language === 'ru';
  const isUz = language === 'uz';

  const labels = {
    home: isRu ? "Главная" : isUz ? "Asosiy" : "Home",
    catalog: isRu ? "Каталог" : isUz ? "Katalog" : "Catalog",
    cart: isRu ? "Корзина" : isUz ? "Savatcha" : "Cart",
    wishlist: isRu ? "Избранное" : isUz ? "Saralangan" : "Wishlist",
    profile: isRu ? (isAdmin ? "Создатель" : (user.isLoggedIn ? "Профиль" : "Войти")) : isUz ? (isAdmin ? "Yaratuvchi" : (user.isLoggedIn ? "Profil" : "Kirish")) : (isAdmin ? "Creator" : (user.isLoggedIn ? "Profile" : "Sign In"))
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleHomeClick = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    if (isCatalogOpen) setIsCatalogOpen(false);
    if (isCartOpen) setIsCartOpen(false);
    if (isWishlistOpen) setIsWishlistOpen(false);
    if (isAuthOpen) setIsAuthOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCatalogClick = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsAuthOpen(false);
    setIsCatalogOpen(!isCatalogOpen);
  };

  const handleCartClick = () => {
    setIsCatalogOpen(false);
    setIsWishlistOpen(false);
    setIsAuthOpen(false);
    setIsCartOpen(true);
  };

  const handleWishlistClick = () => {
    setIsCatalogOpen(false);
    setIsCartOpen(false);
    setIsAuthOpen(false);
    setIsWishlistOpen(true);
  };

  const handleProfileClick = () => {
    setIsCatalogOpen(false);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsAuthOpen(true);
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#16161d]/95 backdrop-blur-lg border-t border-[#e8e8ed] dark:border-[#282834] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe transition-colors duration-200"
    >
      <div className="grid grid-cols-5 h-15 max-w-lg mx-auto items-center px-1">
        
        {/* 1. HOME */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center gap-1 py-1 text-gray-500 dark:text-gray-400 hover:text-[#7000FF] dark:hover:text-[#a366ff] active:scale-95 transition-all focus:outline-none"
        >
          <Home className="w-5 h-5 transition-transform active:scale-110" />
          <span className="text-[10px] font-bold leading-none tracking-tight">
            {labels.home}
          </span>
        </button>

        {/* 2. CATALOG */}
        <button
          onClick={handleCatalogClick}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-all active:scale-95 focus:outline-none ${
            isCatalogOpen 
              ? 'text-[#7000FF] dark:text-[#a366ff] font-black' 
              : 'text-gray-500 dark:text-gray-400 hover:text-[#7000FF] dark:hover:text-[#a366ff]'
          }`}
        >
          <LayoutGrid className="w-5 h-5 transition-transform active:scale-110" />
          <span className="text-[10px] font-bold leading-none tracking-tight">
            {labels.catalog}
          </span>
        </button>

        {/* 3. CART (WITH LIVE BADGE) */}
        <button
          onClick={handleCartClick}
          className={`relative flex flex-col items-center justify-center gap-1 py-1 transition-all active:scale-95 focus:outline-none ${
            isCartOpen 
              ? 'text-[#7000FF] dark:text-[#a366ff] font-black' 
              : 'text-gray-500 dark:text-gray-400 hover:text-[#7000FF] dark:hover:text-[#a366ff]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 transition-transform active:scale-110" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#7000FF] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#16161d] animate-scale-in">
                {totalCartItems > 99 ? '99+' : totalCartItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold leading-none tracking-tight">
            {labels.cart}
          </span>
        </button>

        {/* 4. WISHLIST */}
        <button
          onClick={handleWishlistClick}
          className={`relative flex flex-col items-center justify-center gap-1 py-1 transition-all active:scale-95 focus:outline-none ${
            isWishlistOpen 
              ? 'text-[#7000FF] dark:text-[#a366ff] font-black' 
              : 'text-gray-500 dark:text-gray-400 hover:text-[#7000FF] dark:hover:text-[#a366ff]'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 transition-transform active:scale-110 ${wishlist.length > 0 ? 'text-[#ff4d6d] fill-[#ff4d6d]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#ff4d6d] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#16161d] animate-scale-in">
                {wishlist.length > 99 ? '99+' : wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold leading-none tracking-tight">
            {labels.wishlist}
          </span>
        </button>

        {/* 5. PROFILE / LOGIN / CREATOR */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-all active:scale-95 focus:outline-none ${
            isAuthOpen 
              ? 'text-[#7000FF] dark:text-[#a366ff] font-black' 
              : 'text-gray-500 dark:text-gray-400 hover:text-[#7000FF] dark:hover:text-[#a366ff]'
          }`}
        >
          {isAdmin ? (
            <div className="relative">
              <Crown className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
          ) : user.isLoggedIn ? (
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#7000FF] to-[#2AABEE] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User className="w-5 h-5 transition-transform active:scale-110" />
          )}
          <span className={`text-[10px] font-bold leading-none tracking-tight ${isAdmin ? 'text-amber-500 font-black' : ''}`}>
            {labels.profile}
          </span>
        </button>

      </div>
    </nav>
  );
};

