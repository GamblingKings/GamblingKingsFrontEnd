import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { useHistory } from 'react-router-dom';
import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import { WebSocketConnection, OutgoingAction, IncomingAction } from '../modules/ws';
import { GamePageLoadJSON, GameStartJSON, Game } from '../types';
import GameTypes from '../modules/game/gameTypes';

let pixiApplication: PIXI.Application;
let stage: PIXI.Container;
let pixiLoader: PIXI.Loader;
let interactionManager: PIXI.InteractionManager;

let spriteFactory: SpriteFactory;
let playerContainer: PIXI.Container;
let opponentOneContainer: PIXI.Container;
let opponentTwoContainer: PIXI.Container;
let opponentThreeContainer: PIXI.Container;

type GameProps = {
  ws: WebSocketConnection | null;
};

/**
 * Initialize the Containers containing assets related to Player and Opponent
 */
const containersInit = () => {
  playerContainer = new PIXI.Container();
  opponentOneContainer = new PIXI.Container();
  opponentTwoContainer = new PIXI.Container();
  opponentThreeContainer = new PIXI.Container();

  stage.addChild(playerContainer);
  stage.addChild(opponentOneContainer);
  stage.addChild(opponentTwoContainer);
  stage.addChild(opponentThreeContainer);
};

/**
 * Place the containers relative to how big the canvas is
 * @param canvasRef reference to the canvas element
 */
const placeContainers = (canvasRef: HTMLCanvasElement) => {
  // Hardcoded placements, will fix
  playerContainer.x = 100;
  playerContainer.y = canvasRef.clientHeight - 120;
  opponentOneContainer.x = 50;
  opponentOneContainer.y = 80;
  opponentTwoContainer.x = 200;
  opponentTwoContainer.y = 80;
  opponentThreeContainer.x = canvasRef.clientWidth - 120;
  opponentThreeContainer.y = 80;
};

const GamePage = ({ ws }: GameProps): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const { state } = history.location;
  const { game } = state as { game: Game };
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

    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      console.log(loader);
      if (ws) {
        ws.sendMessage(OutgoingAction.GAME_PAGE_LOAD, { success: true });
      }

      /**
       * Load resources (images) into Sprite Factory
       */
      spriteFactory = new SpriteFactory(resources);
      console.log(spriteFactory);
      containersInit();
      placeContainers(pixiApplication.view);
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
    // eslint-disable-next-line
  }, []);

  return <div ref={canvasRef} />;
};

export default GamePage;
