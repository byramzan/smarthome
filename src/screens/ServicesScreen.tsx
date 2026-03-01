import { Sparkles, Wrench, Zap, Car, Drill, Settings, ShoppingBag, Utensils, ChevronRight, Plus, Minus, Clock, Calendar, Star, ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import type { Service, Product, Restaurant, CartItem, SharingItem, ChargingStation } from '@/types';

interface ServicesScreenProps {
  services: Service[];
  products: Product[];
  restaurants: Restaurant[];
  sharingItems: SharingItem[];
  cart: CartItem[];
  cartTotal: number;
  chargingStations: ChargingStation[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onRemoveFromCart: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
}

type ServiceCategory = 'all' | 'cleaning' | 'repair' | 'sharing' | 'grocery' | 'restaurant' | 'charging';
type ViewMode = 'services' | 'products' | 'restaurants' | 'menu' | 'sharing' | 'cart' | 'cleaning' | 'charging';

const categoryLabels: Record<ServiceCategory, string> = {
  all: 'Все',
  cleaning: 'Уборка',
  repair: 'Ремонт',
  sharing: 'Шеринг',
  grocery: 'Продукты',
  restaurant: 'Еда',
  charging: 'Зарядка ЭМ'
};

const serviceIcons: Record<string, typeof Sparkles> = {
  Sparkles, Zap, Wrench, Car, Drill, Settings, ShoppingBag, Utensils
};

const productCategories = ['Все', 'Молочные', 'Мясо', 'Овощи', 'Фрукты', 'Крупы', 'Выпечка'];

export function ServicesScreen({
  services,
  products,
  restaurants,
  sharingItems,
  cart,
  cartTotal,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
  chargingStations
}: ServicesScreenProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('services');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSharing, setSelectedSharing] = useState<SharingItem | null>(null);
  const [productCategory, setProductCategory] = useState('Все');
  const [cleaningDate, setCleaningDate] = useState('');
  const [cleaningTime, setCleaningTime] = useState('');
  const [showOrderSuccess, setShowOrderSuccess] = useState<'order' | 'payment' | null>(null);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  const filteredProducts = productCategory === 'Все'
    ? products
    : products.filter(p => p.category === productCategory);

  const handleAddToCart = (item: { name: string; price: number; type: 'grocery' | 'food'; source: string }) => {
    onAddToCart({ ...item, quantity: 1 });
  };

  const handleOrderCleaning = () => {
    if (cleaningDate && cleaningTime) {
      setShowOrderSuccess('order');
      setTimeout(() => {
        setShowOrderSuccess(null);
        setViewMode('services');
        setSelectedService(null);
        setCleaningDate('');
        setCleaningTime('');
      }, 2000);
    }
  };

  const handleRentSharing = () => {
    if (selectedSharing) {
      setShowOrderSuccess('payment');
      setTimeout(() => {
        setShowOrderSuccess(null);
        setViewMode('sharing');
        setSelectedSharing(null);
      }, 2000);
    }
  };

  const handleChargeStart = () => {
    if (selectedStation) {
      setShowOrderSuccess('payment');
      setTimeout(() => {
        setShowOrderSuccess(null);
        setSelectedStation(null);
      }, 2000);
    }
  };

  // Cart View
  if (viewMode === 'cart') {
    return (
      <div className="space-y-4 pb-28 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('services')}
            className="flex items-center gap-1 text-sm text-[#60A5FA]"
          >
            <ChevronRight size={16} className="rotate-180" />
            Назад
          </button>
          <h2 className="text-lg font-bold text-[#F8FAFC]">Корзина</h2>
          <button
            onClick={onClearCart}
            className="text-sm text-[#EF4444]"
          >
            Очистить
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-[#27273A] mb-4" />
            <p className="text-[#64748B]">Корзина пуста</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="nova-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#F8FAFC]">{item.name}</p>
                    <p className="text-xs text-[#64748B]">{item.source}</p>
                    <p className="text-sm text-[#60A5FA] font-semibold">{item.price} ₽</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="w-8 h-8 bg-[#1A1A25] rounded-lg flex items-center justify-center hover:bg-[#27273A]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-medium text-[#F8FAFC]">{item.quantity}</span>
                    <button
                      onClick={() => onAddToCart(item)}
                      className="w-8 h-8 bg-nova-primary rounded-lg flex items-center justify-center"
                    >
                      <Plus size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)'
              }}
            >
              <div className="flex items-center justify-between text-white mb-4">
                <span>Итого:</span>
                <span className="text-2xl font-bold">{cartTotal} ₽</span>
              </div>
              <button
                onClick={() => {
                  setShowOrderSuccess('payment');
                  setTimeout(() => {
                    onClearCart();
                    setShowOrderSuccess(null);
                  }, 2000);
                }}
                className="w-full py-3.5 bg-white text-[#3B82F6] rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Products View
  if (viewMode === 'products') {
    return (
      <div className="space-y-4 pb-28 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('services')}
            className="flex items-center gap-1 text-sm text-[#60A5FA]"
          >
            <ChevronRight size={16} className="rotate-180" />
            Назад
          </button>
          <h2 className="text-lg font-bold text-[#F8FAFC]">Продукты</h2>
          <button
            onClick={() => setViewMode('cart')}
            className="relative w-11 h-11 bg-nova-primary rounded-xl flex items-center justify-center"
          >
            <ShoppingCart size={18} className="text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-xs rounded-full flex items-center justify-center border-2 border-[#0A0A0F]">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {productCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setProductCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${productCategory === cat
                ? 'bg-nova-primary text-white'
                : 'bg-[#12121A] text-[#94A3B8] border border-[#27273A]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="nova-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#F8FAFC]">{product.name}</p>
                <p className="text-xs text-[#64748B]">{product.unit}</p>
                <p className="text-sm text-[#60A5FA] font-semibold">{product.price} ₽</p>
              </div>
              {(() => {
                const cartItem = cart.find(i => i.name === product.name && i.source === 'Продукты');
                if (cartItem) {
                  return (
                    <div className="flex items-center gap-3 bg-[#1A1A25] rounded-xl p-1 border border-[#27273A]">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.id, -1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#27273A]"
                      >
                        <Minus size={14} className="text-[#F8FAFC]" />
                      </button>
                      <span className="text-sm font-bold text-[#F8FAFC] w-4 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.id, 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#27273A]"
                      >
                        <Plus size={14} className="text-[#F8FAFC]" />
                      </button>
                    </div>
                  );
                }
                return (
                  <button
                    onClick={() => handleAddToCart({
                      name: product.name,
                      price: product.price,
                      type: 'grocery',
                      source: 'Продукты'
                    })}
                    className="w-11 h-11 bg-nova-primary rounded-xl flex items-center justify-center"
                  >
                    <Plus size={20} className="text-white" />
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Restaurants View
  if (viewMode === 'restaurants') {
    return (
      <div className="space-y-4 pb-28 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('services')}
            className="flex items-center gap-1 text-sm text-[#60A5FA]"
          >
            <ChevronRight size={16} className="rotate-180" />
            Назад
          </button>
          <h2 className="text-lg font-bold text-[#F8FAFC]">Рестораны</h2>
          <button
            onClick={() => setViewMode('cart')}
            className="relative w-11 h-11 bg-nova-primary rounded-xl flex items-center justify-center"
          >
            <ShoppingCart size={18} className="text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-xs rounded-full flex items-center justify-center border-2 border-[#0A0A0F]">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="grid gap-3">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => {
                setSelectedRestaurant(restaurant);
                setViewMode('menu');
              }}
              className="nova-card nova-card-hover p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-[#F8FAFC]">{restaurant.name}</h3>
                  <p className="text-xs text-[#64748B]">{restaurant.cuisine}</p>
                </div>
                <div className="flex items-center gap-1 bg-[#F59E0B]/10 px-2.5 py-1 rounded-lg">
                  <Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-xs font-bold text-[#F59E0B]">{restaurant.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#64748B]">
                <span>{restaurant.deliveryTime}</span>
                <span>мин. заказ {restaurant.minOrder} ₽</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Menu View
  if (viewMode === 'menu' && selectedRestaurant) {
    return (
      <div className="space-y-4 pb-28 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('restaurants')}
            className="flex items-center gap-1 text-sm text-[#60A5FA]"
          >
            <ChevronRight size={16} className="rotate-180" />
            Назад
          </button>
          <h2 className="text-lg font-bold text-[#F8FAFC]">{selectedRestaurant.name}</h2>
          <button
            onClick={() => setViewMode('cart')}
            className="relative w-11 h-11 bg-nova-primary rounded-xl flex items-center justify-center"
          >
            <ShoppingCart size={18} className="text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] text-white text-xs rounded-full flex items-center justify-center border-2 border-[#0A0A0F]">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="grid gap-3">
          {selectedRestaurant.menu.map((item) => (
            <div key={item.id} className="nova-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-[#F8FAFC]">{item.name}</p>
                  <p className="text-xs text-[#64748B] mb-2">{item.description}</p>
                  <p className="text-sm text-[#60A5FA] font-bold">{item.price} ₽</p>
                </div>
                {(() => {
                  const cartItem = cart.find(i => i.name === item.name && i.source === selectedRestaurant.name);
                  if (cartItem) {
                    return (
                      <div className="flex items-center gap-3 bg-[#1A1A25] rounded-xl p-1 border border-[#27273A]">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, -1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#27273A]"
                        >
                          <Minus size={14} className="text-[#F8FAFC]" />
                        </button>
                        <span className="text-sm font-bold text-[#F8FAFC] w-4 text-center">{cartItem.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#27273A]"
                        >
                          <Plus size={14} className="text-[#F8FAFC]" />
                        </button>
                      </div>
                    );
                  }
                  return (
                    <button
                      onClick={() => handleAddToCart({
                        name: item.name,
                        price: item.price,
                        type: 'food',
                        source: selectedRestaurant.name
                      })}
                      className="w-11 h-11 bg-nova-primary rounded-xl flex items-center justify-center"
                    >
                      <Plus size={20} className="text-white" />
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sharing View
  if (viewMode === 'sharing') {
    return (
      <div className="space-y-4 pb-28 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('services')}
            className="flex items-center gap-1 text-sm text-[#60A5FA]"
          >
            <ChevronRight size={16} className="rotate-180" />
            Назад
          </button>
          <h2 className="text-lg font-bold text-[#F8FAFC]">Шеринг</h2>
          <div className="w-11" />
        </div>

        {selectedSharing ? (
          <div className="space-y-4">
            <div className="nova-card p-5">
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{selectedSharing.name}</h3>
              <p className="text-sm text-[#94A3B8] mb-4">{selectedSharing.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between py-2 border-b border-[#27273A]">
                  <span className="text-sm text-[#64748B]">Владелец</span>
                  <span className="text-sm font-medium text-[#F8FAFC]">{selectedSharing.owner}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#27273A]">
                  <span className="text-sm text-[#64748B]">Рейтинг</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-sm font-medium text-[#F8FAFC]">{selectedSharing.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#27273A]">
                  <span className="text-sm text-[#64748B]">Цена/час</span>
                  <span className="text-sm font-bold text-[#60A5FA]">{selectedSharing.pricePerHour} ₽</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#64748B]">Залог</span>
                  <span className="text-sm font-medium text-[#F8FAFC]">{selectedSharing.deposit} ₽</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedSharing(null)}
                  className="flex-1 py-3.5 bg-[#1A1A25] text-[#94A3B8] rounded-xl font-bold border border-[#27273A]"
                >
                  Назад
                </button>
                <button
                  onClick={handleRentSharing}
                  className="flex-1 py-3.5 bg-nova-primary text-white rounded-xl font-bold"
                >
                  Арендовать
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {sharingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedSharing(item)}
                className="nova-card nova-card-hover p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-[#F8FAFC]">{item.name}</h3>
                    <p className="text-xs text-[#64748B]">{item.category}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${item.available
                    ? 'bg-[#10B981]/10 text-[#10B981]'
                    : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                    {item.available ? 'Доступно' : 'Занято'}
                  </div>
                </div>
                <p className="text-sm text-[#94A3B8] mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-xs text-[#F8FAFC]">{item.rating}</span>
                  </div>
                  <span className="text-sm font-bold text-[#60A5FA]">{item.pricePerHour} ₽/час</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Cleaning View
  if (viewMode === 'cleaning' && selectedService) {
    const availableDays = selectedService.schedule?.availableDays || [];
    const availableHours = selectedService.schedule?.availableHours || [];

    return (
      <div className="space-y-4 pb-28 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('services')}
            className="flex items-center gap-1 text-sm text-[#60A5FA]"
          >
            <ChevronRight size={16} className="rotate-180" />
            Назад
          </button>
          <h2 className="text-lg font-bold text-[#F8FAFC]">{selectedService.name}</h2>
          <div className="w-11" />
        </div>

        <div className="nova-card p-5">
          <p className="text-sm text-[#94A3B8] mb-4">{selectedService.description}</p>
          <p className="text-lg font-bold text-[#60A5FA] mb-6">{selectedService.price}</p>

          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#F8FAFC] mb-3">
                <Calendar size={16} className="text-[#3B82F6]" />
                Выберите день
              </label>
              <div className="flex flex-wrap gap-2">
                {availableDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setCleaningDate(day)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${cleaningDate === day
                      ? 'bg-nova-primary text-white'
                      : 'bg-[#1A1A25] text-[#94A3B8] border border-[#27273A]'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#F8FAFC] mb-3">
                <Clock size={16} className="text-[#3B82F6]" />
                Выберите время
              </label>
              <div className="flex flex-wrap gap-2">
                {availableHours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => setCleaningTime(hour)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${cleaningTime === hour
                      ? 'bg-nova-primary text-white'
                      : 'bg-[#1A1A25] text-[#94A3B8] border border-[#27273A]'
                      }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleOrderCleaning}
            disabled={!cleaningDate || !cleaningTime}
            className="w-full mt-6 py-3.5 bg-nova-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Заказать
          </button>
        </div>
      </div>
    );
  }

  // Charging View
  if (viewMode === 'charging') {
    return (
      <div className="space-y-4 pb-28 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('services')}
            className="flex items-center gap-1 text-sm text-[#60A5FA]"
          >
            <ChevronRight size={16} className="rotate-180" />
            Назад
          </button>
          <h2 className="text-lg font-bold text-[#F8FAFC]">Зарядка ЭМ</h2>
          <div className="w-11" />
        </div>

        {selectedStation ? (
          <div className="nova-card p-5">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{selectedStation.name}</h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-[#27273A]">
                <span className="text-sm text-[#64748B]">Тариф</span>
                <span className="text-sm font-bold text-[#60A5FA]">{selectedStation.pricePerKwh} ₽ / кВт⋅ч</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#27273A]">
                <span className="text-sm text-[#64748B]">Коннекторы</span>
                <span className="text-sm font-medium text-[#F8FAFC]">{selectedStation.connectors.join(', ')}</span>
              </div>
              <div className="flex items-center gap-3 py-4 mt-2">
                <div className="flex-1 bg-[#1A1A25] rounded-xl p-3 border border-[#27273A] text-center">
                  <span className="block text-xs text-[#64748B] mb-1">Сумма (₽)</span>
                  <span className="block text-lg font-bold text-[#F8FAFC]">500</span>
                </div>
                <div className="flex-1 bg-[#1A1A25] rounded-xl p-3 border border-[#27273A] text-center">
                  <span className="block text-xs text-[#64748B] mb-1">Примерно кВт⋅ч</span>
                  <span className="block text-lg font-bold text-[#F8FAFC]">32.2</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleChargeStart}
              className="w-full py-3.5 bg-nova-primary text-white rounded-xl font-bold"
            >
              Оплатить и начать зарядку
            </button>
            <button
              onClick={() => setSelectedStation(null)}
              className="w-full mt-3 py-3.5 bg-[#1A1A25] text-[#94A3B8] rounded-xl font-bold border border-[#27273A]"
            >
              Отмена
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {chargingStations.map((station) => (
              <div
                key={station.id}
                onClick={() => station.status === 'available' && setSelectedStation(station)}
                className={`nova-card p-4 flex flex-col gap-3 transition-all ${station.status === 'available' ? 'cursor-pointer hover:border-[#3B82F6]/50' : 'opacity-70'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${station.status === 'available' ? 'bg-[#10B981]/10' : 'bg-[#EF4444]/10'
                      }`}>
                      <Zap size={20} className={station.status === 'available' ? 'text-[#10B981]' : 'text-[#EF4444]'} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#F8FAFC]">{station.name}</h3>
                      <p className="text-xs text-[#64748B]">{station.connectors.join(', ')}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${station.status === 'available' ? 'bg-[#10B981]/20 text-[#10B981]' :
                    station.status === 'in_use' ? 'bg-[#3B82F6]/20 text-[#60A5FA]' :
                      'bg-[#EF4444]/20 text-[#EF4444]'
                    }`}>
                    {station.status === 'available' ? 'Свободна' :
                      station.status === 'in_use' ? 'Занята' : 'Офлайн'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-bold text-[#60A5FA]">{station.pricePerKwh} ₽ / кВт⋅ч</span>
                  {station.status === 'available' && (
                    <span className="text-xs text-[#94A3B8]">Выбрать &rarr;</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Main Services View
  return (
    <div className="space-y-4 pb-28 animate-fade-in">
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(Object.keys(categoryLabels) as ServiceCategory[]).map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              if (category === 'grocery') setViewMode('products');
              else if (category === 'restaurant') setViewMode('restaurants');
              else if (category === 'sharing') setViewMode('sharing');
              else if (category === 'charging') setViewMode('charging');
              else setViewMode('services');
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
              ? 'bg-nova-primary text-white'
              : 'bg-[#12121A] text-[#94A3B8] border border-[#27273A] hover:border-[#3B82F6]/50'
              }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="grid gap-3">
        {filteredServices.map((service) => {
          const Icon = serviceIcons[service.icon] || Sparkles;
          return (
            <div
              key={service.id}
              className="nova-card nova-card-hover p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-nova-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={24} className="text-[#60A5FA]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-[#F8FAFC] mb-0.5">{service.name}</h3>
                <p className="text-xs text-[#64748B] mb-1">{service.description}</p>
                <span className="text-xs font-bold text-[#60A5FA]">{service.price}</span>
              </div>

              <button
                onClick={() => {
                  if (service.category === 'cleaning') {
                    setSelectedService(service);
                    setViewMode('cleaning');
                  }
                }}
                className="flex items-center gap-1 px-4 py-2.5 bg-nova-primary text-white rounded-xl text-sm font-medium"
              >
                Заказать
                <ChevronRight size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Success Modal */}
      {showOrderSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#12121A] border border-[#10B981]/30 rounded-3xl p-6 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-[#10B981]" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
              {showOrderSuccess === 'order' ? 'Заказ оформлен!' : 'Оплата успешно прошла'}
            </h3>
            <p className="text-sm text-[#64748B]">
              {showOrderSuccess === 'order' ? 'Исполнитель свяжется с вами' : 'Чек отправлен на почту'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
