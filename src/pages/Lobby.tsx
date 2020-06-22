import React, { useEffect, useState, useRef } from 'react';

import { WebSocketConnection, IncomingAction, OutgoingAction } from '../modules/ws';
import {
  UsersJSON,
  GamesJSON,
  MessageJSON,
  CurrentUser,
  User,
  Game,
  Message,
  CreateGameJSON,
  UpdateUserJSON,
  UpdateGameJSON,
  JoinGameJSON,
} from '../types';

import CreateGameForm from '../components/lobby/create_game';
import SendMessageForm from '../components/lobby/send_message';
import GameLobby from '../components/lobby/game_lobby';

type LobbyProps = {
  ws: WebSocketConnection | null;
  currentUser: CurrentUser;
};

// const PLACEHOLDER_USERS = [
//   { username: 'user', connectionId: '123' },
//   { username: 'user1', connectionId: '1233' },
//   { username: 'user2', connectionId: '1223' },
// ];
// const PLACEHOLDER_GAMES = [
//   {
//     gameId: '123',
//     gameName: 'game',
//     gameType: 'Mahjong',
//     gameVersion: 'HongKong',
//   },
//   {
//     gameId: '1234',
//     gameName: 'game12323',
//     gameType: 'Mahjong',
//     gameVersion: 'HongKong',
//   },
//   {
//     gameId: '123123',
//     gameName: 'game2323',
//     gameType: 'Mahjong',
//     gameVersion: 'HongKong',
//   },
// ];

const LobbyPage = ({ ws, currentUser }: LobbyProps): JSX.Element => {
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

  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useStateRef(messages);

  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const currentGameRef = useStateRef(currentGame);

  const [createGameModal, setCreateGameModal] = useState<boolean>(false);

  /**
   * State Handlers.
   */
  const toggleCreateGameModal = (): void => setCreateGameModal(!createGameModal);
  const closeCreateGameModal = (): void => setCreateGameModal(false);

  /**
   * Functions
   */
  const requestJoinGame = (gameId: string) => {
    if (ws) {
      ws.sendMessage(OutgoingAction.JOIN_GAME, { gameId });
    }
  };

  /**
   * Remove game from games list.
   * @param gameId string
   */
  const removeGameFromList = (gameId: string) => {
    const updatedGames = [...games].filter((game) => game.gameId !== gameId);
    setGames(updatedGames);
  };

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
    const originalMessages = messagesRef.current as Message[];
    const newMessages = [...originalMessages];
    newMessages.push(data);
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

      const originalGames = gamesRef.current as Game[];
      const newGames = [...originalGames];
      newGames.push(game);
      setGames(newGames);
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
    const { user, state } = data;
    const { connectionId, username } = user;
    const originalUsers = usersRef.current as User[];
    const newUsers = [...originalUsers];
    // Add user to state if not already in the list
    if (state === 'CONNECTED') {
      const index = newUsers.findIndex((u) => u.connectionId === connectionId);
      if (index === -1) {
        newUsers.push({ username, connectionId });
        setUsers(newUsers);
      }
    }
    // Remove user from state if found in the list
    if (state === 'DISCONNECTED') {
      const updatedUsers = newUsers.filter((u) => u.connectionId !== connectionId);
      setUsers(updatedUsers);
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
        setGames(newGames);
      }
    }
    // Remove game from state
    if (state === 'DELETED') {
      removeGameFromList(newGameId);
      const gameRef = currentGameRef.current as Game;
      if (gameRef && gameRef.gameId === newGameId) {
        setCurrentGame(null);
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
      setCurrentGame(game);
      console.log(game);
    } else {
      // TODO: implement join game error modal
      console.log(`Error joining game: ${error}`);
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

    return function cleanup() {
      if (ws) {
        ws.removeListener(IncomingAction.GET_ALL_GAMES);
        ws.removeListener(IncomingAction.GET_ALL_USERS);
        ws.removeListener(IncomingAction.SEND_MESSAGE);
        ws.removeListener(IncomingAction.CREATE_GAME);
        ws.removeListener(IncomingAction.GAME_UPDATE);
        ws.removeListener(IncomingAction.USER_UPDATE);
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
            <button type="button" onClick={() => requestJoinGame(game.gameId)} key={game.gameId}>
              {game.gameName}
            </button>
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

      <div className="margin-top-30">
        <SendMessageForm ws={ws} currentUser={currentUser} />
      </div>
      <div>
        <p>Messages</p>
        {messages.map(({ time, username, message }) => (
          <p key={time.toString()}>{`${time} ${username} ${message}`}</p>
        ))}
      </div>
      {currentGame && (
        <div className="modal background-color-primary margin-top-30">
          <GameLobby
            ws={ws}
            gameRef={currentGameRef}
            game={currentGame}
            setGame={setCurrentGame}
            removeGame={removeGameFromList}
          />
        </div>
      )}
    </div>
  );
};

export default LobbyPage;
