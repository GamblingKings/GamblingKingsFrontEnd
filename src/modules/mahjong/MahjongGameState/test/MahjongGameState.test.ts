import 'jest-webgl-canvas-mock';
// import * as PIXI from 'pixi.js';

import MahjongPlayer from '../../MahjongPlayer/MahjongPlayer';
import MahjongOpponent from '../../MahjongOpponent/MahjongOpponent';
import RenderDirection from '../../../../pixi/directions';
import MahjongGameState from '../MahjongGameState';
import UserEntity from '../../../game/UserEntity/UserEntity';

let mjPlayer: MahjongPlayer;
let mjOpponent1: MahjongOpponent;
let mjOpponent2: MahjongOpponent;
let mjOpponent3: MahjongOpponent;
let gameState: MahjongGameState;
let users: UserEntity[];

beforeEach(() => {
  mjPlayer = new MahjongPlayer('Player');
  mjOpponent1 = new MahjongOpponent('Opp Left', RenderDirection.LEFT);
  mjOpponent2 = new MahjongOpponent('Opp Top', RenderDirection.TOP);
  mjOpponent3 = new MahjongOpponent('Opp Right', RenderDirection.RIGHT);
  users = [mjPlayer, mjOpponent1, mjOpponent2, mjOpponent3];

  gameState = new MahjongGameState(users);
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
