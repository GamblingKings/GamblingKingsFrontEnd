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
 * Interface for USER_UPDATE payload received
 */
export interface UpdateUserJSON {
  user: User;
  state: string;
}

/**
 * Interface for GET_ALL_GAMES payload received
 */
export interface GamesJSON {
  games: Game[];
}

/**
 * Interface for GAME_UPDATE payload received
 */
export interface UpdateGameJSON {
  game: Game;
  state: string;
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

/**
 * Interface for JOIN_GAME payload received
 */
export interface JoinGameJSON {
  success: boolean;
  game: Game;
  error?: string;
}

/**
 * Interface for LEAVE_GAME payload received
 */
export interface LeaveGameJSON {
  success: boolean;
  error?: string;
}
