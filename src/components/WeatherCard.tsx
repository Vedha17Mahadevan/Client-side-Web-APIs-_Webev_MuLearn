import React from 'react';
import { Thermometer, Droplets, Wind, Eye, Sun } from 'lucide-react';
import { WeatherData, UserPreferences } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
  preferences: UserPreferences;
  onToggleUnit: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  preferences,
  onToggleUnit
}) => {
  const temp = preferences.unit === 'celsius' ? weather.current.temp_c : weather.current.temp_f;
  const feelsLike = preferences.unit === 'celsius' ? weather.current.feels_like_c : weather.current.feels_like_f;
  const unit = preferences.unit === 'celsius' ? '°C' : '°F';
  const windSpeed = preferences.unit === 'celsius' ? weather.current.wind_kph : weather.current.wind_mph;
  const windUnit = preferences.unit === 'celsius' ? 'km/h' : 'mph';

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">
            {weather.location.name}
          </h2>
          <p className="text-white/60 text-sm">
            {formatTime(weather.location.localtime)}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={preferences.unit === 'fahrenheit'} onChange={onToggleUnit} />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-white">
            {preferences.unit === 'celsius' ? 'Switch to °F' : 'Switch to °C'}
          </span>
        </label>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
         {weather.current?.condition?.icon && (
          <img
            src={`https:${weather.current.condition.icon}`}
            alt={weather.current.condition.text}
            className="w-20 h-20 mr-4"
          />
        )}        
          <div>
            <div className="text-6xl font-bold text-white mb-2">
              {Math.round(temp)}{unit}
            </div>
            <p className="text-white/80 text-lg capitalize">
              {weather.current.condition.text}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <Thermometer className="mx-auto mb-2 text-white/80" size={24} />
          <p className="text-white/60 text-sm mb-1">Temperature</p>
          <p className="text-white font-semibold text-lg">
            {Math.round(feelsLike)}{unit}
          </p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <Droplets className="mx-auto mb-2 text-white/80" size={24} />
          <p className="text-white/60 text-sm mb-1">Humidity</p>
          <p className="text-white font-semibold text-lg">
            {weather.current.humidity}%
          </p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <Wind className="mx-auto mb-2 text-white/80" size={24} />
          <p className="text-white/60 text-sm mb-1">Wind</p>
          <p className="text-white font-semibold text-lg">
            {Math.round(windSpeed)} {windUnit}
          </p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <Sun className="mx-auto mb-2 text-white/80" size={24} />
          <p className="text-white/60 text-sm mb-1">UV Index</p>
          <p className="text-white font-semibold text-lg">
            {weather.current.uv}
          </p>
        </div>
      </div>
    </div>
  );
};
