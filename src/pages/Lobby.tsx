import React, { useEffect, useState } from 'react';

import WebSocketConnection from '../modules/ws/websocket';
import OutgoingAction from '../modules/ws/outgoing_action';
import IncomingAction from '../modules/ws/incoming_action';
import { UsersJSON, GamesJSON, MessageJSON } from '../types';

import CreateGameForm from '../components/lobby/create_game';
import SendMessageForm from '../components/lobby/send_message';

type LobbyProps = {
  ws: WebSocketConnection | null;
};

const PLACEHOLDER_USERS = [{ username: 'user' }, { username: 'user1' }, { username: 'user2' }];
const PLACEHOLDER_GAMES = [{ game: 'game' }, { game: 'game1' }, { game: 'game2' }];

const LobbyPage = ({ ws }: LobbyProps): JSX.Element => {
  /**
   * States
   */
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [games, setGames] = useState<Record<string, unknown>[]>([]);

  const [messages, setMessages] = useState<string[]>([]);

  /**
   * Listener Callbacks.
   */
  const updateUsers = (payload: unknown) => {
    const data = payload as UsersJSON;
    const { users: newUsers } = data;
    setUsers(newUsers);
  };

  const updateGames = (payload: unknown) => {
    const data = payload as GamesJSON;
    const { games: newGames } = data;
    setGames(newGames);
  };

  const updateMessages = (payload: unknown) => {
    const data = payload as MessageJSON;
    const { message } = data;
    const newMessages = [...messages];
    newMessages.push(message);
    setMessages(newMessages);
  };

  useEffect(() => {
    if (ws) {
      ws.sendMessage(OutgoingAction.GET_ALL_GAMES, {});
      ws.sendMessage(OutgoingAction.GET_ALL_USERS, {});

      ws.addListener(IncomingAction.GET_ALL_USERS, updateUsers);
      ws.addListener(IncomingAction.GET_ALL_GAMES, updateGames);
      ws.addListener(IncomingAction.SEND_MESSAGE, updateMessages);
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
      }
    };
  }, [ws]);

  return (
    <div>
      <p>This is the lobby</p>
      <div>{users.map((user) => user.username)}</div>
      <div>{games.map((game) => game.game)}</div>

      <div>
        <CreateGameForm ws={ws} />
      </div>
      <div>
        <SendMessageForm ws={ws} />
      </div>
      <div>
        {messages.map((message) => (
          <p>{message}</p>
        ))}
      </div>
    </div>
  );
};

export default LobbyPage;
