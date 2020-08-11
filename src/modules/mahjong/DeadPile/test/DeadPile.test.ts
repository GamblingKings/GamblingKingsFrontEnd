import 'jest-webgl-canvas-mock';
import * as PIXI from 'pixi.js';

import DeadPile from '../DeadPile';
import SimpleTile from '../../Tile/SimpleTile';
import SimpleTileTypes from '../../enums/SimpleTileEnums';
import SpriteFactory from '../../../../pixi/SpriteFactory';

const charSimpleTile = new SimpleTile(SimpleTileTypes.CHARACTER, 1);
const bambooSimpleTile = new SimpleTile(SimpleTileTypes.BAMBOO, 5);
const spriteFactory = new SpriteFactory({});

let d: DeadPile;
let pixiStage: PIXI.Container;

beforeEach(() => {
  d = new DeadPile();
  pixiStage = new PIXI.Container();
});

test('Test that the DeadPile stores the last thrown and gets thrown into deadpile if another tile is added', () => {
  d.lastThrown(charSimpleTile);
  d.lastThrown(bambooSimpleTile);

  expect(d.getDeadPile().includes(charSimpleTile)).toBeTruthy();
});

test('Test that the DeadPile only has one tile in the dead pile', () => {
  d.lastThrown(charSimpleTile);
  d.lastThrown(bambooSimpleTile);
  expect(d.getDeadPile()).toHaveLength(1);
});

test('DeadPile - renderTiles()', () => {
  d.add(charSimpleTile);
  d.add(bambooSimpleTile);
  const container = d.renderTiles(spriteFactory);
  expect(container.children).toHaveLength(4);
});

test('DeadPile - render()', () => {
  d.add(charSimpleTile);
  d.add(bambooSimpleTile);
  d.render(spriteFactory, pixiStage);
  expect(d.getContainer().children).toHaveLength(2);
  d.removeAllAssets();
  expect(d.getContainer().children).toHaveLength(0);
});

test('DeadPile - removeLastTile()', () => {
  expect(d.removeLastTile()).toBeFalsy();
  d.add(charSimpleTile);
  d.add(bambooSimpleTile);
  expect(d.getDeadPile()).toHaveLength(2);
  expect(d.removeLastTile()).toBeTruthy();
  expect(d.getDeadPile()).toHaveLength(1);
});
