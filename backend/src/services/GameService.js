import { WordDictionary } from '../models/WordDictionary.js';
import { formatWordHint, formatWordHintWithHyphen, calculateScore, calculateDrawerScore } from '../utils/helpers.js';

export class GameService {
  constructor() {
    this.wordDictionary = new WordDictionary();
  }

  startGame(room) {
    if (!room.canStart()) {
      throw new Error('Cannot start game');
    }

    room.gameState.status = 'playing';
    room.gameState.currentRound = 1;
    room.gameState.currentTurn = 0;

    // Reset all player scores
    room.players.forEach(player => {
      player.score = 0;
      player.resetTurn();
    });

    return room;
  }

  startTurn(room) {
    const { currentRound, currentTurn } = room.gameState;
    const totalPlayers = room.players.length;

    if (currentTurn >= totalPlayers) {
      // End round
      return this.endRound(room);
    }

    // Get drawer for this turn
    const drawer = room.players[currentTurn];
    drawer.isDrawing = true;
    drawer.resetTurn();

    // Reset other players
    room.players.forEach(player => {
      if (player.id !== drawer.id) {
        player.resetTurn();
      }
    });

    room.gameState.currentDrawerId = drawer.id;
    room.gameState.guessedPlayers = [];
    room.gameState.drawingData = [];

    // Get random words for selection
    const words = this.wordDictionary.getRandomWords(
      room.settings.wordCount,
      room.settings.customWords
    );

    return { drawer, words };
  }

  selectWord(room, word) {
    room.gameState.currentWord = word.toLowerCase();
    room.gameState.wordHint = word.includes('-') 
      ? formatWordHintWithHyphen(word) 
      : formatWordHint(word);
    room.gameState.turnStartTime = Date.now();
    room.gameState.turnEndTime = Date.now() + (room.settings.timePerTurn * 1000);

    return room;
  }

  processGuess(room, playerId, guess) {
    const player = room.getPlayer(playerId);
    if (!player) return { correct: false };

    // Check if player is drawer
    if (player.id === room.gameState.currentDrawerId) {
      return { correct: false, message: "You're drawing!" };
    }

    // Check if player already guessed
    if (player.hasGuessed) {
      return { correct: false, message: 'You already guessed correctly!' };
    }

    const normalizedGuess = guess.toLowerCase().trim();
    const currentWord = room.gameState.currentWord;

    if (normalizedGuess === currentWord) {
      // Correct guess
      const timeRemaining = Math.max(0, room.gameState.turnEndTime - Date.now()) / 1000;
      const totalTime = room.settings.timePerTurn;
      const position = room.gameState.guessedPlayers.length + 1;

      const points = calculateScore(
        timeRemaining,
        totalTime,
        position,
        room.settings.penaltiesEnabled,
        player.wrongGuesses
      );

      player.addScore(points);
      player.hasGuessed = true;
      player.guessTime = Date.now();
      room.gameState.guessedPlayers.push({
        id: player.id,
        name: player.name,
        points,
        position
      });

      // Check if all players guessed
      const allGuessed = room.players.filter(p => p.id !== room.gameState.currentDrawerId)
        .every(p => p.hasGuessed);

      return {
        correct: true,
        points,
        position,
        allGuessed,
        player: player.toJSON()
      };
    } else {
      // Wrong guess
      player.wrongGuesses++;
      return { correct: false };
    }
  }

  endTurn(room) {
    const drawer = room.getPlayer(room.gameState.currentDrawerId);
    
    // Calculate drawer score
    let drawerPoints = 0;
    if (room.gameState.guessedPlayers.length > 0) {
      const totalGuessersPoints = room.gameState.guessedPlayers.reduce(
        (sum, g) => sum + g.points, 
        0
      );
      drawerPoints = calculateDrawerScore(totalGuessersPoints);
      drawer.addScore(drawerPoints);
    } else if (room.settings.penaltiesEnabled) {
      // Penalty for drawer if no one guessed
      drawer.addScore(-10);
      drawerPoints = -10;
    }

    drawer.isDrawing = false;
    room.gameState.currentTurn++;

    return {
      word: room.gameState.currentWord,
      drawerPoints,
      guessedPlayers: room.gameState.guessedPlayers,
      leaderboard: this.getLeaderboard(room)
    };
  }

  endRound(room) {
    room.gameState.currentRound++;
    room.gameState.currentTurn = 0;

    if (room.gameState.currentRound > room.settings.rounds) {
      return this.endGame(room);
    }

    return { roundEnded: true, currentRound: room.gameState.currentRound };
  }

  endGame(room) {
    room.gameState.status = 'ended';
    return {
      gameEnded: true,
      finalLeaderboard: this.getLeaderboard(room)
    };
  }

  getLeaderboard(room) {
    return room.players
      .map(p => ({
        id: p.id,
        name: p.name,
        score: p.score
      }))
      .sort((a, b) => b.score - a.score);
  }

  addDrawingAction(room, action) {
    room.gameState.drawingData.push(action);
  }
}
