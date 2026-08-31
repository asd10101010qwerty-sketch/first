import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  Smartphone, 
  Tv, 
  Shirt, 
  Footprints, 
  Sparkles, 
  Home, 
  Car, 
  Baby, 
  Dumbbell, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { categories } from '../../data/categories';

// Icon mapper
const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'Smartphone': return <Smartphone className="w-5 h-5" />;
    case 'Tv': return <Tv className="w-5 h-5" />;
    case 'Shirt': return <Shirt className="w-5 h-5" />;
    case 'Footprints': return <Footprints className="w-5 h-5" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5" />;
    case 'Home': return <Home className="w-5 h-5" />;
    case 'Car': return <Car className="w-5 h-5" />;
    case 'Baby': return <Baby className="w-5 h-5" />;
    case 'Dumbbell': return <Dumbbell className="w-5 h-5" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5" />;
    default: return <Smartphone className="w-5 h-5" />;
  }
};

export const CatalogModal = () => {
  const { 
    isCatalogOpen, 
    setIsCatalogOpen, 
    setSelectedCategory, 
    setSelectedSubcategory,
    setSearchQuery,
    t,
    getCategoryName
  } = useShop();

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  if (!isCatalogOpen) return null;

  const currentCategory = categories[activeCategoryIndex] || categories[0];

  const handleSelectSub = (categoryId, subcategoryName) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryName);
    setSearchQuery('');
    setIsCatalogOpen(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleViewAllCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setIsCatalogOpen(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCatalogOpen(false)}
      />

      {/* Catalog Mega-Menu Container */}
      <div className="fixed top-16 sm:top-20 left-0 right-0 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 z-50">
        <div className="bg-white dark:bg-[#1e1e24] rounded-2xl shadow-2xl border border-[#e8e8ed] dark:border-[#2e2e38] overflow-hidden flex flex-col md:flex-row max-h-[82vh] animate-scale-in transition-colors duration-200">
          
          {/* Left Column: Categories List */}
          <div className="w-full md:w-80 bg-[#f7f7f9] dark:bg-[#16161b] border-r border-[#e8e8ed] dark:border-[#2e2e38] overflow-y-auto p-3 shrink-0 max-h-[40vh] md:max-h-[82vh]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#e8e8ed] dark:border-[#2e2e38] md:hidden">
              <span className="font-bold text-sm text-[#141415] dark:text-white">{t('allCategories')}</span>
              <button 
                onClick={() => setIsCatalogOpen(false)}
                className="p-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 mt-1">
              {categories.map((cat, idx) => {
                const isActive = activeCategoryIndex === idx;
                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveCategoryIndex(idx)}
                    onClick={() => {
                      setActiveCategoryIndex(idx);
                      if (window.innerWidth < 768) {
                        handleViewAllCategory(cat.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-[#7000FF] text-white shadow-sm font-semibold' 
                        : 'text-[#333338] dark:text-gray-300 hover:bg-[#ece6ff] dark:hover:bg-[#2c2444] hover:text-[#7000FF] dark:hover:text-[#c29aff]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : 'text-[#7000FF] dark:text-[#a366ff]'}>
                        {getCategoryIcon(cat.icon)}
                      </span>
                      <span>{getCategoryName(cat)}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Subcategories & Promo Preview */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[50vh] md:max-h-[82vh] bg-white dark:bg-[#1e1e24] flex flex-col justify-between">
            <div>
              {/* Category Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e8e8ed] dark:border-[#2e2e38] mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#141415] dark:text-white flex items-center gap-2">
                    <span>{getCategoryName(currentCategory)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-[#7000FF] dark:text-[#c29aff] font-semibold">
                      {t('officialCategory')}
                    </span>
                  </h3>
                  <p className="text-xs text-[#80808a] dark:text-gray-400 mt-0.5">
                    {t('categorySubtitle')}
                  </p>
                </div>

                <button
                  onClick={() => handleViewAllCategory(currentCategory.id)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#7000FF] dark:text-[#a366ff] hover:underline"
                >
                  <span>{t('viewAllProducts')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCategory.subcategories.map((sub, sIdx) => (
                  <div key={sIdx} className="space-y-2.5">
                    <h4 
                      onClick={() => handleSelectSub(currentCategory.id, sub.title)}
                      className="font-bold text-sm text-[#141415] dark:text-gray-100 hover:text-[#7000FF] dark:hover:text-[#a366ff] cursor-pointer transition-colors"
                    >
                      {sub.title}
                    </h4>
                    <ul className="space-y-1.5">
                      {sub.items.map((item, iIdx) => (
                        <li key={iIdx}>
                          <button
                            onClick={() => handleSelectSub(currentCategory.id, item)}
                            className="text-xs text-[#62656a] dark:text-gray-400 hover:text-[#7000FF] dark:hover:text-[#a366ff] hover:translate-x-1 transition-all text-left block"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Promo Banner in Mega Menu */}
            <div className="mt-8 pt-4 border-t border-[#f0f0f4] dark:border-[#2e2e38]">
              <div 
                onClick={() => handleViewAllCategory(currentCategory.id)}
                className="cursor-pointer bg-gradient-to-r from-[#7000FF] to-[#9d4edd] rounded-xl p-4 text-white flex items-center justify-between hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{getCategoryName(currentCategory)} • Sprint Nasiya 0-0-12</p>
                    <p className="text-xs text-purple-100">{t('nasiyaShelfSubtitle')}</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-white text-[#7000FF] px-3 py-1.5 rounded-lg">
                  {t('goToCatalog')}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
