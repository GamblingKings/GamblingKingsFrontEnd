import { User, Game } from './client';

/**
 * Interface for all messages received from WebSocket.
 */
export interface ReceivedJSON {
  action: string;
  payload: unknown;
}

/**
 * Interface for LOGIN_SUCCESS payload received
 */
export interface LoginSuccessJSON {
  success: boolean;
  error?: string;
}

/**
 * Interface for GET_ALL_USERS payload received
 */
export interface UsersJSON {
  users: User[];
}

/**
 * Interface for GET_ALL_GAMES payload received
 */
export interface GamesJSON {
  games: Game[];
}

/**
 * Interface for SEND_MESSAGE payload received
 */
export interface MessageJSON {
  message: string;
  username: string;
  date: Date;
}

/**
 * Interface for CREATE_GAME payload received
 */
export interface CreateGameJSON {
  success: boolean;
  game: Game;
  error?: string;
}
