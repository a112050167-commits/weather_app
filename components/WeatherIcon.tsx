import React from 'react';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon, CloudDrizzle } from 'lucide-react';

interface WeatherIconProps {
  code: number;
  isDay: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay, className = "w-16 h-16" }) => {
  // WMO Weather interpretation codes (Open-Meteo standard)
  
  // Clear
  if (code === 0) {
    return isDay ? <Sun className={`${className} text-yellow-400`} /> : <Moon className={`${className} text-slate-200`} />;
  }
  
  // Cloudy / Mainly Clear
  if (code === 1 || code === 2 || code === 3) {
    return <Cloud className={`${className} text-blue-200`} />;
  }

  // Fog
  if (code === 45 || code === 48) {
    return <CloudFog className={`${className} text-slate-300`} />;
  }

  // Drizzle
  if (code >= 51 && code <= 57) {
    return <CloudDrizzle className={`${className} text-blue-300`} />;
  }

  // Rain
  if (code >= 61 && code <= 67) {
    return <CloudRain className={`${className} text-blue-500`} />;
  }

  // Snow
  if (code >= 71 && code <= 77) {
    return <CloudSnow className={`${className} text-white`} />;
  }

  // Rain showers
  if (code >= 80 && code <= 82) {
    return <CloudRain className={`${className} text-blue-400`} />;
  }

  // Snow showers
  if (code === 85 || code === 86) {
    return <CloudSnow className={`${className} text-slate-100`} />;
  }

  // Thunderstorm
  if (code >= 95) {
    return <CloudLightning className={`${className} text-yellow-500`} />;
  }

  return <Sun className={className} />;
};

export default WeatherIcon;