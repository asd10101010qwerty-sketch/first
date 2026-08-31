import React, { useState, useMemo } from 'react';
import { 
  X, 
  Crown, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  BarChart3, 
  Store,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  Calendar
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { categories } from '../../data/categories';
import { getFallbackImage } from '../../data/products';

export const AdminModal = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdmin,
    user,
    orders,
    registeredUsers,
    updateOrderStatus,
    deleteOrder,
    products,
    addProduct,
    deleteProduct,
    formatPrice,
    language,
    showToast
  } = useShop();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'orders' | 'products' | 'users'
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  
  // Product Management State
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    titleRu: '',
    titleEn: '',
    category: 'elektronika',
    subcategory: 'Smartfonlar',
    price: '',
    oldPrice: '',
    discountPercent: 0,
    image: '',
    stock: 50,
    description: ''
  });

  const isRu = language === 'ru';
  const isUz = language === 'uz';

  // Multilingual translations for Admin Panel
  const labels = {
    creatorTitle: isRu ? "Панель Создателя: Sprint383" : isUz ? "Yaratuvchi paneli: Sprint383" : "Creator Panel: Sprint383",
    creatorBadge: isRu ? "👑 Владелец" : isUz ? "👑 Egasi" : "👑 Owner",
    creatorSub: isRu ? "Создатель платформы: Sprint383 (+998 94 939 25 21)" : isUz ? "Platforma yaratuvchisi: Sprint383 (+998 94 939 25 21)" : "Platform Creator: Sprint383 (+998 94 939 25 21)",
    
    tabAnalytics: isRu ? "Доход и Аналитика" : isUz ? "Daromad va Tahlil" : "Revenue & Analytics",
    tabOrders: isRu ? "Реальные Заказы" : isUz ? "Haqiqiy Buyurtmalar" : "Real Orders",
    tabProducts: isRu ? "Товары" : isUz ? "Mahsulotlar" : "Products",
    tabUsers: isRu ? "Пользователи" : isUz ? "Foydalanuvchilar" : "Users",
    
    totalRevenue: isRu ? "Общий оборот заказов" : isUz ? "Umumiy aylanma daromad" : "Total Order Revenue",
    creatorProfit: isRu ? "Чистая прибыль Sprint383 (15%)" : isUz ? "Sprint383 sof foydasi (15%)" : "Sprint383 Net Profit (15%)",
    profitDesc: isRu ? "Комиссия создателя с продаж" : isUz ? "Savdolardan yaratuvchi komissiyasi" : "Creator commission from sales",
    realUsersCount: isRu ? "Реальные пользователи" : isUz ? "Haqiqiy foydalanuvchilar" : "Real Users",
    realOrdersCount: isRu ? "Оформлено заказов" : isUz ? "Rasmiylashtirilgan buyurtmalar" : "Total Orders Placed",
    avgCheck: isRu ? "Средний чек" : isUz ? "O'rtacha chek" : "Average Order Value",
    
    noOrdersTitle: isRu ? "Пока нет оформленных заказов" : isUz ? "Hozircha buyurtmalar yo'q" : "No orders placed yet",
    noOrdersDesc: isRu ? "Как только покупатели оформят заказы на сайте, они моментально появятся здесь." : isUz ? "Xaridorlar saytda buyurtma berishlari bilanoq ular shu yerda ko'rinadi." : "As soon as users place orders, they will appear here live.",
    
    searchOrdersPlaceholder: isRu ? "Поиск по ID, клиенту или телефону..." : isUz ? "ID, xaridor yoki telefon bo'yicha qidiruv..." : "Search by ID, customer or phone...",
    searchProductsPlaceholder: isRu ? "Поиск товара по названию..." : isUz ? "Mahsulot nomi bo'yicha qidiruv..." : "Search products by title...",
    
    btnAddProduct: isRu ? "+ Добавить новый товар" : isUz ? "+ Yangi mahsulot qo'shish" : "+ Add New Product",
    addModalTitle: isRu ? "Добавление нового товара в каталог" : isUz ? "Katalogga yangi mahsulot qo'shish" : "Add Product to Catalog",
    prodTitleUz: isRu ? "Название (Узбекский) *" : isUz ? "Nomi (O'zbekcha) *" : "Title (Uzbek) *",
    prodTitleRu: isRu ? "Название (Русский)" : isUz ? "Nomi (Ruscha)" : "Title (Russian)",
    prodCategory: isRu ? "Категория" : isUz ? "Kategoriya" : "Category",
    prodPrice: isRu ? "Цена продажи (сум) *" : isUz ? "Sotuv narxi (so'm) *" : "Price (UZS) *",
    prodOldPrice: isRu ? "Старая цена (сум)" : isUz ? "Eski narx (so'm)" : "Old Price (UZS)",
    prodDiscount: isRu ? "Скидка (%)" : isUz ? "Chegirma (%)" : "Discount (%)",
    prodStock: isRu ? "Остаток на складе (шт)" : isUz ? "Ombordagi qoldiq (dona)" : "Stock Quantity",
    prodImageUrl: isRu ? "Ссылка на фото (URL)" : isUz ? "Rasm havolasi (URL)" : "Image URL",
    btnPublish: isRu ? "Опубликовать товар" : isUz ? "Mahsulotni chop etish" : "Publish Product",
    btnCancel: isRu ? "Отмена" : isUz ? "Bekor qilish" : "Cancel",
    
    orderStatusLabel: isRu ? "Статус заказа:" : isUz ? "Buyurtma holati:" : "Order Status:",
    deleteOrderBtn: isRu ? "Удалить заказ" : isUz ? "Buyurtmani o'chirish" : "Delete order",
    customerLabel: isRu ? "Покупатель" : isUz ? "Xaridor" : "Customer",
    phoneLabel: isRu ? "Телефон" : isUz ? "Telefon" : "Phone",
    pvzLabel: isRu ? "Пункт получения" : isUz ? "Qabul qilish manzili" : "Pickup Point",
    totalSumLabel: isRu ? "Сумма заказа:" : isUz ? "Buyurtma summasi:" : "Order Total:",
    
    registeredUsersTitle: isRu ? "База реальных пользователей платформы" : isUz ? "Platformadagi haqiqiy foydalanuvchilar bazasi" : "Real Registered Users Database",
    registeredAt: isRu ? "Дата регистрации" : isUz ? "Ro'yxatdan o'tgan vaqti" : "Registered At",
    userRoleCreator: isRu ? "👑 Создатель" : isUz ? "👑 Yaratuvchi" : "👑 Creator",
    userRoleCustomer: isRu ? "Покупатель" : isUz ? "Xaridor" : "Customer",
    ordersCountShort: (c) => isRu ? `${c} зак.` : isUz ? `${c} ta buyurtma` : `${c} orders`,
    closeBtn: isRu ? "Закрыть панель" : isUz ? "Panelni yopish" : "Close Panel"
  };

  // Calculate live financial and platform metrics from pure real data
  const stats = useMemo(() => {
    // Total revenue calculated purely from real placed orders
    const totalPlatformRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    // 15% Marketplace Creator commission
    const creatorNetProfit = Math.round(totalPlatformRevenue * 0.15);
    // Dynamic real users and orders count
    const totalUsersCount = registeredUsers.length;
    const totalOrdersCount = orders.length;
    const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalPlatformRevenue / totalOrdersCount) : 0;

    return {
      totalPlatformRevenue,
      creatorNetProfit,
      totalUsersCount,
      totalOrdersCount,
      averageOrderValue
    };
  }, [orders, registeredUsers]);

  if (!isAdminOpen) return null;

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      (o.id && o.id.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.customerPhone && o.customerPhone.includes(orderSearch));

    const matchesStatus = 
      orderStatusFilter === 'all' || 
      (orderStatusFilter === 'processing' && (o.status?.includes('обработке') || o.status?.includes('Ko\'rib') || o.statusCode === 'processing')) ||
      (orderStatusFilter === 'in_transit' && (o.status?.includes('пути') || o.status?.includes('Yo\'lda') || o.statusCode === 'in_transit')) ||
      (orderStatusFilter === 'ready' && (o.status?.includes('выдаче') || o.status?.includes('Tayyor') || o.statusCode === 'ready_for_pickup')) ||
      (orderStatusFilter === 'delivered' && (o.status?.includes('Доставлен') || o.status?.includes('Yetkazildi') || o.statusCode === 'delivered'));

    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.titleRu && p.titleRu.toLowerCase().includes(productSearch.toLowerCase())) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title.trim() || !newProduct.price) {
      showToast(isRu ? "Укажите название и цену товара" : "Mahsulot nomi va narxini kiriting", "error");
      return;
    }

    addProduct({
      title: newProduct.title,
      titleRu: newProduct.titleRu || newProduct.title,
      titleEn: newProduct.titleEn || newProduct.title,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      price: Number(newProduct.price),
      oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : null,
      discountPercent: Number(newProduct.discountPercent) || 0,
      image: newProduct.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      stock: Number(newProduct.stock) || 50,
      description: newProduct.description
    });

    setIsAddProductOpen(false);
    setNewProduct({
      title: '',
      titleRu: '',
      titleEn: '',
      category: 'elektronika',
      subcategory: 'Smartfonlar',
      price: '',
      oldPrice: '',
      discountPercent: 0,
      image: '',
      stock: 50,
      description: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={() => setIsAdminOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 lg:p-6">
        <div className="relative bg-[#121217] text-white rounded-3xl shadow-2xl border border-purple-500/30 w-full max-w-6xl overflow-hidden z-10 animate-scale-in my-6">
          
          {/* Header Bar with Creator Badge */}
          <div className="p-4 sm:p-6 bg-[#181822] border-b border-[#282838] flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#7000FF] to-[#ff4d6d] p-0.5 shadow-lg shadow-purple-500/30">
                <div className="w-full h-full bg-[#121217] rounded-2xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {labels.creatorTitle}
                  </h1>
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    {labels.creatorBadge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {labels.creatorSub}
                </p>
              </div>
            </div>

            {/* Navigation Tabs (Multilingual) */}
            <div className="flex items-center gap-1.5 bg-[#121217] p-1.5 rounded-2xl border border-[#282838] overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'analytics' 
                    ? 'bg-[#7000FF] text-white shadow-sprint' 
                    : 'text-gray-400 hover:text-white hover:bg-[#20202e]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{labels.tabAnalytics}</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'orders' 
                    ? 'bg-[#7000FF] text-white shadow-sprint' 
                    : 'text-gray-400 hover:text-white hover:bg-[#20202e]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{labels.tabOrders}</span>
                <span className="bg-purple-500/30 text-purple-300 text-[10px] px-1.5 py-0.2 rounded-full">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'products' 
                    ? 'bg-[#7000FF] text-white shadow-sprint' 
                    : 'text-gray-400 hover:text-white hover:bg-[#20202e]'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>{labels.tabProducts} ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'users' 
                    ? 'bg-[#7000FF] text-white shadow-sprint' 
                    : 'text-gray-400 hover:text-white hover:bg-[#20202e]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{labels.tabUsers} ({registeredUsers.length})</span>
              </button>
            </div>

            {/* Close */}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl bg-[#20202e] text-gray-400 hover:text-white hover:bg-[#2c2c3e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
            
            {/* TAB 1: 📊 ДОХОД И АНАЛИТИКА (PURE REAL STATS) */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* 4 Main Real Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Total Order Revenue */}
                  <div className="bg-gradient-to-br from-[#1c1c28] to-[#14141e] p-5 rounded-2xl border border-[#2a2a3e] relative overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                      <span>{labels.totalRevenue}</span>
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mt-3 font-mono">
                      {formatPrice(stats.totalPlatformRevenue)}
                    </h3>
                    <div className="text-xs text-gray-400 mt-2">
                      {orders.length} {labels.realOrdersCount.toLowerCase()}
                    </div>
                  </div>

                  {/* Creator Net Profit (15%) */}
                  <div className="bg-gradient-to-br from-[#241a38] to-[#171224] p-5 rounded-2xl border border-purple-500/40 relative overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between text-purple-300 text-xs font-bold">
                      <span>{labels.creatorProfit}</span>
                      <div className="p-2 rounded-xl bg-purple-500/30 text-purple-300">
                        <Crown className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-amber-300 mt-3 font-mono">
                      {formatPrice(stats.creatorNetProfit)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-2 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{labels.profitDesc}</span>
                    </div>
                  </div>

                  {/* Real Registered Users */}
                  <div className="bg-gradient-to-br from-[#1c1c28] to-[#14141e] p-5 rounded-2xl border border-[#2a2a3e] relative overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                      <span>{labels.realUsersCount}</span>
                      <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mt-3 font-mono">
                      {stats.totalUsersCount}
                    </h3>
                    <div className="text-xs text-emerald-400 mt-2 font-bold">
                      {registeredUsers.length} {isRu ? "авторизованных аккаунтов" : isUz ? "tasdiqlangan profillar" : "verified accounts"}
                    </div>
                  </div>

                  {/* Real Orders Placed & Avg Check */}
                  <div className="bg-gradient-to-br from-[#1c1c28] to-[#14141e] p-5 rounded-2xl border border-[#2a2a3e] relative overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
                      <span>{labels.realOrdersCount}</span>
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mt-3 font-mono">
                      {stats.totalOrdersCount}
                    </h3>
                    <div className="text-xs text-gray-400 mt-2">
                      {labels.avgCheck}: <strong className="text-white">{formatPrice(stats.averageOrderValue)}</strong>
                    </div>
                  </div>

                </div>

                {/* Real Orders Summary Shelf */}
                <div className="bg-[#181822] p-5 sm:p-6 rounded-2xl border border-[#282838] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#7000FF]" />
                      <span>{isRu ? "Последняя активность заказов" : isUz ? "Oxirgi buyurtmalar faolligi" : "Recent Orders Activity"}</span>
                    </h4>
                    <span className="text-xs text-gray-400 font-medium">
                      {orders.length} {isRu ? "заказов в базе" : isUz ? "ta buyurtma" : "orders total"}
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center bg-[#14141e] rounded-xl border border-[#242434] space-y-2">
                      <ShoppingBag className="w-8 h-8 text-gray-500 mx-auto" />
                      <p className="text-sm font-bold text-gray-300">{labels.noOrdersTitle}</p>
                      <p className="text-xs text-gray-500 max-w-md mx-auto">{labels.noOrdersDesc}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#242434]">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-mono font-bold text-purple-300">#{o.id}</span>
                            <span className="text-gray-400 ml-2">{o.customerName} ({o.customerPhone})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-white">{formatPrice(o.totalAmount)}</span>
                            <span className="bg-[#242438] text-gray-300 px-2 py-0.5 rounded-full text-[10px]">
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: 📦 УПРАВЛЕНИЕ РЕАЛЬНЫМИ ЗАКАЗАМИ */}
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#181822] p-4 rounded-2xl border border-[#282838]">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={labels.searchOrdersPlaceholder}
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    {[
                      { id: 'all', label: isRu ? 'Все заказы' : isUz ? 'Barcha buyurtmalar' : 'All Orders' },
                      { id: 'processing', label: isRu ? 'В обработке' : isUz ? 'Ko\'rib chiqilmoqda' : 'Processing' },
                      { id: 'in_transit', label: isRu ? 'В пути' : isUz ? 'Yo\'lda' : 'In Transit' },
                      { id: 'ready', label: isRu ? 'Готов к выдаче' : isUz ? 'Tayyor' : 'Ready' },
                      { id: 'delivered', label: isRu ? 'Доставлен' : isUz ? 'Yetkazildi' : 'Delivered' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setOrderStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          orderStatusFilter === tab.id
                            ? 'bg-[#7000FF] text-white'
                            : 'bg-[#121217] text-gray-400 hover:text-white border border-[#2a2a3e]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List Table */}
                <div className="bg-[#181822] rounded-2xl border border-[#282838] overflow-hidden shadow-lg">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 text-xs">
                      {labels.noOrdersTitle}
                    </div>
                  ) : (
                    <div className="divide-y divide-[#242434]">
                      {filteredOrders.map(order => (
                        <div key={order.id} className="p-4 sm:p-5 hover:bg-[#1c1c28] transition-colors space-y-3">
                          
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-sm text-[#c29aff]">
                                #{order.id}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(order.date).toLocaleString()}
                              </span>
                              <span className="text-xs bg-[#242438] text-gray-300 px-2.5 py-0.5 rounded-full font-medium">
                                {order.paymentMethod}
                              </span>
                            </div>

                            {/* Status Selector & Delete Order Button */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 font-bold">{labels.orderStatusLabel}</span>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="text-xs font-bold px-3 py-1.5 rounded-xl outline-none border cursor-pointer bg-[#181822] border-purple-500/40 text-purple-300"
                              >
                                <option value={isRu ? "В обработке" : isUz ? "Ko'rib chiqilmoqda" : "Processing"}>🟡 {isRu ? "В обработке" : isUz ? "Ko'rib chiqilmoqda" : "Processing"}</option>
                                <option value={isRu ? "В пути" : isUz ? "Yo'lda" : "In Transit"}>🚚 {isRu ? "В пути" : isUz ? "Yo'lda" : "In Transit"}</option>
                                <option value={isRu ? "Готов к выдаче" : isUz ? "Tayyor" : "Ready for pickup"}>🏬 {isRu ? "Готов к выдаче" : isUz ? "Tayyor" : "Ready for pickup"}</option>
                                <option value={isRu ? "Доставлен" : isUz ? "Yetkazildi" : "Delivered"}>🟢 {isRu ? "Доставлен" : isUz ? "Yetkazildi" : "Delivered"}</option>
                                <option value={isRu ? "Отменен" : isUz ? "Bekor qilingan" : "Cancelled"}>🔴 {isRu ? "Отменен" : isUz ? "Bekor qilingan" : "Cancelled"}</option>
                              </select>

                              {/* Delete Order Button */}
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 border border-rose-800/40 hover:border-rose-700 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                                title={labels.deleteOrderBtn}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{labels.deleteOrderBtn}</span>
                              </button>
                            </div>
                          </div>

                          {/* Customer Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-[#14141e] p-3 rounded-xl border border-[#242434]">
                            <div>
                              <span className="text-gray-400 block text-[10px] uppercase font-bold">{labels.customerLabel}</span>
                              <span className="font-bold text-white">{order.customerName || "—"}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[10px] uppercase font-bold">{labels.phoneLabel}</span>
                              <span className="font-mono text-purple-300">{order.customerPhone || "—"}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[10px] uppercase font-bold">{labels.pvzLabel}</span>
                              <span className="text-gray-200 truncate block">{order.deliveryType || "ПВЗ Sprint"}</span>
                            </div>
                          </div>

                          {/* Items In Order */}
                          <div className="space-y-1.5">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-xs text-gray-300">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={item.image || getFallbackImage(item.title, 'elektronika')} 
                                    alt={item.title} 
                                    className="w-8 h-8 object-cover rounded-lg bg-gray-800 shrink-0" 
                                  />
                                  <span className="font-medium line-clamp-1">{item.title}</span>
                                  <span className="text-gray-500">x{item.quantity}</span>
                                </div>
                                <span className="font-mono font-bold text-white shrink-0">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Total */}
                          <div className="pt-2 border-t border-[#242434] flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-bold">{labels.totalSumLabel}</span>
                            <span className="text-base font-black text-[#c29aff] font-mono">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: 🛍️ УПРАВЛЕНИЕ ТОВАРАМИ */}
            {activeTab === 'products' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Actions & Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#181822] p-4 rounded-2xl border border-[#282838]">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={labels.searchProductsPlaceholder}
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                    />
                  </div>

                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="w-full sm:w-auto bg-[#7000FF] hover:bg-[#6000e0] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sprint transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{labels.btnAddProduct}</span>
                  </button>
                </div>

                {/* Add Product Modal Drawer */}
                {isAddProductOpen && (
                  <form onSubmit={handleCreateProduct} className="bg-[#181822] p-5 rounded-2xl border border-purple-500/40 space-y-4 animate-slide-up">
                    <div className="flex items-center justify-between border-b border-[#282838] pb-3">
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <Store className="w-4 h-4 text-[#7000FF]" />
                        <span>{labels.addModalTitle}</span>
                      </h4>
                      <button 
                        type="button" 
                        onClick={() => setIsAddProductOpen(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">{labels.prodTitleUz}</label>
                        <input
                          type="text"
                          required
                          placeholder="Xiaomi 14 Ultra 16/512GB"
                          value={newProduct.title}
                          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                          className="w-full px-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">{labels.prodTitleRu}</label>
                        <input
                          type="text"
                          placeholder="Xiaomi 14 Ultra 16/512GB Черный"
                          value={newProduct.titleRu}
                          onChange={(e) => setNewProduct({ ...newProduct, titleRu: e.target.value })}
                          className="w-full px-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">{labels.prodCategory}</label>
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full px-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id} className="bg-[#181822]">{c.nameRu || c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">{labels.prodPrice}</label>
                        <input
                          type="number"
                          required
                          placeholder="12500000"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full px-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">{labels.prodOldPrice}</label>
                        <input
                          type="number"
                          placeholder="14000000"
                          value={newProduct.oldPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
                          className="w-full px-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">{labels.prodDiscount}</label>
                        <input
                          type="number"
                          placeholder="15"
                          value={newProduct.discountPercent}
                          onChange={(e) => setNewProduct({ ...newProduct, discountPercent: e.target.value })}
                          className="w-full px-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">{labels.prodStock}</label>
                        <input
                          type="number"
                          placeholder="50"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          className="w-full px-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">{labels.prodImageUrl}</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="w-full px-3 py-2 bg-[#121217] border border-[#2a2a3e] rounded-xl text-xs text-white outline-none focus:border-[#7000FF]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddProductOpen(false)}
                        className="px-4 py-2 bg-[#242434] text-gray-300 rounded-xl text-xs font-bold"
                      >
                        {labels.btnCancel}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#7000FF] hover:bg-[#6000e0] text-white rounded-xl text-xs font-bold shadow-sprint"
                      >
                        {labels.btnPublish}
                      </button>
                    </div>
                  </form>
                )}

                {/* Products Table */}
                <div className="bg-[#181822] rounded-2xl border border-[#282838] overflow-hidden shadow-lg">
                  <div className="divide-y divide-[#242434]">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="p-4 flex items-center justify-between gap-3 hover:bg-[#1c1c28] transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getFallbackImage(product.title, product.category);
                            }}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">
                              {product.titleRu || product.title}
                            </h5>
                            <p className="text-[11px] text-gray-400">
                              {product.category} • ⭐ {product.rating}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-black text-white font-mono block">
                              {formatPrice(product.price)}
                            </span>
                            {product.oldPrice && (
                              <span className="text-[10px] text-gray-500 line-through block">
                                {formatPrice(product.oldPrice)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: 👥 РЕАЛЬНЫЕ ПОЛЬЗОВАТЕЛИ */}
            {activeTab === 'users' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-[#181822] p-5 rounded-2xl border border-[#282838]">
                  <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    <span>{labels.registeredUsersTitle}</span>
                  </h4>
                  
                  <div className="divide-y divide-[#242434]">
                    {registeredUsers.map((usr, i) => (
                      <div key={i} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm ${
                            usr.role === 'creator' || usr.name === 'Sprint383'
                              ? 'bg-gradient-to-tr from-amber-500 to-[#7000FF] text-white shadow-md shadow-purple-500/30' 
                              : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            {usr.role === 'creator' || usr.name === 'Sprint383' ? '👑' : usr.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{usr.name}</span>
                              <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                                usr.role === 'creator' || usr.name === 'Sprint383'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                                  : 'bg-purple-500/20 text-purple-300'
                              }`}>
                                {usr.role === 'creator' || usr.name === 'Sprint383' ? labels.userRoleCreator : labels.userRoleCustomer}
                              </span>
                            </div>
                            <span className="text-gray-400 font-mono text-[11px]">{usr.phone}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-white block font-mono">{formatPrice(usr.totalSpent || 0)}</span>
                          <span className="text-[10px] text-gray-400">{labels.ordersCountShort(usr.ordersCount || 0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-[#181822] border-t border-[#282838] flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sprint Marketplace v2.4 Enterprise Core Engine</span>
            </div>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-2 bg-[#242434] hover:bg-[#323248] text-white rounded-xl font-bold transition-colors"
            >
              {labels.closeBtn}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
