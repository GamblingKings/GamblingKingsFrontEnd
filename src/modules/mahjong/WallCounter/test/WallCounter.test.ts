import 'jest-webgl-canvas-mock';
import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../../pixi/SpriteFactory';
import WallCounter from '../WallCounter';

let wallCounter: WallCounter;
let pixiStage: PIXI.Container;
const spriteFactory = new SpriteFactory({});

beforeEach(() => {
  wallCounter = new WallCounter();
  pixiStage = new PIXI.Container();
});

test('WallCounter - getCurrentIndex()', () => {
  expect(wallCounter.getCurrentIndex()).toBe(13 * 4);
});

test('WallCounter - increaseCounter()', () => {
  wallCounter.increaseCounter();
  expect(wallCounter.getCurrentIndex()).toBe(13 * 4 + 1);
});

test('WallCounter - getNumberOfTilesLeft()', () => {
  expect(wallCounter.getNumberOfTilesLeft()).toBe(WallCounter.TOTAL_NUMBER_OF_TILES - 13 * 4);
  wallCounter.increaseCounter();
  expect(wallCounter.getNumberOfTilesLeft()).toBe(WallCounter.TOTAL_NUMBER_OF_TILES - 13 * 4 - 1);
});

test('WallCounter - render()', () => {
  wallCounter.render(spriteFactory, pixiStage);
  expect(wallCounter.getContainer().children).toHaveLength(2);
  expect(pixiStage.children).toHaveLength(1);
});

test('WallCounter - reomveAllAssets()', () => {
  wallCounter.render(spriteFactory, pixiStage);
  wallCounter.removeAllAssets();
  expect(wallCounter.getContainer().children).toHaveLength(0);
});
