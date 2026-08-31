import React from 'react';
import { Truck, ShieldCheck, CreditCard, RotateCcw } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const FeatureBar = () => {
  const { setIsPickupPointsOpen, setSelectedCategory, t } = useShop();

  const features = [
    {
      icon: <Truck className="w-6 h-6 text-[#7000FF] dark:text-[#a366ff]" />,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      action: () => setIsPickupPointsOpen(true)
    },
    {
      icon: <CreditCard className="w-6 h-6 text-amber-500" />,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      action: () => setSelectedCategory('nasiya')
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      action: null
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-blue-500" />,
      title: t('feature4Title'),
      desc: t('feature4Desc'),
      action: null
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map((feat, i) => (
          <div
            key={i}
            onClick={feat.action ? feat.action : undefined}
            className={`bg-white dark:bg-[#1a1a20] p-3.5 sm:p-4 rounded-xl border border-[#e8e8ed] dark:border-[#282832] flex items-center gap-3 transition-all ${
              feat.action ? 'cursor-pointer hover:border-[#7000FF] dark:hover:border-[#a366ff] hover:shadow-sm' : ''
            }`}
          >
            <div className="p-2.5 rounded-xl bg-[#f7f7f9] dark:bg-[#242430] shrink-0">
              {feat.icon}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#141415] dark:text-white leading-tight">
                {feat.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#80808a] dark:text-gray-400 mt-0.5 leading-tight">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
