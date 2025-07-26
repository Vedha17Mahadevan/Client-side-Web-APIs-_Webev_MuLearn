import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '71756a1adc15b10186f710bfb5293669';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherIcons = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '🌨️', '13n': '🌨️',
  '50d': '🌫️', '50n': '🌫️'
};

function App() {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('celsius');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resCurrent = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
      if (!resCurrent.ok) throw new Error('City not found');
      const current = await resCurrent.json();

      const resForecast = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
      const forecast = await resForecast.json();

      setData({ current, forecast });
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const getTemp = (temp) => unit === 'celsius' ? Math.round(temp) : Math.round(temp * 9/5 + 32);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  const renderForecast = () => {
    const forecastItems = data.forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5);
    return forecastItems.map((item, idx) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en', { weekday: 'short' });
      const icon = weatherIcons[item.weather[0].icon] || '🌤️';
      return (
        <div key={idx} className="forecast-item">
          <div className="forecast-day">{day}</div>
          <div className="forecast-icon">{icon}</div>
          <div className="forecast-temp">{getTemp(item.main.temp)}{unitSymbol}</div>
        </div>
      );
    });
  };

  return (
    <div className="container">
      <h1>🌤️ Weather App</h1>
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>
      <div className="unit-toggle">
        <button onClick={() => setUnit('celsius')} className={unit === 'celsius' ? 'active' : ''}>°C</button>
        <button onClick={() => setUnit('fahrenheit')} className={unit === 'fahrenheit' ? 'active' : ''}>°F</button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">❌ {error}</div>}

      {data && (
        <div className="weather-info">
          <div className="weather-main">
            <h2>{data.current.name}, {data.current.sys.country}</h2>
            <div className="weather-icon">{weatherIcons[data.current.weather[0].icon] || '🌤️'}</div>
            <div className="temperature">{getTemp(data.current.main.temp)}{unitSymbol}</div>
            <div className="description">{data.current.weather[0].description}</div>
          </div>

          <div className="weather-details">
            <div>Feels Like: {getTemp(data.current.main.feels_like)}{unitSymbol}</div>
            <div>Humidity: {data.current.main.humidity}%</div>
            <div>Wind Speed: {data.current.wind.speed} m/s</div>
            <div>Pressure: {data.current.main.pressure} hPa</div>
          </div>

          <h3>5-Day Forecast</h3>
          <div className="forecast-container">{renderForecast()}</div>
        </div>
      )}
    </div>
  );
}

export default App;
