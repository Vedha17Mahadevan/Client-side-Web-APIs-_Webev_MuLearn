import React from 'react';
import { Loader2, AlertCircle, Cloud } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { SearchBar } from './components/SearchBar';
import { useWeather } from './hooks/useWeather';

function App() {
  const {
    weather,
    preferences,
    loading,
    error,
    loadWeatherData,
    useCurrentLocation,
    toggleUnit
  } = useWeather();

  const handleLocationSelect = (location: string) => {
    loadWeatherData(location);
  };

  const handleCurrentLocation = async () => {
    await useCurrentLocation();
  };

  const isFavorite = weather ? preferences.favorites.includes(weather.location.name) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Weather Unavailable</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => loadWeatherData(preferences.lastSearched)}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-semibold transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Cloud className="w-12 h-12 text-white mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Weather App
            </h1>
          </div>
          <p className="text-white/80 text-lg">
            Get real-time weather updates for any location
          </p>
        </div>

        <SearchBar
          onLocationSelect={handleLocationSelect}
          onUseCurrentLocation={handleCurrentLocation}
          isLoading={loading}
        />

        {weather && (
          <WeatherCard
            weather={weather}
            preferences={preferences}
            onToggleUnit={toggleUnit}
          />
        )}
      </div>
    </div>
  );
}

export default App;
