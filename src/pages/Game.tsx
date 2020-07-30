import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { useHistory } from 'react-router-dom';
import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import RenderDirection from '../pixi/directions';
import { WebSocketConnection, OutgoingAction, IncomingAction } from '../modules/ws';
// can't satisfy eslint and prettier at the same time here
// eslint-disable-next-line object-curly-newline
import { GamePageLoadJSON, GameStartJSON, Game, CurrentUser, User } from '../types';
import GameTypes from '../modules/game/gameTypes';
import MahjongOpponent from '../modules/mahjong/MahjongOpponent/MahjongOpponent';
import MahjongPlayer from '../modules/mahjong/MahjongPlayer/MahjongPlayer';
import TileFactory from '../modules/mahjong/Tile/TileFactory';
import UserEntity from '../modules/game/UserEntity/UserEntity';
import Tile from '../modules/mahjong/Tile/Tile';

/**
 * Pixi Application References
 */
let pixiApplication: PIXI.Application;
let stage: PIXI.Container;
let pixiLoader: PIXI.Loader;
let interactionManager: PIXI.InteractionManager;
let spriteFactory: SpriteFactory;

/**
 * Player States
 */
let player: UserEntity;
let opponentOne: UserEntity;
let opponentTwo: UserEntity;
let opponentThree: UserEntity;

/**
 * Game States
 */
let redrawPending = false;

type GameProps = {
  ws: WebSocketConnection | null;
  currentUser: CurrentUser;
};

/**
 * Initialize the Player and Opponent Classes based on the users from currentGame
 * @param currentGame Game
 */
const playersInit = (currentGame: Game, pixiStage: PIXI.Container, currentUser: CurrentUser) => {
  const { users } = currentGame;

  const indexOfCurrentUser = users.findIndex((user: User) => user.username === currentUser.username);
  const opponents = [];
  const directions = [RenderDirection.LEFT, RenderDirection.TOP, RenderDirection.RIGHT];
  let currentIndex = indexOfCurrentUser + 1;
  for (let i = 0; i < users.length - 1; i += 1) {
    if (currentIndex >= users.length) {
      currentIndex = 0;
    }
    const opponent = new MahjongOpponent(users[currentIndex].username, users[currentIndex].connectionId, directions[i]);
    opponents.push(opponent);
    const opponentContainer = opponent.getContainer();
    pixiStage.addChild(opponentContainer);
    currentIndex += 1;
  }
  [opponentOne, opponentTwo, opponentThree] = [opponents[0], opponents[1], opponents[2]];
  player = new MahjongPlayer(currentUser.username, users[indexOfCurrentUser].connectionId);
};

/**
 * Game Page for main game
 */
const GamePage = ({ ws, currentUser }: GameProps): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);

  /**
   * Allows animate to redraw the canvas if there is a state change.
   */
  const requestRedraw = () => {
    redrawPending = false;
  };

  /**
   * Game reference is passed from GameLobby through history.push
   */
  const history = useHistory();
  const { state } = history.location;
  const { game } = state as { game: Game };

  /**
   * Main Animation loop
   */
  function animate() {
    if (!redrawPending) {
      redrawPending = true;
      stage.removeChildren(0, stage.children.length);

      const mahjongPlayer = player as MahjongPlayer;
      mahjongPlayer.removeAllAssets();
      mahjongPlayer.render(spriteFactory, stage, requestRedraw);
      mahjongPlayer.reposition(pixiApplication.view);

      const mahjongOpponentOne = opponentOne as MahjongOpponent;
      mahjongOpponentOne.removeAllAssets();
      mahjongOpponentOne.render(spriteFactory, stage);
      mahjongOpponentOne.reposition(pixiApplication.view);

      const mahjongOpponentTwo = opponentTwo as MahjongOpponent;
      mahjongOpponentTwo.removeAllAssets();
      mahjongOpponentTwo.render(spriteFactory, stage);
      mahjongOpponentTwo.reposition(pixiApplication.view);

      const mahjongOpponentThree = opponentThree as MahjongOpponent;
      mahjongOpponentThree.removeAllAssets();
      mahjongOpponentThree.render(spriteFactory, stage);
      mahjongOpponentThree.reposition(pixiApplication.view);

      pixiApplication.render();
    }
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
    stage = pixiApplication.stage;

    /**
     * Function setup invoked when assets are done loading
     */
    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>): void {
      console.log(loader);
      if (ws) {
        ws.sendMessage(OutgoingAction.GAME_PAGE_LOAD, { gameId: game.gameId });
      }
      playersInit(game, stage, currentUser);
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
    }

    return function cleanup() {
      if (ws) {
        ws.removeListener(IncomingAction.GAME_PAGE_LOAD);
        ws.removeListener(IncomingAction.GAME_START);
      }
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Listens for resizing of window
   */
  useEffect(() => {
    function handleResize() {
      opponentOne.reposition(pixiApplication.view);

      requestRedraw();
    }
    window.addEventListener('resize', handleResize);

    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  });

  return <div ref={canvasRef} />;
};

export default GamePage;
