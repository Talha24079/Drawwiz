import { LeaderboardEntry } from '../../types/game.types';

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

export function Podium({ topThree }: PodiumProps) {
  const positions = [
    { rank: 2, height: 'h-40', color: 'bg-gray-400', textColor: 'text-gray-700' },
    { rank: 1, height: 'h-56', color: 'bg-yellow-400', textColor: 'text-yellow-900' },
    { rank: 3, height: 'h-32', color: 'bg-orange-400', textColor: 'text-orange-900' }
  ];

  const getPlayer = (rank: number) => topThree[rank - 1];

  return (
    <div className="flex items-end justify-center gap-4 mb-8">
      {positions.map(({ rank, height, color, textColor }) => {
        const player = getPlayer(rank);
        if (!player) return null;

        return (
          <div key={rank} className="flex flex-col items-center">
            <div className="mb-4 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-2">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-gray-800">{player.name}</p>
              <p className="text-2xl font-bold text-blue-600">{player.score}</p>
            </div>
            <div
              className={`w-32 ${height} ${color} rounded-t-lg flex items-center justify-center`}
            >
              <span className={`text-5xl font-bold ${textColor}`}>
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
              </span>
            </div>
            <div className={`w-32 ${color} text-center py-2 font-bold ${textColor}`}>
              #{rank}
            </div>
          </div>
        );
      })}
    </div>
  );
}
