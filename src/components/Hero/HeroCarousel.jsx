import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { heroBanners } from '../../data/banners';
import { useShop } from '../../context/ShopContext';

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { setSelectedCategory, setSelectedSubcategory, setSearchQuery, language, t } = useShop();

  const isRu = language === 'ru';
  const isEn = language === 'en';

  // Auto slide every 5 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
  };

  const handleBannerClick = (banner) => {
    if (!banner) return;
    setSelectedSubcategory(null);
    setSearchQuery('');

    if (banner.categoryTarget) {
      setSelectedCategory(banner.categoryTarget);
    } else {
      setSelectedCategory(null);
    }

    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const currentBanner = heroBanners[currentIndex];

  const getTitle = (banner) => {
    if (isRu && banner.titleRu) return banner.titleRu;
    if (isEn && banner.titleEn) return banner.titleEn;
    return banner.title;
  };

  const getSubtitle = (banner) => {
    if (isRu && banner.subtitleRu) return banner.subtitleRu;
    if (isEn && banner.subtitleEn) return banner.subtitleEn;
    return banner.subtitle;
  };

  const getTag = (banner) => {
    if (isRu && banner.tagRu) return banner.tagRu;
    if (isEn && banner.tagEn) return banner.tagEn;
    return banner.tag;
  };

  const getButtonText = (banner) => {
    if (isRu && banner.buttonTextRu) return banner.buttonTextRu;
    if (isEn && banner.buttonTextEn) return banner.buttonTextEn;
    return banner.buttonText || t('startShopping');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-4">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-56 sm:h-72 md:h-88 lg:h-96 w-full rounded-3xl overflow-hidden shadow-xl group cursor-pointer border border-[#e8e8ed] dark:border-[#2e2e38] transition-all duration-300 select-none"
        onClick={() => handleBannerClick(currentBanner)}
      >
        {/* Background Images with cross-fade */}
        <div className="absolute inset-0 bg-gray-950 overflow-hidden">
          {heroBanners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 pointer-events-none -z-10'
              }`}
            >
              <img
                src={banner.image}
                alt={getTitle(banner)}
                className="w-full h-full object-cover object-center transform transition-transform duration-10000 hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-85 mix-blend-multiply transition-opacity`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            </div>
          ))}
        </div>

        {/* Floating Content Over Banner */}
        <div className="relative h-full flex flex-col justify-end p-5 sm:p-8 md:p-12 z-10 text-white max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-300 mb-2 sm:mb-3 w-fit shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{getTag(currentBanner)}</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
            {getTitle(currentBanner)}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-1.5 sm:mt-2 line-clamp-2 max-w-lg drop-shadow-xs font-medium">
            {getSubtitle(currentBanner)}
          </p>

          <div className="mt-3 sm:mt-5 flex items-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleBannerClick(currentBanner);
              }}
              className="bg-white text-[#7000FF] font-black text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl shadow-xl hover:bg-purple-50 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <span>{getButtonText(currentBanner)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Prev/Next Navigation Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 shadow-lg border border-white/20"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 shadow-lg border border-white/20"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-3 sm:bottom-4 right-5 sm:right-8 z-20 flex items-center gap-1.5 sm:gap-2">
          {heroBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-6 sm:w-8 bg-white shadow-md' 
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
