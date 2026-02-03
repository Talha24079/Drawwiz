import { Room } from '../models/Room.js';
import { Player } from '../models/Player.js';
import { generateRoomCode } from '../utils/helpers.js';

export class RoomService {
  constructor() {
    this.rooms = new Map();
    this.publicQueue = [];
  }

  createRoom(creatorId, creatorName, type = 'private', settings = {}) {
    const code = generateRoomCode();
    const creator = new Player({ id: creatorId, name: creatorName });
    
    const room = new Room({
      code,
      type,
      creatorId,
      players: [creator],
      settings
    });

    this.rooms.set(code, room);
    
    if (type === 'public') {
      this.publicQueue.push(code);
    }

    return room;
  }

  getRoom(code) {
    return this.rooms.get(code);
  }

  deleteRoom(code) {
    this.rooms.delete(code);
    this.publicQueue = this.publicQueue.filter(c => c !== code);
  }

  joinRoom(code, playerId, playerName) {
    const room = this.rooms.get(code);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.isFull()) {
      throw new Error('Room is full');
    }

    if (room.gameState.status !== 'waiting') {
      throw new Error('Game already started');
    }

    const player = new Player({ id: playerId, name: playerName });
    room.addPlayer(player);

    return room;
  }

  findPublicRoom() {
    for (const code of this.publicQueue) {
      const room = this.rooms.get(code);
      if (room && !room.isFull() && room.gameState.status === 'waiting') {
        return room;
      }
    }
    return null;
  }

  leaveRoom(code, playerId) {
    const room = this.rooms.get(code);
    if (!room) return null;

    room.removePlayer(playerId);

    // If room is empty, delete it
    if (room.players.length === 0) {
      this.deleteRoom(code);
      return null;
    }

    // If creator left, assign new creator
    if (room.creatorId === playerId) {
      room.creatorId = room.players[0].id;
    }

    return room;
  }

  updateSettings(code, settings) {
    const room = this.rooms.get(code);
    if (!room) {
      throw new Error('Room not found');
    }

    room.settings = { ...room.settings, ...settings };
    return room;
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }
}
