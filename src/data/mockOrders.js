/**
 * Realistic Demo Orders for Sprint Marketplace Admin Panel
 */

export const mockOrders = [
  {
    id: "ORD-94821",
    customerName: "Madina Karimova",
    customerPhone: "madina.k@gmail.com",
    date: "2026-09-02T14:30:00.000Z",
    status: "Yetkazilmoqda",
    statusCode: "shipping",
    totalAmount: 3200000,
    paymentMethod: "payme",
    deliveryMethod: "pvz",
    deliveryPoint: "Sprint PVZ - Chilonzor 9-mavze",
    items: [
      {
        product: {
          id: "prod-1",
          title: "iPhone 15 Pro Max 256GB Natural Titanium",
          titleRu: "Смартфон Apple iPhone 15 Pro Max 256GB",
          price: 3200000,
          images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80"]
        },
        quantity: 1,
        selectedColor: "Titanium",
        selectedSize: "256GB"
      }
    ]
  },
  {
    id: "ORD-87120",
    customerName: "Jasur Rahimov",
    customerPhone: "jasur.rahimov@mail.ru",
    date: "2026-09-01T11:15:00.000Z",
    status: "Yetkazib berildi",
    statusCode: "delivered",
    totalAmount: 1450000,
    paymentMethod: "uzum_nasiya",
    deliveryMethod: "courier",
    deliveryPoint: "Toshkent, Yunusobod 4",
    items: [
      {
        product: {
          id: "prod-2",
          title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
          titleRu: "Беспроводные наушники Sony WH-1000XM5",
          price: 1450000,
          images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"]
        },
        quantity: 1,
        selectedColor: "Qora",
        selectedSize: "Standart"
      }
    ]
  },
  {
    id: "ORD-76341",
    customerName: "Nilufar Usmanova",
    customerPhone: "nilu.usman@gmail.com",
    date: "2026-09-03T09:20:00.000Z",
    status: "Ko'rib chiqilmoqda",
    statusCode: "processing",
    totalAmount: 890000,
    paymentMethod: "cash",
    deliveryMethod: "pvz",
    deliveryPoint: "Sprint PVZ - Mirzo Ulug'bek",
    items: [
      {
        product: {
          id: "prod-3",
          title: "Nike Air Max 270 Black/White Sneakers",
          titleRu: "Кроссовки Nike Air Max 270",
          price: 890000,
          images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"]
        },
        quantity: 1,
        selectedColor: "Qora",
        selectedSize: "42"
      }
    ]
  }
];

