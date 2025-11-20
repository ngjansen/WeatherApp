import React from 'react';
import { WeatherData } from '../types';
import { WeatherIcon, DetailIcon } from './Icons';
import { Sparkles } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
  theme: {
    accent: string;
    accentBg: string;
    chartHex: string;
  };
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, theme }) => {
  const { current, location, aiSummary } = data;

  // Helper for UV label
  const getUvLabel = (uv: number) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    return 'Very High';
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full animate-fade-in">
      
      {/* Top Header: Location & Temp */}
      <div className="relative flex flex-col items-center justify-center pt-6 md:pt-10 pb-2 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-lg">
           <span className={`w-2 h-2 rounded-full animate-pulse ${theme.accentBg}`}></span>
           <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider opacity-90 drop-shadow-md text-white">Live Forecast</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-1 drop-shadow-xl font-display px-4 break-words">
          {location.city}
        </h1>
        <p className="text-sm md:text-lg opacity-80 font-light tracking-wide drop-shadow-md">
          {location.country} • {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </p>

        <div className="flex flex-col items-center justify-center mt-4 md:mt-6 relative">
          {/* Huge Temp: Scaled for mobile to desktop */}
          <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] leading-none font-bold tracking-tighter bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl font-display filter">
            {Math.round(current.temp)}°
          </span>
          
          <div className="flex items-center gap-3 mt-2">
            <div className="drop-shadow-lg">
                <WeatherIcon condition={current.condition} className={`w-6 h-6 md:w-8 md:h-8 ${theme.accent}`} />
            </div>
            <p className="text-xl md:text-3xl font-light opacity-90 capitalize font-display drop-shadow-md">{current.description}</p>
          </div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="mx-auto max-w-2xl w-full px-2 md:px-0">
        <div className="glass-panel p-4 md:p-5 rounded-2xl flex gap-3 md:gap-4 items-start relative overflow-hidden group shadow-lg transition-transform duration-300 hover:scale-[1.01]">
          <div className={`absolute -right-10 -top-10 w-32 h-32 ${theme.accentBg} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-all duration-500`}></div>
          
          <div className="flex-shrink-0 bg-white/10 p-2 rounded-full mt-1">
            <Sparkles className={`w-4 h-4 md:w-5 md:h-5 ${theme.accent}`} />
          </div>
          <div>
            <h3 className={`text-xs md:text-sm font-semibold ${theme.accent} uppercase tracking-wider mb-1`}>AI Daily Insight</h3>
            <p className="opacity-90 leading-relaxed font-light text-sm md:text-lg drop-shadow-sm">
              {aiSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl mx-auto px-2 md:px-0">
        <StatCard 
          label="Wind" 
          value={`${current.windSpeed} km/h`} 
          icon={<DetailIcon type="wind" className={theme.accent} />}
          subtext="Gusts up to 15"
          theme={theme}
        />
        <StatCard 
          label="Humidity" 
          value={`${current.humidity}%`} 
          icon={<DetailIcon type="humidity" className={theme.accent} />}
          theme={theme}
          visual={
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className={`h-full ${theme.accentBg} rounded-full`} style={{ width: `${current.humidity}%` }} />
            </div>
          }
        />
        <StatCard 
          label="Feels Like" 
          value={`${Math.round(current.feelsLike)}°`} 
          icon={<DetailIcon type="feelsLike" className={theme.accent} />}
          subtext={current.feelsLike > current.temp ? "Humid" : "Windy"}
          theme={theme}
        />
         <StatCard 
          label="UV Index" 
          value={`${current.uvIndex}`} 
          icon={<DetailIcon type="visibility" className={theme.accent} />}
          subtext={getUvLabel(current.uvIndex)}
          theme={theme}
          visual={
            <div className="flex gap-1 mt-2">
                {[...Array(11)].map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < current.uvIndex ? theme.accentBg : 'bg-white/10'}`} />
                ))}
            </div>
          }
        />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; subtext?: string; visual?: React.ReactNode; theme: any }> = ({ label, value, icon, subtext, visual, theme }) => (
  <div className="glass-panel p-3 md:p-4 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-colors duration-300 shadow-md min-h-[100px]">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] md:text-xs opacity-60 font-medium uppercase tracking-wider">{label}</span>
      {icon}
    </div>
    <div>
      <span className="text-xl md:text-2xl font-bold font-display drop-shadow-sm">{value}</span>
      {visual}
      {subtext && <p className="text-[10px] opacity-50 mt-2 leading-tight truncate">{subtext}</p>}
    </div>
  </div>
);