export function setupDrawingHandlers(io, socket, roomService, gameService) {
  
  socket.on('draw-stroke', ({ roomCode, strokeData }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');

      if (room.gameState.currentDrawerId !== socket.id) {
        return; // Only drawer can draw
      }

      gameService.addDrawingAction(room, { type: 'stroke', data: strokeData });
      socket.to(roomCode).emit('drawing-update', {
        type: 'stroke',
        data: strokeData
      });

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('draw-fill', ({ roomCode, fillData }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');

      if (room.gameState.currentDrawerId !== socket.id) {
        return;
      }

      gameService.addDrawingAction(room, { type: 'fill', data: fillData });
      socket.to(roomCode).emit('drawing-update', {
        type: 'fill',
        data: fillData
      });

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('draw-undo', ({ roomCode }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');

      if (room.gameState.currentDrawerId !== socket.id) {
        return;
      }

      socket.to(roomCode).emit('drawing-update', {
        type: 'undo'
      });

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('draw-redo', ({ roomCode }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');

      if (room.gameState.currentDrawerId !== socket.id) {
        return;
      }

      socket.to(roomCode).emit('drawing-update', {
        type: 'redo'
      });

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('draw-clear', ({ roomCode }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');

      if (room.gameState.currentDrawerId !== socket.id) {
        return;
      }

      room.gameState.drawingData = [];
      socket.to(roomCode).emit('drawing-update', {
        type: 'clear'
      });

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
}
