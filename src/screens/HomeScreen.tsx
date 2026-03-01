import { Users, Power, Sparkles } from 'lucide-react';
import { DeviceCard } from '@/components/devices/DeviceCard';
import { ClimateControl } from '@/components/devices/ClimateControl';
import type { SmartDevice, ClimateSettings, FamilyMember } from '@/types';

interface HomeScreenProps {
  familyMembers: FamilyMember[];
  devices: SmartDevice[];
  climate: ClimateSettings;
  peopleAtHome: number;
  adultsAtHome: number;
  onToggleDevice: (id: string) => void;
  onToggleAllLights: () => void;
  onTemperatureChange: (temp: number) => void;
  onBrightnessChange: (brightness: number) => void;
  onUpdateDeviceSettings: (deviceId: string, settings: Partial<SmartDevice['settings']>) => void;
}

export function HomeScreen({
  familyMembers,
  devices,
  climate,
  peopleAtHome,
  adultsAtHome,
  onToggleDevice,
  onToggleAllLights,
  onTemperatureChange,
  onBrightnessChange,
  onUpdateDeviceSettings
}: HomeScreenProps) {
  const atHomeMembers = familyMembers.filter(m => m.isHome);
  const allLightsOn = devices.filter(d => d.type === 'light').every(d => d.isOn);

  return (
    <div className="space-y-5 pb-28 animate-fade-in">
      {/* Presence Status */}
      <div className="nova-card p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-nova-primary/20 blur-3xl rounded-full" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-nova-primary/20 rounded-xl flex items-center justify-center">
              <Users size={22} className="text-[#10B981]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#F8FAFC]">Сейчас дома</h3>
              <p className="text-xs text-[#64748B]">{peopleAtHome} {peopleAtHome === 1 ? 'человек' : peopleAtHome < 5 ? 'человека' : 'человек'}</p>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="flex flex-wrap gap-2 relative z-10">
          {atHomeMembers.map((member) => (
            <span
              key={member.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full text-xs font-medium text-[#10B981]"
            >
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full status-online" />
              {member.name}
            </span>
          ))}
          {familyMembers.filter(m => !m.isHome).map((member) => (
            <span
              key={member.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A25] border border-[#27273A] rounded-full text-xs font-medium text-[#64748B]"
            >
              <span className="w-1.5 h-1.5 bg-[#64748B] rounded-full" />
              {member.name}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Scenarios */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={onToggleAllLights}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl whitespace-nowrap transition-all duration-300 ${allLightsOn
              ? 'bg-nova-primary text-white'
              : 'bg-[#12121A] text-[#F8FAFC] border border-[#27273A] hover:border-[#3B82F6]/50'
            }`}
        >
          <Power size={18} />
          <span className="text-sm font-medium">{allLightsOn ? 'Выключить всё' : 'Включить всё'}</span>
        </button>

        <button
          onClick={() => onTemperatureChange(23)}
          className="flex items-center gap-2 px-5 py-3.5 bg-[#12121A] text-[#F8FAFC] rounded-2xl whitespace-nowrap border border-[#27273A] hover:border-[#3B82F6]/50 transition-all"
        >
          <Sparkles size={18} className="text-[#60A5FA]" />
          <span className="text-sm font-medium">Комфорт</span>
        </button>
      </div>

      {/* Climate Control */}
      <ClimateControl
        climate={climate}
        onTemperatureChange={onTemperatureChange}
        onBrightnessChange={onBrightnessChange}
      />

      {/* Devices */}
      <div>
        <h3 className="font-bold text-base text-[#F8FAFC] mb-3">Устройства</h3>
        <div className="grid grid-cols-2 gap-3">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onToggle={() => onToggleDevice(device.id)}
              onUpdateSettings={(settings) => onUpdateDeviceSettings(device.id, settings)}
              adultsAtHome={adultsAtHome}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
