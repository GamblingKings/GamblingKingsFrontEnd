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
import UserEntity from '../modules/game/UserEntity/UserEntity';

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
let stage: PIXI.Container;
let pixiLoader: PIXI.Loader;
let interactionManager: PIXI.InteractionManager;

let spriteFactory: SpriteFactory;

let player: UserEntity;
let opponentOne: UserEntity;
let opponentTwo: UserEntity;
let opponentThree: UserEntity;

let redrawPending = false;

/**
 * Initialize the Player and Opponent Classes based on the users from currentGame
 * @param currentGame Game
 */
const playersInit = (currentGame: Game, pixiStage: PIXI.Container) => {
  const { users } = currentGame;

  const indexOfCurrentUser = users.findIndex((user: User) => user.username === CURRENT_USER.username);
  const opponents = [];
  const directions = [RenderDirection.LEFT, RenderDirection.TOP, RenderDirection.RIGHT];
  let currentIndex = indexOfCurrentUser + 1;
  for (let i = 0; i < users.length - 1; i += 1) {
    if (currentIndex >= users.length) {
      currentIndex = 0;
    }
    const opponent = new MahjongOpponent(users[currentIndex].username, directions[i]);
    opponents.push(opponent);
    const opponentContainer = opponent.getContainer();
    pixiStage.addChild(opponentContainer);
    currentIndex += 1;
  }
  [opponentOne, opponentTwo, opponentThree] = [opponents[0], opponents[1], opponents[2]];
  player = new MahjongPlayer(CURRENT_USER.username);
  const mahjongPlayer = player as MahjongPlayer;
  mahjongPlayer.setHand(tiles);
};

// /**
//  * Allows animate to redraw the game if there is a state change.
//  */
// const requestRedraw = () => {
//   redrawPending = false;
// };

/**
 * Testing page for the Game.
 * Can only be accessed by /gametest
 */
const GameTestPage = (): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // const [redrawPending, setRedrawPending] = useState(false);

  const requestRedraw = () => {
    redrawPending = false;
  };

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
    stage = pixiApplication.stage;

    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>): void {
      console.log(loader);
      spriteFactory = new SpriteFactory(resources);

      playersInit(STARTING_GAME, stage);

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

export default GameTestPage;
