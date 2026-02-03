import { Player } from '../../types/game.types';

interface PlayerListProps {
  players: Player[];
  creatorId: string;
  currentPlayerId: string;
}

export function PlayerList({ players, creatorId, currentPlayerId }: PlayerListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Players ({players.length})
      </h2>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              player.id === currentPlayerId
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-gray-800">
                {player.name}
                {player.id === currentPlayerId && (
                  <span className="text-blue-600 ml-2">(You)</span>
                )}
              </span>
            </div>
            {player.id === creatorId && (
              <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold">
                Host
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
