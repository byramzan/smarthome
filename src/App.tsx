import { useState, useCallback } from 'react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Header } from '@/components/navigation/Header';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { EmergencyAlert } from '@/components/common/EmergencyAlert';
import { HomeScreen } from '@/screens/HomeScreen';
import { ServicesScreen } from '@/screens/ServicesScreen';
import { UtilitiesScreen } from '@/screens/UtilitiesScreen';
import { SecurityScreen } from '@/screens/SecurityScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { CommunityScreen } from '@/screens/CommunityScreen';
import { useAppState } from '@/hooks/useAppState';
import type { Screen, AIMessage } from '@/types';

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: '1',
      text: 'Здравствуйте! Я ваш умный помощник NOVA. Чем могу помочь сегодня?',
      sender: 'ai',
      timestamp: new Date(),
      actions: [
        { label: 'Погода', action: 'weather' },
        { label: 'Семья', action: 'family' },
        { label: 'Рамадан', action: 'ramadan' },
        { label: 'Устройства', action: 'devices' }
      ]
    }
  ]);

  const {
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
    peopleAtHome,
    adultsAtHome,
    unreadNotifications,
    totalPending,
    cartTotal,
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
  } = useAppState();

  // Ramadan menu data
  const ramadanMenu = {
    today: 'лагман',
    tomorrow: 'плов',
    dayAfter: 'шурпа',
    restaurants: ['Чеченская кухня', 'Халяль Дом', 'Восточный базар']
  };

  // Generate AI response
  const generateAIResponse = (userText: string) => {
    const lowerText = userText.toLowerCase();
    let response = '';
    let actions: { label: string; action: string }[] = [];

    // Weather context
    if (lowerText.includes('погод') || lowerText.includes('холод') || lowerText.includes('тепло')) {
      response = `Сейчас на улице ${aiContext.weather.temp}°C, ${aiContext.weather.condition.toLowerCase()}. Рекомендую установить температуру в квартире на 23°C для комфорта.`;
      actions = [
        { label: 'Установить 23°C', action: 'set_temp_23' },
        { label: 'Спасибо', action: 'thanks' }
      ];
    }
    // Family context
    else if (lowerText.includes('семь') || lowerText.includes('гулять') || lowerText.includes('прогулк')) {
      const atHome = user.familyMembers.filter(m => m.isHome).map(m => m.name).join(' и ');
      response = `Сейчас дома находятся: ${atHome}. Вы давно не проводили время всей семьёй — может, спланируете совместный ужин на выходных?`;
      actions = [
        { label: 'Спланировать', action: 'plan_family' },
        { label: 'Позже', action: 'later' }
      ];
    }
    // Ramadan context
    else if (lowerText.includes('рамадан') || lowerText.includes('пост') || lowerText.includes('ифтар') || lowerText.includes('сухур')) {
      response = `Наступил священный месяц Рамадан! Сегодня по плану у нас ${ramadanMenu.today}. Могу предложить:\n\n🌙 Посетить места для совместного ифтара\n🍽️ Заказать ${ramadanMenu.today} с доставкой\n📋 Составить меню на неделю\n\nЧто выберете?`;
      actions = [
        { label: 'Заказать ' + ramadanMenu.today, action: 'order_ramadan_food' },
        { label: 'Места для ифтара', action: 'iftar_places' },
        { label: 'Меню на неделю', action: 'weekly_ramadan_menu' }
      ];
    }
    // Today's food
    else if (lowerText.includes(ramadanMenu.today) || lowerText.includes('сегодня') || lowerText.includes('готовить')) {
      response = `Сегодня по плану у нас ${ramadanMenu.today}. Могу заказать его через доставку из ресторана "Чеченская кухня" или составить список продуктов для приготовления.\n\n💰 Стоимость готового блюда: 450 ₽\n🛒 Продукты для приготовления: ~300 ₽`;
      actions = [
        { label: 'Заказать готовое', action: 'order_ready_food' },
        { label: 'Список продуктов', action: 'grocery_list' }
      ];
    }
    // Timur
    else if (lowerText.includes('тимур') || lowerText.includes('сын') || lowerText.includes('ребенок')) {
      response = 'Тимур сейчас дома. Он пришёл из школы в 14:30. Хотите, чтобы я напомнил ему сделать уроки?';
      actions = [
        { label: 'Напомнить', action: 'remind_homework' },
        { label: 'Позвонить ему', action: 'call_timur' }
      ];
    }
    // Devices
    else if (lowerText.includes('устройств') || lowerText.includes('свет') || lowerText.includes('пылесос')) {
      const activeDevices = devices.filter(d => d.isOn).length;
      response = `Сейчас активно ${activeDevices} устройств. Робот-пылесос выключен, освещение включено.`;
      actions = [
        { label: 'Комфортный режим', action: 'comfort_mode' },
        { label: 'Выключить всё', action: 'turn_off_all' }
      ];
    }
    // Thanks
    else if (lowerText.includes('спасибо') || lowerText.includes('благодар')) {
      response = 'Всегда рад помочь! Рамадан мубарак! 🌙 Если понадобится что-то ещё — обращайтесь.';
    }
    // Default
    else {
      response = 'Понял вас! Я анализирую контекст и подготовлю персонализированные рекомендации. Чем ещё могу помочь?';
      actions = [
        { label: 'Погода', action: 'weather' },
        { label: 'Рамадан', action: 'ramadan' },
        { label: 'Устройства', action: 'devices' }
      ];
    }

    const aiMessage: AIMessage = {
      id: Date.now().toString(),
      text: response,
      sender: 'ai',
      timestamp: new Date(),
      actions
    };
    setAiMessages(prev => [...prev, aiMessage]);
  };

  // Handle user message
  const handleSendMessage = useCallback((text: string) => {
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setAiMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      generateAIResponse(text);
    }, 1500);
  }, [generateAIResponse]);

  // Handle action buttons
  const handleAIAction = useCallback((action: string) => {
    let response = '';
    let actions: { label: string; action: string }[] = [];

    switch (action) {
      case 'weather':
        response = `Сейчас на улице ${aiContext.weather.temp}°C, ${aiContext.weather.condition.toLowerCase()}. Рекомендую надеть тёплую куртку. В квартире комфортная температура ${climate.temperature}°C.`;
        actions = [
          { label: 'Увеличить температуру', action: 'increase_temp' },
          { label: 'Спасибо', action: 'thanks' }
        ];
        break;
      case 'family': {
        const atHome = user.familyMembers.filter(m => m.isHome).map(m => m.name).join(' и ');
        response = `Сейчас дома находятся: ${atHome}. Ахмед в командировке. Вы давно не проводили время всей семьёй — может, спланируете совместный ужин на выходных?`;
        actions = [
          { label: 'Спланировать', action: 'plan_family' },
          { label: 'Позже', action: 'later' }
        ];
        break;
      }
      case 'ramadan':
        response = `🌙 Наступил священный месяц Рамадан!\n\nСегодня по плану у нас ${ramadanMenu.today}.\n\nМогу предложить:\n• Заказать ${ramadanMenu.today} с доставкой\n• Составить меню на неделю\n• Найти места для ифтара\n\nЧто вас интересует?`;
        actions = [
          { label: 'Заказать ' + ramadanMenu.today, action: 'order_ramadan_food' },
          { label: 'Меню на неделю', action: 'weekly_ramadan_menu' },
          { label: 'Места для ифтара', action: 'iftar_places' }
        ];
        break;
      case 'order_ramadan_food':
        response = `Отлично! Я могу заказать ${ramadanMenu.today} из ресторана "Чеченская кухня" с доставкой к 18:30 (время ифтара).\n\n💰 Стоимость: 450 ₽\n⏰ Доставка: ~30 минут\n\nОформить заказ?`;
        actions = [
          { label: 'Да, оформить', action: 'confirm_order' },
          { label: 'Другой ресторан', action: 'other_restaurant' }
        ];
        break;
      case 'weekly_ramadan_menu':
        response = `📋 Меню на неделю Рамадана:\n\nПн: ${ramadanMenu.today}\nВт: ${ramadanMenu.tomorrow}\nСр: ${ramadanMenu.dayAfter}\nЧт: долма\nПт: хинкали\nСб: шашлык\nВс: плов\n\nХотите, чтобы я заказал продукты на неделю?`;
        actions = [
          { label: 'Заказать продукты', action: 'order_groceries' },
          { label: 'Изменить меню', action: 'edit_menu' }
        ];
        break;
      case 'iftar_places':
        response = `🕌 Места для совместного ифтара в Грозном:\n\n1. Ресторан "Восточный" — шведский стол\n2. Кафе "Халяль" — семейная атмосфера\n3. ТРК "Гранд Парк" — фуд-корт\n\nХотите забронировать столик?`;
        actions = [
          { label: 'Забронировать', action: 'book_table' },
          { label: 'Спасибо', action: 'thanks' }
        ];
        break;
      case 'devices': {
        const activeDevices = devices.filter(d => d.isOn).length;
        response = `Сейчас активно ${activeDevices} устройств. Робот-пылесос выключен, освещение включено.`;
        actions = [
          { label: 'Включить пылесос', action: 'start_vacuum' },
          { label: 'Выключить свет', action: 'turn_off_lights' }
        ];
        break;
      }
      case 'increase_temp':
        setTemperature(24);
        response = 'Температура установлена на 24°C. Система климат-контроля активирована.';
        break;
      case 'set_temp_23':
        setTemperature(23);
        response = 'Температура установлена на 23°C.';
        break;
      case 'comfort_mode':
        setTemperature(23);
        response = 'Комфортный режим активирован. Температура установлена на 23°C.';
        break;
      case 'plan_family':
        response = 'Отличная идея! Вот варианты для семейного времяпрепровождения:\n\n1. 🌳 Парк цветов — прогулка\n2. 🏢 Грозный-Сити — смотровая площадка\n3. 🏛️ Национальный музей\n4. 🎬 ТРК "Гранд Парк" — кино и ужин\n\nКакой вариант вам ближе?';
        actions = [
          { label: 'Парк цветов', action: 'park' },
          { label: 'Грозный-Сити', action: 'tower' },
          { label: 'Музей', action: 'museum' }
        ];
        break;
      case 'confirm_order':
        response = '✅ Заказ оформлен! Доставка будет к 18:30. Приятного ифтара! 🌙';
        break;
      case 'thanks':
        response = 'Всегда рад помочь! Рамадан мубарак! 🌙';
        break;
      default:
        response = 'Отлично! Я запомнил ваш выбор. Чем ещё могу помочь?';
    }

    const aiMessage: AIMessage = {
      id: Date.now().toString(),
      text: response,
      sender: 'ai',
      timestamp: new Date(),
      actions
    };
    setAiMessages(prev => [...prev, aiMessage]);
  }, [aiContext, climate.temperature, user.familyMembers, devices, setTemperature, ramadanMenu.today, ramadanMenu.tomorrow, ramadanMenu.dayAfter]);

  // Render screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return (
          <HomeScreen
            familyMembers={user.familyMembers}
            devices={devices}
            climate={climate}
            peopleAtHome={peopleAtHome}
            adultsAtHome={adultsAtHome}
            onToggleDevice={toggleDevice}
            onToggleAllLights={toggleAllLights}
            onTemperatureChange={setTemperature}
            onBrightnessChange={setBrightness}
            onUpdateDeviceSettings={updateDeviceSettings}
          />
        );
      case 'services':
        return (
          <ServicesScreen
            services={services}
            products={products}
            restaurants={restaurants}
            sharingItems={sharingItems}
            cart={cart}
            cartTotal={cartTotal}
            chargingStations={chargingStations}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
            onClearCart={clearCart}
          />
        );
      case 'community':
        return <CommunityScreen events={communityEvents} news={newsItems} />;
      case 'utilities':
        return (
          <UtilitiesScreen
            payments={payments}
            utilityStats={utilityStats}
            notifications={notifications}
            totalPending={totalPending}
            onMarkRead={markNotificationRead}
          />
        );
      case 'security':
        return (
          <SecurityScreen
            guestQRs={guestQRs}
            onGenerateQR={generateGuestQR}
            onDeleteQR={deleteGuestQR}
            incidents={securityIncidents}
          />
        );
      case 'profile':
        return <ProfileScreen user={user} />;
      default:
        return null;
    }
  };

  // Emergency demo
  const triggerEmergencyDemo = () => {
    addNotification({
      title: 'ВНИМАНИЕ! Протечка воды',
      message: 'В ванной комнате обнаружена протечка воды. Требуется немедленное вмешательство!',
      type: 'emergency',
      action: {
        label: 'Вызвать сантехника',
        handler: () => {
          const aiMessage: AIMessage = {
            id: Date.now().toString(),
            text: 'Сантехник вызван! Ожидайте прибытия в течение 30 минут. Я также отправил уведомление Малике.',
            sender: 'ai',
            timestamp: new Date(),
            actions: [{ label: 'Отменить', action: 'cancel' }]
          };
          setAiMessages(prev => [...prev, aiMessage]);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Emergency Alert */}
      <EmergencyAlert
        isVisible={isEmergency}
        title="ВНИМАНИЕ! Протечка воды"
        message="В ванной комнате обнаружена протечка воды. Требуется немедленное вмешательство!"
        onClose={() => setIsEmergency(false)}
        onAction={() => {
          const aiMessage: AIMessage = {
            id: Date.now().toString(),
            text: 'Сантехник вызван! Ожидайте прибытия в течение 30 минут. Я также отправил уведомление Малике.',
            sender: 'ai',
            timestamp: new Date(),
            actions: [{ label: 'Отменить', action: 'cancel' }]
          };
          setAiMessages(prev => [...prev, aiMessage]);
          setIsEmergency(false);
        }}
        actionLabel="Вызвать сантехника"
      />

      {/* Main Container */}
      <div className="max-w-[480px] mx-auto min-h-screen bg-[#0A0A0F] relative">
        <Header
          screen={activeScreen}
          unreadCount={unreadNotifications}
          userName={user.name}
          onNotificationClick={() => setActiveScreen('utilities')}
        />

        <main className="px-5 pt-2">
          {renderScreen()}
        </main>

        <BottomNav
          activeScreen={activeScreen}
          onScreenChange={setActiveScreen}
          unreadCount={unreadNotifications}
        />

        <AIAssistant
          messages={aiMessages}
          onSendMessage={handleSendMessage}
          onActionClick={handleAIAction}
        />

        {/* Hidden Emergency Button */}
        <button
          onClick={triggerEmergencyDemo}
          className="fixed top-4 left-4 w-8 h-8 bg-transparent rounded-full flex items-center justify-center text-transparent text-xs font-bold z-50"
        >
          ЧС
        </button>
      </div>
    </div>
  );
}

export default App;
