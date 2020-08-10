import 'jest-webgl-canvas-mock';
import jsdom from 'jsdom';
import * as PIXI from 'pixi.js';
import MahjongOpponent from '../MahjongOpponent';
import RenderDirection from '../../../../pixi/directions';
import SpriteFactory from '../../../../pixi/SpriteFactory';
import TileFactory from '../../Tile/TileFactory';

const { JSDOM } = jsdom;
const dom = new JSDOM();
const canvas = dom.window.document.createElement('canvas');

let mjOpponent: MahjongOpponent;
const spriteFactory = new SpriteFactory({});
const NAME = 'Bowser';
const LOCATION_LEFT = RenderDirection.LEFT;
const LOCATION_RIGHT = RenderDirection.RIGHT;
const LOCATION_TOP = RenderDirection.TOP;
const CONNECTION_ID = 'connectionID';
let pixiStage: PIXI.Container;

const SAMPLE_TILE_ARRAY = [
  TileFactory.createTileFromStringDef('2_DOT'),
  TileFactory.createTileFromStringDef('3_DOT'),
  TileFactory.createTileFromStringDef('4_DOT'),
];

beforeEach(() => {
  mjOpponent = new MahjongOpponent(NAME, CONNECTION_ID, LOCATION_LEFT);
  pixiStage = new PIXI.Container();
});

test('MahjongOpponent - getName()', () => {
  expect(mjOpponent.getName()).toBe(NAME);
});

test('MahjongOpponent - getContainer() - Init to be empty', () => {
  expect(mjOpponent.getContainer().children).toHaveLength(0);
});

test('MahjongOpponent - getLocation()', () => {
  expect(mjOpponent.getLocation()).toBe(LOCATION_LEFT);

  mjOpponent = new MahjongOpponent(NAME, CONNECTION_ID, LOCATION_RIGHT);
  expect(mjOpponent.getLocation()).toBe(LOCATION_RIGHT);

  mjOpponent = new MahjongOpponent(NAME, CONNECTION_ID, LOCATION_TOP);
  expect(mjOpponent.getLocation()).toBe(LOCATION_TOP);
});

test('MahjongOpponent - getNumberOfTiles()', () => {
  expect(mjOpponent.getHand().getNumberOfTiles()).toBe(13);
});

test('MahjongOpponent - renderName()', () => {
  const pixiText = mjOpponent.renderName();
  expect(pixiText.text).toBe(NAME);
});

test('MahjongOpponent - renderMahjongHand()', () => {
  const hand = mjOpponent.renderMahjongHand(spriteFactory);
  expect(hand.children).toHaveLength(14); // 13 tiles and 1 container for playedTiles
});

test('MahjongOpponent - renderMahjongHand() with playedTiles', () => {
  const hand = mjOpponent.renderMahjongHand(spriteFactory);
  mjOpponent.addPlayedTiles(SAMPLE_TILE_ARRAY);
  expect(hand.children).toHaveLength(14); // 13 tiles and 1 container for playedTiles
});

test('MahjongOpponent - render()', () => {
  mjOpponent.render(spriteFactory, pixiStage, false);

  expect(mjOpponent.getContainer().children).toHaveLength(2);
  expect(pixiStage.children).toHaveLength(1);
});

test('MahjongOpponent - removeAllAssets()', () => {
  mjOpponent.render(spriteFactory, pixiStage, false);
  mjOpponent.removeAllAssets();
  expect(mjOpponent.getContainer().children).toHaveLength(0);

  mjOpponent.render(spriteFactory, pixiStage, false);
  mjOpponent.removeAllAssets();
  expect(mjOpponent.getContainer().children).toHaveLength(0);
});

test('MahjongOpponent - getPlayedTiles()', () => {
  const emptyPlayedTiles = mjOpponent.getPlayedTiles();
  expect(emptyPlayedTiles).toHaveLength(0);
});

test('MahjongOpponent - addPlayedTiles()', () => {
  mjOpponent.addPlayedTiles(SAMPLE_TILE_ARRAY);
  const playedTiles = mjOpponent.getPlayedTiles();
  expect(playedTiles).toHaveLength(1);
});

test('MahjongOpponent - reposition() / render()', () => {
  // canvas width and height are both 0
  mjOpponent.reposition(canvas);

  expect(mjOpponent.getContainer().x).toBe(100);
  expect(mjOpponent.getContainer().y).toBe(80);

  mjOpponent = new MahjongOpponent(NAME, CONNECTION_ID, LOCATION_RIGHT);
  mjOpponent.reposition(canvas);
  expect(mjOpponent.getContainer().x).toBe(-160);
  expect(mjOpponent.getContainer().y).toBe(80);
  mjOpponent.render(spriteFactory, pixiStage, false);
  expect(mjOpponent.getContainer().children).toHaveLength(2);

  mjOpponent.removeAllAssets();
  mjOpponent.render(spriteFactory, pixiStage, true);
  expect(mjOpponent.getContainer().children).toHaveLength(3); // 2 + 1 for its turn

  mjOpponent = new MahjongOpponent(NAME, CONNECTION_ID, LOCATION_TOP);
  mjOpponent.reposition(canvas);
  expect(mjOpponent.getContainer().x).toBe(200);
  expect(mjOpponent.getContainer().y).toBe(80);
  mjOpponent.render(spriteFactory, pixiStage, false);
  expect(mjOpponent.getContainer().children).toHaveLength(2);
});
