import React from 'react';
import { Settings, Thermometer, Heart, Trash2 } from 'lucide-react';
import { UserPreferences } from '../types/weather';

interface SettingsPanelProps {
  preferences: UserPreferences;
  onToggleUnit: () => void;
  onRemoveFavorite: (location: string) => void;
  onLocationSelect: (location: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  preferences,
  onToggleUnit,
  onRemoveFavorite,
  onLocationSelect,
  isOpen,
  onToggle
}) => {
  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/20 text-white hover:bg-white/30 transition-all duration-300 z-50"
      >
        <Settings size={24} />
      </button>

      <div className={`fixed inset-y-0 right-0 w-80 bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Settings</h3>
          
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Thermometer className="mr-2" size={20} />
              Temperature Unit
            </h4>
            <button
              onClick={onToggleUnit}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Currently: {preferences.unit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
            </button>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Heart className="mr-2" size={20} />
              Favorite Cities ({preferences.favorites.length})
            </h4>
            
            {preferences.favorites.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No favorite cities yet. Add some by clicking the heart icon!
              </p>
            ) : (
              <div className="space-y-2">
                {preferences.favorites.map((location) => (
                  <div
                    key={location}
                    className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-gray-200"
                  >
                    <button
                      onClick={() => {
                        onLocationSelect(location);
                        onToggle();
                      }}
                      className="flex-1 text-left font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
                    >
                      {location}
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(location)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        />
      )}
    </>
  );
};