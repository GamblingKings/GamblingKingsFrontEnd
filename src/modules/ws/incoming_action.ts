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
}

export default IncomingAction;
