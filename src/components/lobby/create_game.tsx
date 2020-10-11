/* eslint-disable operator-linebreak */
import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { makeStyles } from '@material-ui/core/styles';
import { WebSocketConnection, OutgoingAction, PayloadCreator } from '../../modules/ws';
import GameTypes from '../../modules/game/gameTypes';
import MahjongVersions from '../../modules/mahjong/enums/VersionsEnum';
import BigTwoVersions from '../../modules/bigtwo/versions';

type CreateGameFormProps = {
  ws?: WebSocketConnection | null;
  toggleOff: () => void;
};

const useStyles = makeStyles((theme) => ({
  marginRight: {
    marginRight: '20px',
  },
  input: {},
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

/**
 * Form component used to send a request to WebSocket API to create a game.
 */
const CreateGameForm = ({ ws, toggleOff }: CreateGameFormProps): JSX.Element => {
  /**
   * States.
   */
  const [gameName, setGameName] = useState<string>('');
  const [gameType, setGameType] = useState<string>(GameTypes.Mahjong);
  const [gameVersion, setGameVersion] = useState<string>(MahjongVersions.HongKong);

  /**
   * State Handlers.
   */
  const handleSetGameName = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGameName(event.target.value as string);
  };

  const handleSetGameType = (event: React.ChangeEvent<{ value: unknown }>) => {
    const specifiedGameType = event.target.value as string;
    setGameType(specifiedGameType);
    if (specifiedGameType === GameTypes.Mahjong) {
      setGameVersion(MahjongVersions.HongKong);
    }
    if (specifiedGameType === GameTypes.BigTwo) {
      setGameVersion(BigTwoVersions.Chinese);
    }
  };

  const handleSetGameVersion = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGameVersion(event.target.value as string);
  };

  /**
   * Create Game Function
   */
  const createGame = (): void => {
    const payload = PayloadCreator.createGamePayload(gameName, gameType, gameVersion);
    if (ws) {
      ws.sendMessage(OutgoingAction.CREATE_GAME, payload);
    } else {
      // TODO: handling of client that has been disconnected from WS
    }
  };

  const classes = useStyles();

  return (
    <div className="modal">
      <div className="center-modal background-color-white margin-top-30 border-radius-10">
        <div className="flex-column justify-content-center align-items-center padding-20">
          <h2 className="text-align-center margin-bottom-30">Create Game</h2>
          <Input
            classes={{ root: classes.input }}
            placeholder="Enter a Game Name"
            defaultValue={gameName}
            onChange={handleSetGameName}
          />

          <FormControl className={classes.formControl}>
            <InputLabel>Game</InputLabel>
            <Select value={gameType} onChange={handleSetGameType}>
              {Object.keys(GameTypes).map((game) => (
                <MenuItem value={game} key={game}>
                  {game}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel>Game Verson</InputLabel>
            <Select value={gameVersion} onChange={handleSetGameVersion}>
              {gameType === GameTypes.Mahjong &&
                Object.keys(MahjongVersions).map((version) => (
                  <MenuItem value={version} key={version}>
                    {version}
                  </MenuItem>
                ))}
              {gameType === GameTypes.BigTwo &&
                Object.keys(BigTwoVersions).map((version) => (
                  <MenuItem value={version} key={version}>
                    {version}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <div className="flex-row justify-content-center align-items-center margin-top-20">
            <Button classes={{ root: classes.marginRight }} variant="contained" color="primary" onClick={createGame}>
              Create
            </Button>
            <Button variant="contained" color="secondary" onClick={toggleOff}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGameForm;
