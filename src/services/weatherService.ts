const API_KEY = '71756a1adc15b10186f710bfb5293669';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export class WeatherService {
  static async getCurrentWeather(location: string) {
    try {
      // First get coordinates for the location
      const geoResponse = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.ok) {
        throw new Error(`Weather API error: ${geoResponse.status}`);
      }
      
      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        throw new Error('Location not found');
      }
      
      const { lat, lon } = geoData[0];
      
      // Get current weather using coordinates
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform to match expected format
      return {
        location: {
          name: data.name,
          country: data.sys.country,
          localtime: new Date().toISOString()
        },
        current: {
          temp_c: data.main.temp,
          temp_f: (data.main.temp * 9/5) + 32,
          condition: {
            text: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            code: data.weather[0].id
          },
          humidity: data.main.humidity,
          wind_kph: data.wind.speed * 3.6,
          wind_mph: data.wind.speed * 2.237,
          uv: 0, // UV data requires separate API call in OpenWeatherMap
          feelslike_c: data.main.feels_like,
          feelslike_f: (data.main.feels_like * 9/5) + 32
        }
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }

  static async getForecast(location: string, days: number = 5) {
    try {
      // First get coordinates for the location
      const geoResponse = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.ok) {
        throw new Error(`Weather API error: ${geoResponse.status}`);
      }
      
      const geoData = await geoResponse.json();
      if (geoData.length === 0) {
        throw new Error('Location not found');
      }
      
      const { lat, lon } = geoData[0];
      
      // Get forecast using coordinates
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Group forecast data by day
      const dailyForecasts = new Map();
      
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecasts.has(date)) {
          dailyForecasts.set(date, {
            date: item.dt_txt.split(' ')[0],
            day: {
              maxtemp_c: item.main.temp_max,
              maxtemp_f: (item.main.temp_max * 9/5) + 32,
              mintemp_c: item.main.temp_min,
              mintemp_f: (item.main.temp_min * 9/5) + 32,
              condition: {
                text: item.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                code: item.weather[0].id
              }
            }
          });
        } else {
          // Update min/max temperatures
          const existing = dailyForecasts.get(date);
          existing.day.maxtemp_c = Math.max(existing.day.maxtemp_c, item.main.temp_max);
          existing.day.mintemp_c = Math.min(existing.day.mintemp_c, item.main.temp_min);
          existing.day.maxtemp_f = (existing.day.maxtemp_c * 9/5) + 32;
          existing.day.mintemp_f = (existing.day.mintemp_c * 9/5) + 32;
        }
      });
      
      // Transform to match expected format
      return {
        location: {
          name: data.city.name,
          country: data.city.country,
          localtime: new Date().toISOString()
        },
        current: {
          temp_c: data.list[0].main.temp,
          temp_f: (data.list[0].main.temp * 9/5) + 32,
          condition: {
            text: data.list[0].weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`,
            code: data.list[0].weather[0].id
          },
          humidity: data.list[0].main.humidity,
          wind_kph: data.list[0].wind.speed * 3.6,
          wind_mph: data.list[0].wind.speed * 2.237,
          uv: 0,
          feelslike_c: data.list[0].main.feels_like,
          feelslike_f: (data.list[0].main.feels_like * 9/5) + 32
        },
        forecast: {
          forecastday: Array.from(dailyForecasts.values()).slice(0, days)
        }
      };
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  }

  static async searchLocations(query: string) {
    try {
      if (query.length < 3) return [];
      
      const response = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform to match expected format
      return data.map((item: any) => ({
        id: `${item.lat}-${item.lon}`,
        name: item.name,
        region: item.state || '',
        country: item.country,
        lat: item.lat,
        lon: item.lon,
        url: `${item.name}, ${item.country}`
      }));
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  }
}