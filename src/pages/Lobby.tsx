import React, { useEffect, useState } from 'react';
import WebSocketConnection from '../modules/ws/websocket';

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

  const updateUsers = () => {
    // setUsers(newUsers);
  };

  useEffect(() => {
    ws?.sendMessage('GAMES', {});
    ws?.sendMessage('USERS', {});

    ws?.addListener('GAMES', updateUsers);
    ws?.addListener('USERS', () => {});
    setUsers(PLACEHOLDER_USERS);
    setGames(PLACEHOLDER_GAMES);
  }, []);

  console.log(ws);
  return (
    <div>
      <p>This is the lobby</p>
      <div>{Object.keys(users).map((user) => user)}</div>
      <div>{games.map((game) => game)}</div>
    </div>
  );
};

export default LobbyPage;
