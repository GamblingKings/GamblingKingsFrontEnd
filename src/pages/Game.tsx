import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { useHistory } from 'react-router-dom';
import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import RenderDirection from '../pixi/directions';
import { WebSocketConnection, OutgoingAction, IncomingAction } from '../modules/ws';
// can't satisfy eslint and prettier at the same time here
// eslint-disable-next-line object-curly-newline
import { GamePageLoadJSON, GameStartJSON, Game, CurrentUser, User, DrawTileJSON, PlayTileJSON } from '../types';
import GameTypes from '../modules/game/gameTypes';
import MahjongOpponent from '../modules/mahjong/MahjongOpponent/MahjongOpponent';
import MahjongPlayer from '../modules/mahjong/MahjongPlayer/MahjongPlayer';
import TileFactory from '../modules/mahjong/Tile/TileFactory';
import UserEntity from '../modules/game/UserEntity/UserEntity';
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
 * Player State
 */
let player: UserEntity;

/**
 * Game States
 */
let gameState: GameState;

type GameProps = {
  ws: WebSocketConnection | null;
  currentUser: CurrentUser;
};

/**
 * Initialize the GameState
 * @param currentGame Game
 */
const gameStateInit = (currentGame: Game, currentUser: CurrentUser) => {
  const { users } = currentGame;

  const indexOfCurrentUser = users.findIndex((user: User) => user.username === currentUser.username);
  const allUserEntities = [];
  const directions = [RenderDirection.LEFT, RenderDirection.TOP, RenderDirection.RIGHT];
  let currentIndex = indexOfCurrentUser + 1;
  for (let i = 0; i < users.length - 1; i += 1) {
    if (currentIndex >= users.length) {
      currentIndex = 0;
    }
    const opponent = new MahjongOpponent(users[currentIndex].username, users[currentIndex].connectionId, directions[i]);
    allUserEntities[currentIndex] = opponent;
    currentIndex += 1;
  }
  player = new MahjongPlayer(currentUser.username, users[indexOfCurrentUser].connectionId);
  allUserEntities[indexOfCurrentUser] = player;
  gameState = new MahjongGameState(allUserEntities);
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
    [OutgoingAction.PLAY_TILE]: (tile: unknown) => {
      ws?.sendMessage(OutgoingAction.PLAY_TILE, { game: game.gameId, tile });
      const mjGameState = gameState as MahjongGameState;
      mjGameState.requestRedraw();
    },
  };

  /**
   * Main Animation loop
   */
  function animate() {
    const mjGameState = gameState as MahjongGameState;
    mjGameState.renderCanvas(spriteFactory, wsCallbacks, pixiApplication);
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

    const mjPlayer = player as MahjongPlayer;
    mjPlayer.setHand(tiles);

    animate();
  };

  /**
   * For DRAW_TILE
   * @param payload DrawTileJSON
   */
  const mjGameDrawTile = (payload: unknown): void => {
    const data = payload as DrawTileJSON;
    const tile = TileFactory.createTileFromStringDef(data.tile);
    const mjPlayer = player as MahjongPlayer;
    mjPlayer.addTileToHand(tile);
  };

  const mjGamePlayTile = (payload: unknown): void => {
    const data = payload as PlayTileJSON;
    const tile = TileFactory.createTileFromStringDef(data.tile);
    const mjGameState = gameState as MahjongGameState;
    mjGameState.getDeadPile().add(tile);
    // add validation of whether other players want to interact
    // for now, change turn
    mjGameState.goToNextTurn();
    console.log(data.user); // connectionId
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
      gameStateInit(game, currentUser);
      /**
       * Load resources (images) into Sprite Factory
       */
      spriteFactory = new SpriteFactory(resources);
    }
    const images = imageInit(game.gameType as GameTypes);
    pixiLoader.add(images).load(setup);
    // eslint-disable-next-line
  }, []);

  // Setup WS Listeners
  useEffect(() => {
    if (ws) {
      ws.addListener(IncomingAction.GAME_PAGE_LOAD, confirmGamePageLoadReceived);
      ws.addListener(IncomingAction.GAME_START, gameStartInit);
      ws.addListener(IncomingAction.DRAW_TILE, mjGameDrawTile);
      ws.addListener(IncomingAction.PLAY_TILE, mjGamePlayTile);
    }

    return function cleanup() {
      if (ws) {
        ws.removeListener(IncomingAction.GAME_PAGE_LOAD);
        ws.removeListener(IncomingAction.GAME_START);
        ws.removeListener(IncomingAction.DRAW_TILE);
        ws.removeListener(IncomingAction.PLAY_TILE);
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
