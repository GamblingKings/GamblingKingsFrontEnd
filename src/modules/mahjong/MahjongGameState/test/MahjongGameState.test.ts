import 'jest-webgl-canvas-mock';
import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../../pixi/SpriteFactory';
import MahjongPlayer from '../../MahjongPlayer/MahjongPlayer';
import MahjongOpponent from '../../MahjongOpponent/MahjongOpponent';
import RenderDirection from '../../../../pixi/directions';
import MahjongGameState from '../MahjongGameState';
import UserEntity from '../../../game/UserEntity/UserEntity';
import WindEnums from '../../enums/WindEnums';

let mjPlayer: MahjongPlayer;
let mjOpponent1: MahjongOpponent;
let mjOpponent2: MahjongOpponent;
let mjOpponent3: MahjongOpponent;
let gameState: MahjongGameState;
let users: UserEntity[];
const PLAYER_NAME = 'Jay Chou';

let pixiApp: PIXI.Application;
const spriteFactory = new SpriteFactory({});

const callbacks = {
  DRAW_TILE: () => {},
  PLAY_TILE: () => {},
};

beforeEach(() => {
  mjPlayer = new MahjongPlayer(PLAYER_NAME, 'connectionId');
  mjOpponent1 = new MahjongOpponent('Opp Left', 'connectionId', RenderDirection.LEFT);
  mjOpponent2 = new MahjongOpponent('Opp Top', 'connectionId', RenderDirection.TOP);
  mjOpponent3 = new MahjongOpponent('Opp Right', 'connectionId', RenderDirection.RIGHT);
  users = [mjPlayer, mjOpponent1, mjOpponent2, mjOpponent3];

  gameState = new MahjongGameState(users, mjPlayer, callbacks);

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
  gameState.renderCanvas(spriteFactory, pixiApp);
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
