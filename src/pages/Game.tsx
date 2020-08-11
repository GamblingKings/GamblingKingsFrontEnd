import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { useHistory } from 'react-router-dom';
import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import RenderDirection from '../pixi/directions';
import { WebSocketConnection, OutgoingAction, IncomingAction } from '../modules/ws';
import {
  GamePageLoadJSON,
  GameStartJSON,
  Game,
  CurrentUser,
  User,
  DrawTileJSON,
  PlayTileJSON,
  InteractionSuccessJSON,
  PlayedTileInteractionJSON,
} from '../types';
import GameTypes from '../modules/game/gameTypes';
import MahjongOpponent from '../modules/mahjong/MahjongOpponent/MahjongOpponent';
import MahjongPlayer from '../modules/mahjong/MahjongPlayer/MahjongPlayer';
import TileFactory from '../modules/mahjong/Tile/TileFactory';
import Tile from '../modules/mahjong/Tile/Tile';
import GameState from '../modules/game/GameState/GameState';
import MahjongGameState from '../modules/mahjong/MahjongGameState/MahjongGameState';

/**
 * Pixi Application References
 */
let pixiApplication: PIXI.Application;
let pixiLoader: PIXI.Loader;
let interactionManager: PIXI.InteractionManager;
let spriteFactory: SpriteFactory;

/**
 * Game State
 */
let gameState: GameState;

type GameProps = {
  ws: WebSocketConnection | null;
  currentUser: CurrentUser;
};

/**
 * Game Page for main game
 */
const GamePage = ({ ws, currentUser }: GameProps): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);

  /**
   * Game reference is passed from GameLobby through history.push
   */
  const history = useHistory();
  const { state } = history.location;
  const { game } = state as { game: Game };

  /**
   * Callbacks required for adding interaction to PIXI assets.
   */
  const wsCallbacks: Record<string, (...args: unknown[]) => void> = {
    [OutgoingAction.DRAW_TILE]: () => {
      ws?.sendMessage(OutgoingAction.DRAW_TILE, { gameId: game.gameId });
    },
    [OutgoingAction.PLAY_TILE]: (tile: unknown) => {
      ws?.sendMessage(OutgoingAction.PLAY_TILE, { gameId: game.gameId, tile });
      const mjGameState = gameState as MahjongGameState;
      mjGameState.requestRedraw();
    },
    [OutgoingAction.PLAYED_TILE_INTERACTION]: (params: unknown) => {
      const payload = params as Record<string, unknown>;
      ws?.sendMessage(OutgoingAction.PLAYED_TILE_INTERACTION, { gameId: game.gameId, ...payload });
    },
    REQUEST_REDRAW: () => {
      const mjGameState = gameState as MahjongGameState;
      mjGameState.requestRedraw();
    },
  };

  /**
   * Initialize the GameState
   * @param currentGame Game
   */
  const gameStateInit = (currentGame: Game) => {
    const { users } = currentGame;

    const indexOfCurrentUser = users.findIndex((user: User) => user.username === currentUser.username);
    const allUserEntities = [];
    const directions = [RenderDirection.LEFT, RenderDirection.TOP, RenderDirection.RIGHT];
    let currentIndex = indexOfCurrentUser + 1;
    for (let i = 0; i < users.length - 1; i += 1) {
      if (currentIndex >= users.length) {
        currentIndex = 0;
      }
      const opponent = new MahjongOpponent(
        users[currentIndex].username,
        users[currentIndex].connectionId,
        directions[i],
      );
      allUserEntities[currentIndex] = opponent;
      currentIndex += 1;
    }
    const player = new MahjongPlayer(currentUser.username, users[indexOfCurrentUser].connectionId);
    allUserEntities[indexOfCurrentUser] = player;
    gameState = new MahjongGameState(allUserEntities, player as MahjongPlayer, wsCallbacks);
  };

  /**
   * Main Animation loop
   */
  function animate() {
    const mjGameState = gameState as MahjongGameState;
    mjGameState.renderCanvas(spriteFactory, pixiApplication);
    requestAnimationFrame(animate);
  }

  /**
   * Listener Callbacks
   */

  /**
   * For GAME_PAGE_LOAD
   * @param payload GamePageLoadJSON
   */
  const confirmGamePageLoadReceived = (payload: unknown): void => {
    const data = payload as GamePageLoadJSON;
    const { success, error } = data;
    if (success) {
      ws?.removeListener(IncomingAction.GAME_PAGE_LOAD);
    } else {
      console.log(`Error processing GAME_PAGE_LOAD: ${error}`);
      ws?.sendMessage(OutgoingAction.GAME_PAGE_LOAD, { gameId: game.gameId });
    }
  };

  /**
   * For GAME_START
   * @param payload GameStartJSON
   */
  const gameStartInit = (payload: unknown): void => {
    const data = payload as GameStartJSON;
    const tileArray = JSON.parse(data.tiles);
    const tiles: Tile[] = [];
    tileArray.forEach((tile: string) => {
      tiles.push(TileFactory.createTileFromStringDef(tile));
    });
    const mjGameState = gameState as MahjongGameState;

    const mjPlayer = mjGameState.getMjPlayer();
    mjPlayer.setHand(tiles);

    const readyToGo = mjGameState.startRound();

    if (!readyToGo) {
      console.error('Game start error. Verify the game state.');
    }

    animate();
  };

  /**
   * For DRAW_TILE
   * @param payload DrawTileJSON
   */
  const mjGameDrawTile = (payload: unknown): void => {
    const data = payload as DrawTileJSON;
    const tile = TileFactory.createTileFromStringDef(data.tile);

    const mjGameState = gameState as MahjongGameState;
    const mjPlayer = mjGameState.getMjPlayer();

    mjPlayer.addTileToHand(tile);
    mjGameState.requestRedraw();
  };

  /**
   * For PLAY_TILE
   * @param payload PlayTileJSON
   */
  const mjGamePlayTile = (payload: unknown): void => {
    const data = payload as PlayTileJSON;
    const tile = TileFactory.createTileFromStringDef(data.tile);
    const mjGameState = gameState as MahjongGameState;
    mjGameState.getDeadPile().add(tile);

    const mjPlayer = mjGameState.getMjPlayer();

    // Ask for interaction if player was not the one who played tile
    if (data.connectionId !== mjPlayer.getConnectionId()) {
      const users = mjGameState.getUsers();
      // Change state that the opponent has played a tile.
      const opponentIndex = users.findIndex((user) => user.getConnectionId() === data.connectionId);
      if (opponentIndex !== -1) {
        const opponent = users[opponentIndex] as MahjongOpponent;
        opponent.playedTile();
      } else {
        console.error('Game state error. Desync is likely to happen.');
      }

      mjPlayer.setAllowInteraction(true);
      // TODO: (NextPR) set timeout, if nothing happens, send skip
    } else {
      // TODO (NextPR): Display msg to player who played tile to wait while others make decision
    }
    mjGameState.requestRedraw();
  };

  /**
   * For PLAYED_TILE_INTERACTION
   * @param payload PlayedTileInteraction
   */
  const mjPlayedTileInteraction = (payload: unknown): void => {
    const data = payload as PlayedTileInteractionJSON;
    // eslint-disable-next-line object-curly-newline
    const { playedTiles, skipInteraction, meldType, success } = data;
    // If there was an error with processing PLAYED_TILE_INTERACTION, resend message
    if (!success) {
      ws?.sendMessage(OutgoingAction.PLAYED_TILE_INTERACTION, {
        playedTiles,
        skipInteraction,
        meldType,
        gameId: game.gameId,
      });
    }
  };

  /**
   * For INTERACTION_SUCCESS
   * @param payload InteractionSuccessJSON
   */
  const mjInteractionSuccess = (payload: unknown): void => {
    const data = payload as InteractionSuccessJSON;
    const mjGameState = gameState as MahjongGameState;
    const mjPlayer = mjGameState.getMjPlayer();

    if (data.skipInteraction) {
      // If everybody skips, game can proceed normally
      mjGameState.goToNextTurn();

      const userIndex = mjGameState.getCurrentTurn();
      const currentUserEntity = mjGameState.getUsers()[userIndex];

      // If it's user's turn, player can draw tile
      if (currentUserEntity.getConnectionId() === mjPlayer.getConnectionId()) {
        ws?.sendMessage(OutgoingAction.DRAW_TILE, { gameId: game.gameId });
      } else {
        // Change state that opponent will draw a tile
        const opponent = currentUserEntity as MahjongOpponent;
        opponent.drawTile();
      }
    } else {
      const { connectionId, playedTiles, meldType } = data;

      if (connectionId && playedTiles && meldType) {
        const tiles = playedTiles.map((tileStr) => TileFactory.createTileFromStringDef(tileStr));
        const userIndex = mjGameState.getUsers().findIndex((user) => user.getConnectionId() === connectionId);
        if (connectionId === mjPlayer.getConnectionId()) {
          // Player updates their PlayedTiles
          mjPlayer.getHand().addPlayedTiles(tiles);

          // TODO (NextPR): remove played tiles from player hand

          mjPlayer.getHand().setMadeMeld(true);
        } else {
          // Opponent update playedTiles
          const opponent = mjGameState.getUsers()[userIndex] as MahjongOpponent;
          opponent.getHand().addPlayedTiles(tiles);
        }
        // Set turn to the person who interacted successfully
        mjGameState.setTurn(userIndex);
      }
      // Remove last tile from deadpile
      mjGameState.getDeadPile().removeLastTile();
    }

    mjGameState.requestRedraw();
  };

  // Set up PIXI application.
  useEffect(() => {
    /**
     * Launches PIXI Application
     */
    pixiApplication = new PIXI.Application({
      width: canvasRef.current?.clientWidth,
      height: canvasRef.current?.clientHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
      resizeTo: window,
    });
    /**
     * Attaches PixiJS view to HTML canvas element
     */
    if (canvasRef !== null && canvasRef.current !== null) {
      canvasRef.current.appendChild(pixiApplication.view);
    }
    /**
     * Save application managers for reference
     */
    interactionManager = pixiApplication.renderer.plugins.interaction;
    pixiLoader = pixiApplication.loader;
    console.log(interactionManager);

    /**
     * Function setup invoked when assets are done loading
     */
    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>): void {
      console.log(loader);
      if (ws) {
        ws.sendMessage(OutgoingAction.GAME_PAGE_LOAD, { gameId: game.gameId });
      }
      gameStateInit(game);
      /**
       * Load resources (images) into Sprite Factory
       */
      spriteFactory = new SpriteFactory(resources);
    }
    const images = imageInit(game.gameType as GameTypes);
    pixiLoader.add(images).load(setup);
    // eslint-disable-next-line
  }, []);

  /**
   * Setup WS listeners
   */
  useEffect(() => {
    if (ws) {
      ws.addListener(IncomingAction.GAME_PAGE_LOAD, confirmGamePageLoadReceived);
      ws.addListener(IncomingAction.GAME_START, gameStartInit);
      ws.addListener(IncomingAction.DRAW_TILE, mjGameDrawTile);
      ws.addListener(IncomingAction.PLAY_TILE, mjGamePlayTile);
      ws.addListener(IncomingAction.INTERACTION_SUCCESS, mjInteractionSuccess);
      ws.addListener(IncomingAction.PLAYED_TILE_INTERACTION, mjPlayedTileInteraction);
    }

    return function cleanup() {
      if (ws) {
        ws.removeListener(IncomingAction.GAME_PAGE_LOAD);
        ws.removeListener(IncomingAction.GAME_START);
        ws.removeListener(IncomingAction.DRAW_TILE);
        ws.removeListener(IncomingAction.PLAY_TILE);
        ws.removeListener(IncomingAction.INTERACTION_SUCCESS);
        ws.removeListener(IncomingAction.PLAYED_TILE_INTERACTION);
      }
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Listens for resizing of window
   */
  useEffect(() => {
    function handleResize() {
      const mjGameState = gameState as MahjongGameState;
      mjGameState.requestRedraw();
    }
    window.addEventListener('resize', handleResize);

    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  });

  return <div ref={canvasRef} />;
};

export default GamePage;
