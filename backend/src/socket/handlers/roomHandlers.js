export function setupRoomHandlers(io, socket, roomService, gameService) {
  
  socket.on('create-room', ({ playerName, type, settings }) => {
    try {
      const room = roomService.createRoom(socket.id, playerName, type, settings);
      socket.join(room.code);
      socket.emit('room-created', { room: room.toJSON() });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('join-room', ({ roomCode, playerName }) => {
    try {
      const room = roomService.joinRoom(roomCode, socket.id, playerName);
      socket.join(room.code);
      
      socket.emit('room-joined', { room: room.toJSON() });
      io.to(room.code).emit('player-joined', {
        player: room.getPlayer(socket.id).toJSON(),
        players: room.players.map(p => p.toJSON())
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('join-public', ({ playerName }) => {
    try {
      let room = roomService.findPublicRoom();
      
      if (!room) {
        // Create new public room
        room = roomService.createRoom(socket.id, playerName, 'public');
      } else {
        // Join existing public room
        room = roomService.joinRoom(room.code, socket.id, playerName);
      }

      socket.join(room.code);
      socket.emit('room-joined', { room: room.toJSON() });
      
      if (room.players.length > 1) {
        io.to(room.code).emit('player-joined', {
          player: room.getPlayer(socket.id).toJSON(),
          players: room.players.map(p => p.toJSON())
        });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('update-settings', ({ roomCode, settings }) => {
    try {
      const room = roomService.getRoom(roomCode);
      if (!room) throw new Error('Room not found');
      
      if (!room.isCreator(socket.id)) {
        throw new Error('Only creator can update settings');
      }

      roomService.updateSettings(roomCode, settings);
      io.to(roomCode).emit('room-updated', { room: room.toJSON() });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('leave-room', ({ roomCode }) => {
    handleLeaveRoom(io, socket, roomCode, roomService);
  });

  socket.on('disconnect', () => {
    // Find all rooms the player is in and handle leave
    const rooms = roomService.getAllRooms();
    rooms.forEach(room => {
      const player = room.getPlayer(socket.id);
      if (player) {
        handleLeaveRoom(io, socket, room.code, roomService);
      }
    });
  });
}

function handleLeaveRoom(io, socket, roomCode, roomService) {
  try {
    const room = roomService.getRoom(roomCode);
    if (!room) return;

    const leavingPlayer = room.getPlayer(socket.id);
    if (!leavingPlayer) return;

    const updatedRoom = roomService.leaveRoom(roomCode, socket.id);
    socket.leave(roomCode);

    if (updatedRoom) {
      // Room still exists
      io.to(roomCode).emit('player-left', {
        playerId: socket.id,
        playerName: leavingPlayer.name,
        players: updatedRoom.players.map(p => p.toJSON()),
        newCreatorId: updatedRoom.creatorId
      });

      if (leavingPlayer.id !== updatedRoom.creatorId) {
        io.to(roomCode).emit('creator-changed', {
          newCreatorId: updatedRoom.creatorId
        });
      }
    }
  } catch (error) {
    console.error('Error handling leave room:', error);
  }
}
