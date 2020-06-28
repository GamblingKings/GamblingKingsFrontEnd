import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import SpriteFactory from '../pixi/SpriteFactory';
import { WebSocketConnection, OutgoingAction, IncomingAction } from '../modules/ws';
import { GamePageLoadJSON, GameStartJSON } from '../types';

let pixiApplication: PIXI.Application;
let pixiLoader: PIXI.Loader;
let interactionManager: PIXI.InteractionManager;

let spriteFactory: SpriteFactory;

type GameProps = {
  ws: WebSocketConnection | null;
};

const GamePage = ({ ws }: GameProps): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);

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
    pixiApplication = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
    });
    if (canvasRef !== null && canvasRef.current !== null) {
      canvasRef.current.appendChild(pixiApplication.view);
    }
    interactionManager = pixiApplication.renderer.plugins.interaction;
    pixiLoader = pixiApplication.loader;
    console.log(interactionManager);

    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      if (ws) {
        ws.sendMessage(OutgoingAction.GAME_PAGE_LOAD, { success: true });
      }
      console.log(loader);
      spriteFactory = new SpriteFactory(resources);
      console.log(spriteFactory);
    }

    pixiLoader.add().load(setup);
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
