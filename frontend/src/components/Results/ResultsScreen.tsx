import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { LeaderboardEntry } from '../../types/game.types';
import { Podium } from './Podium';
import { Button } from '../Common/Button';

interface ResultsScreenProps {
  socket: Socket | null;
  roomCode: string;
  currentPlayerId: string;
  isCreator: boolean;
  onPlayAgain: () => void;
}

export function ResultsScreen({
  socket,
  roomCode,
  currentPlayerId,
  isCreator,
  onPlayAgain
}: ResultsScreenProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleGameEnded = ({ finalLeaderboard }: any) => {
      setLeaderboard(finalLeaderboard);
    };

    const handleGameReset = () => {
      onPlayAgain();
    };

    socket.on('game-ended', handleGameEnded);
    socket.on('game-reset', handleGameReset);

    return () => {
      socket.off('game-ended', handleGameEnded);
      socket.off('game-reset', handleGameReset);
    };
  }, [socket, onPlayAgain]);

  const handlePlayAgain = () => {
    if (socket && isCreator) {
      socket.emit('play-again', { roomCode });
    }
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit('leave-room', { roomCode });
      window.location.reload();
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const currentPlayerRank = leaderboard.findIndex(p => p.id === currentPlayerId) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Game Over!
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {currentPlayerRank === 1
            ? '🎉 Congratulations! You won! 🎉'
            : `You placed #${currentPlayerRank}`}
        </p>

        {topThree.length > 0 && <Podium topThree={topThree} />}

        {rest.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Final Standings</h2>
            <div className="space-y-2">
              {rest.map((player, idx) => (
                <div
                  key={player.id}
                  className={`flex justify-between items-center p-4 rounded-lg ${
                    player.id === currentPlayerId
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-600">
                      #{idx + 4}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-lg font-semibold text-gray-800">
                      {player.name}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4 justify-center">
          {isCreator && (
            <Button onClick={handlePlayAgain} className="px-8 py-3 text-lg">
              Play Again
            </Button>
          )}
          <Button onClick={handleLeave} variant="secondary" className="px-8 py-3 text-lg">
            Leave Room
          </Button>
        </div>

        {!isCreator && (
          <p className="text-center text-gray-600 mt-4">
            Waiting for host to start a new game...
          </p>
        )}
      </div>
    </div>
  );
}
