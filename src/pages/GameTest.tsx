import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import GameTypes from '../modules/game/gameTypes';
import MahjongVersions from '../modules/mahjong/Wall/version/Versions';

import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import HongKongWall from '../modules/mahjong/Wall/version/HongKongWall';
import Hand from '../modules/mahjong/Hand/Hand';
import Renderer from '../pixi/Renderer';

let pixiApplication: PIXI.Application;
let pixiLoader: PIXI.Loader;
let interactionManager: PIXI.InteractionManager;

const STARTING_GAME = {
  gameType: GameTypes.Mahjong,
  gameVersion: MahjongVersions.HongKong,
};

const w = new HongKongWall();
const DEFAULT_WEIGHTS = Hand.generateHandWeights();
const h1 = new Hand(w, DEFAULT_WEIGHTS);
console.log(h1.getHand());

let spriteFactory: SpriteFactory;
let playerContainer: PIXI.Container;
let opponentOneContainer: PIXI.Container;
let opponentTwoContainer: PIXI.Container;
let opponentThreeContainer: PIXI.Container;

const GameTestPage = (): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);

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
    // Use default Interaction Manager
    interactionManager = pixiApplication.renderer.plugins.interaction;
    pixiLoader = pixiApplication.loader;
    console.log(interactionManager);

    function animate() {
      requestAnimationFrame(animate);
      pixiApplication.render();
    }

    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      console.log(loader);
      spriteFactory = new SpriteFactory(resources);

      playerContainer = new PIXI.Container();
      opponentOneContainer = new PIXI.Container();
      opponentTwoContainer = new PIXI.Container();
      opponentThreeContainer = new PIXI.Container();
      pixiApplication.stage.addChild(playerContainer);
      pixiApplication.stage.addChild(opponentOneContainer);
      pixiApplication.stage.addChild(opponentTwoContainer);
      pixiApplication.stage.addChild(opponentThreeContainer);
      playerContainer.y = 475;
      opponentOneContainer.y = 100;
      opponentTwoContainer.y = 225;
      opponentThreeContainer.y = 350;
      // opponentOneContainer.pivot.x = opponentOneContainer.width / 2;
      // opponentOneContainer.pivot.y = opponentOneContainer.height / 2;
      // opponentOneContainer.x = 100;
      // opponentOneContainer.angle -= 270;
      Renderer.renderMahjongHand(spriteFactory, playerContainer, h1);
      Renderer.renderOpponentMahjongHand(spriteFactory, opponentOneContainer, 13);
      Renderer.renderOpponentMahjongHand(spriteFactory, opponentTwoContainer, 13);
      Renderer.renderOpponentMahjongHand(spriteFactory, opponentThreeContainer, 13);

      animate();
    }

    const images = imageInit(STARTING_GAME.gameType);
    pixiLoader.add(images).load(setup);
  }, []);

  return <div ref={canvasRef} />;
};

export default GameTestPage;
