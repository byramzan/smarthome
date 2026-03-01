import { Bot, Plug, Flame, Lightbulb, Power, Settings, Clock, Home } from 'lucide-react';
import { useState } from 'react';
import type { SmartDevice } from '@/types';

interface DeviceCardProps {
  device: SmartDevice;
  onToggle: () => void;
  onUpdateSettings: (settings: Partial<SmartDevice['settings']>) => void;
  adultsAtHome: number;
}

const deviceIcons: Record<string, typeof Bot> = {
  vacuum: Bot,
  outlet: Plug,
  stove: Flame,
  light: Lightbulb,
};

const deviceGradients: Record<string, { on: string; off: string }> = {
  vacuum: {
    on: 'from-[#06B6D4] to-[#22D3EE]',
    off: 'from-[#1A1A25] to-[#27273A]'
  },
  outlet: {
    on: 'from-[#10B981] to-[#34D399]',
    off: 'from-[#1A1A25] to-[#27273A]'
  },
  stove: {
    on: 'from-[#F59E0B] to-[#FBBF24]',
    off: 'from-[#1A1A25] to-[#27273A]'
  },
  light: {
    on: 'from-[#3B82F6] to-[#60A5FA]',
    off: 'from-[#1A1A25] to-[#27273A]'
  },
};

const rooms = ['Гостиная', 'Кухня', 'Спальня', 'Ванная', 'Прихожая'];
const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function DeviceCard({ device, onToggle, onUpdateSettings, adultsAtHome }: DeviceCardProps) {
  const Icon = deviceIcons[device.type] || Power;
  const gradients = deviceGradients[device.type] || deviceGradients.light;
  const [showSettings, setShowSettings] = useState(false);

  const autoOffEnabled = device.settings?.autoOffWhenEmpty;
  const shouldShowWarning = autoOffEnabled && adultsAtHome === 0 && device.isOn;

  return (
    <>
      <div
        onClick={onToggle}
        className={`nova-card nova-card-hover p-4 cursor-pointer relative overflow-hidden ${device.isOn ? 'border-[#3B82F6]/30' : ''
          } ${shouldShowWarning ? 'border-[#F59E0B]/50' : ''}`}
      >
        {/* Glow Effect */}
        {device.isOn && (
          <div className={`absolute -top-10 -right-10 w-20 h-20 bg-nova-primary`} />
        )}

        <div className="flex items-start justify-between mb-3 relative z-10">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${device.isOn ? gradients.on : gradients.off
            } transition-all duration-300 ${device.isOn ? 'shadow-lg' : ''}`}>
            <Icon
              size={20}
              className={`transition-colors duration-300 ${device.isOn ? 'text-white' : 'text-[#64748B]'}`}
            />
          </div>
          <div className="flex items-center gap-2">
            {shouldShowWarning && (
              <span className="text-[10px] text-[#F59E0B] font-medium bg-[#F59E0B]/10 px-2 py-1 rounded-full">
                Нет взрослых
              </span>
            )}
            <div className={`w-10 h-6 rounded-full p-0.5 transition-all duration-300 ${device.isOn
                ? 'bg-nova-primary'
                : 'bg-[#27273A]'
              }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${device.isOn ? 'translate-x-4' : 'translate-x-0'
                }`} />
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-sm text-[#F8FAFC] mb-0.5 relative z-10">{device.name}</h3>
        <p className="text-xs text-[#64748B] relative z-10">{device.room}</p>

        <div className="mt-3 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${device.isOn ? 'bg-[#10B981] status-online' : 'bg-[#64748B]'}`} />
            <span className={`text-xs font-medium ${device.isOn ? 'text-[#10B981]' : 'text-[#64748B]'}`}>
              {device.isOn ? 'Включено' : 'Выключено'}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(true);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#27273A] transition-colors"
          >
            <Settings size={14} className="text-[#64748B]" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#12121A] border border-[#27273A] rounded-3xl p-6 mx-4 max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#F8FAFC]">Настройки</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="w-9 h-9 bg-[#1A1A25] rounded-xl flex items-center justify-center hover:bg-[#27273A] transition-colors"
              >
                <Power size={16} className="text-[#64748B]" />
              </button>
            </div>

            {/* Auto-off */}
            <div className="mb-6 p-4 bg-[#1A1A25] rounded-2xl border border-[#27273A]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Home size={16} className="text-[#3B82F6]" />
                  <span className="text-sm font-medium text-[#F8FAFC]">Автоотключение</span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ autoOffWhenEmpty: !autoOffEnabled })}
                  className={`w-12 h-6 rounded-full p-0.5 transition-all duration-300 ${autoOffEnabled
                      ? 'bg-nova-primary'
                      : 'bg-[#27273A]'
                    }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${autoOffEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                </button>
              </div>
              <p className="text-xs text-[#64748B]">Выключать, когда нет взрослых дома</p>
            </div>

            {/* Schedule for vacuum */}
            {device.type === 'vacuum' && (
              <div className="mb-6 pt-4 border-t border-[#27273A]">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-[#3B82F6]" />
                  <span className="text-sm font-medium text-[#F8FAFC]">Расписание</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#94A3B8]">Включить</span>
                    <button
                      onClick={() => onUpdateSettings({
                        schedule: {
                          enabled: !device.settings?.schedule?.enabled,
                          time: device.settings?.schedule?.time || '10:00',
                          room: device.settings?.schedule?.room || 'Гостиная',
                          days: device.settings?.schedule?.days || []
                        }
                      })}
                      className={`w-12 h-6 rounded-full p-0.5 transition-all duration-300 ${device.settings?.schedule?.enabled
                          ? 'bg-nova-primary'
                          : 'bg-[#27273A]'
                        }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${device.settings?.schedule?.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                    </button>
                  </div>

                  {device.settings?.schedule?.enabled && (
                    <>
                      <div>
                        <span className="text-xs text-[#64748B] block mb-2">Время</span>
                        <input
                          type="time"
                          value={device.settings?.schedule?.time || '10:00'}
                          onChange={(e) => onUpdateSettings({
                            schedule: {
                              enabled: true,
                              time: e.target.value,
                              room: device.settings?.schedule?.room || 'Гостиная',
                              days: device.settings?.schedule?.days || []
                            }
                          })}
                          className="w-full px-4 py-3 bg-[#1A1A25] border border-[#27273A] rounded-xl text-sm text-[#F8FAFC] focus:border-[#3B82F6] focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <span className="text-xs text-[#64748B] block mb-2">Комната</span>
                        <select
                          value={device.settings?.schedule?.room || 'Гостиная'}
                          onChange={(e) => onUpdateSettings({
                            schedule: {
                              enabled: true,
                              time: device.settings?.schedule?.time || '10:00',
                              room: e.target.value,
                              days: device.settings?.schedule?.days || []
                            }
                          })}
                          className="w-full px-4 py-3 bg-[#1A1A25] border border-[#27273A] rounded-xl text-sm text-[#F8FAFC] focus:border-[#3B82F6] focus:outline-none transition-colors"
                        >
                          {rooms.map(room => (
                            <option key={room} value={room}>{room}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-xs text-[#64748B] block mb-2">Дни</span>
                        <div className="flex flex-wrap gap-1.5">
                          {days.map(day => (
                            <button
                              key={day}
                              onClick={() => {
                                const currentDays = device.settings?.schedule?.days || [];
                                const newDays = currentDays.includes(day)
                                  ? currentDays.filter(d => d !== day)
                                  : [...currentDays, day];
                                onUpdateSettings({
                                  schedule: {
                                    enabled: true,
                                    time: device.settings?.schedule?.time || '10:00',
                                    room: device.settings?.schedule?.room || 'Гостиная',
                                    days: newDays
                                  }
                                });
                              }}
                              className={`w-9 h-9 rounded-xl text-xs font-medium transition-all ${(device.settings?.schedule?.days || []).includes(day)
                                  ? 'bg-nova-primary text-white'
                                  : 'bg-[#1A1A25] text-[#64748B] border border-[#27273A]'
                                }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-3.5 bg-nova-primary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/25 transition-all"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}
    </>
  );
}
