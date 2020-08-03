import 'jest-webgl-canvas-mock';
// import * as PIXI from 'pixi.js';

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

const callbacks = {
  DRAW_TILE: () => {},
  PLAY_TILE: () => {},
};

beforeEach(() => {
  mjPlayer = new MahjongPlayer('Player', 'connectionId');
  mjOpponent1 = new MahjongOpponent('Opp Left', 'connectionId', RenderDirection.LEFT);
  mjOpponent2 = new MahjongOpponent('Opp Top', 'connectionId', RenderDirection.TOP);
  mjOpponent3 = new MahjongOpponent('Opp Right', 'connectionId', RenderDirection.RIGHT);
  users = [mjPlayer, mjOpponent1, mjOpponent2, mjOpponent3];

  gameState = new MahjongGameState(users, callbacks);
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
  gameState.startRound(mjPlayer);
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