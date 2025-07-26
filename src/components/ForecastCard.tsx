import React from 'react';
import { ForecastData, UserPreferences } from '../types/weather';

interface ForecastCardProps {
  forecast: ForecastData;
  preferences: UserPreferences;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, preferences }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-6">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {forecast.forecast.forecastday.map((day, index) => {
          const maxTemp = preferences.unit === 'celsius' ? day.day.maxtemp_c : day.day.maxtemp_f;
          const minTemp = preferences.unit === 'celsius' ? day.day.mintemp_c : day.day.mintemp_f;
          const unit = preferences.unit === 'celsius' ? '°C' : '°F';

          return (
            <div
              key={day.date}
              className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center flex-1">
                <div className="text-white font-medium w-20">
                  {index === 0 ? 'Today' : formatDate(day.date)}
                </div>
                <img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                  className="w-10 h-10 mx-4"
                />
                <div className="flex-1">
                  <p className="text-white text-sm capitalize">
                    {day.day.condition.text}
                  </p>
                  <p className="text-white/60 text-xs">
                    {day.day.chance_of_rain}% rain
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-semibold">
                  {Math.round(maxTemp)}{unit}
                </div>
                <div className="text-white/60 text-sm">
                  {Math.round(minTemp)}{unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
