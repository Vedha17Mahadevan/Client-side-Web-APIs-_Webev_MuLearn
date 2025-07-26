import { UserPreferences } from '../types/weather';

export class StorageService {
  private static readonly PREFERENCES_KEY = 'weather-app-preferences';

  static getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading preferences:', error);
    }
    
    return {
      unit: 'celsius',
      favorites: [],
      lastSearched: 'London'
    };
  }

  static savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  static addToFavorites(location: string): void {
    const preferences = this.getPreferences();
    if (!preferences.favorites.includes(location)) {
      preferences.favorites.push(location);
      this.savePreferences(preferences);
    }
  }

  static removeFromFavorites(location: string): void {
    const preferences = this.getPreferences();
    preferences.favorites = preferences.favorites.filter(fav => fav !== location);
    this.savePreferences(preferences);
  }

  static updateLastSearched(location: string): void {
    const preferences = this.getPreferences();
    preferences.lastSearched = location;
    this.savePreferences(preferences);
  }

  static toggleUnit(): UserPreferences {
    const preferences = this.getPreferences();
    preferences.unit = preferences.unit === 'celsius' ? 'fahrenheit' : 'celsius';
    this.savePreferences(preferences);
    return preferences;
  }
}