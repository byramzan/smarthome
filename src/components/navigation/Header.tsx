import { Bell } from 'lucide-react';
import type { Screen } from '@/types';

interface HeaderProps {
  screen: Screen;
  unreadCount: number;
  userName: string;
  onNotificationClick: () => void;
}

const screenTitles: Record<Screen, string> = {
  home: 'Добро пожаловать',
  services: 'Услуги',
  community: 'Сообщество',
  utilities: 'ЖКХ',
  security: 'Безопасность',
  profile: 'Профиль',
};

export function Header({ screen, unreadCount, userName, onNotificationClick }: HeaderProps) {
  const isHome = screen === 'home';

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-[#27273A]/50">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          {isHome ? (
            <>
              <p className="text-sm text-[#64748B]">{screenTitles[screen]}</p>
              <h1 className="text-2xl font-bold text-gradient">{userName}</h1>
            </>
          ) : (
            <h1 className="text-xl font-bold text-[#F8FAFC]">{screenTitles[screen]}</h1>
          )}
        </div>

        <button
          onClick={onNotificationClick}
          className="nova-icon-button relative"
        >
          <Bell size={20} className="text-[#94A3B8]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#3B82F6] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#0A0A0F]">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
