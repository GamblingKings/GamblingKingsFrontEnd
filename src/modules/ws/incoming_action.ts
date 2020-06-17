enum IncomingAction {
  /**
   * Main
   */
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',

  /**
   * Lobby
   */
  GET_ALL_GAMES = 'GET_ALL_GAMES',
  GET_ALL_USERS = 'GET_ALL_USERS',
  CREATE_GAME = 'CREATE_GAME',
  SEND_MESSAGE = 'SEND_MESSAGE',
  GAME_UPDATE = 'GAME_UPDATE',
  USER_UPDATE = 'USER_UPDATE',
  LEAVE_GAME = 'LEAVE_GAME',
  JOIN_GAME = 'JOIN_GAME',

  /**
   * Game Lobby
   */
  IN_GAME_UPDATE = 'IN_GAME_UPDATE',
  IN_GAME_MESSAGE = 'IN_GAME_MESSAGE',
  START_GAME = 'START_GAME',
}

export default IncomingAction;
