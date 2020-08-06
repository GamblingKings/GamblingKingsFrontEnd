import React from 'react';
import Button from '@material-ui/core/Button';

type GameRowProps = {
  gameId: string;
  onClickHandler: (gameId: string) => void;
  roomName: string;
};

const GameRow = ({ onClickHandler, roomName, gameId }: GameRowProps): JSX.Element => (
  <div className="flex-row justify-content-space-between align-items-center padding-20 border-color-black border-radius-10 margin-10">
    <p className="font-size-1rem align-self">
      Room:
      {roomName}
    </p>
    <Button variant="contained" color="primary" onClick={() => onClickHandler(gameId)}>
      Join Room
    </Button>
  </div>
);

export default GameRow;
