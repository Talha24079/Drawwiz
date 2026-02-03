import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage } from '../../types/game.types';

interface ChatProps {
  socket: Socket | null;
  roomCode: string;
  isDrawing: boolean;
}

export function Chat({ socket, roomCode, isDrawing }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [guess, setGuess] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleGuessResult = ({ correct, points, position }: any) => {
      if (correct) {
        setMessages((prev) => [
          ...prev,
          {
            type: 'system',
            message: `You guessed correctly! +${points} points (Position: ${position})`
          }
        ]);
      }
    };

    const handlePlayerGuessed = ({ playerName }: any) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'system',
          message: `${playerName} guessed the word!`
        }
      ]);
    };

    socket.on('chat-message', handleChatMessage);
    socket.on('guess-result', handleGuessResult);
    socket.on('player-guessed', handlePlayerGuessed);

    return () => {
      socket.off('chat-message', handleChatMessage);
      socket.off('guess-result', handleGuessResult);
      socket.off('player-guessed', handlePlayerGuessed);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !guess.trim() || isDrawing) return;

    socket.emit('send-guess', {
      roomCode,
      guess: guess.trim()
    });

    setGuess('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Chat</h3>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2 min-h-0">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.type === 'system'
                ? 'bg-blue-100 text-blue-800 text-center text-sm font-semibold'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {msg.type === 'system' ? (
              <p>{msg.message}</p>
            ) : (
              <p>
                <span className="font-semibold">{msg.playerName}:</span>{' '}
                {msg.message}
              </p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {!isDrawing && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Type your guess..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            maxLength={50}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            Send
          </button>
        </form>
      )}

      {isDrawing && (
        <div className="text-center text-gray-500 text-sm py-2">
          You can't guess while drawing
        </div>
      )}
    </div>
  );
}
