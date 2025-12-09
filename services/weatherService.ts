import { WeatherData } from '../types';

// Open-Meteo API interpretation code to string/icon mapping
// 0: Clear sky
// 1, 2, 3: Mainly clear, partly cloudy, and overcast
// 45, 48: Fog
// 51, 53, 55: Drizzle
// 61, 63, 65: Rain
// 71, 73, 75: Snow
// 95, 96, 99: Thunderstorm

export const fetchWeatherData = async (lat: number, lng: number): Promise<WeatherData> => {
  try {
    // Constructing the URL based on the Spec's requirement + necessary daily parameter for sunset
    // Spec URL reference: https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current_weather=true&hourly=relativehumidity_2m,precipitation_probability,windspeed_10m,sunset
    // Correction: 'sunset' is a daily variable in Open-Meteo, so we add &daily=sunset &timezone=auto
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m,precipitation_probability,windspeed_10m&daily=sunset&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    // Extract current hour index to get matching hourly data
    // Open-Meteo returns hourly data starting from 00:00 today. 
    // We need to find the index corresponding to the current time.
    const currentHourISO = data.current_weather.time; // "2023-10-27T10:00"
    const currentHourIndex = data.hourly.time.findIndex((t: string) => t === currentHourISO);
    
    // Fallback if index not found (shouldn't happen with correct API usage, but safety first)
    const safeIndex = currentHourIndex !== -1 ? currentHourIndex : 0;

    return {
      currentTemp: data.current_weather.temperature,
      weatherCode: data.current_weather.weathercode,
      windSpeed: data.current_weather.windspeed, // From current_weather as per spec
      humidity: data.hourly.relativehumidity_2m[safeIndex],
      precipitationProb: data.hourly.precipitation_probability[safeIndex],
      sunset: data.daily.sunset[0], // First day (today) sunset
      isDay: data.current_weather.is_day,
    };

  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};