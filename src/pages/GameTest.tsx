import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import GameTypes from '../modules/game/gameTypes';
import MahjongVersions from '../modules/mahjong/Wall/version/Versions';

import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import TileFactory from '../modules/mahjong/Tile/TileFactory';

let pixiApplication: PIXI.Application;

const STARTING_GAME = {
  gameType: GameTypes.Mahjong,
  gameVersion: MahjongVersions.HongKong,
};

const TILES = [
  TileFactory.createTileFromStringDef('1_BAMBOO'),
  TileFactory.createTileFromStringDef('2_BAMBOO'),
  TileFactory.createTileFromStringDef('3_BAMBOO'),
];

let spriteFactory: SpriteFactory;
const playerHand = new PIXI.Container();
console.log(playerHand);

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

    function animate() {
      requestAnimationFrame(animate);
      pixiApplication.render();
    }

    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      spriteFactory = new SpriteFactory(resources);
      for (let i = 0; i < TILES.length; i += 1) {
        const tile = TILES[i];
        const sprite = spriteFactory.generateSprite(tile.toString());
        sprite.width = 100;
        sprite.height = 150;
        sprite.x = i * 50;
        pixiApplication.stage.addChild(sprite);
      }
      const sprite = spriteFactory.generateSprite('123');
      pixiApplication.stage.addChild(sprite);

      console.log(loader);
      animate();
    }

    const images = imageInit(STARTING_GAME.gameType);
    pixiApplication.loader.add(images).load(setup);
  }, []);

  return <div ref={canvasRef} />;
};

export default GameTestPage;
