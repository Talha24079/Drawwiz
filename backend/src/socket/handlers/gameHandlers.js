export function setupGameHandlers(io, socket, roomService, gameService) {
  
  socket.on('start-game', ({ roomCode }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');

      if (!room.isCreator(socket.id)) {
        throw new Error('Only creator can start the game');
      }

      gameService.startGame(room);
      io.to(roomCode).emit('game-started', {
        gameState: room.gameState,
        players: room.players.map(p => p.toJSON())
      });

      // Start first turn
      setTimeout(() => {
        startTurn(io, roomCode, roomService, gameService);
      }, 2000);

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('select-word', ({ roomCode, word }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');

      if (room.gameState.currentDrawerId !== socket.id) {
        throw new Error('You are not the drawer');
      }

      gameService.selectWord(room, word);

      // Emit different events to drawer and guessers
      socket.emit('word-selected', {
        word: room.gameState.currentWord,
        wordHint: room.gameState.wordHint,
        turnEndTime: room.gameState.turnEndTime
      });

      socket.to(roomCode).emit('word-selected', {
        wordHint: room.gameState.wordHint,
        turnEndTime: room.gameState.turnEndTime,
        drawerId: socket.id
      });

      // Set timer for turn end
      const turnDuration = room.settings.timePerTurn * 1000;
      setTimeout(() => {
        endTurn(io, roomCode, roomService, gameService);
      }, turnDuration);

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('send-guess', ({ roomCode, guess }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');

      const result = gameService.processGuess(room, socket.id, guess);

      if (result.correct) {
        socket.emit('guess-result', {
          correct: true,
          points: result.points,
          position: result.position
        });

        io.to(roomCode).emit('chat-message', {
          type: 'system',
          message: `${result.player.name} guessed the word!`,
          playerId: socket.id
        });

        io.to(roomCode).emit('player-guessed', {
          playerId: socket.id,
          playerName: result.player.name,
          position: result.position,
          players: room.players.map(p => p.toJSON())
        });

        // If all guessed, end turn early
        if (result.allGuessed) {
          setTimeout(() => {
            endTurn(io, roomCode, roomService, gameService);
          }, 1000);
        }
      } else {
        socket.emit('guess-result', { correct: false });
        
        // Broadcast as chat message only if not drawer
        if (result.message !== "You're drawing!") {
          io.to(roomCode).emit('chat-message', {
            type: 'guess',
            message: guess,
            playerId: socket.id,
            playerName: room.getPlayer(socket.id).name
          });
        }
      }

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('play-again', ({ roomCode }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');

      if (!room.isCreator(socket.id)) {
        throw new Error('Only creator can restart the game');
      }

      // Reset game state
      room.gameState = {
        status: 'waiting',
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

      room.players.forEach(p => {
        p.score = 0;
        p.resetTurn();
      });

      io.to(roomCode).emit('game-reset', {
        room: room.toJSON()
      });

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
}

function startTurn(io, roomCode, roomService, gameService) {
  const room = roomService.getRoom(roomCode);
  if (!room) return;

  const result = gameService.startTurn(room);
  
  if (result.roundEnded) {
    io.to(roomCode).emit('round-ended', {
      currentRound: result.currentRound,
      leaderboard: gameService.getLeaderboard(room)
    });

    if (result.gameEnded) {
      io.to(roomCode).emit('game-ended', {
        finalLeaderboard: result.finalLeaderboard
      });
      return;
    }

    // Start next round
    setTimeout(() => {
      startTurn(io, roomCode, roomService, gameService);
    }, 3000);
    return;
  }

  io.to(roomCode).emit('turn-started', {
    drawerId: result.drawer.id,
    drawerName: result.drawer.name,
    currentRound: room.gameState.currentRound,
    currentTurn: room.gameState.currentTurn + 1,
    totalTurns: room.players.length
  });

  // Send word choices to drawer
  io.to(result.drawer.id).emit('word-selection', {
    words: result.words
  });
}

function endTurn(io, roomCode, roomService, gameService) {
  const room = roomService.getRoom(roomCode);
  if (!room || room.gameState.status !== 'playing') return;

  const result = gameService.endTurn(room);

  io.to(roomCode).emit('turn-ended', {
    word: result.word,
    drawerPoints: result.drawerPoints,
    guessedPlayers: result.guessedPlayers,
    leaderboard: result.leaderboard
  });

  // Check if round or game ended
  if (room.gameState.currentTurn >= room.players.length) {
    const roundResult = gameService.endRound(room);
    
    setTimeout(() => {
      io.to(roomCode).emit('round-ended', {
        currentRound: room.gameState.currentRound,
        leaderboard: gameService.getLeaderboard(room)
      });

      if (roundResult.gameEnded) {
        io.to(roomCode).emit('game-ended', {
          finalLeaderboard: roundResult.finalLeaderboard
        });
        return;
      }

      // Start next round
      setTimeout(() => {
        startTurn(io, roomCode, roomService, gameService);
      }, 3000);
    }, 3000);
  } else {
    // Start next turn
    setTimeout(() => {
      startTurn(io, roomCode, roomService, gameService);
    }, 3000);
  }
}
