import React from 'react';
import { 
  Zap, 
  Phone, 
  Mail, 
  Send, 
  Smartphone 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Footer = () => {
  const { setIsPickupPointsOpen, t } = useShop();

  return (
    <footer className="bg-white dark:bg-[#16161c] border-t border-[#e8e8ed] dark:border-[#26262e] mt-12 text-[#141415] dark:text-white transition-colors duration-200">
      {/* Top Banner inside Footer */}
      <div className="border-b border-[#e8e8ed] dark:border-[#26262e] bg-[#f9f8fe] dark:bg-[#1a1a24]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#7000FF] flex items-center justify-center text-white shrink-0 shadow-md">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#141415] dark:text-white">
                {t('appDownloadBannerTitle')}
              </h3>
              <p className="text-xs text-[#80808a] dark:text-gray-400">
                {t('appDownloadBannerDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#141415] dark:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-900 border border-transparent dark:border-gray-800 transition-colors">
              <Smartphone className="w-4 h-4" />
              <div className="text-left">
                <span className="text-[9px] block text-gray-400 leading-none">Download on</span>
                <span className="font-bold leading-none">App Store</span>
              </div>
            </button>

            <button className="flex items-center gap-2 bg-[#141415] dark:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-900 border border-transparent dark:border-gray-800 transition-colors">
              <Smartphone className="w-4 h-4" />
              <div className="text-left">
                <span className="text-[9px] block text-gray-400 leading-none">Get it on</span>
                <span className="font-bold leading-none">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Col 1: About */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-[#141415] dark:text-white">{t('aboutUs')}</h4>
            <ul className="space-y-2 text-xs text-[#62656a] dark:text-gray-400">
              <li>
                <button 
                  onClick={() => setIsPickupPointsOpen(true)}
                  className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors"
                >
                  {t('pickupPoints')}
                </button>
              </li>
              <li><a href="#vacancies" className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors">Careers / Vakansiyalar</a></li>
              <li><a href="#about" className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors">Company / Kompaniya</a></li>
            </ul>
          </div>

          {/* Col 2: For Users */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-[#141415] dark:text-white">{t('forUsers')}</h4>
            <ul className="space-y-2 text-xs text-[#62656a] dark:text-gray-400">
              <li><a href="#contact" className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors">Contact Us</a></li>
              <li><a href="#faq" className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors">{t('faq')}</a></li>
              <li><a href="#rules" className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors">Returns & Refunds</a></li>
            </ul>
          </div>

          {/* Col 3: For Sellers */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-[#141415] dark:text-white">{t('forSellers')}</h4>
            <ul className="space-y-2 text-xs text-[#62656a] dark:text-gray-400">
              <li><a href="#seller" className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors">Sell on Sprint</a></li>
              <li><a href="#cabinet" className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors">Merchant Portal</a></li>
              <li><a href="#pvz-partner" className="hover:text-[#7000FF] dark:hover:text-[#a366ff] transition-colors">Open a Pick-up Point</a></li>
            </ul>
          </div>

          {/* Col 4: Contacts & Socials */}
          <div className="space-y-3 col-span-2 md:col-span-1 lg:col-span-2">
            <h4 className="font-extrabold text-sm text-[#141415] dark:text-white">{t('contactSupport')}</h4>
            <div className="space-y-2 text-xs text-[#62656a] dark:text-gray-400">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7000FF] dark:text-[#a366ff]" />
                <a href="tel:+998712007007" className="font-bold text-[#141415] dark:text-white hover:text-[#7000FF] dark:hover:text-[#a366ff] text-sm">
                  +998 71 200 70 07
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7000FF] dark:text-[#a366ff]" />
                <a href="mailto:support@sprint.uz" className="hover:text-[#7000FF] dark:hover:text-[#a366ff]">
                  support@sprint.uz
                </a>
              </p>
              <p className="text-[11px] text-[#80808a] dark:text-gray-400 pt-1">
                24/7 Dedicated Customer Support
              </p>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <span className="text-xs font-bold text-[#141415] dark:text-white block mb-2">Socials:</span>
              <div className="flex gap-2">
                <a href="https://t.me" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-[#f2f2f5] dark:bg-[#22222a] hover:bg-[#7000FF] hover:text-white flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300 font-bold text-xs" title="Telegram">
                  <Send className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-[#f2f2f5] dark:bg-[#22222a] hover:bg-[#FF4D6D] hover:text-white flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300 font-bold text-xs" title="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-[#f2f2f5] dark:bg-[#22222a] hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300 font-bold text-xs" title="YouTube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-[#f2f2f5] dark:bg-[#22222a] hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300 font-bold text-xs" title="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & payment partners */}
        <div className="mt-10 pt-6 border-t border-[#e8e8ed] dark:border-[#26262e] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#80808a] dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#7000FF] dark:text-[#a366ff] fill-[#7000FF] dark:fill-[#a366ff]" />
            <span>&copy; {new Date().getFullYear()} {t('allRightsReserved')}</span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-[#f2f2f5] dark:bg-[#22222a] text-gray-700 dark:text-gray-300 px-2 py-1 rounded">UZCARD</span>
            <span className="text-[10px] font-bold bg-[#f2f2f5] dark:bg-[#22222a] text-orange-600 dark:text-orange-400 px-2 py-1 rounded">HUMO</span>
            <span className="text-[10px] font-bold bg-[#f2f2f5] dark:bg-[#22222a] text-blue-700 dark:text-blue-400 px-2 py-1 rounded">VISA</span>
            <span className="text-[10px] font-bold bg-[#f2f2f5] dark:bg-[#22222a] text-red-600 dark:text-red-400 px-2 py-1 rounded">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
