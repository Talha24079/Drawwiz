import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { Room } from './types/game.types';
import { HomeScreen } from './components/Home/HomeScreen';
import { Lobby } from './components/Lobby/Lobby';
import { GameScreen } from './components/Game/GameScreen';
import { ResultsScreen } from './components/Results/ResultsScreen';

type AppState = 'home' | 'lobby' | 'game' | 'results';

function App() {
  const { socket, connected } = useSocket();
  const [appState, setAppState] = useState<AppState>('home');
  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');

  useEffect(() => {
    if (socket) {
      setCurrentPlayerId(socket.id || '');
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = ({ room: newRoom }: { room: Room }) => {
      setRoom(newRoom);
      setAppState('lobby');
    };

    const handleRoomJoined = ({ room: joinedRoom }: { room: Room }) => {
      setRoom(joinedRoom);
      setAppState('lobby');
    };

    const handleGameStarted = ({ gameState, players }: any) => {
      if (room) {
        setRoom({ ...room, gameState, players });
      }
      setAppState('game');
    };

    const handleGameEnded = () => {
      setAppState('results');
    };

    socket.on('room-created', handleRoomCreated);
    socket.on('room-joined', handleRoomJoined);
    socket.on('game-started', handleGameStarted);
    socket.on('game-ended', handleGameEnded);

    return () => {
      socket.off('room-created', handleRoomCreated);
      socket.off('room-joined', handleRoomJoined);
      socket.off('game-started', handleGameStarted);
      socket.off('game-ended', handleGameEnded);
    };
  }, [socket, room]);

  const handleRoomJoined = () => {
    setAppState('lobby');
  };

  const handleGameStart = () => {
    setAppState('game');
  };

  const handleGameEnd = () => {
    setAppState('results');
  };

  const handlePlayAgain = () => {
    setAppState('lobby');
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Connecting...</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {appState === 'home' && (
        <HomeScreen socket={socket} onRoomJoined={handleRoomJoined} />
      )}

      {appState === 'lobby' && room && (
        <Lobby
          socket={socket}
          room={room}
          currentPlayerId={currentPlayerId}
          onGameStart={handleGameStart}
        />
      )}

      {appState === 'game' && room && (
        <GameScreen
          socket={socket}
          roomCode={room.code}
          currentPlayerId={currentPlayerId}
          players={room.players}
          onGameEnd={handleGameEnd}
        />
      )}

      {appState === 'results' && room && (
        <ResultsScreen
          socket={socket}
          roomCode={room.code}
          currentPlayerId={currentPlayerId}
          isCreator={room.creatorId === currentPlayerId}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}

export default App;
