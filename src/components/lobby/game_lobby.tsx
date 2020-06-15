import React from 'react';
import { WebSocketConnection, Game } from '../../types';
import OutgoingAction from '../../modules/ws/outgoing_action';

type GameLobbyProps = {
  ws?: WebSocketConnection | null;
  game: Game | null;
};

const GameLobby = ({ ws, game }: GameLobbyProps): JSX.Element => {
  const requestLeaveGame = () => {
    if (ws && game) {
      ws.sendMessage(OutgoingAction.LEAVE_GAME, { gameId: game.gameId });
    }
  };

  return (
    <div>
      <p>Game Lobby</p>
      <button type="button" onClick={requestLeaveGame}>
        Leave Game
      </button>
    </div>
  );
};

export default GameLobby;
