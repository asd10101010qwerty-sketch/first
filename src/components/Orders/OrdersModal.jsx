import React from 'react';
import { 
  X, 
  Package, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  CreditCard 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { getFallbackImage } from '../../data/products';

export const OrdersModal = () => {
  const {
    isOrdersOpen,
    setIsOrdersOpen,
    orders,
    formatPrice,
    t
  } = useShop();

  if (!isOrdersOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsOrdersOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div className="relative bg-white dark:bg-[#1a1a22] rounded-3xl shadow-2xl border border-[#e8e8ed] dark:border-[#2e2e38] w-full max-w-4xl overflow-hidden z-10 animate-scale-in my-8 transition-colors duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-[#2e2e38] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-[#7000FF] dark:text-[#a366ff]" />
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {t('myOrders')}
              </h2>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-[#7000FF] dark:text-[#c29aff] font-bold px-2.5 py-0.5 rounded-full">
                {orders.length}
              </span>
            </div>

            <button
              onClick={() => setIsOrdersOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#282834] hover:bg-gray-200 dark:hover:bg-[#323242] text-gray-700 dark:text-gray-300 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Orders List */}
          <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
            {orders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-950/40 text-[#7000FF] dark:text-[#c29aff] flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('noOrdersYet')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {t('noOrdersDesc')}
                </p>
                <button
                  onClick={() => setIsOrdersOpen(false)}
                  className="mt-2 bg-[#7000FF] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#6000e0] transition-colors"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const isDelivered = order.statusCode === 'delivered';

                return (
                  <div 
                    key={order.id}
                    className="bg-[#fafafc] dark:bg-[#14141a] rounded-2xl border border-gray-200 dark:border-[#2a2a36] p-4 sm:p-5 space-y-4 hover:border-purple-200 transition-colors"
                  >
                    {/* Top Row: ID, Date, Status */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-200 dark:border-[#2a2a36] text-xs">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{order.id}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {new Date(order.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`px-3 py-1 rounded-full font-extrabold text-xs flex items-center gap-1 ${
                          isDelivered 
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                            : 'bg-purple-100 dark:bg-purple-900/60 text-[#7000FF] dark:text-[#c29aff]'
                        }`}>
                          {isDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          <span>{order.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-center">
                        <span className="text-[#7000FF] dark:text-[#a366ff]">1. Received</span>
                        <span className={isDelivered ? 'text-[#7000FF] dark:text-[#a366ff]' : 'text-purple-600 font-semibold'}>2. Packaging</span>
                        <span className={isDelivered ? 'text-[#7000FF] dark:text-[#a366ff]' : 'text-purple-400'}>3. In Transit</span>
                        <span className={isDelivered ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}>4. Delivered</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isDelivered ? 'w-full bg-emerald-500' : 'w-1/2 bg-[#7000FF]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white dark:bg-[#1e1e26] p-3.5 rounded-xl border border-gray-200 dark:border-[#2e2e3a]">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block mb-0.5">{t('deliveryMethod')}:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#7000FF] dark:text-[#a366ff] shrink-0" />
                          <span>{order.deliveryType}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 block mb-0.5">{t('paymentMethod')}:</span>
                        <span className="font-bold text-[#7000FF] dark:text-[#c29aff] flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-[#7000FF] dark:text-[#a366ff] shrink-0" />
                          <span>{order.paymentMethod}</span>
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items Preview */}
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-white dark:bg-[#1e1e26] p-2.5 rounded-xl border border-gray-100 dark:border-[#2a2a34]">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getFallbackImage(item.title, 'elektronika');
                              }}
                              className="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0" 
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{item.title}</p>
                              <p className="text-gray-500 dark:text-gray-400 text-[11px]">{item.color} • {item.quantity} qty</p>
                            </div>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Total */}
                    <div className="flex justify-between items-center pt-2 text-sm font-black text-gray-900 dark:text-white">
                      <span>{t('totalPayment')}</span>
                      <span className="text-[#7000FF] dark:text-[#a366ff] text-base">{formatPrice(order.totalAmount)}</span>
                    </div>

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
