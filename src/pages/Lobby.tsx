/* eslint-disable object-curly-newline */
import React, { useEffect, useState } from 'react';

import WebSocketConnection from '../modules/ws/websocket';
import OutgoingAction from '../modules/ws/outgoing_action';
import IncomingAction from '../modules/ws/incoming_action';
import { UsersJSON, GamesJSON, MessageJSON, CurrentUser, User, Game } from '../types';

import CreateGameForm from '../components/lobby/create_game';
import SendMessageForm from '../components/lobby/send_message';

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
   * States
   */
  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const [messages, setMessages] = useState<string[]>([]);

  /**
   * Listener Callbacks.
   */
  const updateUsers = (payload: unknown): void => {
    const data = payload as UsersJSON;
    console.log(data);
    const { users: newUsers } = data;
    setUsers(newUsers);
  };

  const updateGames = (payload: unknown): void => {
    const data = payload as GamesJSON;
    console.log(data);
    const { games: newGames } = data;
    setGames(newGames);
  };

  const updateMessages = (payload: unknown): void => {
    const data = payload as MessageJSON;
    const { message } = data;
    const newMessages = [...messages];
    newMessages.push(message);
    setMessages(newMessages);
  };

  const createdGame = (payload: unknown): void => {
    // TODO: act on when game is created
    console.log(payload);
  };

  useEffect(() => {
    if (ws) {
      const addListeners = [
        ws.addListener(IncomingAction.GET_ALL_USERS, updateUsers),
        ws.addListener(IncomingAction.GET_ALL_GAMES, updateGames),
        ws.addListener(IncomingAction.SEND_MESSAGE, updateMessages),
        ws.addListener(IncomingAction.CREATE_GAME, createdGame),
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
      }
    };
  }, [ws]);

  return (
    <div>
      <div className="border-color-black">
        <p>Users</p>
        {users.map((user) => (
          <p key={user.connectionId}>{user.username}</p>
        ))}
      </div>
      <div className="border-color-black">
        <p>Games</p>
        {games.map((game) => (
          <p key={game.gameId}>{game.gameName}</p>
        ))}
      </div>

      <div>
        <CreateGameForm ws={ws} />
      </div>
      <div>
        <SendMessageForm ws={ws} />
      </div>
      <div>
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
    </div>
  );
};

export default LobbyPage;
