import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2,
  Crown,
  ChevronRight,
  User as UserIcon,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { emailAuthService, CREATOR_EMAIL } from '../../services/emailAuthService';

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

  const [step, setStep] = useState('form'); // 'form' | 'code' | 'sending'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [realCode, setRealCode] = useState(null); // fallback display if email not sent
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isRu = language === 'ru';
  const isUz = language === 'uz';

  const displayName = isAdmin ? 'Sprint383' : user.name;

  const t = {
    title: isRu ? "Вход в аккаунт" : isUz ? "Hisobga kirish" : "Sign In",
    desc: isRu 
      ? "Введите ваше имя и email для входа" 
      : isUz 
      ? "Kirish uchun ismingiz va emailingizni kiriting" 
      : "Enter your name and email to sign in",
    namePlaceholder: isRu ? "Ваше имя" : isUz ? "Ismingiz" : "Your name",
    emailPlaceholder: isRu ? "Ваш email" : isUz ? "Emailingiz" : "Your email",
    btnSendCode: isRu ? "Получить код" : isUz ? "Kodni olish" : "Get Code",
    
    codeTitle: isRu ? "Введите код" : isUz ? "Kodni kiriting" : "Enter Code",
    codeDesc: isRu 
      ? "Мы отправили 6-значный код на вашу почту:" 
      : isUz 
      ? "Biz 6 raqamli kodni emailingizga yubordik:" 
      : "We sent a 6-digit code to your email:",
    codePlaceholder: "000000",
    btnVerify: isRu ? "Подтвердить" : isUz ? "Tasdiqlash" : "Verify",
    btnResend: isRu ? "Отправить заново" : isUz ? "Qayta yuborish" : "Resend",
    btnBack: isRu ? "Назад" : isUz ? "Orqaga" : "Back",
    
    errorName: isRu ? "Введите имя" : isUz ? "Ismni kiriting" : "Enter your name",
    errorEmail: isRu ? "Введите email" : isUz ? "Emailni kiriting" : "Enter email",
    errorEmailInvalid: isRu ? "Неверный формат email" : isUz ? "Email formati noto'g'ri" : "Invalid email format",
    errorCode: isRu ? "Неверный код" : isUz ? "Kod noto'g'ri" : "Invalid code",
    errorCodeEmpty: isRu ? "Введите код" : isUz ? "Kodni kiriting" : "Enter the code",

    verified: isRu ? "Авторизован" : isUz ? "Tasdiqlangan" : "Verified",
    creatorBadge: isRu ? "👑 Создатель Sprint" : isUz ? "👑 Sprint Yaratuvchisi" : "👑 Sprint Creator",
    btnOpenAdmin: isRu ? "👑 Войти в панель Создателя" : isUz ? "👑 Yaratuvchi paneliga kirish" : "👑 Open Creator Panel",
    logout: isRu ? "Выйти из аккаунта" : isUz ? "Profildan chiqish" : "Log out",
    close: isRu ? "Закрыть" : isUz ? "Yopish" : "Close",
    security: isRu ? "Защищённая авторизация Sprint" : isUz ? "Sprint xavfsiz avtorizatsiya" : "Secure Sprint Authentication",
    
    fallbackCodeMsg: isRu 
      ? "Ваш код подтверждения:" 
      : isUz 
      ? "Tasdiqlash kodingiz:" 
      : "Your verification code:"
  };

  if (!isAuthOpen) return null;

  const handleClose = () => {
    setIsAuthOpen(false);
    setStep('form');
    setName('');
    setEmail('');
    setCode('');
    setRealCode(null);
    setError('');
    setLoading(false);
  };

  const handleOpenCreatorPanel = () => {
    setIsAuthOpen(false);
    setIsAdminOpen(true);
  };

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSendCode = async () => {
    setError('');
    if (!name.trim()) { setError(t.errorName); return; }
    if (!email.trim()) { setError(t.errorEmail); return; }
    if (!validateEmail(email.trim())) { setError(t.errorEmailInvalid); return; }

    setLoading(true);
    try {
      const result = await emailAuthService.sendVerificationCode(name.trim(), email.trim());
      
      if (result.success) {
        setStep('code');
        
        // If email was NOT sent (EmailJS not configured), show the code as fallback
        if (!result.emailSent) {
          setRealCode(result.code);
        } else {
          setRealCode(null);
        }
      }
    } catch {
      setError(isRu ? "Ошибка отправки" : "Yuborishda xatolik");
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setError('');
    if (!code.trim() || code.trim().length < 4) { setError(t.errorCodeEmpty); return; }

    setLoading(true);
    try {
      const result = await emailAuthService.verifyCode(code.trim(), email.trim());
      
      if (result.verified) {
        const finalName = result.userName || name.trim();
        const finalEmail = result.email || email.trim().toLowerCase();
        
        // Use email as phone for the login system
        loginUser(finalEmail, finalName);
        handleClose();
        showToast(isRu ? `Добро пожаловать, ${finalName}!` : `Xush kelibsiz, ${finalName}!`, "success");
      } else {
        setError(t.errorCode);
      }
    } catch {
      setError(t.errorCode);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setCode('');
    setError('');
    setLoading(true);
    try {
      const result = await emailAuthService.sendVerificationCode(name.trim(), email.trim());
      if (!result.emailSent) {
        setRealCode(result.code);
      }
      showToast(isRu ? "Код отправлен заново" : "Kod qayta yuborildi", "success");
    } catch {
      // ignore
    }
    setLoading(false);
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
            /* ═══════ LOGGED IN PROFILE ═══════ */
            <div className="p-6 sm:p-8 text-center space-y-5">
              <div className={`w-16 h-16 rounded-full text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg ${
                isAdmin 
                  ? 'bg-gradient-to-tr from-amber-500 via-[#7000FF] to-[#ff4d6d] shadow-purple-500/30' 
                  : 'bg-gradient-to-tr from-[#7000FF] to-[#9333ea] shadow-purple-500/25'
              }`}>
                {isAdmin ? <Crown className="w-8 h-8 text-amber-300 animate-pulse" /> : displayName.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">
                    {displayName}
                  </h3>
                  {isAdmin && <span className="text-amber-500 text-xs">👑</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{user.phone}</p>
                
                <span className={`inline-flex items-center gap-1.5 mt-2.5 text-xs font-bold px-3 py-1 rounded-full ${
                  isAdmin 
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                    : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                }`}>
                  {isAdmin ? (
                    <>
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t.creatorBadge}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>{t.verified}</span>
                    </>
                  )}
                </span>
              </div>

              {isAdmin && (
                <div className="pt-2">
                  <button
                    onClick={handleOpenCreatorPanel}
                    className="w-full bg-gradient-to-r from-amber-500 via-[#7000FF] to-[#ff4d6d] hover:brightness-110 active:scale-95 text-white font-black py-3.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between shadow-xl shadow-purple-500/25 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-300" />
                      <span>{t.btnOpenAdmin}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 dark:border-[#2a2a36] space-y-2">
                <button onClick={logoutUser} className="w-full bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-bold py-2.5 rounded-xl text-xs transition-colors">
                  {t.logout}
                </button>
                <button onClick={handleClose} className="w-full bg-gray-100 dark:bg-[#282834] hover:bg-gray-200 dark:hover:bg-[#323242] text-gray-800 dark:text-gray-200 font-bold py-2.5 rounded-xl text-xs transition-colors">
                  {t.close}
                </button>
              </div>
            </div>

          ) : step === 'form' ? (
            /* ═══════ STEP 1: NAME + EMAIL FORM ═══════ */
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#7000FF] to-[#9333ea] text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/30">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">{t.title}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs mx-auto">{t.desc}</p>
              </div>

              <div className="space-y-3">
                {/* Name Input */}
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder={t.namePlaceholder}
                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-[#232330] border border-gray-200 dark:border-[#333345] rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    autoComplete="name"
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-[#232330] border border-gray-200 dark:border-[#333345] rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    autoComplete="email"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-rose-500 font-medium px-1">{error}</p>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#7000FF] to-[#9333ea] hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:active:scale-100 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-purple-500/25 transition-all mt-1 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>{t.btnSendCode}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2a2a36] flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
                <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
                <span>{t.security}</span>
              </div>
            </div>

          ) : (
            /* ═══════ STEP 2: ENTER VERIFICATION CODE ═══════ */
            <div className="p-6 sm:p-8 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#7000FF] to-[#9333ea] text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-500/30">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">{t.codeTitle}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{t.codeDesc}</p>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-1">{email}</p>
              </div>

              {/* Show code as fallback if email not sent */}
              {realCode && (
                <div className="mb-4 p-3.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl text-center">
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 mb-1.5">{t.fallbackCodeMsg}</p>
                  <p className="text-3xl font-black tracking-[0.3em] text-purple-700 dark:text-purple-300 font-mono">{realCode}</p>
                </div>
              )}

              <div className="space-y-3">
                {/* Code Input */}
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder={t.codePlaceholder}
                    className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-[#232330] border border-gray-200 dark:border-[#333345] rounded-xl text-center text-2xl font-black tracking-[0.3em] text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-rose-500 font-medium px-1">{error}</p>
                )}

                {/* Verify Button */}
                <button
                  onClick={handleVerifyCode}
                  disabled={loading || code.length < 4}
                  className="w-full bg-gradient-to-r from-[#7000FF] to-[#9333ea] hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:active:scale-100 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-purple-500/25 transition-all cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{t.btnVerify}</span>
                    </>
                  )}
                </button>

                {/* Resend + Back */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setStep('form'); setCode(''); setRealCode(null); setError(''); }}
                    className="flex-1 py-2.5 text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-[#282834] rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t.btnBack}
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="flex-1 py-2.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl transition-colors"
                  >
                    {t.btnResend}
                  </button>
                </div>
              </div>

              {/* Security Footer */}
              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-[#2a2a36] flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>{t.security}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
