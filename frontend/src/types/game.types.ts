export interface Player {
  id: string;
  name: string;
  score: number;
  hasGuessed: boolean;
  isDrawing: boolean;
}

export interface GameSettings {
  timePerTurn: number;
  rounds: number;
  maxPlayers: number;
  wordCount: number;
  hintsEnabled: boolean;
  penaltiesEnabled: boolean;
  customWords: string[];
}

export interface GameState {
  status: 'waiting' | 'playing' | 'ended';
  currentRound: number;
  currentTurn: number;
  currentDrawerId: string | null;
  currentWord: string | null;
  wordHint: string | null;
  turnStartTime: number | null;
  turnEndTime: number | null;
  guessedPlayers: GuessedPlayer[];
  drawingData: DrawingAction[];
}

export interface Room {
  code: string;
  type: 'public' | 'private';
  creatorId: string;
  players: Player[];
  settings: GameSettings;
  gameState: GameState;
  createdAt: number;
}

export interface GuessedPlayer {
  id: string;
  name: string;
  points: number;
  position: number;
}

export interface DrawingAction {
  type: 'stroke' | 'fill' | 'undo' | 'redo' | 'clear';
  data?: any;
}

export interface StrokeData {
  points: number[];
  color: string;
  width: number;
}

export interface FillData {
  x: number;
  y: number;
  color: string;
}

export interface ChatMessage {
  type: 'system' | 'guess' | 'chat';
  message: string;
  playerId?: string;
  playerName?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
}
