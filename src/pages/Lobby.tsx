import React, { useEffect, useState } from 'react';

import WebSocketConnection from '../modules/ws/websocket';
import OutgoingAction from '../modules/ws/outgoing_action';
import { UsersJSON, GamesJSON } from '../types';

import CreateGameForm from '../components/lobby/create_game';

type LobbyProps = {
  ws: WebSocketConnection | null;
};

const PLACEHOLDER_USERS = [{ username: 'user' }, { username: 'user1' }, { username: 'user2' }];
const PLACEHOLDER_GAMES = [{ game: 'game' }, { game: 'game1' }, { game: 'game2' }];

// TODO: allow client to use SEND_MESSAGE and listen in on messages

const LobbyPage = ({ ws }: LobbyProps): JSX.Element => {
  /**
   * States
   */
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [games, setGames] = useState<Record<string, unknown>[]>([]);

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

  useEffect(() => {
    if (ws) {
      ws.sendMessage(OutgoingAction.GET_ALL_GAMES, {});
      ws.sendMessage(OutgoingAction.GET_ALL_USERS, {});

      ws.addListener('GAMES', updateUsers);
      ws.addListener('USERS', updateGames);
    } else {
      // TODO: handling of client that has been disconnected from WS
    }

    setUsers(PLACEHOLDER_USERS);
    setGames(PLACEHOLDER_GAMES);

    return function cleanup() {
      if (ws) {
        ws.removeListener(OutgoingAction.GET_ALL_GAMES);
        ws.removeListener(OutgoingAction.GET_ALL_USERS);
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
    </div>
  );
};

export default LobbyPage;
