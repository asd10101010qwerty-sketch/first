import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ArrowUpDown, 
  X, 
  ChevronRight, 
  Sparkles, 
  ShoppingBag,
  Zap
} from 'lucide-react';
import { useShop } from './context/ShopContext';
import { categories } from './data/categories';

// Components
import { TopBar } from './components/Header/TopBar';
import { Navbar } from './components/Header/Navbar';
import { CategoryBar } from './components/Header/CategoryBar';
import { CatalogModal } from './components/Header/CatalogModal';
import { HeroCarousel } from './components/Hero/HeroCarousel';
import { StoryBadges } from './components/Hero/StoryBadges';
import { FeatureBar } from './components/Hero/FeatureBar';
import { ProductCard } from './components/Product/ProductCard';
import { ProductShelf } from './components/Product/ProductShelf';
import { ProductDetailModal } from './components/Product/ProductDetailModal';
import { CartDrawer } from './components/Cart/CartDrawer';
import { CheckoutModal } from './components/Checkout/CheckoutModal';
import { WishlistModal } from './components/Wishlist/WishlistModal';
import { OrdersModal } from './components/Orders/OrdersModal';
import { AuthModal } from './components/Auth/AuthModal';
import { PickupPointsModal } from './components/PickupPoints/PickupPointsModal';
import { AdminModal } from './components/Admin/AdminModal';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { Footer } from './components/Footer/Footer';

export default function App() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    toast,
    t,
    getCategoryName
  } = useShop();

  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc' | 'rating'
  const [nasiyaOnly, setNasiyaOnly] = useState(false);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        (p.titleRu && p.titleRu.toLowerCase().includes(q)) ||
        (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        (p.seller && p.seller.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory) {
      if (selectedCategory === 'nasiya') {
        result = result.filter(p => p.badgeType === 'nasiya' || p.badge?.includes('Nasiya'));
      } else if (selectedCategory === 'chegirmalar') {
        result = result.filter(p => p.discountPercent > 0 || p.isFlashSale);
      } else {
        result = result.filter(p => p.category === selectedCategory);
      }
    }

    // Subcategory filter
    if (selectedSubcategory) {
      result = result.filter(p => 
        p.subcategory.toLowerCase().includes(selectedSubcategory.toLowerCase()) ||
        p.title.toLowerCase().includes(selectedSubcategory.toLowerCase())
      );
    }

    // Additional Filter Flags
    if (nasiyaOnly) {
      result = result.filter(p => p.badgeType === 'nasiya' || p.badge?.includes('Nasiya'));
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: Popular & Hit items first
      result.sort((a, b) => (b.ordersCount || 0) - (a.ordersCount || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSubcategory, nasiyaOnly, sortBy]);

  // Shelves Collections
  const flashSaleProducts = useMemo(() => {
    return products.filter(p => p.isFlashSale || p.discountPercent >= 20).slice(0, 10);
  }, [products]);

  const popularElectronics = useMemo(() => {
    return products.filter(p => p.category === 'elektronika').slice(0, 10);
  }, [products]);

  const fashionProducts = useMemo(() => {
    return products.filter(p => p.category === 'kiyim' || p.category === 'poyabzallar').slice(0, 10);
  }, [products]);

  const beautyProducts = useMemo(() => {
    return products.filter(p => p.category === 'gozallik' || p.category === 'salomatlik').slice(0, 10);
  }, [products]);

  const booksProducts = useMemo(() => {
    return products.filter(p => p.category === 'kitoblar').slice(0, 10);
  }, [products]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setNasiyaOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f9] dark:bg-[#121215] text-[#141415] dark:text-gray-100 font-sans transition-colors duration-200 selection:bg-[#7000FF] selection:text-white">
      
      {/* Top utility bar */}
      <TopBar />

      {/* Main sticky navigation header */}
      <header className="sticky top-0 z-40">
        <Navbar />
        <CategoryBar />
      </header>

      {/* Mega-Catalog Modal Overlay */}
      <CatalogModal />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 md:pb-8 space-y-6 sm:space-y-8">
        
        {/* If user is filtering by search or category, show catalog filter view */}
        {(selectedCategory || selectedSubcategory || searchQuery) ? (
          <div className="space-y-6 animate-fade-in">
            
            {/* Breadcrumb & Filter Header */}
            <div className="bg-white dark:bg-[#18181c] p-4 sm:p-6 rounded-2xl border border-[#e8e8ed] dark:border-[#26262e] shadow-xs space-y-4">
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-xs text-[#80808a] dark:text-gray-400 flex-wrap">
                <button 
                  onClick={handleClearFilters}
                  className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors"
                >
                  {t('home')}
                </button>
                
                {activeCategoryObj && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <button 
                      onClick={() => setSelectedSubcategory(null)}
                      className={`hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors ${!selectedSubcategory ? 'font-bold text-[#141415] dark:text-white' : ''}`}
                    >
                      {getCategoryName(activeCategoryObj)}
                    </button>
                  </>
                )}

                {selectedSubcategory && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="font-bold text-[#141415] dark:text-white">
                      {selectedSubcategory}
                    </span>
                  </>
                )}

                {searchQuery && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="font-bold text-[#141415] dark:text-white">
                      "{searchQuery}"
                    </span>
                  </>
                )}
              </div>

              {/* Title & Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2f2f5] dark:border-[#26262e] pb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#141415] dark:text-white flex items-center gap-2">
                    {searchQuery ? `"${searchQuery}"` : activeCategoryObj ? getCategoryName(activeCategoryObj) : t('catalog')}
                    <span className="text-sm font-semibold text-[#80808a] dark:text-gray-400">
                      ({filteredProducts.length} {t('items')})
                    </span>
                  </h1>
                </div>

                {/* Reset Filters button */}
                <button
                  onClick={handleClearFilters}
                  className="self-start sm:self-auto text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:underline"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t('clearFilter')}</span>
                </button>
              </div>

              {/* Controls bar: Subcategory pills & Sorting */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Subcategories Horizontal Scroll */}
                {activeCategoryObj?.subcategories && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                      onClick={() => setSelectedSubcategory(null)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        !selectedSubcategory
                          ? 'bg-[#7000FF] text-white shadow-sprint'
                          : 'bg-[#f2f2f5] dark:bg-[#22222a] text-[#404040] dark:text-gray-300 hover:bg-[#e6e6ec] dark:hover:bg-[#2c2c36]'
                      }`}
                    >
                      {t('all')}
                    </button>
                    {activeCategoryObj.subcategories.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                          selectedSubcategory === sub
                            ? 'bg-[#7000FF] text-white shadow-sprint'
                            : 'bg-[#f2f2f5] dark:bg-[#22222a] text-[#404040] dark:text-gray-300 hover:bg-[#e6e6ec] dark:hover:bg-[#2c2c36]'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sorting and Flag Dropdowns */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  
                  {/* Nasiya 0-0-12 toggle pill */}
                  <button
                    onClick={() => setNasiyaOnly(!nasiyaOnly)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      nasiyaOnly 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm' 
                        : 'bg-white dark:bg-[#22222a] border-[#e8e8ed] dark:border-[#2e2e38] text-gray-700 dark:text-gray-300 hover:border-amber-400'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>{t('nasiyaPill')}</span>
                  </button>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5 bg-[#f2f2f5] dark:bg-[#22222a] px-3 py-1.5 rounded-xl border border-transparent focus-within:border-[#7000FF]">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#80808a]" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#141415] dark:text-white outline-none cursor-pointer"
                    >
                      <option value="popular" className="dark:bg-[#1e1e24]">{t('sortPopular')}</option>
                      <option value="price-asc" className="dark:bg-[#1e1e24]">{t('sortPriceAsc')}</option>
                      <option value="price-desc" className="dark:bg-[#1e1e24]">{t('sortPriceDesc')}</option>
                      <option value="rating" className="dark:bg-[#1e1e24]">{t('sortRating')}</option>
                    </select>
                  </div>
                </div>

              </div>

            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#18181c] rounded-3xl p-12 text-center border border-[#e8e8ed] dark:border-[#26262e] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f5f0ff] dark:bg-[#281f3a] text-[#7000FF] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#141415] dark:text-white">
                  {t('noResults')}
                </h3>
                <p className="text-xs text-[#80808a] dark:text-gray-400 max-w-sm mx-auto">
                  {t('noResultsDesc')}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7000FF] hover:bg-[#6000e0] text-white font-bold rounded-xl text-xs shadow-sprint hover:shadow-sprint-hover transition-all"
                >
                  <span>{t('browseAll')}</span>
                </button>
              </div>
            )}

          </div>
        ) : (
          /* Default Marketplace Home Landing Flow */
          <>
            {/* Main Interactive Hero Banner Carousel */}
            <HeroCarousel />

            {/* Dynamic Interactive Story Circular Badges */}
            <StoryBadges />

            {/* Marketplace USPs Feature Bar */}
            <FeatureBar />

            {/* Flash Sale Shelf */}
            <ProductShelf
              title={t('flashSaleTitle')}
              subtitle={t('flashSaleSubtitle')}
              badge={t('flashSaleBadge')}
              products={flashSaleProducts}
              onViewAll={() => setSelectedCategory('chegirmalar')}
            />

            {/* Electronics Best-sellers */}
            <ProductShelf
              title={t('electronicsTitle')}
              subtitle={t('electronicsSubtitle')}
              products={popularElectronics}
              onViewAll={() => setSelectedCategory('elektronika')}
            />

            {/* Mid-Page Promotional Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#7000FF] via-[#8534f5] to-[#2AABEE] p-6 sm:p-10 text-white shadow-xl shadow-purple-500/20">
              <div className="relative z-10 max-w-xl space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-amber-400 text-purple-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                  <Zap className="w-3.5 h-3.5 fill-purple-950" />
                  <span>{t('nasiyaBannerBadge')}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
                  {t('nasiyaBannerTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
                  {t('nasiyaBannerDesc')}
                </p>
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    setSearchQuery('');
                    setSelectedCategory('nasiya');
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="mt-2 bg-white text-[#7000FF] hover:bg-purple-50 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>{t('nasiyaBannerBtn')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Background Product Imagery & Glow */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 lg:opacity-30 pointer-events-none hidden sm:block">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80" 
                  alt="Sprint Nasiya"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Fashion & Shoes Shelf */}
            <ProductShelf
              title={t('fashionTitle')}
              subtitle={t('fashionSubtitle')}
              products={fashionProducts}
              onViewAll={() => setSelectedCategory('kiyim')}
            />

            {/* Beauty & Care Shelf */}
            <ProductShelf
              title={t('beautyTitle')}
              subtitle={t('beautySubtitle')}
              products={beautyProducts}
              onViewAll={() => setSelectedCategory('gozallik')}
            />

            {/* Books Shelf */}
            <ProductShelf
              title={t('booksTitle')}
              subtitle={t('booksSubtitle')}
              products={booksProducts}
              onViewAll={() => setSelectedCategory('kitoblar')}
            />
          </>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <WishlistModal />
      <OrdersModal />
      <AuthModal />
      <PickupPointsModal />
      <AdminModal />

      {/* Global Toast Notification with slide and spring bounce */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 animate-slide-up max-w-[90vw]">
          <div className={`p-3.5 sm:p-4 rounded-2xl shadow-2xl border flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold animate-scale-in ${
            toast.type === 'success' ? 'bg-emerald-950 text-emerald-100 border-emerald-700 shadow-emerald-950/50' :
            toast.type === 'error' ? 'bg-rose-950 text-rose-100 border-rose-700 shadow-rose-950/50' :
            'bg-gray-900 text-white border-gray-700 shadow-black/50'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-purple-400 shrink-0 animate-pulse" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Mobile-first bottom navigation bar */}
      <MobileBottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
}
