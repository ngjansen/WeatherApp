import React from 'react';
import { WeatherData } from '../types';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WeatherIcon } from './Icons';

interface HourlyForecastProps {
  data: WeatherData['hourly'];
  theme: {
    accent: string;
    accentBg: string;
    chartHex: string;
  };
}

const CustomTooltip = ({ active, payload, label, color }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-2xl text-center min-w-[80px]">
        <p className="text-sm font-medium text-white/60 mb-1">{label}</p>
        <div className="flex items-center justify-center gap-1">
           <span className="text-2xl font-bold text-white font-display">{payload[0].value}°</span>
        </div>
        <p className="text-xs mt-1" style={{ color: color }}>{payload[0].payload.condition}</p>
      </div>
    );
  }
  return null;
};

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, theme }) => {
  // Limit to next 24 hours
  const chartData = data.slice(0, 24);

  return (
    <div className="w-full glass-panel rounded-3xl p-4 md:p-8 shadow-2xl h-full flex flex-col">
      <div className="flex justify-between items-end mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-white font-display">Hourly Forecast</h2>
        <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest">Next 24 Hours</span>
      </div>
      
      {/* Mobile: Horizontal Scroll List with Snap */}
      <div className="flex md:hidden overflow-x-auto pb-4 gap-3 no-scrollbar mask-linear-fade snap-x snap-mandatory touch-pan-x">
        {chartData.map((hour, i) => (
          <div key={i} className="snap-center flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 min-w-[72px] border border-white/5">
            <span className="text-xs text-white/60 font-medium">{hour.time}</span>
            <WeatherIcon condition={hour.condition} className="w-6 h-6 text-white" />
            <span className="text-lg font-bold">{Math.round(hour.temp)}°</span>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${theme.accentBg}`} style={{width: `${hour.precipChance}%`}} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Chart */}
      <div className="hidden md:block flex-1 min-h-[250px] w-full -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.chartHex} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme.chartHex} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
              dy={10}
              interval={2} 
            />
            <Tooltip content={<CustomTooltip color={theme.chartHex} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }} />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke={theme.chartHex} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};