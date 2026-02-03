import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Room, GameSettings as GameSettingsType } from '../../types/game.types';
import { PlayerList } from './PlayerList';
import { GameSettings } from './GameSettings';
import { Button } from '../Common/Button';

interface LobbyProps {
  socket: Socket | null;
  room: Room | null;
  currentPlayerId: string;
  onGameStart: () => void;
}

export function Lobby({ socket, room, currentPlayerId, onGameStart }: LobbyProps) {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(room);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleRoomUpdated = ({ room: updatedRoom }: { room: Room }) => {
      setCurrentRoom(updatedRoom);
    };

    const handlePlayerJoined = ({ players }: any) => {
      if (currentRoom) {
        setCurrentRoom({ ...currentRoom, players });
      }
    };

    const handlePlayerLeft = ({ players, newCreatorId }: any) => {
      if (currentRoom) {
        setCurrentRoom({
          ...currentRoom,
          players,
          creatorId: newCreatorId || currentRoom.creatorId
        });
      }
    };

    const handleGameStarted = () => {
      onGameStart();
    };

    socket.on('room-updated', handleRoomUpdated);
    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);
    socket.on('game-started', handleGameStarted);

    return () => {
      socket.off('room-updated', handleRoomUpdated);
      socket.off('player-joined', handlePlayerJoined);
      socket.off('player-left', handlePlayerLeft);
      socket.off('game-started', handleGameStarted);
    };
  }, [socket, currentRoom, onGameStart]);

  if (!currentRoom) return null;

  const isCreator = currentRoom.creatorId === currentPlayerId;
  const canStart = currentRoom.players.length >= 2;

  const handleStartGame = () => {
    if (socket && isCreator && canStart) {
      socket.emit('start-game', { roomCode: currentRoom.code });
    }
  };

  const handleSettingsChange = (settings: Partial<GameSettingsType>) => {
    if (socket && isCreator) {
      socket.emit('update-settings', {
        roomCode: currentRoom.code,
        settings
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentRoom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit('leave-room', { roomCode: currentRoom.code });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Game Lobby</h1>
            <Button onClick={handleLeave} variant="danger">
              Leave
            </Button>
          </div>

          {currentRoom.type === 'private' && (
            <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Room Code:</p>
                  <p className="text-2xl font-bold text-blue-600">{currentRoom.code}</p>
                </div>
                <Button onClick={handleCopyCode} variant="secondary">
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
            </div>
          )}

          {!canStart && (
            <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 mb-4 text-center">
              <p className="text-yellow-800 font-semibold">
                Waiting for at least 2 players to start the game...
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlayerList
            players={currentRoom.players}
            creatorId={currentRoom.creatorId}
            currentPlayerId={currentPlayerId}
          />

          <div>
            <GameSettings
              settings={currentRoom.settings}
              isCreator={isCreator}
              onSettingsChange={handleSettingsChange}
            />

            {isCreator && (
              <div className="mt-4">
                <Button
                  onClick={handleStartGame}
                  disabled={!canStart}
                  className="w-full text-xl py-4"
                >
                  {canStart ? 'Start Game' : 'Need 2+ Players'}
                </Button>
              </div>
            )}

            {!isCreator && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">
                  Waiting for host to start the game...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
