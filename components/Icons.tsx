import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudDrizzle, 
  CloudFog, 
  Moon,
  Wind,
  Droplets,
  Eye,
  ThermometerSun,
  CloudSun
} from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  className?: string;
  isNight?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = "w-6 h-6", isNight = false }) => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes("thunder")) return <CloudLightning className={className} />;
  if (lowerCondition.includes("drizzle")) return <CloudDrizzle className={className} />;
  if (lowerCondition.includes("rain")) return <CloudRain className={className} />;
  if (lowerCondition.includes("snow")) return <CloudSnow className={className} />;
  if (lowerCondition.includes("mist") || lowerCondition.includes("fog")) return <CloudFog className={className} />;
  
  if (lowerCondition.includes("cloud")) {
    if (lowerCondition.includes("partly")) return <CloudSun className={className} />;
    return <Cloud className={className} />;
  }

  if (isNight) return <Moon className={className} />;
  
  return <Sun className={className} />;
};

export const DetailIcon: React.FC<{ type: 'humidity' | 'wind' | 'feelsLike' | 'visibility', className?: string }> = ({ type, className = "w-5 h-5" }) => {
  switch(type) {
    case 'humidity': return <Droplets className={className} />;
    case 'wind': return <Wind className={className} />;
    case 'feelsLike': return <ThermometerSun className={className} />;
    case 'visibility': return <Eye className={className} />;
    default: return <Sun className={className} />;
  }
};