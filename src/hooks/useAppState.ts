import { useState, useCallback } from 'react';
import type {
  UserProfile,
  SmartDevice,
  ClimateSettings,
  Payment,
  Notification,
  Service,
  GuestQR,
  AIContext,
  Product,
  Restaurant,
  CartItem,
  UtilityStats,
  SharingItem,
  CommunityEvent,
  NewsItem,
  ChargingStation,
  SecurityIncident
} from '@/types';

// Начальные данные пользователя
const initialUser: UserProfile = {
  id: '1',
  name: 'Ахмед',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
  apartment: 'Башня 3, кв. 156',
  phone: '+7 (928) 123-45-67',
  email: 'ahmed@nova.ru',
  familyMembers: [
    {
      id: '1',
      name: 'Ахмед',
      age: 42,
      isHome: false,
      role: 'adult'
    },
    {
      id: '2',
      name: 'Малика',
      age: 38,
      isHome: true,
      role: 'adult'
    },
    {
      id: '3',
      name: 'Тимур',
      age: 12,
      isHome: true,
      role: 'child'
    }
  ],
  cars: [
    {
      id: '1',
      model: 'BMW X5',
      plate: 'А 123 БВ 95',
      color: '#1A1A1A'
    }
  ]
};

// Начальные устройства с умными настройками
const initialDevices: SmartDevice[] = [
  {
    id: '1',
    name: 'Робот-пылесос',
    type: 'vacuum',
    isOn: false,
    icon: 'Bot',
    room: 'Гостиная',
    settings: {
      autoOffWhenEmpty: false,
      schedule: {
        enabled: false,
        time: '10:00',
        room: 'Гостиная',
        days: ['Пн', 'Ср', 'Пт']
      }
    }
  },
  {
    id: '2',
    name: 'Умная розетка',
    type: 'outlet',
    isOn: true,
    icon: 'Plug',
    room: 'Кухня',
    settings: {
      autoOffWhenEmpty: true
    }
  },
  {
    id: '3',
    name: 'Электроплита',
    type: 'stove',
    isOn: false,
    icon: 'Flame',
    room: 'Кухня',
    settings: {
      autoOffWhenEmpty: true
    }
  },
  {
    id: '4',
    name: 'Освещение',
    type: 'light',
    isOn: true,
    icon: 'Lightbulb',
    room: 'Вся квартира',
    settings: {
      autoOffWhenEmpty: false
    }
  },
];

// Начальные настройки климата
const initialClimate: ClimateSettings = {
  temperature: 22,
  targetTemperature: 23,
  humidity: 45,
  brightness: 75
};

// Начальные платежи с арендой
const initialPayments: Payment[] = [
  { id: '1', date: '2024-03-01', amount: 2450, type: 'electricity', status: 'paid', period: 'Февраль 2024' },
  { id: '2', date: '2024-03-01', amount: 1800, type: 'water', status: 'paid', period: 'Февраль 2024' },
  { id: '3', date: '2024-03-01', amount: 3200, type: 'maintenance', status: 'paid', period: 'Февраль 2024' },
  { id: '4', date: '2024-03-01', amount: 45000, type: 'rent', status: 'paid', period: 'Февраль 2024' },
  { id: '5', date: '2024-04-01', amount: 2100, type: 'electricity', status: 'pending', period: 'Март 2024' },
  { id: '6', date: '2024-04-01', amount: 1650, type: 'water', status: 'pending', period: 'Март 2024' },
  { id: '7', date: '2024-04-01', amount: 45000, type: 'rent', status: 'pending', period: 'Март 2024' },
];

// Статистика ЖКХ
const initialUtilityStats: UtilityStats[] = [
  { month: 'Окт', electricity: 2100, water: 1600, gas: 800, maintenance: 3200 },
  { month: 'Ноя', electricity: 2300, water: 1700, gas: 900, maintenance: 3200 },
  { month: 'Дек', electricity: 2800, water: 1800, gas: 1200, maintenance: 3200 },
  { month: 'Янв', electricity: 2600, water: 1750, gas: 1100, maintenance: 3200 },
  { month: 'Фев', electricity: 2450, water: 1800, gas: 950, maintenance: 3200 },
  { month: 'Март', electricity: 2100, water: 1650, gas: 850, maintenance: 3200 },
];

// Начальные уведомления
const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Плановое отключение воды',
    message: 'Завтра с 10:00 до 14:00 будет отключена холодная вода для проведения профилактических работ.',
    type: 'warning',
    date: '2024-03-15T10:00:00',
    isRead: false
  },
  {
    id: '2',
    title: 'Новая квитанция',
    message: 'Сформирована квитанция за март 2024. Сумма к оплате: 48 750 ₽',
    type: 'info',
    date: '2024-03-01T09:00:00',
    isRead: true
  }
];

// Услуги
const initialServices: Service[] = [
  {
    id: '1',
    name: 'Клининг',
    category: 'cleaning',
    icon: 'Sparkles',
    description: 'Генеральная уборка квартиры',
    price: 'от 3 500 ₽',
    schedule: {
      availableDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      availableHours: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
    }
  },
  { id: '2', name: 'Электрик', category: 'repair', icon: 'Zap', description: 'Ремонт электропроводки', price: 'от 1 500 ₽' },
  { id: '3', name: 'Сантехник', category: 'repair', icon: 'Wrench', description: 'Устранение протечек', price: 'от 2 000 ₽' },
  { id: '4', name: 'Автомойка', category: 'cleaning', icon: 'Car', description: 'Мойка авто во дворе', price: 'от 500 ₽' },
];

// Продукты
const initialProducts: Product[] = [
  { id: '1', name: 'Молоко 3.2%', category: 'Молочные', price: 89, unit: '1 л', icon: 'Milk' },
  { id: '2', name: 'Хлеб белый', category: 'Выпечка', price: 45, unit: 'шт', icon: 'Bread' },
  { id: '3', name: 'Яйца куриные', category: 'Молочные', price: 120, unit: '10 шт', icon: 'Egg' },
  { id: '4', name: 'Масло сливочное', category: 'Молочные', price: 180, unit: '200 г', icon: 'Milk' },
  { id: '5', name: 'Сыр твердый', category: 'Молочные', price: 350, unit: '300 г', icon: 'Cheese' },
  { id: '6', name: 'Курица филе', category: 'Мясо', price: 420, unit: '1 кг', icon: 'Beef' },
  { id: '7', name: 'Говядина', category: 'Мясо', price: 650, unit: '1 кг', icon: 'Beef' },
  { id: '8', name: 'Помидоры', category: 'Овощи', price: 180, unit: '1 кг', icon: 'Apple' },
  { id: '9', name: 'Огурцы', category: 'Овощи', price: 120, unit: '1 кг', icon: 'Apple' },
  { id: '10', name: 'Яблоки', category: 'Фрукты', price: 150, unit: '1 кг', icon: 'Apple' },
  { id: '11', name: 'Бананы', category: 'Фрукты', price: 110, unit: '1 кг', icon: 'Apple' },
  { id: '12', name: 'Рис', category: 'Крупы', price: 95, unit: '800 г', icon: 'Wheat' },
];

// Рестораны
const initialRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Чеченская кухня',
    cuisine: 'Национальная',
    rating: 4.8,
    deliveryTime: '30-45 мин',
    minOrder: 500,
    menu: [
      { id: 'r1-1', name: 'Лагман', description: 'Традиционный суп с лапшой и мясом', price: 450, category: 'Супы' },
      { id: 'r1-2', name: 'Хинкали', description: '6 шт. с бараниной', price: 380, category: 'Горячее' },
      { id: 'r1-3', name: 'Шашлык из баранины', description: '300 г с овощами гриль', price: 650, category: 'Горячее' },
      { id: 'r1-4', name: 'Плов', description: 'Узбекский плов с бараниной', price: 520, category: 'Горячее' },
      { id: 'r1-5', name: 'Чалоп', description: 'Овощной салат по-чеченски', price: 280, category: 'Салаты' },
    ]
  },
  {
    id: '2',
    name: 'Pizza House',
    cuisine: 'Итальянская',
    rating: 4.5,
    deliveryTime: '25-40 мин',
    minOrder: 600,
    menu: [
      { id: 'r2-1', name: 'Пепперони', description: '30 см, острая', price: 590, category: 'Пицца' },
      { id: 'r2-2', name: 'Маргарита', description: '30 см, классическая', price: 450, category: 'Пицца' },
      { id: 'r2-3', name: 'Цезарь с курицей', description: 'Классический салат', price: 380, category: 'Салаты' },
      { id: 'r2-4', name: 'Паста Карбонара', description: 'Спагетти с беконом', price: 420, category: 'Паста' },
    ]
  },
  {
    id: '3',
    name: 'Sushi Master',
    cuisine: 'Японская',
    rating: 4.7,
    deliveryTime: '35-50 мин',
    minOrder: 800,
    menu: [
      { id: 'r3-1', name: 'Филадельфия', description: '8 шт.', price: 480, category: 'Роллы' },
      { id: 'r3-2', name: 'Калифорния', description: '8 шт.', price: 420, category: 'Роллы' },
      { id: 'r3-3', name: 'Сет "Микс"', description: '32 шт., ассорти', price: 1290, category: 'Сеты' },
      { id: 'r3-4', name: 'Мисо суп', description: 'Традиционный суп', price: 180, category: 'Супы' },
    ]
  },
  {
    id: '4',
    name: 'Burger King',
    cuisine: 'Американская',
    rating: 4.3,
    deliveryTime: '20-35 мин',
    minOrder: 400,
    menu: [
      { id: 'r4-1', name: 'Воппер', description: 'Классический бургер', price: 350, category: 'Бургеры' },
      { id: 'r4-2', name: 'Чизбургер', description: 'С двойным сыром', price: 280, category: 'Бургеры' },
      { id: 'r4-3', name: 'Картофель фри', description: 'Большая порция', price: 180, category: 'Закуски' },
      { id: 'r4-4', name: 'Кола', description: '0.5 л', price: 120, category: 'Напитки' },
    ]
  },
];

// Расширенный шеринг
const initialSharingItems: SharingItem[] = [
  {
    id: '1',
    name: 'Дрель Bosch',
    category: 'Инструменты',
    description: 'Профессиональная дрель, 750W',
    pricePerHour: 150,
    deposit: 2000,
    owner: 'Сосед 12 кв.',
    rating: 4.9,
    available: true
  },
  {
    id: '2',
    name: 'Шуруповёрт Makita',
    category: 'Инструменты',
    description: 'Аккумуляторный, 18V, с набором бит',
    pricePerHour: 120,
    deposit: 1500,
    owner: 'Сосед 24 кв.',
    rating: 4.8,
    available: true
  },
  {
    id: '3',
    name: 'Перфоратор',
    category: 'Инструменты',
    description: 'Для бетона и кирпича, 900W',
    pricePerHour: 250,
    deposit: 3000,
    owner: 'Сосед 8 кв.',
    rating: 4.7,
    available: false
  },
  {
    id: '4',
    name: 'Лестница 3 м',
    category: 'Оборудование',
    description: 'Алюминиевая, складная',
    pricePerHour: 100,
    deposit: 1000,
    owner: 'Сосед 15 кв.',
    rating: 5.0,
    available: true
  },
  {
    id: '5',
    name: 'Пылесос моющий',
    category: 'Бытовая',
    description: 'Karcher, для ковров и мебели',
    pricePerHour: 200,
    deposit: 2500,
    owner: 'Сосед 31 кв.',
    rating: 4.6,
    available: true
  },
  {
    id: '6',
    name: 'Болгарка',
    category: 'Инструменты',
    description: 'УШМ, 125 мм, 1100W',
    pricePerHour: 180,
    deposit: 2000,
    owner: 'Сосед 5 кв.',
    rating: 4.8,
    available: true
  },
  {
    id: '7',
    name: 'Генератор',
    category: 'Оборудование',
    description: 'Бензиновый, 3 кВт',
    pricePerHour: 400,
    deposit: 5000,
    owner: 'Сосед 42 кв.',
    rating: 4.9,
    available: true
  },
  {
    id: '8',
    name: 'Опрыскиватель',
    category: 'Садовый',
    description: 'Для растений, 5 л',
    pricePerHour: 80,
    deposit: 500,
    owner: 'Сосед 18 кв.',
    rating: 4.5,
    available: true
  },
];

// Гостевые QR-коды
const initialGuestQRs: GuestQR[] = [
  {
    id: '1',
    code: 'GUEST-2024-001',
    expiresAt: '2024-03-15T20:00:00',
    purpose: 'Курьер Wildberries'
  }
];

// Контекст для ИИ
const initialAIContext: AIContext = {
  weather: {
    temp: 8,
    condition: 'Облачно',
    icon: 'cloud'
  },
  season: 'spring',
  isRamadan: false,
  familyActivity: 'low'
};

// События
const initialCommunityEvents: CommunityEvent[] = [
  {
    id: '1',
    title: 'Весенний субботник',
    date: '2024-04-15T10:00:00',
    location: 'Внутренний двор ЖК',
    description: 'Уважаемые соседи! Приглашаем всех на традиционный весенний субботник. Инвентарь выдадут на месте. После уборки — бесплатный плов и чай от управляющей компании.',
    type: 'activity',
    participants: 45
  },
  {
    id: '2',
    title: 'Празднование Ид аль-Фитр',
    date: '2024-04-10T14:00:00',
    location: 'Центральная площадь района',
    description: 'Массовые гуляния по случаю Ураза-Байрам. Детские аниматоры, аттракционы и национальные угощения.',
    type: 'holiday',
    participants: 120
  },
  {
    id: '3',
    title: 'Собрание собственников',
    date: '2024-04-05T19:00:00',
    location: 'Холл 1-го подъезда',
    description: 'Обсуждение вопросов установки новых шлагбаумов и благоустройства детской площадки.',
    type: 'meetup',
    participants: 28
  }
];

// Новости района
const initialNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Открытие новой детской площадки',
    date: '2024-03-28T09:00:00',
    content: 'Рады сообщить, что во дворе второй очереди завершен монтаж новой детской игровой зоны с безопасным покрытием.',
    author: 'Управляющая компания',
    type: 'news'
  },
  {
    id: '2',
    title: 'Поиск хозяина: найден кот',
    date: '2024-03-29T18:30:00',
    content: 'В 3-м подъезде найден рыжий кот в ошейнике. Сейчас он находится в диспетчерской.',
    author: 'Сосед (кв. 142)',
    type: 'announcement'
  }
];

// Зарядные станции для авто
const initialChargingStations: ChargingStation[] = [
  {
    id: '1',
    name: 'Станция Башня 1 (Подземный паркинг)',
    status: 'available',
    connectors: ['Type 2', 'CCS2'],
    pricePerKwh: 15.5
  },
  {
    id: '2',
    name: 'Станция Башня 3 (Гостевая парковка)',
    status: 'in_use',
    connectors: ['Type 2'],
    pricePerKwh: 15.5
  },
  {
    id: '3',
    name: 'Быстрая зарядка (Въезд)',
    status: 'available',
    connectors: ['CCS2', 'CHAdeMO'],
    pricePerKwh: 22.0
  }
];

// Инциденты системы безопасности (с нейросетью)
const initialSecurityIncidents: SecurityIncident[] = [
  {
    id: '1',
    type: 'accident',
    title: 'ВНИМАНИЕ: ДТП во дворе',
    description: 'Нейросеть зафиксировала легкое ДТП на выезде с гостевой парковки. Оба водителя на месте.',
    location: 'Гостевая парковка',
    timestamp: '2024-03-31T14:20:00',
    status: 'active'
  },
  {
    id: '2',
    type: 'fight',
    title: 'Конфликтная ситуация',
    description: 'Система распознала потасовку возле детской площадки. Охрана направлена на место.',
    location: 'Детская площадка',
    timestamp: '2024-03-31T12:15:00',
    status: 'resolved'
  }
];

export function useAppState() {
  const [user] = useState<UserProfile>(initialUser);
  const [devices, setDevices] = useState<SmartDevice[]>(initialDevices);
  const [climate, setClimate] = useState<ClimateSettings>(initialClimate);
  const [payments] = useState<Payment[]>(initialPayments);
  const [utilityStats] = useState<UtilityStats[]>(initialUtilityStats);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [services] = useState<Service[]>(initialServices);
  const [products] = useState<Product[]>(initialProducts);
  const [restaurants] = useState<Restaurant[]>(initialRestaurants);
  const [sharingItems] = useState<SharingItem[]>(initialSharingItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [guestQRs, setGuestQRs] = useState<GuestQR[]>(initialGuestQRs);
  const [aiContext] = useState<AIContext>(initialAIContext);
  const [isEmergency, setIsEmergency] = useState(false);
  const [communityEvents] = useState<CommunityEvent[]>(initialCommunityEvents);
  const [newsItems] = useState<NewsItem[]>(initialNewsItems);
  const [chargingStations] = useState<ChargingStation[]>(initialChargingStations);
  const [securityIncidents] = useState<SecurityIncident[]>(initialSecurityIncidents);

  // Управление устройствами
  const toggleDevice = useCallback((deviceId: string) => {
    setDevices(prev => prev.map(d =>
      d.id === deviceId ? { ...d, isOn: !d.isOn } : d
    ));
  }, []);

  const toggleAllLights = useCallback(() => {
    const lightDevices = devices.filter(d => d.type === 'light');
    const allOn = lightDevices.every(d => d.isOn);
    setDevices(prev => prev.map(d =>
      d.type === 'light' ? { ...d, isOn: !allOn } : d
    ));
  }, [devices]);

  const updateDeviceSettings = useCallback((deviceId: string, settings: Partial<SmartDevice['settings']>) => {
    setDevices(prev => prev.map(d =>
      d.id === deviceId ? { ...d, settings: { ...d.settings, ...settings } } : d
    ));
  }, []);

  // Управление климатом
  const setTemperature = useCallback((temp: number) => {
    setClimate(prev => ({ ...prev, targetTemperature: temp }));
  }, []);

  const setBrightness = useCallback((brightness: number) => {
    setClimate(prev => ({ ...prev, brightness }));
  }, []);

  // Уведомления
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Корзина
  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name && i.source === item.source);
      if (existing) {
        return prev.map(i =>
          i.name === item.name && i.source === item.source
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item, id: Date.now().toString() }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQuantity = i.quantity + delta;
        return { ...i, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return i;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Гостевые QR-коды
  const generateGuestQR = useCallback((purpose: string, hours: number) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);

    const newQR: GuestQR = {
      id: Date.now().toString(),
      code: `GUEST-${Date.now()}`,
      expiresAt: expiresAt.toISOString(),
      purpose
    };
    setGuestQRs(prev => [newQR, ...prev]);
    return newQR;
  }, []);

  const deleteGuestQR = useCallback((id: string) => {
    setGuestQRs(prev => prev.filter(qr => qr.id !== id));
  }, []);

  // Счётчики
  const peopleAtHome = user.familyMembers.filter(m => m.isHome).length;
  const adultsAtHome = user.familyMembers.filter(m => m.role === 'adult' && m.isHome).length;
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  return {
    // Данные
    user,
    devices,
    climate,
    payments,
    utilityStats,
    notifications,
    services,
    products,
    restaurants,
    sharingItems,
    cart,
    guestQRs,
    aiContext,
    isEmergency,
    communityEvents,
    newsItems,
    chargingStations,
    securityIncidents,

    // Счётчики
    peopleAtHome,
    adultsAtHome,
    unreadNotifications,
    totalPending,
    cartTotal,

    // Действия
    toggleDevice,
    toggleAllLights,
    updateDeviceSettings,
    setTemperature,
    setBrightness,
    markNotificationRead,
    addNotification,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    generateGuestQR,
    deleteGuestQR,
    setIsEmergency
  };
}
