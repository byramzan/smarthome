import { Thermometer, Sun, Droplets } from 'lucide-react';
import type { ClimateSettings } from '@/types';

interface ClimateControlProps {
  climate: ClimateSettings;
  onTemperatureChange: (temp: number) => void;
  onBrightnessChange: (brightness: number) => void;
}

export function ClimateControl({ climate, onTemperatureChange, onBrightnessChange }: ClimateControlProps) {
  const tempPercent = ((climate.targetTemperature - 16) / (30 - 16)) * 100;
  const brightnessPercent = climate.brightness;

  return (
    <div className="nova-card p-5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-nova-primary/20 blur-3xl rounded-full" />
      
      <h3 className="font-bold text-base text-[#F8FAFC] mb-5 relative z-10">Климат и освещение</h3>
      
      {/* Temperature */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-nova-primary/20 rounded-xl flex items-center justify-center">
              <Thermometer size={16} className="text-[#F59E0B]" />
            </div>
            <span className="text-sm font-medium text-[#94A3B8]">Температура</span>
          </div>
          <span className="text-2xl font-bold text-gradient">{climate.targetTemperature}°</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="16"
            max="30"
            step="0.5"
            value={climate.targetTemperature}
            onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#27273A] rounded-full appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, #F59E0B ${tempPercent}%, #27273A ${tempPercent}%)` 
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-[#64748B]">
            <span>16°</span>
            <span>23°</span>
            <span>30°</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-1">
            <Droplets size={12} />
            <span>Влажность {climate.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Thermometer size={12} />
            <span>Сейчас {climate.temperature}°</span>
          </div>
        </div>
      </div>
      
      {/* Brightness */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-nova-primary/20 rounded-xl flex items-center justify-center">
              <Sun size={16} className="text-[#60A5FA]" />
            </div>
            <span className="text-sm font-medium text-[#94A3B8]">Яркость</span>
          </div>
          <span className="text-2xl font-bold text-gradient">{climate.brightness}%</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={climate.brightness}
            onChange={(e) => onBrightnessChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-[#27273A] rounded-full appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, #3B82F6 ${brightnessPercent}%, #27273A ${brightnessPercent}%)` 
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-[#64748B]">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
