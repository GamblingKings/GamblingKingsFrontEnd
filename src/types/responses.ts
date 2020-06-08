import { User, Game } from './client';

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
  users: User[];
}

/**
 * Interface for GAMES payload received
 */
export interface GamesJSON {
  games: Game[];
}

export interface MessageJSON {
  message: string;
}
