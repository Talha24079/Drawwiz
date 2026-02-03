import { GameSettings as GameSettingsType } from '../../types/game.types';

interface GameSettingsProps {
  settings: GameSettingsType;
  isCreator: boolean;
  onSettingsChange?: (settings: Partial<GameSettingsType>) => void;
}

export function GameSettings({ settings, isCreator, onSettingsChange }: GameSettingsProps) {
  const handleChange = (key: keyof GameSettingsType, value: any) => {
    if (onSettingsChange) {
      onSettingsChange({ [key]: value });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Game Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time per Turn (seconds)
          </label>
          {isCreator ? (
            <select
              value={settings.timePerTurn}
              onChange={(e) => handleChange('timePerTurn', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value={60}>60</option>
              <option value={80}>80</option>
              <option value={100}>100</option>
              <option value={120}>120</option>
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-100 rounded-lg">{settings.timePerTurn}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rounds
          </label>
          {isCreator ? (
            <select
              value={settings.rounds}
              onChange={(e) => handleChange('rounds', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-100 rounded-lg">{settings.rounds}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Players
          </label>
          {isCreator ? (
            <select
              value={settings.maxPlayers}
              onChange={(e) => handleChange('maxPlayers', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-100 rounded-lg">{settings.maxPlayers}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Word Choices
          </label>
          {isCreator ? (
            <select
              value={settings.wordCount}
              onChange={(e) => handleChange('wordCount', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-100 rounded-lg">{settings.wordCount}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Hints Enabled
          </label>
          {isCreator ? (
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.hintsEnabled}
                onChange={(e) => handleChange('hintsEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
            </label>
          ) : (
            <div className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
              {settings.hintsEnabled ? 'Yes' : 'No'}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Penalties Enabled
          </label>
          {isCreator ? (
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.penaltiesEnabled}
                onChange={(e) => handleChange('penaltiesEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
            </label>
          ) : (
            <div className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
              {settings.penaltiesEnabled ? 'Yes' : 'No'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
