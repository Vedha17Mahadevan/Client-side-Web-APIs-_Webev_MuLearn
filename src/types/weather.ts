export interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    wind_mph: number;
    pressure_mb: number;
    feels_like_c: number;
    feels_like_f: number;
    uv: number;
  };
}

export interface ForecastData {
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        condition: {
          text: string;
          icon: string;
        };
        chance_of_rain: number;
      };
    }>;
  };
}

export interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
}

export interface UserPreferences {
  unit: 'celsius' | 'fahrenheit';
  favorites: string[];
  lastSearched: string;
}