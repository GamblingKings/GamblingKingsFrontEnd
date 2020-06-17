/* eslint-disable object-curly-newline */
import React, { useState, useRef, useEffect } from 'react';
import { Game, Message, InGameMessageJSON, InGameUpdateJSON, StartGameJSON } from '../../types';
import { WebSocketConnection, IncomingAction, OutgoingAction } from '../../modules/ws';

type GameLobbyProps = {
  ws?: WebSocketConnection | null;
  game: Game | null;
  gameRef: React.MutableRefObject<unknown>;
  setGame: React.Dispatch<React.SetStateAction<Game | null>>;
};

// TODO: only host can see the start game button.

/**
 * GameLobby is a Component that holds users before the game actually starts.
 * Users can send messages to other users in the same game, and can leave the game.
 * Only the host can start the game.
 */
const GameLobby = ({ ws, game, gameRef, setGame }: GameLobbyProps): JSX.Element => {
  /**
   * Hook that holds a reference to a state.
   * Used in WebSocket callbacks as initialized callbacks do not have updated reference to state.
   * @param state unknown
   * @return React.MutableRefObject
   */
  function useStateRef(state: unknown) {
    const stateRef = useRef(state);
    useEffect(() => {
      stateRef.current = state;
    });
    return stateRef;
  }

  /**
   * States
   */
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useStateRef(messages);

  /**
   * Send message to backend to leave game
   */
  const requestLeaveGame = () => {
    if (ws && game) {
      ws.sendMessage(OutgoingAction.LEAVE_GAME, { gameId: game.gameId });
    }
  };

  /**
   * Send message to backend to start game
   */
  const requestStartGame = () => {
    if (ws && game) {
      const payload = {
        gameId: game.gameId,
      };
      ws.sendMessage(OutgoingAction.START_GAME, payload);
    }
  };

  /**
   * Listener Callbacks
   */

  /**
   * For IN_GAME_MESSAGE
   * @param payload InGameMessageJSON
   */
  const updateMessage = (payload: unknown): void => {
    const data = payload as InGameMessageJSON;
    const originalMessages = messagesRef.current as Message[];
    const newMessages = [...originalMessages];
    newMessages.push(data);
    setMessages(newMessages);
  };

  /**
   * For IN_GAME_UPDATE
   * @param payload InGameUpdateJSON
   */
  const updateGame = (payload: unknown): void => {
    const data = payload as InGameUpdateJSON;
    const { users } = data;
    const originalGame = gameRef.current as Game;
    const newGame = { ...originalGame };
    newGame.users = users;
    setGame(newGame);
  };

  /**
   * For START_GAME
   * @param payload StartGameJSON
   */
  const startGame = (payload: unknown): void => {
    const { success, error } = payload as StartGameJSON;
    if (success) {
      console.log('start game');
    } else {
      console.log(`Error in starting game: ${error}`);
    }
  };

  useEffect(() => {
    if (ws) {
      ws.addListener(IncomingAction.IN_GAME_MESSAGE, updateMessage);
      ws.addListener(IncomingAction.IN_GAME_UPDATE, updateGame);
      ws.addListener(IncomingAction.START_GAME, startGame);
    }
    return function cleanup() {
      if (ws) {
        ws.removeListener(IncomingAction.IN_GAME_MESSAGE);
        ws.removeListener(IncomingAction.IN_GAME_UPDATE);
        ws.removeListener(IncomingAction.START_GAME);
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <p>Game Lobby</p>
      <button type="button" onClick={requestLeaveGame}>
        Leave Game
      </button>
      <button type="button" onClick={requestStartGame}>
        Start Game
      </button>
      <div>
        <p>Users</p>
        {game && game.users.map((user) => <p key={user.connectionId}>{user.username}</p>)}
      </div>
      <div>
        {messages.map(({ message, username, time }) => (
          <p>{`${time} ${username} ${message}`}</p>
        ))}
      </div>
    </div>
  );
};

export default GameLobby;
