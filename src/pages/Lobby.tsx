import React, { useEffect, useState, useRef } from 'react';

import WebSocketConnection from '../modules/ws/websocket';
import OutgoingAction from '../modules/ws/outgoing_action';
import IncomingAction from '../modules/ws/incoming_action';
import {
  UsersJSON,
  GamesJSON,
  MessageJSON,
  CurrentUser,
  User,
  Game,
  CreateGameJSON,
  UpdateUserJSON,
  UpdateGameJSON,
  JoinGameJSON,
  LeaveGameJSON,
} from '../types';

import CreateGameForm from '../components/lobby/create_game';
import SendMessageForm from '../components/lobby/send_message';
import GameLobby from '../components/lobby/game_lobby';

type LobbyProps = {
  ws: WebSocketConnection | null;
  currentUser: CurrentUser;
};

const PLACEHOLDER_USERS = [
  { username: 'user', connectionId: '123' },
  { username: 'user1', connectionId: '1233' },
  { username: 'user2', connectionId: '1223' },
];
const PLACEHOLDER_GAMES = [
  {
    gameId: '123',
    gameName: 'game',
    gameType: 'Mahjong',
    gameVersion: 'HongKong',
  },
  {
    gameId: '1234',
    gameName: 'game12323',
    gameType: 'Mahjong',
    gameVersion: 'HongKong',
  },
  {
    gameId: '123123',
    gameName: 'game2323',
    gameType: 'Mahjong',
    gameVersion: 'HongKong',
  },
];

const LobbyPage = ({ ws }: LobbyProps): JSX.Element => {
  /**
   * Hook that holds a reference to a state.
   * Used in WebSocket callbacks as initialized callbacks do not have updated reference to state.
   * @param state unknown
   * @return React.MutableRefObject
   */
  function useStateRef(state: unknown) {
    const stateRef = useRef(state);
    useEffect(() => {
      stateRef.current = state;
    });
    return stateRef;
  }

  /**
   * States
   */
  const [users, setUsers] = useState<User[]>([]);
  const usersRef = useStateRef(users);

  const [games, setGames] = useState<Game[]>([]);
  const gamesRef = useStateRef(games);

  const [messages, setMessages] = useState<string[]>([]);
  const messagesRef = useStateRef(messages);

  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [inGame, setInGame] = useState<boolean>(false);

  const [createGameModal, setCreateGameModal] = useState<boolean>(false);

  /**
   * State Handlers.
   */
  const toggleCreateGameModal = (): void => setCreateGameModal(!createGameModal);
  const closeCreateGameModal = (): void => setCreateGameModal(false);

  /**
   * Listener Callbacks.
   */

  /**
   * For GET_ALL_USERS
   * @param payload UsersJSON
   */
  const updateUsers = (payload: unknown): void => {
    const data = payload as UsersJSON;
    const { users: newUsers } = data;

    /**
     * Only add user if they have a username associated.
     */
    const filteredUsers = newUsers.filter((user) => user.username);
    setUsers(filteredUsers);
  };

  /**
   * For GET_ALL_GAMES
   * @param payload GamesJSON
   */
  const updateGames = (payload: unknown): void => {
    const data = payload as GamesJSON;
    const { games: newGames } = data;
    setGames(newGames);
  };

  /**
   * For SEND_MESSAGE
   * @param payload MessageJSON
   */
  const updateMessages = (payload: unknown): void => {
    const data = payload as MessageJSON;
    const { message } = data;
    const originalMessages = messagesRef.current as string[];
    const newMessages = [...originalMessages];
    newMessages.push(message);
    setMessages(newMessages);
  };

  /**
   * For CREATE_GAME
   * @param payload UpdateUserJSON
   */
  const createdGame = (payload: unknown): void => {
    const data = payload as CreateGameJSON;
    const { success, game, error } = data;
    if (success) {
      console.log(game);
      setCurrentGame(game);
      closeCreateGameModal();
      setInGame(true);
    } else {
      // TODO: implement create game error modal
      console.log(`Error in creating game: ${error}`);
    }
  };

  /**
   * For USER_UPDATE
   * @param payload UpdateUserJSON
   */
  const updateUser = (payload: unknown): void => {
    const data = payload as UpdateUserJSON;
    const { connectionId, username, state } = data;
    const originalUsers = usersRef.current as User[];
    const newUsers = [...originalUsers];
    // Add user to state if not already in the list
    if (state === 'CONNECT') {
      const index = newUsers.findIndex((user) => user.connectionId === connectionId);
      if (index === -1) {
        newUsers.push({ username, connectionId });
        setUsers(newUsers);
      }
    }
    // Remove user from state if found in the list
    if (state === 'DISCONNECT') {
      const index = newUsers.findIndex((user) => user.connectionId === connectionId);
      if (index !== -1) {
        newUsers.splice(index, 1);
        setUsers(newUsers);
      }
    }
  };

  /**
   * For GAME_UPDATE
   * @param payload UpdateGameJSON
   */
  const updateGame = (payload: unknown): void => {
    const data = payload as UpdateGameJSON;
    const { game, state } = data;
    const { gameId: newGameId } = game;
    const originalGames = gamesRef.current as Game[];
    const newGames = [...originalGames];
    // Add game to state if game isn't already in the list
    if (state === 'CREATED') {
      const index = newGames.findIndex((g) => g.gameId === newGameId);
      if (index === -1) {
        newGames.push(game);
      }
    }
    // Remove game from state
    if (state === 'DELETED') {
      const index = newGames.findIndex((g) => g.gameId === newGameId);
      if (index !== -1) {
        newGames.splice(index, 1);
        setGames(newGames);
      }
    }
  };

  /**
   * For JOIN_GAME
   * @param payload JoinGameJSON
   */
  const joinGame = (payload: unknown): void => {
    const data = payload as JoinGameJSON;
    const { success, game, error } = data;
    if (success) {
      setInGame(true);
      setCurrentGame(game);
      console.log(game);
    } else {
      // TODO: implement join game error modal
      console.log(`Error joining game: ${error}`);
    }
  };

  /**
   * For LEAVE_GAME
   * @param payload
   */
  const leaveGame = (payload: unknown): void => {
    const data = payload as LeaveGameJSON;
    const { success, error } = data;
    if (success) {
      setInGame(false);
    } else {
      // TODO: implement something that player couldn't leave game properly
      console.log(`Error in leaving game: ${error}`);
    }
  };

  useEffect(() => {
    if (ws) {
      const addListeners = [
        ws.addListener(IncomingAction.GET_ALL_USERS, updateUsers),
        ws.addListener(IncomingAction.GET_ALL_GAMES, updateGames),
        ws.addListener(IncomingAction.SEND_MESSAGE, updateMessages),
        ws.addListener(IncomingAction.CREATE_GAME, createdGame),
        ws.addListener(IncomingAction.GAME_UPDATE, updateGame),
        ws.addListener(IncomingAction.USER_UPDATE, updateUser),
        ws.addListener(IncomingAction.LEAVE_GAME, leaveGame),
        ws.addListener(IncomingAction.JOIN_GAME, joinGame),
      ];

      const failedAdded = addListeners.filter((bool) => !bool);
      if (failedAdded.length === 0) {
        ws.sendMessage(OutgoingAction.GET_ALL_GAMES, {});
        ws.sendMessage(OutgoingAction.GET_ALL_USERS, {});
      }
    } else {
      // TODO: handling of client that has been disconnected from WS
    }

    setUsers(PLACEHOLDER_USERS);
    setGames(PLACEHOLDER_GAMES);

    return function cleanup() {
      if (ws) {
        ws.removeListener(IncomingAction.GET_ALL_GAMES);
        ws.removeListener(IncomingAction.GET_ALL_USERS);
        ws.removeListener(IncomingAction.SEND_MESSAGE);
        ws.removeListener(IncomingAction.CREATE_GAME);
        ws.removeListener(IncomingAction.GAME_UPDATE);
        ws.removeListener(IncomingAction.USER_UPDATE);
        ws.removeListener(IncomingAction.LEAVE_GAME);
        ws.removeListener(IncomingAction.JOIN_GAME);
      }
    };
    // eslint-disable-next-line
  }, [ws]);

  return (
    <div className="">
      <header className="margin-bottom-20">
        <h3>Gambling Kings Lobby</h3>
      </header>
      <div className="flex-row">
        <div className="border-color-black margin-right-20 padding-30">
          <p>Users</p>
          {users.map((user) => (
            <p key={user.connectionId}>{user.username}</p>
          ))}
        </div>
        <div className="border-color-black padding-30">
          <p>Games</p>
          {games.map((game) => (
            <p key={game.gameId}>{game.gameName}</p>
          ))}
        </div>
      </div>

      <div>
        <button type="button" onClick={toggleCreateGameModal}>
          Create Game
        </button>
      </div>

      {createGameModal && (
        <div className="modal background-color-primary margin-top-30">
          <CreateGameForm ws={ws} toggleOff={closeCreateGameModal} />
        </div>
      )}

      <div>
        <SendMessageForm ws={ws} />
      </div>
      <div>
        <p>Messages</p>
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
      {inGame && (
        <div className="modal background-color-primary margin-top-30">
          <GameLobby ws={ws} game={currentGame} />
        </div>
      )}
    </div>
  );
};

export default LobbyPage;
