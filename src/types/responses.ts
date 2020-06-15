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
  time: Date;
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

/**
 * Interface for IN_GAME_MESSAGE payload received
 */
export interface InGameMessageJSON {
  message: string;
  username: string;
  time: Date;
}

/**
 * Interface for IN_GAME_UPDATE payload received
 */
export interface InGameUpdateJSON {
  connections: string; // placeholder
}

/**
 * Interface for START_GAME payload received
 */
export interface StartGameJSON {
  success: boolean;
  error?: string;
}
