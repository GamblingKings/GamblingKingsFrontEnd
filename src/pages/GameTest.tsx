import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import GameTypes from '../modules/game/gameTypes';
import MahjongVersions from '../modules/mahjong/Wall/version/Versions';

import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import HongKongWall from '../modules/mahjong/Wall/version/HongKongWall';
import Hand from '../modules/mahjong/Hand/Hand';
import Renderer from '../pixi/Renderer';
// import TileFactory from '../modules/mahjong/Tile/TileFactory';

let pixiApplication: PIXI.Application;
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
const playerContainer = new PIXI.Container();
console.log(playerContainer);

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
    console.log(interactionManager);

    function animate() {
      requestAnimationFrame(animate);
      pixiApplication.render();
    }

    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      spriteFactory = new SpriteFactory(resources);
      pixiApplication.stage.addChild(playerContainer);
      playerContainer.y = 200;
      Renderer.renderMahjongHand(spriteFactory, playerContainer, h1);

      console.log(loader);
      animate();
    }

    const images = imageInit(STARTING_GAME.gameType);
    pixiApplication.loader.add(images).load(setup);
  }, []);

  return <div ref={canvasRef} />;
};

export default GameTestPage;
