import React, { useState } from 'react';
import { WebSocketConnection } from '../../types';

import GameTypes from '../../modules/game/gameTypes';

type CreateGameFormProps = {
  ws?: WebSocketConnection | null;
};

const CreateGameForm = ({ ws }: CreateGameFormProps): JSX.Element => {
  /**
   * States.
   */
  const [gameName, setGameName] = useState<string>('');
  const [gameType, setGameType] = useState<string>(GameTypes.Mahjong);

  /**
   * State Handlers.
   */
  const handleSetGameName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  };

  const handleSetGameType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGameType(event.target.value);
  };

  /**
   * Create Game Function
   */
  const createGame = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();

    const payload = {
      gameName,
      gameType,
    };
    console.log(payload);
    if (ws) {
      ws.sendMessage('CREATE_GAME', payload);
    } else {
      // TODO: handling of client that has been disconnected from WS
    }
  };

  return (
    <div>
      <p>Create Game</p>
      <form>
        <input value={gameName} onChange={handleSetGameName} placeholder="Enter a game name." />
        <select value={gameType} onChange={handleSetGameType}>
          {Object.keys(GameTypes).map((game) => (
            <option value={game} key={game}>
              {game}
            </option>
          ))}
        </select>
        <input type="submit" onClick={createGame} value="Create" />
      </form>
    </div>
  );
};

export default CreateGameForm;
