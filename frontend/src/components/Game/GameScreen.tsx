import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Player } from '../../types/game.types';
import { Canvas } from './Canvas';
import { DrawingTools } from './DrawingTools';
import { WordDisplay } from './WordDisplay';
import { Timer } from './Timer';
import { Chat } from './Chat';
import { WordSelection } from './WordSelection';

interface GameScreenProps {
  socket: Socket | null;
  roomCode: string;
  currentPlayerId: string;
  players: Player[];
  onGameEnd: () => void;
}

export function GameScreen({
  socket,
  roomCode,
  currentPlayerId,
  players: initialPlayers,
  onGameEnd
}: GameScreenProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [wordHint, setWordHint] = useState<string | null>(null);
  const [turnEndTime, setTurnEndTime] = useState<number | null>(null);
  const [wordChoices, setWordChoices] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(5);
  const [currentTool, setCurrentTool] = useState<'pen' | 'fill'>('pen');

  const isDrawing = drawerId === currentPlayerId;

  useEffect(() => {
    if (!socket) return;

    const handleTurnStarted = ({ drawerId: newDrawerId, currentRound: round }: any) => {
      setDrawerId(newDrawerId);
      setCurrentWord(null);
      setWordHint(null);
      setTurnEndTime(null);
      setWordChoices([]);
      setCurrentRound(round);
    };

    const handleWordSelection = ({ words }: any) => {
      setWordChoices(words);
    };

    const handleWordSelected = ({ word, wordHint: hint, turnEndTime: endTime, drawerId: dId }: any) => {
      if (word) {
        setCurrentWord(word);
      }
      setWordHint(hint);
      setTurnEndTime(endTime);
      if (dId) {
        setDrawerId(dId);
      }
    };

    const handleTurnEnded = ({ word, leaderboard }: any) => {
      setCurrentWord(word);
      setWordHint(null);
      setWordChoices([]);
      
      // Update players with new scores
      if (leaderboard) {
        setPlayers(prevPlayers =>
          prevPlayers.map(p => {
            const updated = leaderboard.find((l: any) => l.id === p.id);
            return updated ? { ...p, score: updated.score } : p;
          })
        );
      }
    };

    const handleRoundEnded = ({ currentRound: round, leaderboard }: any) => {
      setCurrentRound(round);
      if (leaderboard) {
        setPlayers(prevPlayers =>
          prevPlayers.map(p => {
            const updated = leaderboard.find((l: any) => l.id === p.id);
            return updated ? { ...p, score: updated.score } : p;
          })
        );
      }
    };

    const handleGameEnded = () => {
      onGameEnd();
    };

    socket.on('turn-started', handleTurnStarted);
    socket.on('word-selection', handleWordSelection);
    socket.on('word-selected', handleWordSelected);
    socket.on('turn-ended', handleTurnEnded);
    socket.on('round-ended', handleRoundEnded);
    socket.on('game-ended', handleGameEnded);

    return () => {
      socket.off('turn-started', handleTurnStarted);
      socket.off('word-selection', handleWordSelection);
      socket.off('word-selected', handleWordSelected);
      socket.off('turn-ended', handleTurnEnded);
      socket.off('round-ended', handleRoundEnded);
      socket.off('game-ended', handleGameEnded);
    };
  }, [socket, onGameEnd]);

  const handleWordSelect = (word: string) => {
    if (socket) {
      socket.emit('select-word', { roomCode, word });
      setWordChoices([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">DrawWiz</h1>
              <p className="text-gray-600">Round {currentRound}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Room: {roomCode}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Word Display and Timer */}
          <div className="lg:col-span-3 space-y-4">
            <WordDisplay
              wordHint={wordHint}
              isDrawing={isDrawing}
              currentWord={currentWord}
            />
            <Timer turnEndTime={turnEndTime} />
          </div>

          {/* Scoreboard */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Players</h3>
            <div className="space-y-2">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, idx) => (
                  <div
                    key={player.id}
                    className={`p-2 rounded-lg ${
                      player.id === currentPlayerId
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-600">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-sm">
                            {player.name}
                            {player.id === drawerId && (
                              <span className="ml-1 text-green-600">✏️</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-blue-600">
                        {player.score}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Canvas and Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Canvas
              socket={socket}
              roomCode={roomCode}
              isDrawing={isDrawing}
              currentColor={currentColor}
              currentWidth={currentWidth}
              currentTool={currentTool}
            />
          </div>

          <div className="space-y-4">
            {isDrawing && (
              <DrawingTools
                currentColor={currentColor}
                currentWidth={currentWidth}
                currentTool={currentTool}
                onColorChange={setCurrentColor}
                onWidthChange={setCurrentWidth}
                onToolChange={setCurrentTool}
              />
            )}
            <div className="h-96 lg:h-auto">
              <Chat socket={socket} roomCode={roomCode} isDrawing={isDrawing} />
            </div>
          </div>
        </div>

        {/* Word Selection Modal */}
        {wordChoices.length > 0 && isDrawing && (
          <WordSelection words={wordChoices} onSelectWord={handleWordSelect} />
        )}
      </div>
    </div>
  );
}
