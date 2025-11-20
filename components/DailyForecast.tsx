import React from 'react';
import { WeatherData } from '../types';
import { WeatherIcon } from './Icons';
import { CloudRain } from 'lucide-react';

interface DailyForecastProps {
  data: WeatherData['daily'];
  theme: {
    accent: string;
    accentBg: string;
    chartHex: string;
  };
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ data, theme }) => {
  const globalMin = Math.min(...data.map(d => d.minTemp));
  const globalMax = Math.max(...data.map(d => d.maxTemp));
  const range = globalMax - globalMin;

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 shadow-2xl h-full">
       <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-semibold text-white font-display">7-Day Forecast</h2>
         <span className="text-xs text-white/40 uppercase tracking-widest">Upcoming</span>
      </div>

      <div className="space-y-2">
        {data.map((day, i) => {
          const leftPad = ((day.minTemp - globalMin) / range) * 100;
          const width = ((day.maxTemp - day.minTemp) / range) * 100;
          
          return (
            <div key={i} className="group grid grid-cols-[80px_40px_1fr] items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-all duration-300 cursor-default border border-transparent hover:border-white/5">
              
              {/* Day & Date */}
              <div className="flex flex-col">
                <span className="font-semibold text-white/90 font-display text-lg">{i === 0 ? 'Today' : day.day.slice(0, 3)}</span>
              </div>
              
              {/* Icon */}
              <div className="flex flex-col items-center justify-center">
                 <WeatherIcon condition={day.condition} className="w-6 h-6 text-white/80 group-hover:scale-110 transition-transform" />
                 {day.precipChance > 20 && (
                    <div className="flex items-center gap-0.5 mt-1">
                         <CloudRain className={`w-3 h-3 ${theme.accent}`} />
                        <span className={`text-[10px] ${theme.accent} font-bold`}>{day.precipChance}%</span>
                    </div>
                 )}
              </div>

              {/* Range Bar */}
              <div className="flex items-center gap-4 w-full">
                <span className="text-sm text-white/50 w-6 text-right font-medium">{Math.round(day.minTemp)}°</span>
                
                <div className="relative flex-1 h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                        className="absolute h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                        style={{ 
                            left: `${leftPad}%`,
                            width: `${width}%`,
                            minWidth: '15%',
                            background: `linear-gradient(90deg, rgba(255,255,255,0.4) 0%, ${theme.chartHex} 100%)`
                        }}
                    />
                </div>

                <span className="text-sm text-white w-6 font-bold">{Math.round(day.maxTemp)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};