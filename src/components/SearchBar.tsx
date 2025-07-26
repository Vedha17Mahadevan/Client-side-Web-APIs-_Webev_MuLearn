import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { WeatherService } from '../services/weatherService';
import { GeolocationService } from '../services/geolocationService';
import { LocationSuggestion } from '../types/weather';

interface SearchBarProps {
  onLocationSelect: (location: string) => void;
  onUseCurrentLocation: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onLocationSelect,
  onUseCurrentLocation,
  isLoading
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await WeatherService.searchLocations(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const locationString = `${suggestion.name}, ${suggestion.country}`;
    setQuery(locationString);
    setShowSuggestions(false);
    onLocationSelect(locationString);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onLocationSelect(query.trim());
    }
  };

  const handleCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      await onUseCurrentLocation();
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-16 py-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
          />
          {searchLoading && (
            <Loader2 className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/60 animate-spin" size={20} />
          )}
        </div>
        
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={locationLoading || isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          {locationLoading ? (
            <Loader2 className="text-white animate-spin" size={20} />
          ) : (
            <MapPin className="text-white" size={20} />
          )}
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-10">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-white/20 transition-colors duration-200 border-b border-white/10 last:border-b-0"
            >
              <div className="font-medium text-gray-800">
                {suggestion.name}
              </div>
              <div className="text-sm text-gray-600">
                {suggestion.region}, {suggestion.country}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};