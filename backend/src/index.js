import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomService } from './services/RoomService.js';
import { GameService } from './services/GameService.js';
import { setupRoomHandlers } from './socket/handlers/roomHandlers.js';
import { setupGameHandlers } from './socket/handlers/gameHandlers.js';
import { setupDrawingHandlers } from './socket/handlers/drawingHandlers.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Initialize services
const roomService = new RoomService();
const gameService = new GameService();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  setupRoomHandlers(io, socket, roomService, gameService);
  setupGameHandlers(io, socket, roomService, gameService);
  setupDrawingHandlers(io, socket, roomService, gameService);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
