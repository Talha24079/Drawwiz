export function validatePlayerName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (name.trim().length > 20) {
    return 'Name must be less than 20 characters';
  }
  if (!/^[a-zA-Z0-9_\s]+$/.test(name)) {
    return 'Name can only contain letters, numbers, and underscores';
  }
  return null;
}

export function validateRoomCode(code: string): string | null {
  if (!code || code.trim().length === 0) {
    return 'Room code is required';
  }
  if (code.trim().length !== 6) {
    return 'Room code must be 6 characters';
  }
  return null;
}
