import 'jest-webgl-canvas-mock';
import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../../pixi/SpriteFactory';
import WallCounter from '../WallCounter';

let wallCounter: WallCounter;
let pixiStage: PIXI.Container;
const spriteFactory = new SpriteFactory({});
const mockCanvasRef = {
  current: {
    clientHeight: 1080,
    clientWidth: 1920,
  },
} as React.RefObject<HTMLDivElement>;

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
  wallCounter.render(spriteFactory, pixiStage, mockCanvasRef);
  expect(wallCounter.getContainer().children).toHaveLength(2);
  expect(pixiStage.children).toHaveLength(1);
});

test('WallCounter - removeAllAssets()', () => {
  wallCounter.render(spriteFactory, pixiStage, mockCanvasRef);
  wallCounter.removeAllAssets();
  expect(wallCounter.getContainer().children).toHaveLength(0);
});

test('WallCounter - setCurrentIndex() with valid index', () => {
  const validIndex = 50;
  const result = wallCounter.setCurrentIndex(validIndex);
  expect(wallCounter.getCurrentIndex()).toBe(validIndex);
  expect(result).toBeTruthy();
});

test('WallCounter - setCurrentIndex() with invalid index', () => {
  const initialCount = wallCounter.getCurrentIndex();
  const invalidIndex = 145;
  const result = wallCounter.setCurrentIndex(invalidIndex);
  expect(wallCounter.getCurrentIndex()).toBe(initialCount);
  expect(result).toBeFalsy();
});

test('WallCounter - resetEverything()', () => {
  wallCounter.increaseCounter();
  wallCounter.render(spriteFactory, pixiStage, mockCanvasRef);

  wallCounter.resetEverything();

  expect(wallCounter.getContainer().children).toHaveLength(0);
  expect(wallCounter.getCurrentIndex()).toBe(WallCounter.NUMBER_OF_TILES_PER_HAND * WallCounter.NUMBER_OF_PLAYERS);
});
