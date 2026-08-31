import React from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { categories } from '../../data/categories';

export const CategoryBar = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    setSelectedSubcategory,
    setSearchQuery,
    t,
    getCategoryName
  } = useShop();

  const handleCategoryClick = (catId) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(catId);
    }
    setSelectedSubcategory(null);
    setSearchQuery('');
  };

  return (
    <div className="bg-white/95 dark:bg-[#18181c]/95 backdrop-blur-md border-b border-[#e8e8ed] dark:border-[#26262e] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 sm:py-2.5 no-scrollbar text-xs font-medium text-[#404045] dark:text-[#a5a5b2] touch-pan-x">
          
          {/* Highlighted Promo Tabs */}
          <button
            onClick={() => handleCategoryClick('nasiya')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold whitespace-nowrap hover:opacity-95 shadow-xs transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('nasiyaTab')}</span>
          </button>

          <button
            onClick={() => handleCategoryClick('chegirmalar')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{t('dealsTab')}</span>
          </button>

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const catName = getCategoryName(cat);

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#7000FF] text-white font-bold' 
                    : 'hover:text-[#7000FF] dark:hover:text-[#a366ff] hover:bg-[#f5f0ff] dark:hover:bg-[#282832]'
                }`}
              >
                <span>{catName}</span>
                {cat.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isSelected ? 'bg-white text-[#7000FF]' : 'bg-[#7000FF]/10 dark:bg-[#7000FF]/30 text-[#7000FF] dark:text-[#c29aff]'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};
