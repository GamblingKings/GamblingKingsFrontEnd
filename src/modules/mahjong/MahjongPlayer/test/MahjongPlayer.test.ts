import 'jest-webgl-canvas-mock';
import * as PIXI from 'pixi.js';
import jsdom from 'jsdom';

import MahjongPlayer from '../MahjongPlayer';
import SpriteFactory from '../../../../pixi/SpriteFactory';
import TileFactory from '../../Tile/TileFactory';
import Tile from '../../Tile/Tile';

const { JSDOM } = jsdom;
const dom = new JSDOM();
const canvas = dom.window.document.createElement('canvas');

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

let tiles: Tile[];

const spriteFactory = new SpriteFactory({});
let pixiStage: PIXI.Container;
const placeholderFunction = () => {};

const NAME = 'Jay Chou';
let mjPlayer: MahjongPlayer;

beforeEach(() => {
  tiles = tileStrings.map((tile) => TileFactory.createTileFromStringDef(tile));
  mjPlayer = new MahjongPlayer(NAME);
  pixiStage = new PIXI.Container();
});

test('MahjongPlayer - getName()', () => {
  expect(mjPlayer.getName()).toEqual(NAME);
});

test('MahjongPlayer - getContainer() - Init to be empty', () => {
  expect(mjPlayer.getContainer().children).toHaveLength(0);
});

test('MahjongPlayer - setHand() / getHand()', () => {
  expect(mjPlayer.getHand().getTiles()).toHaveLength(0);
  mjPlayer.setHand(tiles);
  expect(mjPlayer.getHand().getTiles()).toEqual(tiles);
});

test('MahjongPlayer - renderName()', () => {
  const pixiText = mjPlayer.renderName();
  expect(pixiText.text).toBe(NAME);
});

test('MahjongPlayer - renderHand()', () => {
  // Empty hand
  const handContainerEmpty = mjPlayer.renderHand(spriteFactory, placeholderFunction);

  expect(handContainerEmpty.children).toHaveLength(0);

  // 13 tiles for front and 13 tiles for back
  mjPlayer.setHand(tiles);
  const handContainerFull = mjPlayer.renderHand(spriteFactory, placeholderFunction);
  expect(handContainerFull.children).toHaveLength(26);
});

test('MahjongPlayer - render() - empty hand', () => {
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  expect(pixiStage.children).toHaveLength(1);

  mjPlayer.removeAllAssets();
  mjPlayer.setHand(tiles);
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  expect(pixiStage.children).toHaveLength(1);
});

test('MahjongPlayer - render() - full hand', () => {
  mjPlayer.setHand(tiles);
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  expect(pixiStage.children).toHaveLength(1);

  mjPlayer.getHand()?.setSelectedTile(2);
  mjPlayer.removeAllAssets();
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  expect(pixiStage.children).toHaveLength(1);
});

test('MahjongPlayer - removeAllAssets()', () => {
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  mjPlayer.removeAllAssets();
  expect(mjPlayer.getContainer().children).toHaveLength(0);

  mjPlayer.setHand(tiles);
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  mjPlayer.removeAllAssets();
  expect(mjPlayer.getContainer().children).toHaveLength(0);
});

test('MahjongPlayer - reposition()', () => {
  // canvas width and height are both 0
  mjPlayer.reposition(canvas);

  expect(mjPlayer.getContainer().x).toBe(100);
  expect(mjPlayer.getContainer().y).toBe(-120);
});