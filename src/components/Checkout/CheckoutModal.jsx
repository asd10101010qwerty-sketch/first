import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  Sparkles, 
  ArrowRight,
  Phone,
  User as UserIcon,
  CheckCircle2,
  Calendar,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../../context/ShopContext';
import { pickupPoints } from '../../data/pickupPoints';
import { getFallbackImage } from '../../data/products';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    formatPrice,
    formatInstallment,
    placeOrder,
    user,
    setIsAuthOpen,
    setIsOrdersOpen,
    showToast,
    selectedPickupPoint,
    setSelectedPickupPoint,
    t,
    getProductTitle
  } = useShop();

  const [deliveryType, setDeliveryType] = useState('pvz'); // 'pvz' | 'courier'
  const [address, setAddress] = useState('');
  const [name, setName] = useState(user.isLoggedIn ? user.name : '');
  const [phone, setPhone] = useState(user.isLoggedIn ? user.phone : '+998 ');
  const [paymentMethod, setPaymentMethod] = useState('uzcard'); // 'nasiya' | 'uzcard' | 'visa' | 'cash'
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Sync user info when logged in
  React.useEffect(() => {
    if (user.isLoggedIn) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SPRINT2026' || promoCode.trim().toUpperCase() === 'SPRINT10') {
      const disc = Math.round(cartTotal * 0.10);
      setDiscountAmount(disc);
      setPromoApplied(true);
      showToast("10% promo discount applied!", "success");
    } else {
      showToast("Invalid promo code (Try: SPRINT2026)", "error");
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount + (deliveryType === 'courier' ? 20000 : 0));

  const handleCompleteOrder = (e) => {
    e.preventDefault();

    if (!user.isLoggedIn) {
      showToast("Xarid qilish uchun avval hisobingizga kiring / Войдите в аккаунт", "info");
      setIsCheckoutOpen(false);
      setIsAuthOpen(true);
      return;
    }

    if (!name.trim()) {
      showToast("Please enter your name", "error");
      return;
    }

    if (!phone.trim() || phone.length < 9) {
      showToast("Please enter a valid phone number", "error");
      return;
    }

    const orderData = {
      recipientName: name,
      recipientPhone: phone,
      deliveryType: deliveryType === 'pvz' ? selectedPickupPoint.name : `Courier: ${address || 'Toshkent sh.'}`,
      deliveryAddress: deliveryType === 'pvz' ? selectedPickupPoint.address : address,
      paymentMethod: 
        paymentMethod === 'nasiya' ? "Sprint Nasiya 0-0-12" :
        paymentMethod === 'uzcard' ? "Uzcard / Humo" :
        paymentMethod === 'visa' ? "Visa / Mastercard" : "Cash on delivery",
      totalAmount: finalTotal,
      discountAmount,
      items: cart.map(item => ({
        id: item.product.id,
        title: getProductTitle(item.product),
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
        image: item.product.images[0]
      }))
    };

    const newOrder = placeOrder(orderData);
    setOrderSuccess(newOrder);

    // Launch Confetti animation
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="relative bg-white dark:bg-[#1a1a22] rounded-3xl shadow-2xl border border-[#e8e8ed] dark:border-[#2e2e38] w-full max-w-4xl overflow-hidden z-10 animate-scale-in my-8 transition-colors duration-200">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 dark:bg-[#282834] hover:bg-gray-200 dark:hover:bg-[#323242] text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {orderSuccess ? (
            /* Order Success View */
            <div className="p-6 sm:p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-900/50 text-[#7000FF] dark:text-[#c29aff] px-3 py-1 rounded-full">
                  {t('orderSuccessTitle')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  {t('thankYou')}, {orderSuccess.recipientName}!
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  {t('yourOrderNumber')}: <strong className="text-[#7000FF] dark:text-[#a366ff]">{orderSuccess.id}</strong>. {t('willDeliver1Day')}
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-[#f7f7f9] dark:bg-[#14141a] p-5 rounded-2xl border border-gray-200 dark:border-[#2a2a36] max-w-lg mx-auto text-left space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">{t('deliveryMethod')}:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{orderSuccess.deliveryType}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">{t('deliveryAddress')}:</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right max-w-[240px]">{orderSuccess.deliveryAddress}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-500 dark:text-gray-400">{t('paymentMethod')}:</span>
                  <span className="font-bold text-[#7000FF] dark:text-[#a366ff]">{orderSuccess.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-1 text-base font-black text-gray-900 dark:text-white">
                  <span>{t('totalPayment')}</span>
                  <span className="text-[#7000FF] dark:text-[#a366ff]">{formatPrice(orderSuccess.totalAmount)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    handleClose();
                    setIsOrdersOpen(true);
                  }}
                  className="w-full sm:w-auto bg-[#7000FF] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#6000e0] transition-colors"
                >
                  {t('viewMyOrders')}
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-gray-100 dark:bg-[#282834] text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-gray-200 dark:hover:bg-[#323242] transition-colors"
                >
                  {t('backToHome')}
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleCompleteOrder} className="p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>{t('checkoutTitle')}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                  {t('oneDay')}
                </span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Columns: Form Fields (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* 1. Delivery Method */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block">
                      {t('deliveryMethod')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('pvz')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          deliveryType === 'pvz'
                            ? 'border-[#7000FF] bg-[#f5f0ff] dark:bg-[#2c2045] ring-2 ring-[#7000FF]/20'
                            : 'border-gray-200 dark:border-[#2e2e38] hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <MapPin className={`w-5 h-5 ${deliveryType === 'pvz' ? 'text-[#7000FF] dark:text-[#a366ff]' : 'text-gray-400'}`} />
                          <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            Free (1 day)
                          </span>
                        </div>
                        <p className="font-bold text-xs text-gray-900 dark:text-white">{t('sprintPvz')}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{t('sprintPvzDesc')}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('courier')}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          deliveryType === 'courier'
                            ? 'border-[#7000FF] bg-[#f5f0ff] dark:bg-[#2c2045] ring-2 ring-[#7000FF]/20'
                            : 'border-gray-200 dark:border-[#2e2e38] hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Truck className={`w-5 h-5 ${deliveryType === 'courier' ? 'text-[#7000FF] dark:text-[#a366ff]' : 'text-gray-400'}`} />
                          <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-900/50 text-[#7000FF] dark:text-[#c29aff] px-1.5 py-0.5 rounded">
                            20 000 UZS
                          </span>
                        </div>
                        <p className="font-bold text-xs text-gray-900 dark:text-white">{t('courierDelivery')}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{t('courierDesc')}</p>
                      </button>
                    </div>

                    {/* Choose PVZ */}
                    {deliveryType === 'pvz' ? (
                      <div className="p-3.5 bg-gray-50 dark:bg-[#20202a] rounded-2xl border border-gray-200 dark:border-[#2e2e38]">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                          {t('choosePvz')}
                        </label>
                        <select
                          value={selectedPickupPoint.id}
                          onChange={(e) => {
                            const found = pickupPoints.find(p => p.id === e.target.value);
                            if (found) setSelectedPickupPoint(found);
                          }}
                          className="w-full bg-white dark:bg-[#181820] border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white font-medium focus:border-[#7000FF] outline-none"
                        >
                          {pickupPoints.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.city} - {p.name} ({p.address})
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{t('readyTomorrow')}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-gray-50 dark:bg-[#20202a] rounded-2xl border border-gray-200 dark:border-[#2e2e38]">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                          {t('deliveryAddress')}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tashkent, Chilanzar 5, Apt 45"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-white dark:bg-[#181820] border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-[#7000FF]"
                        />
                      </div>
                    )}
                  </div>

                  {/* 2. Recipient Data */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block">
                      {t('recipientInfo')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">{t('fullName')}</label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="Azizbek Qodirov"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#20202a] border border-gray-200 dark:border-[#2e2e38] rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:border-[#7000FF] focus:bg-white dark:focus:bg-[#181820]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">{t('phone')}</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            placeholder="+998 90 123 45 67"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#20202a] border border-gray-200 dark:border-[#2e2e38] rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:border-[#7000FF] focus:bg-white dark:focus:bg-[#181820] font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Payment Method */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block">
                      {t('paymentMethod')}
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Sprint Nasiya */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('nasiya')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentMethod === 'nasiya'
                            ? 'border-[#7000FF] bg-[#fff8eb] dark:bg-[#2a2214] ring-2 ring-amber-400'
                            : 'border-gray-200 dark:border-[#2e2e38] hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs mb-1">
                          <Sparkles className="w-4 h-4" />
                          <span>Sprint Nasiya 0-0-12</span>
                        </div>
                        <p className="text-[11px] text-gray-700 dark:text-gray-300 font-medium">12 month installment</p>
                      </button>

                      {/* Uzcard / Humo */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('uzcard')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentMethod === 'uzcard'
                            ? 'border-[#7000FF] bg-[#f5f0ff] dark:bg-[#2c2045] ring-2 ring-[#7000FF]/20'
                            : 'border-gray-200 dark:border-[#2e2e38] hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold text-xs mb-1">
                          <CreditCard className="w-4 h-4 text-[#7000FF] dark:text-[#a366ff]" />
                          <span>Uzcard / Humo</span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Online banking cards</p>
                      </button>

                      {/* Visa / MasterCard */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('visa')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentMethod === 'visa'
                            ? 'border-[#7000FF] bg-[#f5f0ff] dark:bg-[#2c2045] ring-2 ring-[#7000FF]/20'
                            : 'border-gray-200 dark:border-[#2e2e38] hover:border-gray-300'
                        }`}
                      >
                        <p className="font-bold text-xs text-gray-900 dark:text-white mb-1">Visa / Mastercard</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">International cards</p>
                      </button>

                      {/* Cash on pickup */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentMethod === 'cash'
                            ? 'border-[#7000FF] bg-[#f5f0ff] dark:bg-[#2c2045] ring-2 ring-[#7000FF]/20'
                            : 'border-gray-200 dark:border-[#2e2e38] hover:border-gray-300'
                        }`}
                      >
                        <p className="font-bold text-xs text-gray-900 dark:text-white mb-1">Cash on Delivery</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Pay when receiving</p>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Column: Order Summary & Confirm (5 cols) */}
                <div className="lg:col-span-5 bg-[#fafafc] dark:bg-[#14141a] p-5 rounded-2xl border border-gray-200 dark:border-[#2a2a36] flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800">
                      {t('cart')} ({cart.length})
                    </h3>

                    {/* Small list */}
                    <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.title} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getFallbackImage(item.product.title, item.product.category);
                            }}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100 dark:bg-[#242430] shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{getProductTitle(item.product)}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-[11px]">{item.quantity} × {formatPrice(item.product.price)}</p>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white shrink-0">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Input */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t('promoPlaceholder')}
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#20202a] border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-[#7000FF] uppercase text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="bg-[#7000FF] hover:bg-[#6000e0] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0"
                        >
                          {t('apply')}
                        </button>
                      </div>
                      {promoApplied && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5" />
                          <span>10% discount promo applied!</span>
                        </p>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex justify-between">
                        <span>{t('itemsPrice')}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(cartTotal)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                          <span>{t('promoDiscount')}</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>{t('deliveryFee')}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {deliveryType === 'pvz' ? 'Free' : '20 000 UZS'}
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-300 dark:border-gray-700">
                        <span>{t('totalPayment')}</span>
                        <span className="text-[#7000FF] dark:text-[#a366ff]">{formatPrice(finalTotal)}</span>
                      </div>

                      {paymentMethod === 'nasiya' && (
                        <div className="p-2 rounded-lg bg-amber-50 dark:bg-[#2a2214] text-amber-800 dark:text-amber-300 font-bold text-xs text-center border border-amber-200 dark:border-[#4a3a1e] mt-2">
                          {formatInstallment(finalTotal, 12)}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#7000FF] hover:bg-[#6000e0] active:scale-95 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sprint hover:shadow-sprint-hover transition-all mt-4"
                  >
                    <span>{t('placeOrder')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
