import { City } from './types';

// Predefined cities to simulate the Dropdown functionality smoothly as per User Flow
export const CITIES: City[] = [
  { name: 'Taipei City', country: 'Taiwan', lat: 25.0330, lng: 121.5654 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Reykjavík', country: 'Iceland', lat: 64.1466, lng: -21.9426 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
];

export const DEFAULT_CITY = CITIES[0]; // Taipei City
