import { useState, useEffect } from 'react';
import { WeatherData, UserPreferences } from '../types/weather';
import { WeatherService } from '../services/weatherService';
import { StorageService } from '../services/storageService';
import { GeolocationService } from '../services/geolocationService';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(StorageService.getPreferences());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = async (location: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await WeatherService.getCurrentWeather(location);
      setWeather(weatherData);
      StorageService.updateLastSearched(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
      console.error('Weather loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = async () => {
    try {
      const locationString = await GeolocationService.getCurrentLocationString();
      await loadWeatherData(locationString);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
      // Fallback to last searched location
      await loadWeatherData(preferences.lastSearched);
    }
  };

  const toggleUnit = () => {
    const newPreferences = StorageService.toggleUnit();
    setPreferences(newPreferences);
  };

  const toggleFavorite = (location: string) => {
    if (preferences.favorites.includes(location)) {
      StorageService.removeFromFavorites(location);
    } else {
      StorageService.addToFavorites(location);
    }
    setPreferences(StorageService.getPreferences());
  };

  const removeFavorite = (location: string) => {
    StorageService.removeFromFavorites(location);
    setPreferences(StorageService.getPreferences());
  };

  useEffect(() => {
    loadWeatherData(preferences.lastSearched);
  }, []);

  return {
    weather,
    preferences,
    loading,
    error,
    loadWeatherData,
    useCurrentLocation,
    toggleUnit,
    toggleFavorite,
    removeFavorite
  };
};