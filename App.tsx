import React, { useState, useEffect } from 'react';
import { CITIES, DEFAULT_CITY } from './constants';
import { City, WeatherData } from './types';
import { fetchWeatherData } from './services/weatherService';
import { generateOutfitSuggestion } from './services/geminiService';
import WeatherIcon from './components/WeatherIcon';
import InfoCard from './components/InfoCard';
import { Droplets, Wind, Sunset, Sparkles, ChevronDown, Umbrella } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Background gradient based on weather/time
  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-gradient-to-br from-blue-100 to-indigo-200';
    if (weatherData.weatherCode >= 95) return 'bg-gradient-to-br from-slate-700 to-slate-900 text-white'; // Storm
    if (!weatherData.isDay) return 'bg-gradient-to-br from-indigo-900 to-purple-800 text-white'; // Night
    if (weatherData.weatherCode === 0) return 'bg-gradient-to-br from-orange-100 to-blue-200'; // Clear Day
    if (weatherData.weatherCode >= 61) return 'bg-gradient-to-br from-slate-300 to-slate-500'; // Rain
    return 'bg-gradient-to-br from-blue-50 to-indigo-100'; // Default
  };

  // Fetch Weather Data
  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      setAiAdvice(null); // Reset AI advice on city change
      try {
        const data = await fetchWeatherData(selectedCity.lat, selectedCity.lng);
        setWeatherData(data);
      } catch (error) {
        console.error("Failed to load weather", error);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [selectedCity]);

  // Handle AI Outfit Suggestion
  const handleAiSuggestion = async () => {
    if (!weatherData) return;
    setAiLoading(true);
    const advice = await generateOutfitSuggestion(selectedCity.name, weatherData);
    setAiAdvice(advice);
    setAiLoading(false);
  };

  // Format Sunset Time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-700 ease-in-out ${getBackgroundClass()}`}>
      
      {/* Mobile-first Container - Max width constrained to look like a mobile app on desktop */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col relative h-[90vh] max-h-[900px]">
        
        {/* 1. Header Section */}
        <header className="pt-8 pb-2 text-center relative z-10">
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase opacity-70">WEATHER</h1>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6 custom-scrollbar">
          
          {/* 2. City Selection Section */}
          <div className="px-6 py-2 relative z-20">
            <div className="relative group">
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const city = CITIES.find(c => c.name === e.target.value);
                  if (city) setSelectedCity(city);
                }}
                className="w-full appearance-none bg-white/40 hover:bg-white/60 transition-colors backdrop-blur-md text-slate-800 font-medium py-3 px-4 pr-10 rounded-2xl shadow-sm outline-none cursor-pointer text-lg"
              >
                {CITIES.map((city) => (
                  <option key={city.name} value={city.name} className="text-slate-800 bg-white">
                    {city.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 pointer-events-none w-5 h-5" />
            </div>
          </div>

          {loading ? (
             <div className="flex items-center justify-center h-64">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white opacity-60"></div>
             </div>
          ) : weatherData && (
            <>
              {/* 3. Main Weather Info Section */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="mb-4 transform scale-125 drop-shadow-lg">
                  <WeatherIcon code={weatherData.weatherCode} isDay={weatherData.isDay} className="w-32 h-32" />
                </div>
                <h2 className="text-3xl font-bold mb-1 text-slate-800 dark:text-white drop-shadow-sm">{selectedCity.name}</h2>
                <div className="text-[5rem] leading-none font-light tracking-tighter text-slate-800 dark:text-white drop-shadow-md">
                  {Math.round(weatherData.currentTemp)}°
                </div>
              </div>

              {/* 4. Detailed Indicators Section */}
              <div className="grid grid-cols-3 gap-3 px-6 mb-8">
                <InfoCard 
                  label="Rain Chance" 
                  value={weatherData.precipitationProb} 
                  unit="%" 
                  icon={<Umbrella className="w-6 h-6 text-blue-500" />} 
                />
                <InfoCard 
                  label="Humidity" 
                  value={weatherData.humidity} 
                  unit="%" 
                  icon={<Droplets className="w-6 h-6 text-cyan-500" />} 
                />
                <InfoCard 
                  label="Wind" 
                  value={weatherData.windSpeed} 
                  unit="km/h" 
                  icon={<Wind className="w-6 h-6 text-slate-500" />} 
                />
                {/* Optional Sunset card if layout permitted 4 items, but strict to 3 columns grid as per visual vibe */}
              </div>

              {/* 5. City Scenery Section */}
              <div className="px-6 mb-6">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg group">
                  <img 
                    src={`https://picsum.photos/seed/${selectedCity.name}/800/600`} 
                    alt={`${selectedCity.name} scenery`}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay information (e.g., Sunset) on top of image for aesthetic integration */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex items-center text-white">
                    <Sunset className="w-5 h-5 mr-2 opacity-80" />
                    <span className="font-medium text-sm">Sunset at {formatTime(weatherData.sunset)}</span>
                  </div>
                </div>
              </div>

              {/* 6. AI Section */}
              <div className="px-6 pb-6">
                <button
                  onClick={handleAiSuggestion}
                  disabled={aiLoading}
                  className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl shadow-lg shadow-fuchsia-500/30 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {aiLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                      <span className="font-semibold tracking-wide">Daily Outfit Advice</span>
                    </>
                  )}
                </button>

                {/* AI Result Display */}
                {aiAdvice && (
                  <div className="mt-4 p-5 bg-white/60 backdrop-blur-md rounded-2xl shadow-inner border border-white/40 animate-fade-in-up">
                    <p className="text-slate-700 text-base leading-relaxed font-medium">
                      "{aiAdvice}"
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;