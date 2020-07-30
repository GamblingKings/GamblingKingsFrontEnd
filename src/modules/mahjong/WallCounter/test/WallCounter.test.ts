import 'jest-webgl-canvas-mock';
// import * as PIXI from 'pixi.js';
// import jsdom from 'jsdom';

import WallCounter from '../WallCounter';

let wallCounter: WallCounter;

beforeEach(() => {
  wallCounter = new WallCounter();
});

test('WallCounter - getCurrentIndex()', () => {
  expect(wallCounter.getCurrentIndex()).toBe(13 * 4);
});
