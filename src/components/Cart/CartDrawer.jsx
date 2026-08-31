import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ArrowRight, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { getFallbackImage } from '../../data/products';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    cartItemsCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    formatPrice,
    formatInstallment,
    setIsCheckoutOpen,
    setSelectedProductDetail,
    user,
    setIsAuthOpen,
    showToast,
    t,
    getProductTitle
  } = useShop();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    // Require authentication before purchasing
    if (!user.isLoggedIn) {
      showToast("Buyurtma berish uchun avval tizimga kiring / Войдите в аккаунт", "info");
      setIsCartOpen(false);
      setIsAuthOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
        <div className="w-screen max-w-md bg-white dark:bg-[#181820] shadow-2xl flex flex-col justify-between animate-slide-up transition-colors duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#e8e8ed] dark:border-[#282832] flex items-center justify-between bg-white dark:bg-[#181820]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#7000FF] dark:text-[#a366ff]" />
              <h2 className="text-lg font-black text-[#141415] dark:text-white">
                {t('cart')}
              </h2>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-[#7000FF] dark:text-[#c29aff] font-bold px-2 py-0.5 rounded-full">
                {cartItemsCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('clear')}</span>
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#282834] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delivery Progress Alert */}
          <div className="bg-[#f0fdf4] dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40 px-4 py-2.5 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t('freeDeliveryProgress')}</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-[#7000FF] dark:text-[#a366ff]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('cartEmpty')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                  {t('cartEmptyDesc')}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 bg-[#7000FF] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#6000e0] transition-colors"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div 
                  key={`${item.product.id}-${idx}`}
                  className="bg-white dark:bg-[#1f1f28] rounded-xl border border-gray-200 dark:border-[#2e2e3a] p-3.5 flex gap-3 shadow-xs hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallbackImage(item.product.title, item.product.category);
                    }}
                    onClick={() => {
                      setSelectedProductDetail(item.product);
                      setIsCartOpen(false);
                    }}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-100 dark:bg-[#282834] shrink-0 cursor-pointer"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 
                          onClick={() => {
                            setSelectedProductDetail(item.product);
                            setIsCartOpen(false);
                          }}
                          className="text-xs font-semibold text-[#141415] dark:text-white line-clamp-2 hover:text-[#7000FF] dark:hover:text-[#a366ff] cursor-pointer"
                        >
                          {getProductTitle(item.product)}
                        </h4>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-gray-400 hover:text-rose-500 p-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Options */}
                      <div className="flex gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        <span>{t('color')}: <strong>{item.selectedColor}</strong></span>
                        {item.selectedSize !== 'Standart' && (
                          <span>{t('size')}: <strong>{item.selectedSize}</strong></span>
                        )}
                      </div>
                    </div>

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-[#2a2a36]">
                      <div>
                        <span className="text-sm font-extrabold text-[#141415] dark:text-white">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-gray-400 block">
                            {formatPrice(item.product.price)} x {item.quantity}
                          </span>
                        )}
                      </div>

                      {/* Counter */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(idx, -1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800 dark:text-gray-200 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, 1)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#e8e8ed] dark:border-[#282832] bg-white dark:bg-[#181820] space-y-3 shadow-lg">
              {/* Installment preview */}
              <div className="bg-[#fff8eb] dark:bg-[#2a2214] p-2.5 rounded-xl border border-[#ffe4b0] dark:border-[#4a3a1e] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#804b00] dark:text-[#ffc966] font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t('nasiyaTab')}:</span>
                </div>
                <span className="font-extrabold text-amber-700 dark:text-amber-400">
                  {formatInstallment(cartTotal, 12)}
                </span>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>{t('itemsPrice')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>{t('deliveryFee')}</span>
                  <span>{t('oneDay')} (Free)</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>{t('totalPayment')}</span>
                  <span className="text-[#7000FF] dark:text-[#a366ff]">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#7000FF] hover:bg-[#6000e0] active:scale-95 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sprint hover:shadow-sprint-hover transition-all"
              >
                {!user.isLoggedIn && <Lock className="w-4 h-4 text-purple-200" />}
                <span>{user.isLoggedIn ? t('proceedToCheckout') : "Войдите для оформления заказа"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
