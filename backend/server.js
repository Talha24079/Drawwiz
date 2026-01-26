import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import {
    createRoom,
    getRoom,
    addPlayerToRoom,
    removePlayerFromRoom,
    addStrokeToRoom,
    clearRoomCanvas,
} from './roomManager.js'
import {
    startGame,
    selectWord,
    handleGuess,
} from './gameManager.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
})

app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Drawwiz server is running' })
})

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Create room
    socket.on('createRoom', ({ roomId, playerName, isPrivate = false }) => {
        const result = createRoom(roomId, socket.id, isPrivate)

        if (result.success) {
            // Add creator as first player
            const player = {
                id: socket.id,
                socketId: socket.id,
                name: playerName,
                isHost: true,
            }

            addPlayerToRoom(roomId, player)
            socket.join(roomId)

            socket.emit('roomCreated', {
                roomId,
                room: result.room,
            })

            io.to(roomId).emit('roomUpdated', {
                players: result.room.players,
            })
        }
        else {
            socket.emit('error', { message: result.error })
        }
    })

    // Join room
    socket.on('joinRoom', ({ roomId, playerName }) => {
        const room = getRoom(roomId)

        if (!room) {
            socket.emit('error', { message: 'Room not found' })
            return
        }

        const player = {
            id: socket.id,
            socketId: socket.id,
            name: playerName,
            isHost: false,
        }

        const result = addPlayerToRoom(roomId, player)

        if (result.success) {
            socket.join(roomId)

            socket.emit('roomJoined', {
                roomId,
                room: result.room,
            })

            // Notify all players in the room
            io.to(roomId).emit('playerJoined', {
                player,
                players: result.room.players,
            })

            // Send existing canvas state to new player
            if (result.room.canvas.strokes.length > 0) {
                socket.emit('canvasState', {
                    strokes: result.room.canvas.strokes,
                })
            }
        }
        else {
            socket.emit('error', { message: result.error })
        }
    })

    // Start game
    socket.on('startGame', ({ roomId }) => {
        const room = getRoom(roomId)

        if (!room) {
            socket.emit('error', { message: 'Room not found' })
            return
        }

        // Only host can start game
        if (room.host !== socket.id) {
            socket.emit('error', { message: 'Only host can start the game' })
            return
        }

        const result = startGame(roomId, io)

        if (!result.success) {
            socket.emit('error', { message: result.error })
        }
    })

    // Select word
    socket.on('selectWord', ({ roomId, word }) => {
        const room = getRoom(roomId)

        if (!room) {
            return
        }

        // Only current drawer can select word
        if (room.gameState.currentDrawer !== socket.id) {
            return
        }

        selectWord(roomId, word, io)
    })

    // Drawing events
    socket.on('draw', ({ roomId, stroke }) => {
        const room = getRoom(roomId)

        if (!room) {
            return
        }

        // Only current drawer can draw
        if (room.gameState.currentDrawer !== socket.id) {
            return
        }

        addStrokeToRoom(roomId, stroke)

        // Broadcast to all other players in the room
        socket.to(roomId).emit('draw', { stroke })
    })

    // Undo last stroke
    socket.on('undo', ({ roomId }) => {
        const room = getRoom(roomId)

        if (!room) {
            return
        }

        // Only current drawer can undo
        if (room.gameState.currentDrawer !== socket.id) {
            return
        }

        if (room.canvas.strokes.length > 0) {
            room.canvas.strokes.pop()
            io.to(roomId).emit('undo')
        }
    })

    // Clear canvas
    socket.on('clearCanvas', ({ roomId }) => {
        const room = getRoom(roomId)

        if (!room) {
            return
        }

        // Only current drawer can clear
        if (room.gameState.currentDrawer !== socket.id) {
            return
        }

        clearRoomCanvas(roomId)
        io.to(roomId).emit('clearCanvas')
    })

    // Chat/Guess message
    socket.on('sendMessage', ({ roomId, message }) => {
        const room = getRoom(roomId)

        if (!room) {
            return
        }

        const player = room.players.find(p => p.id === socket.id)

        if (!player) {
            return
        }

        // Check if it's a correct guess
        const guessResult = handleGuess(roomId, socket.id, message, io)

        // If correct, don't show the message (already handled in handleGuess)
        // If incorrect or not playing, broadcast the message
        if (!guessResult.correct || room.gameState.status !== 'playing') {
            io.to(roomId).emit('message', {
                playerId: socket.id,
                playerName: player.name,
                message,
                timestamp: Date.now(),
            })
        }
    })

    // Leave room / disconnect
    socket.on('leaveRoom', ({ roomId }) => {
        handlePlayerLeave(socket.id, roomId)
    })

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`)

        // Find which room the player was in
        const rooms = io.sockets.adapter.rooms
        rooms.forEach((sockets, roomId) => {
            if (sockets.has(socket.id)) {
                handlePlayerLeave(socket.id, roomId)
            }
        })
    })
})

function handlePlayerLeave(socketId, roomId) {
    const result = removePlayerFromRoom(roomId, socketId)

    if (result.success && !result.roomDeleted) {
        io.to(roomId).emit('playerLeft', {
            playerId: socketId,
            players: result.room.players,
        })
    }
}

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
    console.log(`🎨 Drawwiz server running on http://localhost:${PORT}`)
})
