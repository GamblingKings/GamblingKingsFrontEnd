/**
 * Interface for all messages received from WebSocket.
 */
export interface ReceivedJSON {
  action: string;
  payload: unknown;
}

/**
 * Interface for USERS payload received
 */
export interface UsersJSON {
  users: Record<string, unknown>[];
}

/**
 * Interface for GAMES payload received
 */
export interface GamesJSON {
  games: Record<string, unknown>[];
}

export interface MessageJSON {
  message: string;
}
