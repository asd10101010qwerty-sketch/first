import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Menu, 
  Heart, 
  ShoppingBag, 
  User, 
  Zap, 
  Clock, 
  ArrowRight, 
  Flame,
  Sun,
  Moon,
  Crown
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { getFallbackImage } from '../../data/products';

export const Navbar = () => {
  const {
    products,
    cartItemsCount,
    wishlistCount,
    searchQuery,
    setSearchQuery,
    isCatalogOpen,
    setIsCatalogOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    isAdminOpen,
    setIsAdminOpen,
    isAdmin,
    user,
    setSelectedCategory,
    setSelectedSubcategory,
    setSelectedProductDetail,
    formatPrice,
    theme,
    toggleTheme,
    t,
    getProductTitle
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);
  const searchContainerRef = useRef(null);

  // Trigger bounce animations when counts change
  useEffect(() => {
    if (cartItemsCount > 0) {
      setCartAnimate(true);
      const timer = setTimeout(() => setCartAnimate(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  useEffect(() => {
    if (wishlistCount > 0) {
      setWishlistAnimate(true);
      const timer = setTimeout(() => setWishlistAnimate(false), 400);
      return () => clearTimeout(timer);
    }
  }, [wishlistCount]);

  // Filtered search suggestions
  const searchSuggestions = searchQuery.trim()
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.titleRu && p.titleRu.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.titleEn && p.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const popularSearches = [
    "iPhone 16 Pro",
    "AirPods Pro",
    "Nike Air Force",
    "Robot-changyutgich",
    "Dyson stayler",
    "Kitoblar"
  ];

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchFocused(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProductDetail(product);
    setIsSearchFocused(false);
  };

  const handlePopularSearch = (term) => {
    setSearchQuery(term);
    setIsSearchFocused(false);
  };

  const handleResetHome = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white/95 dark:bg-[#18181c]/95 border-b border-[#e8e8ed] dark:border-[#26262e] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo - Sprint */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={handleResetHome}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-md shadow-purple-500/25 group-hover:scale-110 transition-all duration-300">
                <img 
                  src="/sprint_logo.png" 
                  alt="Sprint Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#7000FF] dark:text-[#a366ff] uppercase flex items-center leading-none group-hover:tracking-wider transition-all duration-300">
                  Sprint
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5 inline-block animate-ping"></span>
                </span>
                <span className="text-[10px] font-semibold text-[#80808a] dark:text-gray-400 uppercase tracking-wider hidden sm:block">
                  Marketplace
                </span>
              </div>
            </button>

            {/* Catalog Mega-Menu Button */}
            <button
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm active:scale-95 ${
                isCatalogOpen 
                  ? 'bg-[#5c00d4] text-white shadow-sprint' 
                  : 'bg-[#7000FF] text-white hover:bg-[#6000e0] hover:shadow-sprint'
              }`}
            >
              <div className={`transition-transform duration-300 ${isCatalogOpen ? 'rotate-90' : ''}`}>
                {isCatalogOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </div>
              <span className="hidden sm:inline">{t('catalog')}</span>
            </button>
          </div>

          {/* Search Bar with live autocomplete */}
          <div className="flex-1 max-w-2xl relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-[#f2f2f5] dark:bg-[#22222a] hover:bg-[#ebebee] dark:hover:bg-[#282832] focus:bg-white dark:focus:bg-[#1e1e26] text-sm text-[#141415] dark:text-white placeholder-[#80808a] pl-4 pr-24 py-2.5 sm:py-3 rounded-xl border border-transparent focus:border-[#7000FF] focus:ring-4 focus:ring-[#7000FF]/15 transition-all outline-none"
              />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-[#80808a] hover:text-[#141415] dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:rotate-90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#7000FF] hover:bg-[#6000e0] active:scale-95 text-white p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 shadow-xs hover:shadow-sprint"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden md:inline">{t('find')}</span>
                </button>
              </div>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e1e24] rounded-2xl shadow-2xl border border-[#e8e8ed] dark:border-[#2e2e38] py-3 z-50 animate-scale-in max-h-96 overflow-y-auto">
                {searchQuery.trim() ? (
                  <div>
                    <div className="px-4 py-1.5 text-xs font-bold text-[#80808a] dark:text-gray-400 uppercase tracking-wider">
                      {t('searchResults')}
                    </div>
                    {searchSuggestions.length > 0 ? (
                      searchSuggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="w-full px-4 py-2.5 hover:bg-[#f5f0ff] dark:hover:bg-[#2b2440] flex items-center gap-3 text-left transition-all duration-150 border-b border-[#f5f5f7] dark:border-[#2a2a34] last:border-0 hover:translate-x-1"
                        >
                          <img 
                            src={product.images[0]} 
                            alt={product.title} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getFallbackImage(product.title, product.category);
                            }}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-[#141415] dark:text-gray-100 truncate">
                              {getProductTitle(product)}
                            </p>
                            <p className="text-xs text-[#7000FF] dark:text-[#a366ff] font-bold">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#80808a] shrink-0" />
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-[#80808a] dark:text-gray-400">
                        "{searchQuery}" {t('noResults')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="px-4 py-1 flex items-center gap-1.5 text-xs font-bold text-[#80808a] dark:text-gray-400 uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                      <span>{t('popularSearches')}</span>
                    </div>
                    <div className="p-3 flex flex-wrap gap-2">
                      {popularSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handlePopularSearch(term)}
                          className="px-3 py-1.5 bg-[#f2f2f5] dark:bg-[#282832] hover:bg-[#ebe0ff] dark:hover:bg-[#342650] hover:text-[#7000FF] dark:hover:text-[#c29aff] rounded-lg text-xs font-medium text-[#404040] dark:text-gray-300 transition-all duration-200 flex items-center gap-1.5 hover:scale-105"
                        >
                          <Clock className="w-3 h-3 text-[#80808a]" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Login, Wishlist, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Quick Theme Toggle Icon */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-[#141415] dark:text-yellow-400 hover:bg-[#f5f0ff] dark:hover:bg-[#282832] transition-transform duration-200 active:scale-90 hover:rotate-12"
              title="Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-spin-slow" />
              ) : (
                <Moon className="w-5 h-5 text-[#303030]" />
              )}
            </button>

            {/* User Profile / Login */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-[#141415] dark:text-gray-200 hover:bg-[#f5f0ff] dark:hover:bg-[#282832] hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-all duration-200 group active:scale-95"
            >
              <div className="relative">
                <User className="w-5 h-5 text-[#303030] dark:text-gray-300 group-hover:text-[#7000FF] dark:group-hover:text-[#a366ff] transition-colors" />
                {user.isLoggedIn && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#18181c] animate-pulse"></span>
                )}
              </div>
              <span className="text-xs font-semibold hidden md:inline truncate max-w-[80px]">
                {user.isLoggedIn ? user.name.split(' ')[0] : t('login')}
              </span>
            </button>

            {/* Wishlist Button (Desktop & Tablet) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className={`hidden sm:flex relative items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-[#141415] dark:text-gray-200 hover:bg-[#f5f0ff] dark:hover:bg-[#282832] hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-all duration-200 group active:scale-95 ${
                wishlistAnimate ? 'animate-heart-pop' : ''
              }`}
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-[#303030] dark:text-gray-300 group-hover:text-[#7000FF] dark:group-hover:text-[#a366ff] transition-colors group-hover:scale-110" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#7000FF] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden md:inline">{t('wishlist')}</span>
            </button>

            {/* Cart Button (Desktop & Tablet) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`hidden sm:flex relative items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#f5f0ff] dark:bg-[#2a2040] text-[#7000FF] dark:text-[#c29aff] hover:bg-[#ebd9ff] dark:hover:bg-[#382b54] transition-all duration-200 group font-bold active:scale-95 ${
                cartAnimate ? 'animate-cart-bump shadow-sprint' : ''
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#7000FF] dark:text-[#c29aff] group-hover:scale-115 transition-transform duration-200" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#FF4D6D] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#18181c] shadow-md animate-scale-in">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs hidden md:inline font-bold">{t('cart')}</span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
