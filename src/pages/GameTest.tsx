import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import GameTypes from '../modules/game/gameTypes';
import MahjongVersions from '../modules/mahjong/Wall/version/Versions';

import imageInit from '../pixi/imageLoader';
import SpriteFactory from '../pixi/SpriteFactory';
import HongKongWall from '../modules/mahjong/Wall/version/HongKongWall';
import Hand from '../modules/mahjong/Hand/Hand';
import Renderer from '../pixi/Renderer';
import Opponent from '../modules/game/Opponent/Opponent';
import MahjongOpponent from '../modules/mahjong/MahjongOpponent/MahjongOpponent';
import { User, Game } from '../types';
import Player from '../modules/game/Player/Player';
import MahjongPlayer from '../modules/mahjong/MahjongPlayer/MahjongPlayer';
import RenderDirection from '../pixi/directions';

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

const w = new HongKongWall();
const DEFAULT_WEIGHTS = Hand.generateHandWeights();
const h1 = new Hand(w, DEFAULT_WEIGHTS);

/**
 * ********************************************************
 * ********************************************************
 * ********************************************************
 */

let redrawPending = false;

let pixiApplication: PIXI.Application;
let stage: PIXI.Container;
let pixiLoader: PIXI.Loader;
let interactionManager: PIXI.InteractionManager;

let spriteFactory: SpriteFactory;
let playerContainer: PIXI.Container;
let opponentOneContainer: PIXI.Container;
let opponentTwoContainer: PIXI.Container;
let opponentThreeContainer: PIXI.Container;

let player: Player;
let opponentOne: Opponent;
let opponentTwo: Opponent;
let opponentThree: Opponent;

/**
 * Initialize the Player and Opponent Classes based on the users from currentGame
 * @param currentGame Game
 */
const playersInit = (currentGame: Game) => {
  const { users } = currentGame;

  const indexOfCurrentUser = users.findIndex((user: User) => user.username === CURRENT_USER.username);
  const opponents = [];
  let currentIndex = indexOfCurrentUser + 1;
  for (let i = 0; i < users.length - 1; i += 1) {
    if (currentIndex >= users.length) {
      currentIndex = 0;
    }
    opponents.push(new MahjongOpponent(users[currentIndex].username));
    currentIndex += 1;
  }
  [opponentOne, opponentTwo, opponentThree] = [opponents[0], opponents[1], opponents[2]];
  player = new MahjongPlayer(CURRENT_USER.username, h1);
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

/**
 * Allows animate to redraw the game if there is a state change.
 */
const requestRedraw = () => {
  redrawPending = false;
  console.log(redrawPending);
};

/**
 * Testing page for the Game.
 * Can only be accessed by /gametest
 */
const GameTestPage = (): JSX.Element => {
  const canvasRef = useRef<HTMLDivElement>(null);
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

    /**
     * Main animation loop
     */
    function animate() {
      if (!redrawPending) {
        redrawPending = true;
        opponentOneContainer.removeChildren(0, opponentOneContainer.children.length);
        opponentTwoContainer.removeChildren(0, opponentTwoContainer.children.length);
        opponentThreeContainer.removeChildren(0, opponentThreeContainer.children.length);
        playerContainer.removeChildren(0, playerContainer.children.length);

        Renderer.renderPlayerMahjong(spriteFactory, playerContainer, player as MahjongPlayer, requestRedraw);
        Renderer.renderOpponentMahjong(
          spriteFactory,
          opponentOneContainer,
          opponentOne as MahjongOpponent,
          RenderDirection.LEFT,
        );
        Renderer.renderOpponentMahjong(
          spriteFactory,
          opponentTwoContainer,
          opponentTwo as MahjongOpponent,
          RenderDirection.TOP,
        );
        Renderer.renderOpponentMahjong(
          spriteFactory,
          opponentThreeContainer,
          opponentThree as MahjongOpponent,
          RenderDirection.RIGHT,
        );

        pixiApplication.render();
      }
      requestAnimationFrame(animate);
    }

    function setup(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
      console.log(loader);
      spriteFactory = new SpriteFactory(resources);

      containersInit();
      placeContainers(pixiApplication.view);
      playersInit(STARTING_GAME);

      animate();
    }

    const images = imageInit(STARTING_GAME.gameType as GameTypes);
    pixiLoader.add(images).load(setup);
  }, []);

  /**
   * Listens for
   */
  useEffect(() => {
    function handleResize() {
      placeContainers(pixiApplication.view);
      redrawPending = false;
    }
    window.addEventListener('resize', handleResize);

    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  });

  return <div ref={canvasRef} />;
};

export default GameTestPage;
