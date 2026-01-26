import { getRandomWords } from './wordList.js'
import { getRoom, updateRoomGameState, clearRoomCanvas } from './roomManager.js'

export function startGame(roomId, io) {
    const room = getRoom(roomId)
    if (!room) {
        return { success: false, error: 'Room not found' }
    }

    if (room.players.length < 2) {
        return { success: false, error: 'Need at least 2 players to start' }
    }

    // Initialize game state
    updateRoomGameState(roomId, {
        status: 'playing',
        currentRound: 1,
        currentDrawer: room.players[0].id,
        guessedPlayers: new Set(),
    })

    clearRoomCanvas(roomId)

    // Emit game started event
    io.to(roomId).emit('gameStarted', {
        players: room.players,
        scores: room.gameState.scores,
    })

    // Start first round
    startNewRound(roomId, io)

    return { success: true }
}

export function startNewRound(roomId, io) {
    const room = getRoom(roomId)
    if (!room) {
        return
    }

    // Clear canvas
    clearRoomCanvas(roomId)

    // Reset guessed players
    room.gameState.guessedPlayers.clear()

    // Get random words for drawer
    const words = getRandomWords(3)

    // Notify all players about new round
    io.to(roomId).emit('newRound', {
        roundNumber: room.gameState.currentRound,
        drawer: room.gameState.currentDrawer,
    })

    // Send word choices only to drawer
    const drawerSocketId = room.players.find(
        p => p.id === room.gameState.currentDrawer
    )?.socketId

    if (drawerSocketId) {
        io.to(drawerSocketId).emit('wordOptions', { words })
    }
}

export function selectWord(roomId, word, io) {
    const room = getRoom(roomId)
    if (!room) {
        return
    }

    // Set the word and create hint
    updateRoomGameState(roomId, {
        currentWord: word,
        wordHint: word.replace(/[a-zA-Z]/g, '_'),
        timer: 80,
    })

    // Notify all players (except drawer)
    io.to(roomId).emit('wordSelected', {
        wordHint: room.gameState.wordHint,
    })

    // Start timer
    startRoundTimer(roomId, io)
}

function startRoundTimer(roomId, io) {
    const room = getRoom(roomId)
    if (!room) {
        return
    }

    const timerInterval = setInterval(() => {
        const currentRoom = getRoom(roomId)
        if (!currentRoom || currentRoom.gameState.status !== 'playing') {
            clearInterval(timerInterval)
            return
        }

        currentRoom.gameState.timer -= 1

        // Emit timer update every second
        io.to(roomId).emit('timerUpdate', {
            timeLeft: currentRoom.gameState.timer,
        })

        // End round when timer reaches 0
        if (currentRoom.gameState.timer <= 0) {
            clearInterval(timerInterval)
            endRound(roomId, io)
        }
    }, 1000)
}

export function handleGuess(roomId, playerId, message, io) {
    const room = getRoom(roomId)
    if (!room) {
        return { success: false }
    }

    // Don't process if player is the drawer
    if (playerId === room.gameState.currentDrawer) {
        return { success: false }
    }

    // Don't process if already guessed
    if (room.gameState.guessedPlayers.has(playerId)) {
        return { success: false }
    }

    // Check if guess is correct (case-insensitive)
    const guess = message.toLowerCase().trim()
    const correctWord = room.gameState.currentWord?.toLowerCase()

    if (guess === correctWord) {
        // Mark player as guessed
        room.gameState.guessedPlayers.add(playerId)

        // Calculate points based on speed (more time left = more points)
        const timeBonus = Math.floor(room.gameState.timer / 10)
        const orderBonus = 100 - (room.gameState.guessedPlayers.size * 20)
        const points = Math.max(50, orderBonus + timeBonus)

        // Award points
        room.gameState.scores[playerId] += points

        // Emit correct guess to all players
        io.to(roomId).emit('correctGuess', {
            playerId,
            playerName: room.players.find(p => p.id === playerId)?.name,
            points,
        })

        // Check if all players have guessed
        const nonDrawerPlayers = room.players.filter(
            p => p.id !== room.gameState.currentDrawer
        )
        if (room.gameState.guessedPlayers.size === nonDrawerPlayers.length) {
            endRound(roomId, io)
        }

        return { success: true, correct: true }
    }

    return { success: true, correct: false }
}

function endRound(roomId, io) {
    const room = getRoom(roomId)
    if (!room) {
        return
    }

    // Emit round end with the word
    io.to(roomId).emit('roundEnd', {
        word: room.gameState.currentWord,
        scores: room.gameState.scores,
    })

    // Check if game should end
    if (room.gameState.currentRound >= room.gameState.maxRounds) {
        endGame(roomId, io)
        return
    }

    // Move to next drawer
    const currentDrawerIndex = room.players.findIndex(
        p => p.id === room.gameState.currentDrawer
    )
    const nextDrawerIndex = (currentDrawerIndex + 1) % room.players.length

    updateRoomGameState(roomId, {
        currentRound: room.gameState.currentRound + 1,
        currentDrawer: room.players[nextDrawerIndex].id,
        currentWord: null,
        wordHint: '',
    })

    // Start next round after delay
    setTimeout(() => {
        startNewRound(roomId, io)
    }, 5000)
}

function endGame(roomId, io) {
    const room = getRoom(roomId)
    if (!room) {
        return
    }

    // Find winner
    let winner = null
    let maxScore = -1

    for (const [playerId, score] of Object.entries(room.gameState.scores)) {
        if (score > maxScore) {
            maxScore = score
            winner = playerId
        }
    }

    updateRoomGameState(roomId, {
        status: 'gameEnd',
    })

    // Emit game end
    io.to(roomId).emit('gameEnd', {
        winner,
        winnerName: room.players.find(p => p.id === winner)?.name,
        finalScores: room.gameState.scores,
    })
}
