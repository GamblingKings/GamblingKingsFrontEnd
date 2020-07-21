import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useHistory } from 'react-router-dom';
import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import { WebSocketConnection, OutgoingAction, IncomingAction } from '../modules/ws';
import { GamePageLoadJSON, GameStartJSON, Game } from '../types';
import GameTypes from '../modules/game/gameTypes';
import Player from '../modules/game/Player/Player';
import Opponent from '../modules/game/Opponent/Opponent';
import MahjongOpponent from '../modules/mahjong/MahjongOpponent/MahjongOpponent';
import MahjongPlayer from '../modules/mahjong/MahjongPlayer/MahjongPlayer';

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
let player: Player;
let opponentOne: Opponent;
let opponentTwo: Opponent;
let opponentThree: Opponent;

type GameProps = {
  ws: WebSocketConnection | null;
};

/**
 * Game Page for main game
 */
const GamePage = ({ ws }: GameProps): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [redrawPending, setRedrawPending] = useState(false);

  /**
   * Allows animate to redraw the canvas if there is a state change.
   */
  const requestRedraw = () => {
    setRedrawPending(false);
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
      setRedrawPending(true);
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
      ws?.sendMessage(OutgoingAction.GAME_PAGE_LOAD, { success: true });
    }
  };

  /**
   * For GAME_START
   * @param payload GameStartJSON
   */
  const gameStartInit = (payload: unknown): void => {
    const data = payload as GameStartJSON;
    console.log(data);

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
    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      console.log(loader);
      if (ws) {
        ws.sendMessage(OutgoingAction.GAME_PAGE_LOAD, { success: true });
      }

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
