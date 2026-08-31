import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Search, 
  Clock, 
  Check 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { pickupPoints, availableCities } from '../../data/pickupPoints';

export const PickupPointsModal = () => {
  const {
    isPickupPointsOpen,
    setIsPickupPointsOpen,
    selectedPickupPoint,
    setSelectedPickupPoint,
    selectedCity,
    setSelectedCity,
    showToast,
    t
  } = useShop();

  const [activeCityTab, setActiveCityTab] = useState(selectedCity || 'Toshkent');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isPickupPointsOpen) return null;

  const filteredPoints = pickupPoints.filter(p => {
    const matchesCity = p.city.toLowerCase() === activeCityTab.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const handleSelectPoint = (point) => {
    setSelectedPickupPoint(point);
    setSelectedCity(point.city);
    showToast(`Pickup point selected: ${point.name}`, "success");
    setIsPickupPointsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsPickupPointsOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div className="relative bg-white dark:bg-[#1a1a22] rounded-3xl shadow-2xl border border-[#e8e8ed] dark:border-[#2e2e38] w-full max-w-4xl overflow-hidden z-10 animate-scale-in my-8 transition-colors duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-[#2e2e38] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#7000FF] dark:text-[#a366ff]" />
                <span>{t('pvzDirectoryTitle')}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t('pvzDirectorySubtitle')}
              </p>
            </div>

            <button
              onClick={() => setIsPickupPointsOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#282834] hover:bg-gray-200 dark:hover:bg-[#323242] text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* City Tabs & Search */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-[#2e2e38] bg-[#fafafc] dark:bg-[#14141a] space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('searchPvz')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#22222a] border border-gray-300 dark:border-[#2e2e38] rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:border-[#7000FF]"
              />
            </div>

            {/* City Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {availableCities.slice(0, 7).map(city => (
                <button
                  key={city}
                  onClick={() => setActiveCityTab(city)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCityTab === city
                      ? 'bg-[#7000FF] text-white shadow-xs'
                      : 'bg-white dark:bg-[#22222a] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Points List */}
          <div className="p-4 sm:p-6 max-h-[55vh] overflow-y-auto space-y-3">
            {filteredPoints.length === 0 ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-xs">
                No pickup points found in "{activeCityTab}".
              </div>
            ) : (
              filteredPoints.map((point) => {
                const isSelected = selectedPickupPoint.id === point.id;

                return (
                  <div
                    key={point.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected 
                        ? 'border-[#7000FF] bg-[#f5f0ff] dark:bg-[#251d38] ring-1 ring-[#7000FF]' 
                        : 'border-gray-200 dark:border-[#2e2e3a] hover:border-gray-300 bg-white dark:bg-[#1a1a22]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{point.name}</h4>
                        <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                          {t('oneDay')} Free
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{point.address}</span>
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#7000FF] dark:text-[#a366ff]" />
                          <span>{point.workingHours}</span>
                        </span>
                        <span>•</span>
                        <span>{point.fittingRooms} {t('fittingRoomsCount')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPoint(point)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#7000FF] text-white shadow-xs'
                          : 'bg-gray-100 dark:bg-[#282834] hover:bg-[#7000FF] hover:text-white text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{isSelected ? t('selected') : t('selectThisPoint')}</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
