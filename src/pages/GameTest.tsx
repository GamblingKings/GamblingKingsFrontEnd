import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import GameTypes from '../modules/game/gameTypes';
import MahjongVersions from '../modules/mahjong/Wall/version/Versions';

import imageInit from '../pixi/imageLoader';

let pixiApplication: PIXI.Application;

const STARTING_GAME = {
  gameType: GameTypes.Mahjong,
  gameVersion: MahjongVersions.HongKong,
};

const GameTestPage = (): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pixiApplication = new PIXI.Application({
      width: 500,
      height: 500,
      antialias: true,
      transparent: false,
      resolution: 1,
    });
    if (canvasRef !== null && canvasRef.current !== null) {
      canvasRef.current.appendChild(pixiApplication.view);
    }

    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      const resource = resources['1_BAMBOO'] as PIXI.LoaderResource;
      console.log(resource);
      const tile = new PIXI.Sprite(resource.texture);
      console.log(tile);
      pixiApplication.stage.addChild(tile);
      console.log(resources);
      console.log(loader);
    }
    console.log(STARTING_GAME);

    pixiApplication.loader.add(imageInit()).load(setup);
  }, []);

  return <div ref={canvasRef} />;
};

export default GameTestPage;
