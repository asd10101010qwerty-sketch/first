export const categories = [
  {
    id: "elektronika",
    name: "Elektronika",
    nameRu: "Электроника",
    icon: "Smartphone",
    badge: "Ommabop",
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "Smartfonlar va telefonlar",
        titleRu: "Смартфоны и телефоны",
        items: ["Apple iPhone", "Samsung Galaxy", "Xiaomi & Redmi", "Honor & Huawei", "Tugmali telefonlar", "G'iloflar va shishalar"]
      },
      {
        title: "Noutbuklar va kompyuterlar",
        titleRu: "Ноутбуки и компьютеры",
        items: ["MacBook", "O'yin noutbuklari", "Ofis noutbuklari", "Monitorlar", "Klaviatura va sichqonchalar", "Tizim bloklari"]
      },
      {
        title: "Audio va video",
        titleRu: "Аудио и видео",
        items: ["Simsiz quloqchinlar", "Smart televizorlar", "Portativ kolonka", "Soundbarlar", "Mikrofonlar"]
      },
      {
        title: "Aqlli soatlar va bilaguzuklar",
        titleRu: "Смарт-часы и браслеты",
        items: ["Apple Watch", "Samsung Galaxy Watch", "Xiaomi Smart Band", "Bolalar aqlli soatlari", "Kamarlar"]
      }
    ]
  },
  {
    id: "maishiy-texnika",
    name: "Maishiy texnika",
    nameRu: "Бытовая техника",
    icon: "Tv",
    color: "from-purple-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "Oshxona texnikasi",
        titleRu: "Техника для кухни",
        items: ["Muzlatgichlar", "Gaz plitalari", "Mikroto'lqinli pechlar", "Blender va mikserlar", "Elektr choynaklar", "Kofemashinalar"]
      },
      {
        title: "Uy uchun texnika",
        titleRu: "Техника для дома",
        items: ["Changyutgichlar", "Robot-changyutgichlar", "Kir yuvish mashinalari", "Dazmollar va bug'lagichlar", "Tikuv mashinalari"]
      },
      {
        title: "Iqlim texnikasi",
        titleRu: "Климатическая техника",
        items: ["Konditsionerlar", "Isitgichlar", "Havo namlagichlar", "Ventilyatorlar", "Suv isitgichlar"]
      }
    ]
  },
  {
    id: "kiyim",
    name: "Kiyim",
    nameRu: "Одежда",
    icon: "Shirt",
    badge: "Yangi",
    color: "from-pink-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "Ayollar kiyimi",
        titleRu: "Женская одежда",
        items: ["Ko'ylaklar va sarafanlar", "Futbolkalar va toplar", "Shimlar va jinsilar", "Xudi va svitshotlar", "Kurtkalar va paltolar", "Ichki kiyimlar"]
      },
      {
        title: "Erkaklar kiyimi",
        titleRu: "Мужская одежда",
        items: ["Futbolkalar va pololar", "Ko'ylaklar", "Jinsilar va shimlar", "Sport kiyimlari", "Kurtkalar", "Paypoqlar va ichki kiyim"]
      },
      {
        title: "Bolalar kiyimi",
        titleRu: "Детская одежда",
        items: ["O'g'il bolalar kiyimi", "Qiz bolalar kiyimi", "Chaqaloqlar kiyimi", "Maktab formasi"]
      }
    ]
  },
  {
    id: "poyabzallar",
    name: "Poyabzallar",
    nameRu: "Обувь",
    icon: "Footprints",
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "Erkaklar poyabzali",
        titleRu: "Мужская обувь",
        items: ["Krossovkalar va kedalar", "Klassik tuflilar", "Mokasinlar", "Shlyopkalar va sandalilar", "Botinkalar"]
      },
      {
        title: "Ayollar poyabzali",
        titleRu: "Женская обувь",
        items: ["Krossovkalar", "Pos screw tuflilar", "Baletkalar", "Etiklar va yarim etiklar", "Sandalilar"]
      },
      {
        title: "Poyabzal parvarishi",
        titleRu: "Уход за обувью",
        items: ["Kremlar va gubkalar", "Dezodorantlar", "Poyabzal qoliplari", "Bog'ichlar"]
      }
    ]
  },
  {
    id: "gozallik",
    name: "Go'zallik va parvarish",
    nameRu: "Красота и уход",
    icon: "Sparkles",
    color: "from-fuchsia-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "Yuz parvarishi",
        titleRu: "Уход за лицом",
        items: ["Kremlar va zardoblar", "Niqoblar va patchlar", "Yuvinish vositalari", "Tonerlar", "Quyoshdan himoya (SPF)"]
      },
      {
        title: "Parfyumeriya",
        titleRu: "Парфюмерия",
        items: ["Ayollar atirlari", "Erkaklar atirlari", "Arab atirlari", "Tana spreylari"]
      },
      {
        title: "Soch parvarishi",
        titleRu: "Уход за волосами",
        items: ["Shampunlar", "Balzamlar va niqoblar", "Soch moylari", "Fenlar va staylerlar"]
      },
      {
        title: "Makiyaj",
        titleRu: "Макияж",
        items: ["Tonal kremlar", "Lab bo'yoqlari", "Tush va laynerlar", "Makiyaj cho'tkalari"]
      }
    ]
  },
  {
    id: "uy-rozgor",
    name: "Uy-ro'zg'or buyumlari",
    nameRu: "Товары для дома",
    icon: "Home",
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "Oshxona anjomlari",
        titleRu: "Посуда и кухонные принадлежности",
        items: ["Qozon va tovalar", "Idish-tovoq to'plamlari", "Pichoqlar", "Choynak va kofe idishlari", "Konteynerlar"]
      },
      {
        title: "Yotoq anjomlari va to'qimachilik",
        titleRu: "Постельное белье и текстиль",
        items: ["Ko'rpa-yostiq jildlari", "Yostiqlar va adyollar", "Sochiqlar", "Pardalar va gilamchalar"]
      },
      {
        title: "Uy tozaligi va saqlash",
        titleRu: "Уборка и хранение",
        items: ["Organayzerlar", "Tozalash vositalari", "Shvabrlar va chelaklar", "Kiyim ilgichlar"]
      }
    ]
  },
  {
    id: "avtotovarlar",
    name: "Avtotovarlar",
    nameRu: "Автотовары",
    icon: "Car",
    color: "from-cyan-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "Avtoelektronika",
        titleRu: "Автоэлектроника",
        items: ["Videoregistratorlar", "FM-modulyatorlar", "Radar detektorlar", "Avto akustika va kalonkalar"]
      },
      {
        title: "Salon anjomlari",
        titleRu: "Аксессуары для салона",
        items: ["Chexollar va gilamchalar", "Telefon ushlagichlar", "Xushbo'ylantirgichlar", "Avto changyutgichlar"]
      },
      {
        title: "Avtoximiya va moylar",
        titleRu: "Автохимия и масла",
        items: ["Motor moylari", "Shampunlar va polirovkalar", "Antifrizlar", "Oyna yuvgichlar"]
      }
    ]
  },
  {
    id: "bolalar",
    name: "Bolalar tovarlari",
    nameRu: "Детские товары",
    icon: "Baby",
    color: "from-yellow-400 to-amber-500",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "O'yinchoqlar",
        titleRu: "Игрушки",
        items: ["Lego va konstruktorlar", "Yumshoq o'yinchoqlar", "Radio boshqariladigan mashinalar", "Stol o'yinlari"]
      },
      {
        title: "Chaqaloqlar parvarishi",
        titleRu: "Уход за малышами",
        items: ["Tagliklar (Pampers)", "Sut idishlari", "Surgichlar", "Bolalar aravachalari", "Kolyaskalar"]
      }
    ]
  },
  {
    id: "sport",
    name: "Sport va hordiq",
    nameRu: "Спорт и отдых",
    icon: "Dumbbell",
    color: "from-green-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "Fitnes va trenajyorlar",
        titleRu: "Фитнес и тренажеры",
        items: ["Gantellar va shtangalar", "Fitnes rezinkalari", "Gimnastika gilamchalari", "Sakragichlar"]
      },
      {
        title: "Sayr va turizm",
        titleRu: "Туризм и кемпинг",
        items: ["Palatkalar", "Termoslar", "Ryukzaklar", "Fonarlar"]
      }
    ]
  },
  {
    id: "kitoblar",
    name: "Kitoblar",
    nameRu: "Книги",
    icon: "BookOpen",
    color: "from-red-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format&fit=crop&q=60",
    subcategories: [
      {
        title: "Badiiy adabiyot",
        titleRu: "Художественная литература",
        items: ["Jahon adabiyoti", "O'zbek adabiyoti", "Detektiv va triller", "Psixologiya va motivatsiya"]
      },
      {
        title: "Biznes va rivojlanish",
        titleRu: "Бизнес и саморазвитие",
        items: ["Moliyaviy savodxonlik", "Liderlik", "Marketing", "Shaxsiy o'sish"]
      },
      {
        title: "Diniy adabiyotlar",
        titleRu: "Религиозная литература",
        items: ["Qur'oni Karim", "Hadislar to'plami", "Siyrat kitoblari", "Islom tarixi"]
      }
    ]
  }
];

