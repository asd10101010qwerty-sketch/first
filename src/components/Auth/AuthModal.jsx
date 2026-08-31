import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2,
  Crown,
  ChevronRight,
  Smartphone,
  User as UserIcon
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { telegramAuthService } from '../../services/telegramAuthService';

export const AuthModal = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    isAdminOpen,
    setIsAdminOpen,
    isAdmin,
    user,
    loginUser,
    logoutUser,
    language,
    showToast
  } = useShop();

  const [step, setStep] = useState('initial'); // 'initial' | 'waiting'
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [telegramLink, setTelegramLink] = useState(null);
  const [telegramNativeLink, setTelegramNativeLink] = useState(null);
  const pollingIntervalRef = useRef(null);

  const isRu = language === 'ru';
  const isUz = language === 'uz';

  const displayName = isAdmin ? 'Sprint383' : user.name;

  const texts = {
    titleInitial: isRu ? "Вход через Telegram" : isUz ? "Telegram orqali kirish" : "Login with Telegram",
    descInitial: isRu 
      ? "Авторизуйтесь быстро и безопасно через официальный бот @SprintAuthBot"
      : isUz 
      ? "@SprintAuthBot orqali xavfsiz va tez tizimga kiring"
      : "Log in quickly and securely via the official @SprintAuthBot",
    btnStartTelegram: isRu ? "Войти через Telegram" : isUz ? "Telegram orqali kirish" : "Log in with Telegram",
    
    titleWaiting: isRu ? "Ожидание..." : isUz ? "Kutilmoqda..." : "Waiting...",
    descWaiting: isRu 
      ? "В боте @SprintAuthBot выберите язык, напишите ваше имя и отправьте контакт:"
      : isUz 
      ? "@SprintAuthBot da tilni tanlang, ismingizni yozing va kontaktni yuboring:"
      : "In @SprintAuthBot, choose your language, write your name, and share your contact:",
    
    btnOpenBot: isRu ? "Открыть Telegram на телефоне" : isUz ? "Telefonda Telegramni ochish" : "Open Telegram on Phone",
    btnOpenWeb: isRu ? "Открыть в браузере" : isUz ? "Brauzerda ochish" : "Open in Browser",
    cancel: isRu ? "Отмена" : isUz ? "Bekor qilish" : "Cancel",
    verified: isRu ? "Авторизован через Telegram" : isUz ? "Telegram orqali tasdiqlangan" : "Verified via Telegram",
    creatorBadge: isRu ? "👑 Создатель Sprint" : isUz ? "👑 Sprint Yaratuvchisi" : "👑 Sprint Creator",
    btnOpenAdmin: isRu ? "👑 Войти в панель Создателя" : isUz ? "👑 Yaratuvchi paneliga kirish" : "👑 Open Creator Panel",
    logout: isRu ? "Выйти из аккаунта" : isUz ? "Profildan chiqish" : "Log out",
    close: isRu ? "Закрыть" : isUz ? "Yopish" : "Close",
    security: isRu ? "Официальный бот авторизации Sprint Marketplace" : isUz ? "Sprint Marketplace rasmiy avtorizatsiya boti" : "Official Sprint Marketplace Auth Bot"
  };

  // Core Auth Verification Check
  const checkAuthStatus = useCallback(async (sessionIdToCheck) => {
    const targetSessionId = sessionIdToCheck || currentSessionId;
    if (!targetSessionId) return;

    try {
      const sessionData = await telegramAuthService.checkSessionStatus(targetSessionId);

      if (sessionData && sessionData.authenticated) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }

        const cleanPhone = (sessionData.phone || '').replace(/[^\d]/g, '');
        const isCreatorPhone = cleanPhone.endsWith('949392521') || cleanPhone === '998949392521';
        
        const loggedName = isCreatorPhone ? 'Sprint383' : (sessionData.userName || 'Пользователь');
        const loggedPhone = sessionData.phone || '+998 94 939 25 21';

        loginUser(loggedPhone, loggedName);
        setIsAuthOpen(false);
        setStep('initial');
        setTelegramLink(null);
        setTelegramNativeLink(null);
        setCurrentSessionId(null);

        try {
          localStorage.removeItem('sprint_pending_session_id');
        } catch {
          // ignore
        }

        showToast(isRu ? `Здравствуйте, ${loggedName}!` : `Salom, ${loggedName}!`, "success");
      }
    } catch {
      // ignore
    }
  }, [currentSessionId, isRu, loginUser, setIsAuthOpen, showToast]);

  // Polling Loop + Mobile Visibility/Focus Change detection
  useEffect(() => {
    if (step === 'waiting' && currentSessionId) {
      pollingIntervalRef.current = setInterval(() => checkAuthStatus(currentSessionId), 700);

      // Instant check when user switches back from Telegram app to mobile browser
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          checkAuthStatus(currentSessionId);
        }
      };

      const handleWindowFocus = () => {
        checkAuthStatus(currentSessionId);
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleWindowFocus);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleWindowFocus);
      };
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [step, currentSessionId, checkAuthStatus]);

  // Check cached session on startup for mobile page reload
  useEffect(() => {
    if (!user.isLoggedIn) {
      try {
        const cached = localStorage.getItem('sprint_pending_session_id');
        if (cached) {
          checkAuthStatus(cached);
        }
      } catch {
        // ignore
      }
    }
  }, [user.isLoggedIn, checkAuthStatus]);

  if (!isAuthOpen) return null;

  const handleStartTelegram = async () => {
    try {
      const result = await telegramAuthService.createCloudSession();
      setCurrentSessionId(result.sessionId);
      setTelegramLink(result.telegramDeepLink);
      setTelegramNativeLink(result.telegramNativeLink);
      setStep('waiting');

      // Check if mobile device
      const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
      
      if (isMobile && result.telegramNativeLink) {
        // On mobile, trigger direct app opening
        window.location.href = result.telegramNativeLink;
        setTimeout(() => {
          window.open(result.telegramDeepLink, '_blank');
        }, 500);
      } else {
        // On desktop, open in new tab
        window.open(result.telegramDeepLink, '_blank');
      }
    } catch {
      showToast(isRu ? "Ошибка открытия Telegram" : "Telegram ochishda xatolik", "error");
    }
  };

  const handleClose = () => {
    setIsAuthOpen(false);
    setStep('initial');
    setTelegramLink(null);
    setTelegramNativeLink(null);
    setCurrentSessionId(null);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
  };

  const handleOpenCreatorPanel = () => {
    setIsAuthOpen(false);
    setIsAdminOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative bg-white dark:bg-[#1a1a22] rounded-3xl shadow-2xl border border-[#e8e8ed] dark:border-[#2e2e38] w-full max-w-md overflow-hidden z-10 animate-scale-in transition-colors duration-200">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 dark:bg-[#282834] hover:bg-gray-200 dark:hover:bg-[#323242] text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {user.isLoggedIn ? (
            /* Logged In User Profile Card */
            <div className="p-6 sm:p-8 text-center space-y-5">
              <div className={`w-16 h-16 rounded-full text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg ${
                isAdmin 
                  ? 'bg-gradient-to-tr from-amber-500 via-[#7000FF] to-[#ff4d6d] shadow-purple-500/30' 
                  : 'bg-gradient-to-tr from-[#2AABEE] to-[#229ED9] shadow-sky-500/25'
              }`}>
                {isAdmin ? <Crown className="w-8 h-8 text-amber-300 animate-pulse" /> : displayName.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    {displayName}
                  </h3>
                  {isAdmin && (
                    <span className="text-amber-500 text-xs" title="Владелец">👑</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{user.phone}</p>
                
                <span className={`inline-flex items-center gap-1.5 mt-2.5 text-xs font-bold px-3 py-1 rounded-full ${
                  isAdmin 
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                    : 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300'
                }`}>
                  {isAdmin ? (
                    <>
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                      <span>{texts.creatorBadge}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>{texts.verified}</span>
                    </>
                  )}
                </span>
              </div>

              {/* EXCLUSIVE CREATOR ADMIN PANEL BUTTON (ONLY SHOWN IN PROFILE FOR SPRINT383) */}
              {isAdmin && (
                <div className="pt-2">
                  <button
                    onClick={handleOpenCreatorPanel}
                    className="w-full bg-gradient-to-r from-amber-500 via-[#7000FF] to-[#ff4d6d] hover:brightness-110 active:scale-95 text-white font-black py-3.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between shadow-xl shadow-purple-500/25 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-300" />
                      <span>{texts.btnOpenAdmin}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 dark:border-[#2a2a36] space-y-2">
                <button
                  onClick={logoutUser}
                  className="w-full bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  {texts.logout}
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-100 dark:bg-[#282834] hover:bg-gray-200 dark:hover:bg-[#323242] text-gray-800 dark:text-gray-200 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  {texts.close}
                </button>
              </div>
            </div>
          ) : step === 'initial' ? (
            /* Step 1: 1-Click Telegram Login Button */
            <div className="p-6 sm:p-8">
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#2AABEE] to-[#229ED9] text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-sky-500/30">
                  <Send className="w-8 h-8 ml-0.5" />
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  {texts.titleInitial}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs mx-auto">
                  {texts.descInitial}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleStartTelegram}
                  className="w-full bg-gradient-to-r from-[#2AABEE] via-[#229ED9] to-[#1c8ec7] hover:brightness-105 active:scale-95 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-sky-500/25 transition-all cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>{texts.btnStartTelegram}</span>
                </button>

                <div className="text-center">
                  <span className="text-[11px] text-gray-400">
                    @{telegramAuthService.botUsername || "SprintAuthBot"}
                  </span>
                </div>
              </div>

              {/* Security Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2a2a36] flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
                <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                <span>{texts.security}</span>
              </div>
            </div>
          ) : (
            /* Step 2: Animated Spinner + "Ожидание..." with Mobile 1-Tap Buttons */
            <div className="p-6 sm:p-8 text-center space-y-6 animate-fade-in">
              
              {/* Circular Loading Spinner */}
              <div className="flex flex-col items-center justify-center py-3">
                <div className="relative flex items-center justify-center">
                  {/* Outer pulse ring */}
                  <div className="absolute w-20 h-20 rounded-full border-4 border-sky-400/20 animate-ping"></div>
                  {/* Main animated spinner */}
                  <Loader2 className="w-16 h-16 text-[#2AABEE] animate-spin" />
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-6">
                  {texts.titleWaiting}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                  {texts.descWaiting}
                </p>
              </div>

              {/* Mobile Actions: Open Telegram Native App or Web */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-[#282834]">
                {telegramNativeLink && (
                  <a
                    href={telegramNativeLink}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#2AABEE] to-[#229ED9] hover:brightness-105 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{texts.btnOpenBot}</span>
                  </a>
                )}

                {telegramLink && (
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-bold text-[#229ED9] flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-[#229ED9]" />
                    <span>{texts.btnOpenWeb}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {texts.cancel}
                </button>
              </div>

              {/* Security Footer */}
              <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>{texts.security}</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
