import 'jest-webgl-canvas-mock';
import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../../pixi/SpriteFactory';
import MahjongPlayer from '../../MahjongPlayer/MahjongPlayer';
import MahjongOpponent from '../../MahjongOpponent/MahjongOpponent';
import RenderDirection from '../../../../pixi/directions';
import MahjongGameState from '../MahjongGameState';
import UserEntity from '../../../game/UserEntity/UserEntity';
import WindEnums from '../../enums/WindEnums';
import PointValidator from '../../PointValidator/PointValidator';
import validateHandStructure from '../../utils/functions/validateHandStructure';
import TileFactory from '../../Tile/TileFactory';

const mockCanvasRef = {
  current: {
    clientHeight: 1080,
    clientWidth: 1920,
  },
} as React.RefObject<HTMLDivElement>;

let mjPlayer: MahjongPlayer;
let mjOpponent1: MahjongOpponent;
let mjOpponent2: MahjongOpponent;
let mjOpponent3: MahjongOpponent;
let gameState: MahjongGameState;
let gameStateOne: MahjongGameState;
let users: UserEntity[];
let usersOpponentFirst: UserEntity[];
const PLAYER_NAME = 'Jay Chou';

let pixiApp: PIXI.Application;
const spriteFactory = new SpriteFactory({});

const callbacks = {
  DRAW_TILE: () => {},
  PLAY_TILE: () => {},
};

const tileStrings = [
  '7_DOT',
  '7_DOT',
  '7_DOT',
  '8_DOT',
  '8_DOT',
  '8_DOT',
  '5_BAMBOO',
  '5_BAMBOO',
  '5_BAMBOO',
  'NORTH',
  'NORTH',
  'EAST',
  'EAST',
];
const tiles = tileStrings.map((tile) => TileFactory.createTileFromStringDef(tile));

beforeEach(() => {
  mjPlayer = new MahjongPlayer(PLAYER_NAME, 'connectionId');
  mjOpponent1 = new MahjongOpponent('Opp Left', 'connectionId1', RenderDirection.LEFT);
  mjOpponent2 = new MahjongOpponent('Opp Top', 'connectionId2', RenderDirection.TOP);
  mjOpponent3 = new MahjongOpponent('Opp Right', 'connectionId3', RenderDirection.RIGHT);
  users = [mjPlayer, mjOpponent1, mjOpponent2, mjOpponent3];
  usersOpponentFirst = [mjOpponent1, mjPlayer, mjOpponent2, mjOpponent3];

  gameState = new MahjongGameState(users, mjPlayer, callbacks);
  gameStateOne = new MahjongGameState(usersOpponentFirst, mjPlayer, callbacks);

  pixiApp = { stage: new PIXI.Container(), view: {} as HTMLCanvasElement }; // mocking
});

test('MahjongGameState - getUsers()', () => {
  expect(gameState.getUsers()).toStrictEqual(users);
});

test('MahjongGameState - getCurrentTurn() / goToNextTurn()', () => {
  expect(gameState.getCurrentTurn()).toBe(0);
  expect(gameState.goToNextTurn()).toBe(1);
  expect(gameState.goToNextTurn()).toBe(2);
  expect(gameState.goToNextTurn()).toBe(3);
  expect(gameState.goToNextTurn()).toBe(0);
});

test('MahjongGameState - roundStarted()', () => {
  expect(gameState.getRoundStarted()).toBeFalsy();
  gameState.startRound();
  expect(gameState.getRoundStarted()).toBeTruthy();
  gameState.endRound();
  expect(gameState.getRoundStarted()).toBeFalsy();
});

test('MahjongGameState - roundStarted() - opponent first', () => {
  expect(gameStateOne.getRoundStarted()).toBeFalsy();
  gameStateOne.startRound();
  expect(gameStateOne.getRoundStarted()).toBeTruthy();
  expect(mjOpponent1.getHand().getHasDrawn()).toBeTruthy();
});

test('MahjongGameState - getWallCounter()', () => {
  expect(gameState.getWallCounter().getContainer().children).toHaveLength(0);
});

test('MahjongGameState - getDealer() / changeDealer()', () => {
  expect(gameState.getDealer()).toBe(0);
  expect(gameState.getCurrentWind()).toBe(WindEnums.EAST);
  gameState.changeDealer();
  expect(gameState.getDealer()).toBe(1);
  expect(gameState.getCurrentWind()).toBe(WindEnums.EAST);
  gameState.changeDealer();
  expect(gameState.getDealer()).toBe(2);
  expect(gameState.getCurrentWind()).toBe(WindEnums.EAST);
  gameState.changeDealer();
  expect(gameState.getDealer()).toBe(3);
  expect(gameState.getCurrentWind()).toBe(WindEnums.EAST);
  gameState.changeDealer();
  expect(gameState.getDealer()).toBe(0);
  expect(gameState.getCurrentWind()).toBe(WindEnums.SOUTH);
});

test('MahjongGameState - getCurrentWind(), changeWind()', () => {
  expect(gameState.getCurrentWind()).toBe(WindEnums.EAST);
  gameState.changeWind();
  expect(gameState.getCurrentWind()).toBe(WindEnums.SOUTH);
  gameState.changeWind();
  expect(gameState.getCurrentWind()).toBe(WindEnums.WEST);
  gameState.changeWind();
  expect(gameState.getCurrentWind()).toBe(WindEnums.NORTH);
  gameState.changeWind();
  expect(gameState.getCurrentWind()).toBe(WindEnums.EAST);
});

test('MahjongGameState - renderCanvas()', () => {
  gameState.startRound();
  gameState.renderCanvas(spriteFactory, pixiApp, mockCanvasRef);
  expect(pixiApp.stage.children).toHaveLength(6); // 4 - users, 1 deadpile, 1 wall
  gameState.requestRedraw();
  expect(pixiApp.stage.children).toHaveLength(6);
});

test('MahjongGameState - getDeadPile()', () => {
  expect(gameState.getDeadPile().getDeadPile()).toHaveLength(0);
});

test('MahjongGameState - getMjPlayer()', () => {
  expect(gameState.getMjPlayer().getName()).toBe(PLAYER_NAME);
});

test('MahjongGameState - setTurn()', () => {
  gameState.setTurn(1);
  expect(gameState.getCurrentTurn()).toBe(1);
});

test('MahjongGameState - update()', () => {
  mjPlayer.setAllowInteraction(true);
  const timer = mjPlayer.getTimer();
  expect(timer.getContainer().children).toHaveLength(0); // timer hasn't started
  gameState.update();
  expect(timer.getContainer().children).toHaveLength(0); // timer hasn't started
});

test('MahjongGameState - renderCanvas() -include timer', () => {
  gameState.startRound();
  mjPlayer.setAllowInteraction(true);
  gameState.renderCanvas(spriteFactory, pixiApp, mockCanvasRef);
  expect(pixiApp.stage.children).toHaveLength(7); // 4 - users, 1 deadpile, 1 wall, 1 timer
  gameState.requestRedraw();
  expect(pixiApp.stage.children).toHaveLength(7);
});

test('MahjongGameState - gameStateSync()', () => {
  gameState.gameStateSync(0, 0);
  expect(gameState.getDealer()).toBe(0);
  expect(gameState.getCurrentWind()).toBe(WindEnums.EAST);
  gameState.gameStateSync(1, 1);
  expect(gameState.getDealer()).toBe(1);
  expect(gameState.getCurrentWind()).toBe(WindEnums.SOUTH);
  gameState.gameStateSync(2, 2);
  expect(gameState.getDealer()).toBe(2);
  expect(gameState.getCurrentWind()).toBe(WindEnums.WEST);
  gameState.gameStateSync(3, 3);
  expect(gameState.getDealer()).toBe(3);
  expect(gameState.getCurrentWind()).toBe(WindEnums.NORTH);
});

test('MahjongGameState - resetEverything()', () => {
  gameState.startRound();
  gameState.renderCanvas(spriteFactory, pixiApp, mockCanvasRef);

  gameState.resetEverything();

  expect(gameState.getDeadPile().getContainer().children).toHaveLength(0);
  expect(gameState.getWallCounter().getContainer().children).toHaveLength(0);
});

test('MahjongGameState - renderWinState()', () => {
  const connectionId = 'connectionId';
  mjPlayer.setHand(tiles);
  mjPlayer.addTileToHand(TileFactory.createTileFromStringDef('EAST'));
  const playerHand = mjPlayer.getHand();
  const handValidationResult = validateHandStructure(
    playerHand.getAllTiles().map((tile) => tile.toString()),
    playerHand.getWind(),
    playerHand.getFlowerNumber(),
    gameState.getCurrentWind(),
    playerHand.getConcealed(),
  );
  const pointValidationResult = PointValidator.validateHandPoints(handValidationResult);
  gameState.endRound();
  gameState.winnerFound();
  gameState.setWinnerInfo(connectionId, pointValidationResult.largestHand);
  gameState.requestRedraw();
  gameState.renderWinState(spriteFactory, pixiApp.stage);

  expect(pixiApp.stage.children).toHaveLength(1);
});

test('MahjongGameState - renderWinState() through renderCanvas', () => {
  const connectionId = 'connectionId';
  mjPlayer.setHand(tiles);
  mjPlayer.addTileToHand(TileFactory.createTileFromStringDef('EAST'));
  const playerHand = mjPlayer.getHand();
  const handValidationResult = validateHandStructure(
    playerHand.getAllTiles().map((tile) => tile.toString()),
    playerHand.getWind(),
    playerHand.getFlowerNumber(),
    gameState.getCurrentWind(),
    playerHand.getConcealed(),
  );
  const pointValidationResult = PointValidator.validateHandPoints(handValidationResult);
  gameState.endRound();
  gameState.winnerFound();
  gameState.setWinnerInfo(connectionId, pointValidationResult.largestHand);
  gameState.requestRedraw();
  gameState.renderCanvas(spriteFactory, pixiApp, mockCanvasRef);

  expect(pixiApp.stage.children).toHaveLength(1);
});

test('MahjongGameState - renderDrawState()', () => {
  gameState.endRound();
  gameState.requestRedraw();
  gameState.renderDrawState(spriteFactory, pixiApp.stage);

  expect(pixiApp.stage.children).toHaveLength(1);
});

test('MahjongGameState - renderDrawState() through renderCanvas', () => {
  gameState.endRound();
  gameState.requestRedraw();

  gameState.renderCanvas(spriteFactory, pixiApp, mockCanvasRef);

  expect(pixiApp.stage.children).toHaveLength(1);
});

test('MahjongGameState - getGameStarted', () => {
  expect(gameState.getGameStarted()).toBeFalsy();
});

test('MahjongGameState - setGameStarted', () => {
  expect(gameState.getGameStarted()).toBeFalsy();
  gameState.setGameStarted(true);
  expect(gameState.getGameStarted()).toBeTruthy();
});
