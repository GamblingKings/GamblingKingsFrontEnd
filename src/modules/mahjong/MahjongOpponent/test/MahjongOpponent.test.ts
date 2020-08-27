import 'jest-webgl-canvas-mock';
import jsdom from 'jsdom';
import * as PIXI from 'pixi.js';
import MahjongOpponent from '../MahjongOpponent';
import RenderDirection from '../../../../pixi/directions';
import SpriteFactory from '../../../../pixi/SpriteFactory';
import TileFactory from '../../Tile/TileFactory';

const mockCanvasRef = {
  current: {
    clientHeight: 1080,
    clientWidth: 1920,
  },
} as React.RefObject<HTMLDivElement>;

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
  const hand = mjOpponent.renderMahjongHand(spriteFactory, mockCanvasRef);
  expect(hand.children).toHaveLength(14); // 13 tiles and 1 container for playedTiles
});

test('MahjongOpponent - renderMahjongHand() and drawn', () => {
  mjOpponent.drawTile();
  const hand = mjOpponent.renderMahjongHand(spriteFactory, mockCanvasRef);
  expect(hand.children).toHaveLength(15); // 14 tiles and 1 container for playedTiles
});

test('MahjongOpponent - renderMahjongHand() with playedTiles', () => {
  mjOpponent.addPlayedTiles(SAMPLE_TILE_ARRAY);
  let hand = mjOpponent.renderMahjongHand(spriteFactory, mockCanvasRef);
  expect(hand.children).toHaveLength(12); // 11 tiles and 1 container for playedTiles

  mjOpponent.removeAllAssets();
  mjOpponent.addPlayedTiles(SAMPLE_TILE_ARRAY);
  hand = mjOpponent.renderMahjongHand(spriteFactory, mockCanvasRef);
  expect(hand.children).toHaveLength(10); // 8 tiles and 1 container for playedTiles
});

test('MahjongOpponent - render()', () => {
  mjOpponent.render(spriteFactory, pixiStage, false, mockCanvasRef);

  expect(mjOpponent.getContainer().children).toHaveLength(2);
  expect(pixiStage.children).toHaveLength(1);
});

test('MahjongOpponent - removeAllAssets()', () => {
  mjOpponent.render(spriteFactory, pixiStage, false, mockCanvasRef);
  mjOpponent.removeAllAssets();
  expect(mjOpponent.getContainer().children).toHaveLength(0);

  mjOpponent.render(spriteFactory, pixiStage, false, mockCanvasRef);
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

  /**
   * Cannot test reposition as it is dependent on clientHeight/clientWidth
   * As we cannot modify the clientHeight/clientWidth of the canvas element
   * the result is always 0
   */

  expect(mjOpponent.getContainer().x).toBe(0);
  expect(mjOpponent.getContainer().y).toBe(0);

  mjOpponent = new MahjongOpponent(NAME, CONNECTION_ID, LOCATION_RIGHT);
  mjOpponent.reposition(canvas);
  expect(mjOpponent.getContainer().x).toBe(-1);
  expect(mjOpponent.getContainer().y).toBe(0);
  mjOpponent.render(spriteFactory, pixiStage, false, mockCanvasRef);
  expect(mjOpponent.getContainer().children).toHaveLength(2);

  mjOpponent.removeAllAssets();
  mjOpponent.render(spriteFactory, pixiStage, true, mockCanvasRef);
  expect(mjOpponent.getContainer().children).toHaveLength(3); // 2 + 1 for its turn

  mjOpponent = new MahjongOpponent(NAME, CONNECTION_ID, LOCATION_TOP);
  mjOpponent.reposition(canvas);
  expect(mjOpponent.getContainer().x).toBe(0);
  expect(mjOpponent.getContainer().y).toBe(0);
  mjOpponent.render(spriteFactory, pixiStage, false, mockCanvasRef);
  expect(mjOpponent.getContainer().children).toHaveLength(2);
});

test('MahjongOpponent - setHasDrawn()', () => {
  expect(mjOpponent.getHand().getHasDrawn()).toBeFalsy();
  mjOpponent.drawTile();
  expect(mjOpponent.getHand().getHasDrawn()).toBeTruthy();
});

test('MahjongOpponent - playedTile()', () => {
  mjOpponent.drawTile();
  mjOpponent.playedTile();
  expect(mjOpponent.getHand().getHasDrawn()).toBeFalsy();
});

test('MahjongOpponent - resetEverything()', () => {
  mjOpponent.drawTile();
  mjOpponent.playedTile();
  mjOpponent.render(spriteFactory, pixiStage, true, mockCanvasRef);

  mjOpponent.resetEverything();
  expect(mjOpponent.getContainer().children).toHaveLength(0);
  expect(mjOpponent.getHand().getNumberOfTiles()).toBe(13);
});
