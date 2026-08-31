import React from 'react';
import { storyBadges } from '../../data/banners';
import { useShop } from '../../context/ShopContext';
import { Zap, Percent, Smartphone, Shirt, Tv, Sparkles, Car, BookOpen } from 'lucide-react';

export const StoryBadges = () => {
  const { setSelectedCategory, setSelectedSubcategory, setSearchQuery, language } = useShop();

  const isRu = language === 'ru';
  const isEn = language === 'en';

  const handleStoryClick = (story) => {
    setSelectedSubcategory(null);
    setSearchQuery('');

    if (story.target) {
      setSelectedCategory(story.target);
    } else {
      setSelectedCategory(null);
    }

    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const getStoryName = (story) => {
    if (isRu && story.nameRu) return story.nameRu;
    if (isEn && story.nameEn) return story.nameEn;
    return story.name;
  };

  // Fallback visual icons if image is loading or fails
  const storyIcons = {
    "story-1": <Zap className="w-6 h-6 text-amber-400" />,
    "story-2": <Percent className="w-6 h-6 text-[#FF4D6D]" />,
    "story-3": <Smartphone className="w-6 h-6 text-[#7000FF]" />,
    "story-4": <Shirt className="w-6 h-6 text-sky-400" />,
    "story-5": <Tv className="w-6 h-6 text-orange-400" />,
    "story-6": <Sparkles className="w-6 h-6 text-pink-400" />,
    "story-7": <Car className="w-6 h-6 text-emerald-400" />,
    "story-8": <BookOpen className="w-6 h-6 text-indigo-400" />
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
      <div className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar py-1">
        {storyBadges.map((story) => (
          <button
            key={story.id}
            onClick={() => handleStoryClick(story)}
            className="flex flex-col items-center gap-1.5 group shrink-0 focus:outline-none cursor-pointer"
          >
            {/* Gradient Border Ring */}
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#7000FF] via-[#FF4D6D] to-[#FF9E00] group-hover:scale-110 transition-transform duration-200 shadow-sm active:scale-95">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-[#18181c] rounded-full overflow-hidden flex items-center justify-center p-0.5">
                <img
                  src={story.image}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-full h-full rounded-full object-cover select-none pointer-events-none"
                />
              </div>
              {story.isNew && (
                <span className="absolute -top-1 -right-1 bg-[#7000FF] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white dark:border-gray-900 shadow-xs">
                  TOP
                </span>
              )}
            </div>

            {/* Label */}
            <span className="text-[11px] sm:text-xs font-semibold text-[#141415] dark:text-gray-200 group-hover:text-[#7000FF] dark:group-hover:text-[#a366ff] transition-colors max-w-[75px] sm:max-w-[85px] text-center truncate">
              {getStoryName(story)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
