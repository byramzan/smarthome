import { Home, Briefcase, Receipt, Shield, Users } from 'lucide-react';
import type { Screen } from '@/types';

interface BottomNavProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  unreadCount: number;
}

const navItems: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Дом', icon: Home },
  { id: 'services', label: 'Сервисы', icon: Briefcase },
  { id: 'community', label: 'Соседи', icon: Users },
  { id: 'security', label: 'Доступ', icon: Shield },
  { id: 'utilities', label: 'ЖКХ', icon: Receipt },
];

export function BottomNav({ activeScreen, onScreenChange, unreadCount }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#12121A]/95 backdrop-blur-xl nav-glow rounded-t-3xl z-50">
      <div className="max-w-[480px] mx-auto flex items-center justify-around h-[76px] px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300 ${isActive
                  ? 'bg-nova-primary/20'
                  : 'hover:bg-[#1A1A25]'
                }`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={`transition-all duration-300 ${isActive
                      ? 'text-[#60A5FA]'
                      : 'text-[#64748B]'
                    }`}
                />
                {item.id === 'utilities' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-nova-primary rounded-full border-2 border-[#12121A]" />
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-[#60A5FA]' : 'text-[#64748B]'
                }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
