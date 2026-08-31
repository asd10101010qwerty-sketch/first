import React, { useState, useEffect } from 'react';
import { ChevronRight, Flame, Sparkles, Clock } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useShop } from '../../context/ShopContext';

export const ProductShelf = ({
  title,
  subtitle,
  iconType, // 'flame' | 'sparkle' | 'clock' | null
  products,
  isCountdown = false,
  onViewAll
}) => {
  const { t } = useShop();

  // Flash sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    if (!isCountdown) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCountdown]);

  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Shelf Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-2xl font-black text-[#141415] dark:text-white flex items-center gap-2">
            {iconType === 'flame' && <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 fill-rose-500" />}
            {iconType === 'sparkle' && <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-500" />}
            {iconType === 'clock' && <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#7000FF] dark:text-[#a366ff]" />}
            <span>{title}</span>
          </h2>

          {/* Flash Sale Countdown Timer */}
          {isCountdown && (
            <div className="flex items-center gap-1 bg-[#141415] dark:bg-[#252530] text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg shadow-xs border border-gray-800 dark:border-gray-700">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span>:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span>:</span>
              <span className="text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-[#7000FF] dark:text-[#a366ff] hover:text-[#5200b8] dark:hover:text-[#c29aff] transition-colors group"
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-[#80808a] dark:text-gray-400 -mt-3 mb-4">
          {subtitle}
        </p>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
