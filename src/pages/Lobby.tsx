import React, { useEffect, useState } from 'react';
import WebSocketConnection from '../modules/ws/websocket';
import { UsersJSON, GamesJSON } from '../types';

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
    ws?.sendMessage('GAMES', {});
    ws?.sendMessage('USERS', {});

    ws?.addListener('GAMES', updateUsers);
    ws?.addListener('USERS', updateGames);
    setUsers(PLACEHOLDER_USERS);
    setGames(PLACEHOLDER_GAMES);
  }, [ws]);

  return (
    <div>
      <p>This is the lobby</p>
      <div>{users.map((user) => user.username)}</div>
      <div>{games.map((game) => game.game)}</div>
    </div>
  );
};

export default LobbyPage;
