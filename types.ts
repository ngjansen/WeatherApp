export interface WeatherData {
  location: {
    city: string;
    country: string;
    lat?: number;
    lon?: number;
  };
  current: {
    temp: number;
    condition: string; // e.g., "Sunny", "Rainy", "Cloudy"
    description: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    uvIndex: number;
    visibility: number;
    isDay: boolean;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  aiSummary: string; // A short, fun AI generated tip or summary
}

export interface HourlyForecast {
  time: string; // "14:00"
  temp: number;
  condition: string;
  precipChance: number;
}

export interface DailyForecast {
  day: string; // "Monday"
  date: string; // "Oct 24"
  minTemp: number;
  maxTemp: number;
  condition: string;
  precipChance: number;
}

export enum WeatherCondition {
  Sunny = "Sunny",
  Clear = "Clear",
  Cloudy = "Cloudy",
  PartlyCloudy = "PartlyCloudy",
  Rain = "Rain",
  Drizzle = "Drizzle",
  Thunderstorm = "Thunderstorm",
  Snow = "Snow",
  Mist = "Mist",
  Fog = "Fog"
}