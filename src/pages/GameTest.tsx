import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

import GameTypes from '../modules/game/gameTypes';
import MahjongVersions from '../modules/mahjong/enums/VersionsEnum';
import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import MahjongOpponent from '../modules/mahjong/MahjongOpponent/MahjongOpponent';
import { User, Game } from '../types';
import MahjongPlayer from '../modules/mahjong/MahjongPlayer/MahjongPlayer';
import RenderDirection from '../pixi/directions';
import TileFactory from '../modules/mahjong/Tile/TileFactory';
import GameState from '../modules/game/GameState/GameState';
import MahjongGameState from '../modules/mahjong/MahjongGameState/MahjongGameState';
import { PIXI_TEXT_STYLE } from '../pixi/mahjongConstants';
import UserEntity from '../modules/game/UserEntity/UserEntity';
import Interactions from '../pixi/Interactions';
import HongKongWall from '../modules/mahjong/Wall/version/HongKongWall';
import Tile from '../modules/mahjong/Tile/Tile';

/**
 * ********************************************************
 * ********************************************************
 *                    TESTING VARIABLES
 * ********************************************************
 * ********************************************************
 */
const CURRENT_USER: User = { username: 'Patrick', connectionId: 'abc' };
const PLACEHOLDER_USER1: User = { username: 'Derrick', connectionId: 'def' };
const PLACEHOLDER_USER2: User = { username: 'Michael', connectionId: 'ghi' };
const PLACEHOLDER_USER3: User = { username: 'Vincent', connectionId: 'jkl' };
const ALL_USERS: User[] = [PLACEHOLDER_USER3, CURRENT_USER, PLACEHOLDER_USER1, PLACEHOLDER_USER2];

const STARTING_GAME: Game = {
  gameId: 'asd',
  gameName: 'asdf',
  host: PLACEHOLDER_USER3,
  gameType: GameTypes.Mahjong,
  gameVersion: MahjongVersions.HongKong,
  users: ALL_USERS,
};
const tileStrings = [
  '7_DOT',
  '7_DOT',
  '7_DOT',
  '8_DOT',
  '8_DOT',
  '2_BAMBOO',
  '5_BAMBOO',
  '9_BAMBOO',
  '9_CHARACTER',
  'NORTH',
  'EAST',
  'REDDRAGON',
  'WHITEDRAGON',
];
const tiles = tileStrings.map((tile) => TileFactory.createTileFromStringDef(tile));

/**
 * ********************************************************
 * ********************************************************
 * ********************************************************
 */

let pixiApplication: PIXI.Application;
let pixiLoader: PIXI.Loader;
let interactionManager: PIXI.InteractionManager;

let spriteFactory: SpriteFactory;
let gameState: GameState;
let player: UserEntity;

const wall = new HongKongWall();
const playedTilesOne = ['1_DOT', '1_DOT', '1_DOT'].map((tile) => TileFactory.createTileFromStringDef(tile));
const playedTilesTwo = ['4_DOT', '5_DOT', '6_DOT'].map((tile) => TileFactory.createTileFromStringDef(tile));

/**
 * Testing page for the Game.
 * Can only be accessed by /gametest
 */
const GameTestPage = (): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const mockWSCallbacks: Record<string, (...args: unknown[]) => void> = {
    DRAW_TILE: () => {
      console.log(gameState);
    },
    PLAY_TILE: (tile: unknown) => {
      const mjGameState = gameState as MahjongGameState;
      const tileStr = tile as string;
      const tileInstance = TileFactory.createTileFromStringDef(tileStr);
      mjGameState.getDeadPile().add(tileInstance);
      mjGameState.requestRedraw();
    },
    PLAYED_TILE_INTERACTION: (params: unknown) => {
      console.log(params);
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

    const indexOfCurrentUser = users.findIndex((user: User) => user.username === CURRENT_USER.username);
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

    player = new MahjongPlayer(CURRENT_USER.username, CURRENT_USER.connectionId);
    const mahjongPlayer = player as MahjongPlayer;
    mahjongPlayer.setHand(tiles);
    mahjongPlayer.getHand().addPlayedTiles(playedTilesOne);
    mahjongPlayer.getHand().addPlayedTiles(playedTilesTwo);

    allUserEntities[indexOfCurrentUser] = mahjongPlayer;

    const opponentTest = allUserEntities[0] as MahjongOpponent;
    opponentTest.addPlayedTiles(playedTilesOne);
    opponentTest.addPlayedTiles(playedTilesTwo);

    gameState = new MahjongGameState(allUserEntities, mahjongPlayer, mockWSCallbacks);
    console.log(gameState);
  };

  const forGameTesting = () => {
    const mjGameState = gameState as MahjongGameState;
    const mjPlayer = player as MahjongPlayer;
    const { stage } = pixiApplication;
    const drawText = new PIXI.Text('Draw Tile', PIXI_TEXT_STYLE);
    Interactions.addMouseInteraction(drawText, (event: PIXI.InteractionEvent) => {
      const tile = wall.draw() as Tile;
      mjPlayer.addTileToHand(tile);
      console.log(event);
      mjGameState.requestRedraw();
    });
    const nextTurnText = new PIXI.Text('Next turn', PIXI_TEXT_STYLE);
    nextTurnText.x = 200;
    Interactions.addMouseInteraction(nextTurnText, (event: PIXI.InteractionEvent) => {
      console.log(event);
      mjGameState.goToNextTurn();
      mjGameState.requestRedraw();
      console.log(mockWSCallbacks.DRAW_TILE());
    });
    stage.addChild(drawText);
    stage.addChild(nextTurnText);
  };

  /**
   * Main Animation loop
   */
  function animate() {
    const mjGameState = gameState as MahjongGameState;
    mjGameState.renderCanvas(spriteFactory, pixiApplication);
    forGameTesting();
    requestAnimationFrame(animate);
  }

  // Set up PIXI Application
  useEffect(() => {
    pixiApplication = new PIXI.Application({
      width: canvasRef.current?.clientWidth,
      height: canvasRef.current?.clientHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
      resizeTo: window,
    });
    if (canvasRef !== null && canvasRef.current !== null) {
      canvasRef.current.appendChild(pixiApplication.view);
    }
    // Use default Interaction Manager
    interactionManager = pixiApplication.renderer.plugins.interaction;
    pixiLoader = pixiApplication.loader;
    console.log(interactionManager);

    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>): void {
      console.log(loader);
      spriteFactory = new SpriteFactory(resources);

      gameStateInit(STARTING_GAME);
      animate();
    }

    const images = imageInit(STARTING_GAME.gameType as GameTypes);
    pixiLoader.add(images).load(setup);
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

export default GameTestPage;
