export interface City {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

export interface WeatherData {
  currentTemp: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  precipitationProb: number;
  sunset: string; // ISO string
  isDay: number;
}

export enum WeatherCondition {
  Clear = 'Clear',
  Cloudy = 'Cloudy',
  Rain = 'Rain',
  Snow = 'Snow',
  Thunder = 'Thunder',
  Fog = 'Fog'
}