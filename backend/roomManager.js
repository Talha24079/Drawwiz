// Room management system
const rooms = new Map()

export function createRoom(roomId, creatorSocketId, isPrivate = false) {
    if (rooms.has(roomId)) {
        return { success: false, error: 'Room already exists' }
    }

    const room = {
        id: roomId,
        isPrivate,
        players: [],
        host: creatorSocketId,
        gameState: {
            status: 'lobby', // lobby, playing, roundEnd, gameEnd
            currentRound: 0,
            maxRounds: 3,
            currentDrawer: null,
            currentWord: null,
            wordHint: '',
            guessedPlayers: new Set(),
            timer: 80,
            scores: {},
        },
        canvas: {
            strokes: [],
        },
        createdAt: Date.now(),
    }

    rooms.set(roomId, room)
    return { success: true, room }
}

export function getRoom(roomId) {
    return rooms.get(roomId)
}

export function deleteRoom(roomId) {
    return rooms.delete(roomId)
}

export function addPlayerToRoom(roomId, player) {
    const room = rooms.get(roomId)
    if (!room) {
        return { success: false, error: 'Room not found' }
    }

    // Check if player already exists
    const existingPlayer = room.players.find(p => p.id === player.id)
    if (existingPlayer) {
        return { success: true, room }
    }

    room.players.push(player)

    // Initialize score for new player
    room.gameState.scores[player.id] = 0

    return { success: true, room }
}

export function removePlayerFromRoom(roomId, playerId) {
    const room = rooms.get(roomId)
    if (!room) {
        return { success: false, error: 'Room not found' }
    }

    room.players = room.players.filter(p => p.id !== playerId)

    // If room is empty, delete it
    if (room.players.length === 0) {
        deleteRoom(roomId)
        return { success: true, roomDeleted: true }
    }

    // If host left, assign new host
    if (room.host === playerId && room.players.length > 0) {
        room.host = room.players[0].id
    }

    return { success: true, room }
}

export function getRoomPlayers(roomId) {
    const room = rooms.get(roomId)
    return room ? room.players : []
}

export function updateRoomGameState(roomId, updates) {
    const room = rooms.get(roomId)
    if (!room) {
        return { success: false, error: 'Room not found' }
    }

    room.gameState = { ...room.gameState, ...updates }
    return { success: true, room }
}

export function addStrokeToRoom(roomId, stroke) {
    const room = rooms.get(roomId)
    if (!room) {
        return { success: false, error: 'Room not found' }
    }

    room.canvas.strokes.push(stroke)
    return { success: true }
}

export function clearRoomCanvas(roomId) {
    const room = rooms.get(roomId)
    if (!room) {
        return { success: false, error: 'Room not found' }
    }

    room.canvas.strokes = []
    return { success: true }
}

export function getAllRooms() {
    return Array.from(rooms.values())
}
