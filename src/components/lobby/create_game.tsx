/* eslint-disable operator-linebreak */
import React, { useState } from 'react';
import { WebSocketConnection } from '../../types';

import GameTypes from '../../modules/game/gameTypes';
import OutgoingAction from '../../modules/ws/outgoing_action';
import MahjongVersions from '../../modules/mahjong/versions';
import BigTwoVersions from '../../modules/bigtwo/versions';

type CreateGameFormProps = {
  ws?: WebSocketConnection | null;
};

/**
 * Form component used to send a request to WebSocket API to create a game.
 */
const CreateGameForm = ({ ws }: CreateGameFormProps): JSX.Element => {
  /**
   * States.
   */
  const [gameName, setGameName] = useState<string>('');
  const [gameType, setGameType] = useState<string>(GameTypes.Mahjong);
  const [gameVersion, setGameVersion] = useState<string>(MahjongVersions.HongKong);

  /**
   * State Handlers.
   */
  const handleSetGameName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  };

  const handleSetGameType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const specifiedGameType = event.target.value as string;
    setGameType(specifiedGameType);
    if (specifiedGameType === GameTypes.Mahjong) {
      setGameVersion(MahjongVersions.HongKong);
    }
    if (specifiedGameType === GameTypes.BigTwo) {
      setGameVersion(BigTwoVersions.Chinese);
    }
  };

  const handleSetGameVersion = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGameVersion(event.target.value);
  };

  /**
   * Create Game Function
   */
  const createGame = (event: React.FormEvent<HTMLInputElement>): void => {
    event.preventDefault();

    const payload = {
      game: {
        gameName,
        gameType,
        gameVersion,
      },
    };
    console.log(payload);
    if (ws) {
      ws.sendMessage(OutgoingAction.CREATE_GAME, payload);
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
        <select value={gameVersion} onChange={handleSetGameVersion}>
          {gameType === GameTypes.Mahjong &&
            Object.keys(MahjongVersions).map((version) => (
              <option value={version} key={version}>
                {version}
              </option>
            ))}
          {gameType === GameTypes.BigTwo &&
            Object.keys(BigTwoVersions).map((version) => (
              <option value={version} key={version}>
                {version}
              </option>
            ))}
        </select>

        <input type="submit" onClick={createGame} value="Create" />
      </form>
    </div>
  );
};

export default CreateGameForm;
