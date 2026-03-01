// Типы для приложения NOVA Smart Home

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  isHome: boolean;
  role: 'adult' | 'child';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  apartment: string;
  phone: string;
  email: string;
  familyMembers: FamilyMember[];
  cars: Car[];
}

export interface Car {
  id: string;
  model: string;
  plate: string;
  color: string;
}

export interface SmartDevice {
  id: string;
  name: string;
  type: 'vacuum' | 'outlet' | 'stove' | 'light' | 'climate';
  isOn: boolean;
  icon: string;
  room?: string;
  settings?: DeviceSettings;
}

export interface DeviceSettings {
  autoOffWhenEmpty?: boolean;
  schedule?: {
    enabled: boolean;
    time?: string;
    room?: string;
    days?: string[];
  };
}

export interface ClimateSettings {
  temperature: number;
  targetTemperature: number;
  humidity: number;
  brightness: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  type: 'electricity' | 'water' | 'gas' | 'maintenance' | 'rent';
  status: 'paid' | 'pending';
  period: string;
  months?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency';
  date: string;
  isRead: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

export interface Service {
  id: string;
  name: string;
  category: 'cleaning' | 'repair' | 'sharing' | 'delivery' | 'grocery' | 'restaurant';
  icon: string;
  description: string;
  price?: string;
  schedule?: {
    availableDays: string[];
    availableHours: string[];
  };
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  icon: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  menu: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'grocery' | 'food';
  source: string;
}

export interface GuestQR {
  id: string;
  code: string;
  expiresAt: string;
  purpose: string;
}

export interface AIContext {
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  season: string;
  isRamadan: boolean;
  familyActivity: 'low' | 'medium' | 'high';
}

export interface AIMessage {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  actions?: {
    label: string;
    action: string;
  }[];
}

export interface UtilityStats {
  month: string;
  electricity: number;
  water: number;
  gas: number;
  maintenance: number;
}

export interface SharingItem {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerHour: number;
  deposit: number;
  owner: string;
  rating: number;
  available: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'holiday' | 'meetup' | 'activity';
  participants: number;
  image?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
  author: string;
  type: 'news' | 'announcement';
}

export interface ChargingStation {
  id: string;
  name: string;
  status: 'available' | 'in_use' | 'offline';
  connectors: string[];
  pricePerKwh: number;
}

export interface SecurityIncident {
  id: string;
  type: 'fight' | 'accident' | 'suspicious' | 'vandalism';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  status: 'active' | 'resolved';
  image?: string;
}

export type Screen = 'home' | 'services' | 'utilities' | 'security' | 'community' | 'profile';
