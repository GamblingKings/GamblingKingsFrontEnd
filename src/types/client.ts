export interface CurrentUser {
  username: string;
}

export interface User {
  connectionId: string;
  username: string;
}

export interface Game {
  gameId: string;
  gameName: string;
  gameType: string;
  gameVersion: string;
}
