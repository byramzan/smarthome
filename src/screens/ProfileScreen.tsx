import { Home, Car, Users, Edit, ChevronRight, Shield, LogOut, User } from 'lucide-react';
import type { UserProfile } from '@/types';

interface ProfileScreenProps {
  user: UserProfile;
}

export function ProfileScreen({ user }: ProfileScreenProps) {
  const adults = user.familyMembers.filter(m => m.role === 'adult');
  const children = user.familyMembers.filter(m => m.role === 'child');

  return (
    <div className="space-y-5 pb-28 animate-fade-in">
      {/* Profile Header */}
      <div className="nova-card p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-nova-primary/20 blur-3xl rounded-full" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)'
              }}
            >
              <User size={36} className="text-white" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#1A1A25] border border-[#27273A] rounded-xl flex items-center justify-center hover:border-[#3B82F6]/50 transition-colors">
              <Edit size={14} className="text-[#60A5FA]" />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#F8FAFC]">{user.name}</h2>
            <p className="text-sm text-[#64748B]">{user.apartment}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg text-xs font-bold text-[#10B981]">
                Верифицирован
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-5 relative z-10">
          <div className="p-3.5 bg-[#1A1A25] rounded-xl border border-[#27273A]">
            <p className="text-xs text-[#64748B] mb-1">Телефон</p>
            <p className="text-sm font-medium text-[#F8FAFC]">{user.phone}</p>
          </div>
          <div className="p-3.5 bg-[#1A1A25] rounded-xl border border-[#27273A]">
            <p className="text-xs text-[#64748B] mb-1">Email</p>
            <p className="text-sm font-medium text-[#F8FAFC]">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Family */}
      <div className="nova-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-nova-primary/20 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-[#60A5FA]" />
            </div>
            <h3 className="font-bold text-base text-[#F8FAFC]">Семья</h3>
          </div>
          <span className="text-sm text-[#64748B]">{user.familyMembers.length} чел.</span>
        </div>

        <div className="space-y-3">
          {/* Adults */}
          <div>
            <p className="text-xs text-[#64748B] mb-2">Взрослые</p>
            <div className="space-y-2">
              {adults.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2.5 bg-[#1A1A25] rounded-xl border border-[#27273A]">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)'
                    }}
                  >
                    <User size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#F8FAFC]">{member.name}</p>
                    <p className="text-xs text-[#64748B]">{member.age} лет</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${member.isHome ? 'bg-[#10B981] status-online' : 'bg-[#64748B]'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Children */}
          {children.length > 0 && (
            <div>
              <p className="text-xs text-[#64748B] mb-2">Дети</p>
              <div className="space-y-2">
                {children.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2.5 bg-[#1A1A25] rounded-xl border border-[#27273A]">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)'
                      }}
                    >
                      <User size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#F8FAFC]">{member.name}</p>
                      <p className="text-xs text-[#64748B]">{member.age} лет</p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${member.isHome ? 'bg-[#10B981] status-online' : 'bg-[#64748B]'}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property */}
      <div className="nova-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-nova-primary/20 rounded-xl flex items-center justify-center">
            <Home size={18} className="text-[#60A5FA]" />
          </div>
          <h3 className="font-bold text-base text-[#F8FAFC]">Недвижимость</h3>
        </div>

        <div 
          className="p-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/70">ЖК NOVA Residence</span>
            <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-bold text-white">Владелец</span>
          </div>
          <p className="text-xl font-bold text-white mb-1">{user.apartment}</p>
          <p className="text-xs text-white/70">Грозный, проспект Кадырова, 200</p>
        </div>
      </div>

      {/* Transport */}
      <div className="nova-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 bg-nova-primary/20 rounded-xl flex items-center justify-center">
            <Car size={18} className="text-[#60A5FA]" />
          </div>
          <h3 className="font-bold text-base text-[#F8FAFC]">Транспорт</h3>
        </div>

        <div className="space-y-3">
          {user.cars.map((car) => (
            <div key={car.id} className="flex items-center gap-3 p-3 bg-[#1A1A25] rounded-xl border border-[#27273A]">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${car.color}30` }}
              >
                <Car size={20} style={{ color: car.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#F8FAFC]">{car.model}</p>
                <p className="text-xs text-[#64748B] font-mono">{car.plate}</p>
              </div>
              <ChevronRight size={18} className="text-[#64748B]" />
            </div>
          ))}
        </div>
      </div>

      {/* Data Security */}
      <div className="nova-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center border border-[#10B981]/30">
            <Shield size={20} className="text-[#10B981]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#F8FAFC]">Безопасность данных</h3>
            <p className="text-xs text-[#64748B]">Децентрализованное хранение</p>
          </div>
        </div>
        
        <div className="p-3.5 bg-[#1A1A25] rounded-xl border border-[#27273A]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#10B981] rounded-full status-online" />
            <span className="text-xs font-bold text-[#10B981]">Зашифрованный профиль</span>
          </div>
          <p className="text-xs text-[#64748B]">
            Ваши данные хранятся в зашифрованном виде. У девелопера и УК нет доступа к личной информации.
          </p>
        </div>
      </div>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 p-4 bg-[#12121A] rounded-2xl border border-[#27273A] text-[#EF4444] font-bold hover:bg-[#EF4444]/10 hover:border-[#EF4444]/30 transition-all">
        <LogOut size={18} />
        Выйти из аккаунта
      </button>
    </div>
  );
}
