export class Room {
  constructor(data) {
    this.code = data.code;
    this.type = data.type; // 'public' or 'private'
    this.creatorId = data.creatorId;
    this.players = data.players || [];
    this.settings = {
      timePerTurn: data.settings?.timePerTurn || 80,
      rounds: data.settings?.rounds || 3,
      maxPlayers: data.settings?.maxPlayers || 8,
      wordCount: data.settings?.wordCount || 3,
      hintsEnabled: data.settings?.hintsEnabled !== false,
      penaltiesEnabled: data.settings?.penaltiesEnabled || false,
      customWords: data.settings?.customWords || []
    };
    this.gameState = {
      status: 'waiting', // 'waiting', 'playing', 'ended'
      currentRound: 0,
      currentTurn: 0,
      currentDrawerId: null,
      currentWord: null,
      wordHint: null,
      turnStartTime: null,
      turnEndTime: null,
      guessedPlayers: [],
      drawingData: []
    };
    this.createdAt = data.createdAt || Date.now();
  }

  addPlayer(player) {
    if (this.players.length >= this.settings.maxPlayers) {
      throw new Error('Room is full');
    }
    this.players.push(player);
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
  }

  getPlayer(playerId) {
    return this.players.find(p => p.id === playerId);
  }

  isCreator(playerId) {
    return this.creatorId === playerId;
  }

  isFull() {
    return this.players.length >= this.settings.maxPlayers;
  }

  canStart() {
    return this.players.length >= 2 && this.gameState.status === 'waiting';
  }

  toJSON() {
    return {
      code: this.code,
      type: this.type,
      creatorId: this.creatorId,
      players: this.players,
      settings: this.settings,
      gameState: {
        ...this.gameState,
        currentWord: null // Never send the actual word to clients
      },
      createdAt: this.createdAt
    };
  }
}
