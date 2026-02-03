import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { NameInput } from './NameInput';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import { validateRoomCode } from '../../utils/validation';

interface HomeScreenProps {
  socket: Socket | null;
  onRoomJoined: () => void;
}

export function HomeScreen({ socket, onRoomJoined }: HomeScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNameSet = (name: string) => {
    setPlayerName(name);
  };

  const handleStartGame = () => {
    if (!socket || !playerName) return;
    setLoading(true);
    socket.emit('join-public', { playerName });
  };

  const handleCreatePrivateRoom = () => {
    if (!socket || !playerName) return;
    setLoading(true);
    socket.emit('create-room', {
      playerName,
      type: 'private',
      settings: {}
    });
  };

  const handleJoinRoom = () => {
    const validationError = validateRoomCode(roomCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!socket || !playerName) return;
    setLoading(true);
    socket.emit('join-room', {
      roomCode: roomCode.toUpperCase(),
      playerName
    });
  };

  React.useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = () => {
      setLoading(false);
      onRoomJoined();
    };

    const handleRoomJoined = () => {
      setLoading(false);
      onRoomJoined();
    };

    const handleError = ({ message }: { message: string }) => {
      setLoading(false);
      setError(message);
    };

    socket.on('room-created', handleRoomCreated);
    socket.on('room-joined', handleRoomJoined);
    socket.on('error', handleError);

    return () => {
      socket.off('room-created', handleRoomCreated);
      socket.off('room-joined', handleRoomJoined);
      socket.off('error', handleError);
    };
  }, [socket, onRoomJoined]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          DrawWiz
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Draw, Guess, and Win!
        </p>

        {!playerName ? (
          <div>
            <NameInput onNameSet={handleNameSet} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700">
                Welcome, <span className="font-bold text-blue-600">{playerName}</span>!
              </p>
            </div>

            <Button
              onClick={handleStartGame}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Joining...' : 'Start Game'}
            </Button>

            <Button
              onClick={handleCreatePrivateRoom}
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              Create Private Room
            </Button>

            <Button
              onClick={() => setShowJoinModal(true)}
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              Join Room
            </Button>

            <button
              onClick={() => setPlayerName('')}
              className="w-full text-sm text-gray-600 hover:text-gray-800 mt-4"
            >
              Change Name
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <Modal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          setRoomCode('');
          setError(null);
        }}
        title="Join Room"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="Enter room code"
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 uppercase"
            maxLength={6}
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div className="flex gap-2">
            <Button
              onClick={handleJoinRoom}
              disabled={loading}
              className="flex-1"
            >
              Join
            </Button>
            <Button
              onClick={() => {
                setShowJoinModal(false);
                setRoomCode('');
                setError(null);
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
