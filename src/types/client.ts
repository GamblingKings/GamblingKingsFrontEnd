/**
 * Interface for Current User (Client)
 */
export interface CurrentUser {
  username: string;
}

/**
 * Interface to represent other users (including self in Lobby)
 */
export interface User {
  connectionId: string;
  username: string;
}

/**
 * Interface to represent a game in Lobby
 */
export interface Game {
  gameId: string;
  gameName: string;
  gameType: string;
  gameVersion: string;
  users: User[];
}

/**
 * Interface to represent a Message sent from users or system
 */
export interface Message {
  message: string;
  username: string;
  time: Date;
}
