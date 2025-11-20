import React, { useState, useEffect, useCallback } from 'react';
import { getWeather } from './services/geminiService';
import { WeatherData } from './types';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { Search, MapPin, Loader2, RefreshCw } from 'lucide-react';

// Weather Theme Colors
interface ThemeColors {
  blob1: string;
  blob2: string;
  blob3: string;
  bg: string;
  accent: string; // For text/borders (e.g., text-amber-400)
  accentBg: string; // For backgrounds (e.g., bg-amber-400)
  chartHex: string; // For Recharts hex color
}

const getTheme = (condition?: string, isDay: boolean = true): ThemeColors => {
  const c = condition?.toLowerCase() || "";
  
  // --- NIGHT THEMES ---
  if (!isDay) {
     // Thunderstorm Night
     if (c.includes("thunder")) {
        return { 
          bg: "bg-slate-950", 
          blob1: "bg-purple-900", 
          blob2: "bg-yellow-900", 
          blob3: "bg-slate-900",
          accent: "text-yellow-400",
          accentBg: "bg-yellow-400",
          chartHex: "#facc15"
        };
     }
     // Clear Night
     return { 
        bg: "bg-slate-950", 
        blob1: "bg-indigo-900", 
        blob2: "bg-violet-900", 
        blob3: "bg-fuchsia-950",
        accent: "text-violet-300",
        accentBg: "bg-violet-300",
        chartHex: "#c4b5fd"
     };
  }

  // --- DAY THEMES (VIBRANT) ---

  // THUNDERSTORM (Day)
  if (c.includes("thunder")) {
    return { 
      bg: "bg-slate-900", 
      blob1: "bg-purple-600", 
      blob2: "bg-yellow-600", 
      blob3: "bg-gray-800",
      accent: "text-yellow-300",
      accentBg: "bg-yellow-300",
      chartHex: "#fde047"
    };
  }

  // RAIN / DRIZZLE (Day)
  if (c.includes("rain") || c.includes("drizzle")) {
    return { 
      bg: "bg-blue-900", // Deep but saturated
      blob1: "bg-blue-600", 
      blob2: "bg-cyan-600", 
      blob3: "bg-indigo-600",
      accent: "text-cyan-300",
      accentBg: "bg-cyan-300",
      chartHex: "#67e8f9"
    };
  }

  // SNOW (Day)
  if (c.includes("snow")) {
     return { 
      bg: "bg-sky-100", // Very bright
      blob1: "bg-white", 
      blob2: "bg-sky-200", 
      blob3: "bg-blue-200",
      accent: "text-sky-600", // Darker text for contrast on light bg
      accentBg: "bg-sky-500",
      chartHex: "#0ea5e9"
    };
  }

  // MIST / FOG (Day)
  if (c.includes("mist") || c.includes("fog")) {
    return { 
      bg: "bg-teal-800", 
      blob1: "bg-emerald-600", 
      blob2: "bg-teal-600", 
      blob3: "bg-slate-500",
      accent: "text-emerald-300",
      accentBg: "bg-emerald-300",
      chartHex: "#5eead4"
    };
  }

  // CLOUDY (Day)
  if (c.includes("cloud")) {
    return { 
      bg: "bg-blue-600", // Bright cloudy blue
      blob1: "bg-blue-400", 
      blob2: "bg-slate-400", 
      blob3: "bg-indigo-400",
      accent: "text-blue-200",
      accentBg: "bg-blue-200",
      chartHex: "#bfdbfe"
    };
  }

  // SUNNY / CLEAR (Day) - THE BRIGHTEST
  if (c.includes("sunny") || c.includes("clear")) {
    return { 
      bg: "bg-sky-500", // Vibrant Sky Blue
      blob1: "bg-orange-400", 
      blob2: "bg-yellow-300", 
      blob3: "bg-pink-400",
      accent: "text-yellow-200",
      accentBg: "bg-yellow-300",
      chartHex: "#fde047"
    };
  }

  // Default Fallback
  return { 
    bg: "bg-indigo-600", 
    blob1: "bg-purple-500", 
    blob2: "bg-pink-500", 
    blob3: "bg-blue-500",
    accent: "text-indigo-200",
    accentBg: "bg-indigo-200",
    chartHex: "#c7d2fe"
  };
};

export default function App() {
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeColors>(getTheme());

  const fetchWeather = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(query);
      setWeatherData(data);
      setTheme(getTheme(data.current.condition, data.current.isDay));
    } catch (err) {
      setError("Failed to retrieve forecast.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather("New York");
  }, [fetchWeather]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationQuery.trim()) fetchWeather(locationQuery);
  };

  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`${latitude}, ${longitude}`);
        },
        () => {
            setLoading(false);
            setError("Location access denied.");
        }
      );
    }
  };

  // Determine if text should be dark based on bg brightness (for Snow theme mainly)
  const isLightBg = theme.bg.includes("sky-100");
  const textColor = isLightBg ? "text-slate-800" : "text-white";
  const placeholderColor = isLightBg ? "placeholder-slate-500" : "placeholder-white/50";
  const glassBg = isLightBg ? "bg-black/5 border-black/5" : "bg-white/10 border-white/20";

  return (
    <div className={`min-h-screen w-full relative overflow-hidden transition-colors duration-1000 ${theme.bg}`}>
      
      {/* Dynamic Background Blobs - Optimized for performance */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none transform-gpu">
         <div className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-blob ${theme.blob1} transition-colors duration-1000`}></div>
         <div className={`absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-blob animation-delay-2000 ${theme.blob2} transition-colors duration-1000`}></div>
         <div className={`absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-blob animation-delay-4000 ${theme.blob3} transition-colors duration-1000`}></div>
      </div>

      {/* Content Wrapper */}
      <div className={`relative z-10 flex flex-col items-center p-3 sm:p-6 md:p-8 max-w-6xl mx-auto w-full min-h-screen ${textColor}`}>
        
        {/* Floating Search Bar - Sleek & Compact & Single Row */}
        <div className="sticky top-2 md:top-4 z-50 w-full flex justify-center px-4 mb-2 md:mb-6 pointer-events-none">
           {/* Pointer events auto on child to allow clicking through side areas if needed */}
          <div className={`pointer-events-auto relative group w-full max-w-[240px] focus-within:max-w-md transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${glassBg} backdrop-blur-2xl rounded-full shadow-lg hover:shadow-2xl flex items-center h-10 md:h-12 pl-4 pr-1`}>
            <Search className={`w-4 h-4 opacity-50 flex-shrink-0 ${textColor}`} />
            <form onSubmit={handleSearch} className="flex-1 min-w-0 h-full flex items-center">
                <input
                    type="text"
                    inputMode="search"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Find your city..."
                    className={`w-full h-full bg-transparent border-none ${textColor} ${placeholderColor} focus:outline-none focus:ring-0 px-3 text-sm font-medium placeholder:font-light tracking-wide truncate`}
                />
            </form>
            <div className={`w-px h-4 mx-1 opacity-20 ${isLightBg ? 'bg-black' : 'bg-white'}`}></div>
            <button 
              onClick={handleGeoLocation}
              className={`flex-shrink-0 p-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 opacity-70 hover:opacity-100 ${isLightBg ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}
              title="Use my location"
            >
              <MapPin className={`w-4 h-4 ${textColor}`} />
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="w-full flex flex-col gap-4 md:gap-6">
            {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
                <div className="relative">
                    <div className={`absolute inset-0 rounded-full blur-xl ${isLightBg ? 'bg-sky-400/30' : 'bg-white/20'}`}></div>
                    <Loader2 className={`w-12 h-12 md:w-16 md:h-16 animate-spin relative z-10 ${textColor}`} />
                </div>
                <p className="mt-6 md:mt-8 text-sm md:text-xl font-light tracking-widest uppercase opacity-80">Scanning Atmosphere</p>
            </div>
            ) : error ? (
            <div className="flex items-center justify-center h-[50vh]">
                <div className={`${glassBg} p-6 md:p-8 rounded-2xl text-center max-w-xs md:max-w-md backdrop-blur-md`}>
                    <p className="text-red-400 font-bold text-lg md:text-xl mb-2">Connection Lost</p>
                    <p className="opacity-70 mb-6 text-sm md:text-base">{error}</p>
                    <button 
                        onClick={() => fetchWeather("London")} 
                        className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 mx-auto text-sm md:text-base ${isLightBg ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    >
                        <RefreshCw className="w-4 h-4" /> Try London
                    </button>
                </div>
            </div>
            ) : weatherData ? (
            <>
                {/* Hero */}
                <section className="w-full mb-2 md:mb-4">
                    <CurrentWeather data={weatherData} theme={theme} />
                </section>

                {/* Forecasts Split */}
                <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 w-full animate-slide-up">
                    <div className="lg:col-span-3 h-full">
                        <HourlyForecast data={weatherData.hourly} theme={theme} />
                    </div>
                    <div className="lg:col-span-2 h-full">
                        <DailyForecast data={weatherData.daily} theme={theme} />
                    </div>
                </section>
            </>
            ) : null}
        </div>
        
        {/* Footer */}
        <footer className="mt-12 text-center pb-4">
            <p className="opacity-30 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
              Powered by Gemini 2.5
            </p>
        </footer>

      </div>
    </div>
  );
}