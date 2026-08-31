import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { pickupPoints } from '../data/pickupPoints';
import { translations } from '../data/translations';

const ShopContext = createContext();

export const ADMIN_PHONE = "+998949392521";

export const ShopProvider = ({ children }) => {
  // Products list with dynamic Admin CRUD state & localStorage
  const [productsList, setProductsList] = useState(() => {
    try {
      const saved = localStorage.getItem('sprint_custom_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Theme: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('sprint_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('sprint_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Language: 'uz' | 'ru' | 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sprint_lang') || 'uz';
  });

  // Translation helper function
  const t = (key) => {
    const currentDict = translations[language] || translations.uz;
    return currentDict[key] || translations.uz[key] || key;
  };

  // Helper to get localized product title
  const getProductTitle = (product) => {
    if (!product) return '';
    if (language === 'ru' && product.titleRu) return product.titleRu;
    if (language === 'en' && product.titleEn) return product.titleEn;
    return product.title;
  };

  // Helper to get localized category name
  const getCategoryName = (category) => {
    if (!category) return '';
    if (language === 'ru' && category.nameRu) return category.nameRu;
    if (language === 'en' && category.nameEn) return category.nameEn;
    return category.name;
  };

  // Cart state with localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sprint_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state with localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sprint_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real Orders history state (clean real orders without fake data)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sprint_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real Registered Users list (pure real accounts authenticated via Telegram)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('sprint_registered_users');
      return saved ? JSON.parse(saved) : [
        {
          id: "usr-creator",
          name: "Sprint383",
          phone: "+998 94 939 25 21",
          registeredAt: new Date().toISOString(),
          role: "creator",
          ordersCount: 0,
          totalSpent: 0
        }
      ];
    } catch {
      return [
        {
          id: "usr-creator",
          name: "Sprint383",
          phone: "+998 94 939 25 21",
          registeredAt: new Date().toISOString(),
          role: "creator",
          ordersCount: 0,
          totalSpent: 0
        }
      ];
    }
  });

  // Location & Delivery Points
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('sprint_city') || 'Toshkent';
  });

  const [selectedPickupPoint, setSelectedPickupPoint] = useState(() => {
    try {
      const saved = localStorage.getItem('sprint_pvz');
      return saved ? JSON.parse(saved) : pickupPoints[0];
    } catch {
      return pickupPoints[0];
    }
  });

  // User Profile
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sprint_user');
      return saved ? JSON.parse(saved) : { isLoggedIn: false, phone: '', name: 'Foydalanuvchi' };
    } catch {
      return { isLoggedIn: false, phone: '', name: 'Foydalanuvchi' };
    }
  });

  // ADMIN AUTHORIZATION: Only number +998949392521
  const normalizePhone = (p) => (p || '').replace(/[^\d]/g, '');
  const isAdmin = Boolean(
    user.isLoggedIn && 
    (normalizePhone(user.phone).endsWith('949392521') || normalizePhone(user.phone) === '998949392521' || user.phone?.includes('949392521'))
  );

  // Navigation & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  // Modals & Drawers state
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isPickupPointsOpen, setIsPickupPointsOpen] = useState(false);
  const [isCitySelectOpen, setIsCitySelectOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sprint_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sprint_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('sprint_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sprint_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('sprint_custom_products', JSON.stringify(productsList));
  }, [productsList]);

  useEffect(() => {
    localStorage.setItem('sprint_city', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    localStorage.setItem('sprint_pvz', JSON.stringify(selectedPickupPoint));
  }, [selectedPickupPoint]);

  useEffect(() => {
    localStorage.setItem('sprint_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('sprint_user', JSON.stringify(user));
  }, [user]);

  // Cart operations
  const addToCart = (product, quantity = 1, options = {}) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id &&
        item.selectedColor === (options.color || product.colors?.[0] || 'Standart') &&
        item.selectedSize === (options.size || product.sizes?.[0] || 'Standart')
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        showToast(t('addedToCart'), 'success');
        return updated;
      }

      showToast(t('addedToCart'), 'success');
      return [...prev, {
        product,
        quantity,
        selectedColor: options.color || product.colors?.[0] || 'Standart',
        selectedSize: options.size || product.sizes?.[0] || 'Standart'
      }];
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast(t('cartEmpty'), 'info');
  };

  const updateQuantity = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQuantity = updated[index].quantity + delta;
      if (newQuantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(t('wishlist'), 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast(t('wishlist'), 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.includes(productId);
  };

  // User auth operations
  const loginUser = (phone, name = 'Foydalanuvchi') => {
    const cleanPhone = (phone || '').replace(/[^\d]/g, '');
    const isCreator = cleanPhone.endsWith('949392521') || cleanPhone === '998949392521';
    const finalName = isCreator ? 'Sprint383' : name;

    const newUser = { isLoggedIn: true, phone, name: finalName };
    setUser(newUser);
    localStorage.setItem('sprint_user', JSON.stringify(newUser));

    // Register or update real user in platform database
    setRegisteredUsers(prev => {
      const existsIndex = prev.findIndex(u => u.phone === phone || normalizePhone(u.phone) === cleanPhone);
      if (existsIndex > -1) {
        const updated = [...prev];
        updated[existsIndex].name = finalName;
        return updated;
      }
      return [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          name: finalName,
          phone,
          registeredAt: new Date().toISOString(),
          role: isCreator ? 'creator' : 'customer',
          ordersCount: 0,
          totalSpent: 0
        }
      ];
    });
  };

  const logoutUser = () => {
    const cleared = { isLoggedIn: false, phone: '', name: 'Foydalanuvchi' };
    setUser(cleared);
    localStorage.setItem('sprint_user', JSON.stringify(cleared));
    setIsAdminOpen(false);
    showToast(t('login'), 'info');
  };

  // Order Placement (Syncs with real user records)
  const placeOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: orderData.recipientName || user.name,
      customerPhone: orderData.recipientPhone || user.phone,
      date: new Date().toISOString(),
      status: language === 'uz' ? "Ko'rib chiqilmoqda" : language === 'en' ? "Processing" : "В обработке",
      statusCode: "processing",
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update real user's total spent & order count
    setRegisteredUsers(prev => {
      const phoneToMatch = newOrder.customerPhone;
      const index = prev.findIndex(u => u.phone === phoneToMatch || normalizePhone(u.phone) === normalizePhone(phoneToMatch));
      if (index > -1) {
        const updated = [...prev];
        updated[index].ordersCount = (updated[index].ordersCount || 0) + 1;
        updated[index].totalSpent = (updated[index].totalSpent || 0) + (newOrder.totalAmount || 0);
        return updated;
      }
      return [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          name: newOrder.customerName,
          phone: newOrder.customerPhone,
          registeredAt: new Date().toISOString(),
          role: 'customer',
          ordersCount: 1,
          totalSpent: newOrder.totalAmount || 0
        }
      ];
    });

    clearCart();
    return newOrder;
  };

  // Admin Order Operations
  const updateOrderStatus = (orderId, newStatus, statusCode = 'processing') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus, statusCode };
      }
      return order;
    }));
    showToast(
      language === 'uz' ? `Buyurtma holati "${newStatus}" ga o'zgartirildi` :
      language === 'en' ? `Order status changed to "${newStatus}"` :
      `Статус заказа изменён на "${newStatus}"`,
      'success'
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    showToast(
      language === 'uz' ? `Buyurtma #${orderId} o'chirildi` :
      language === 'en' ? `Order #${orderId} deleted` :
      `Заказ #${orderId} успешно удалён`,
      'info'
    );
  };

  // Admin Product CRUD Operations
  const addProduct = (newProduct) => {
    const productWithId = {
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      ordersCount: 0,
      badge: "Yangi",
      badgeType: "hit",
      isPopular: true,
      images: [newProduct.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"],
      colors: ["Standart"],
      sizes: ["Standart"],
      specs: {},
      seller: "Sprint Official",
      ...newProduct
    };

    setProductsList(prev => [productWithId, ...prev]);
    showToast(
      language === 'uz' ? `"${productWithId.title}" mahsuloti qo'shildi!` :
      language === 'en' ? `Product "${productWithId.title}" added!` :
      `Товар "${productWithId.title}" успешно добавлен!`,
      'success'
    );
    return productWithId;
  };

  const updateProduct = (productId, updatedFields) => {
    setProductsList(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, ...updatedFields };
      }
      return p;
    }));
    showToast(
      language === 'uz' ? `Mahsulot yangilandi!` :
      language === 'en' ? `Product updated!` :
      `Товар успешно обновлён!`,
      'success'
    );
  };

  const deleteProduct = (productId) => {
    setProductsList(prev => prev.filter(p => p.id !== productId));
    showToast(
      language === 'uz' ? `Mahsulot o'chirildi` :
      language === 'en' ? `Product deleted` :
      `Товар удалён из каталога`,
      'info'
    );
  };

  // Price formatting
  const formatPrice = (amount) => {
    if (!amount && amount !== 0) return '';
    const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (language === 'ru') return `${formatted} сум`;
    if (language === 'en') return `${formatted} UZS`;
    return `${formatted} so'm`;
  };

  const formatInstallment = (amount, months = 12) => {
    const monthly = Math.round((amount * 1.15) / months);
    const formatted = monthly.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (language === 'ru') return `${formatted} сум/мес`;
    if (language === 'en') return `${formatted} UZS/mo`;
    return `${formatted} so'm/oy`;
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <ShopContext.Provider
      value={{
        products: productsList,
        productsList,
        addProduct,
        updateProduct,
        deleteProduct,
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        getProductTitle,
        getCategoryName,
        cart,
        cartTotal,
        cartItemsCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isWishlisted,
        orders,
        registeredUsers,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        selectedCity,
        setSelectedCity,
        selectedPickupPoint,
        setSelectedPickupPoint,
        user,
        isAdmin,
        loginUser,
        logoutUser,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedProductDetail,
        setSelectedProductDetail,
        isCatalogOpen,
        setIsCatalogOpen,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isAuthOpen,
        setIsAuthOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isPickupPointsOpen,
        setIsPickupPointsOpen,
        isCitySelectOpen,
        setIsCitySelectOpen,
        isAdminOpen,
        setIsAdminOpen,
        toast,
        showToast,
        formatPrice,
        formatInstallment
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
