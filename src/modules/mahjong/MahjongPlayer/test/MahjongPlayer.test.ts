import 'jest-webgl-canvas-mock';
import * as PIXI from 'pixi.js';
import jsdom from 'jsdom';

import MahjongPlayer from '../MahjongPlayer';
import SpriteFactory from '../../../../pixi/SpriteFactory';
import TileFactory from '../../Tile/TileFactory';
import Tile from '../../Tile/Tile';
import WindEnums from '../../enums/WindEnums';
import DeadPile from '../../DeadPile/DeadPile';
import { OutgoingAction } from '../../../ws';

const { JSDOM } = jsdom;
const dom = new JSDOM();
const canvas = dom.window.document.createElement('canvas');

const mockCanvasRef = {
  current: {
    clientHeight: 1080,
    clientWidth: 1920,
  },
} as React.RefObject<HTMLDivElement>;

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

const winnableTileStrings = [
  '7_DOT',
  '7_DOT',
  '7_DOT',
  '8_DOT',
  '8_DOT',
  '2_BAMBOO',
  '2_BAMBOO',
  '2_BAMBOO',
  '9_CHARACTER',
  '9_CHARACTER',
  '9_CHARACTER',
  'NORTH',
  'NORTH',
];
const winnableTiles = winnableTileStrings.map((tile) => TileFactory.createTileFromStringDef(tile));

let tiles: Tile[];
const tile = TileFactory.createTileFromStringDef('1_DOT');
const tile8 = TileFactory.createTileFromStringDef('8_DOT');
const tile7 = TileFactory.createTileFromStringDef('7_DOT');
let deadPile: DeadPile;

const spriteFactory = new SpriteFactory({});
const callbacks = {
  [OutgoingAction.PLAYED_TILE_INTERACTION]: () => console.log('played tile callback'),
  REQUEST_REDRAW: () => console.log('redraw callback'),
};
let pixiStage: PIXI.Container;

const NAME = 'Jay Chou';
let mjPlayer: MahjongPlayer;

const SAMPLE_TILE_ARRAY = [
  TileFactory.createTileFromStringDef('2_DOT'),
  TileFactory.createTileFromStringDef('3_DOT'),
  TileFactory.createTileFromStringDef('4_DOT'),
];

beforeEach(() => {
  tiles = tileStrings.map((t) => TileFactory.createTileFromStringDef(t));
  deadPile = new DeadPile();
  mjPlayer = new MahjongPlayer(NAME, 'ASDF');
  pixiStage = new PIXI.Container();
});

test('MahjongPlayer - getName()', () => {
  expect(mjPlayer.getName()).toStrictEqual(NAME);
});

test('MahjongPlayer - getContainer() - Init to be empty', () => {
  expect(mjPlayer.getContainer().children).toHaveLength(0);
});

test('MahjongPlayer - setHand() / getHand()', () => {
  expect(mjPlayer.getHand().getTiles()).toHaveLength(0);
  mjPlayer.setHand(tiles);
  expect(mjPlayer.getHand().getTiles()).toStrictEqual(tiles);
});

test('MahjongPlayer - renderName()', () => {
  const pixiText = mjPlayer.renderName();
  expect(pixiText.text).toBe(NAME);
});

test('MahjongPlayer - renderHand()', () => {
  // Empty hand
  const handContainerEmpty = mjPlayer.renderHand(spriteFactory, callbacks, mockCanvasRef);

  expect(handContainerEmpty.children).toHaveLength(1); // 1 child for playedtiles container

  // 13 tiles for front and 13 tiles for back
  mjPlayer.setHand(tiles);
  const handContainerFull = mjPlayer.renderHand(spriteFactory, callbacks, mockCanvasRef);
  expect(handContainerFull.children).toHaveLength(27); // 26 + 1 child for playedtiles container
});

test('MahjongPlayer - render() - empty hand', () => {
  mjPlayer.render(spriteFactory, pixiStage, false, mockCanvasRef, callbacks);
  expect(pixiStage.children).toHaveLength(1);

  mjPlayer.removeAllAssets();
  mjPlayer.setHand(tiles);
  mjPlayer.render(spriteFactory, pixiStage, false, mockCanvasRef, callbacks);
  expect(pixiStage.children).toHaveLength(1);
});

test('MahjongPlayer - render() - full hand', () => {
  mjPlayer.setHand(tiles);
  mjPlayer.render(spriteFactory, pixiStage, false, callbacks);
  expect(pixiStage.children).toHaveLength(1);

  mjPlayer.getHand()?.setSelectedTile(2);
  mjPlayer.removeAllAssets();
  mjPlayer.render(spriteFactory, pixiStage, false, callbacks);
  expect(pixiStage.children).toHaveLength(1);
  mjPlayer.removeAllAssets();
  mjPlayer.render(spriteFactory, pixiStage, true, callbacks);
  expect(mjPlayer.getContainer().children).toHaveLength(4);
  expect(pixiStage.children).toHaveLength(1);
});

test('MahjongPlayer - renderHand() - has drawn tile', () => {
  mjPlayer.setHand(tiles);
  mjPlayer.getHand().draw(tile);
  const hand = mjPlayer.renderHand(spriteFactory, callbacks, mockCanvasRef);
  expect(hand.children).toHaveLength(29); // 28 + 1 child for playedtiles container
});

test('MahjongPlayer - renderHand() - with played tiles', () => {
  mjPlayer.setHand(tiles);
  mjPlayer.getHand().addPlayedTiles(SAMPLE_TILE_ARRAY);
  let hand = mjPlayer.renderHand(spriteFactory, callbacks, mockCanvasRef);

  // test will fail when tiles in hand get removed
  expect(hand.children).toHaveLength(27); // 26 + 1 child for playedtiles container
  mjPlayer.removeAllAssets();
  mjPlayer.getHand().addPlayedTiles(SAMPLE_TILE_ARRAY);
  hand = mjPlayer.renderHand(spriteFactory, callbacks, mockCanvasRef);
  // test will fail when tiles in hand get removed
  expect(hand.children).toHaveLength(27); // 26 + 1 child for playedtiles container
});

test('MahjongPlayer - removeAllAssets()', () => {
  mjPlayer.render(spriteFactory, pixiStage, false, mockCanvasRef, callbacks);
  mjPlayer.removeAllAssets();
  expect(mjPlayer.getContainer().children).toHaveLength(0);

  mjPlayer.setHand(tiles);
  mjPlayer.render(spriteFactory, pixiStage, false, mockCanvasRef, callbacks);
  mjPlayer.removeAllAssets();
  expect(mjPlayer.getContainer().children).toHaveLength(0);
});

test('MahjongPlayer - reposition()', () => {
  // canvas width and height are both 0
  mjPlayer.reposition(canvas);

  // Can't test as x and y are dependent on clientHeight/clientWidth which cannot be changed from 0
  expect(mjPlayer.getContainer().x).toBe(0);
  expect(mjPlayer.getContainer().y).toBe(0);
});

test('MahjongPlayer - setWindAndFlower()', () => {
  expect(mjPlayer.setWindAndFlower(WindEnums.SOUTH, 4)).toBeTruthy();
  expect(mjPlayer.setWindAndFlower(WindEnums.SOUTH, 3)).toBeTruthy();
  expect(mjPlayer.setWindAndFlower(WindEnums.SOUTH, 2)).toBeTruthy();
  expect(mjPlayer.setWindAndFlower(WindEnums.SOUTH, 1)).toBeTruthy();
  expect(mjPlayer.setWindAndFlower(WindEnums.SOUTH, 0)).toBeFalsy();
  expect(mjPlayer.setWindAndFlower(WindEnums.SOUTH, 5)).toBeFalsy();
});

test('MahjongPlayer - addHandToTile()', () => {
  mjPlayer.setHand(tiles);
  mjPlayer.addTileToHand(tile);
  expect(mjPlayer.getHand().getTiles()).toHaveLength(14);
});

test('MahjongPlayer - getInteractionContainer() empty', () => {
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(0);
});

test('MahjongPlayer - getAllowInteraction()', () => {
  expect(mjPlayer.getAllowInteraction()).toBeFalsy();
  mjPlayer.setAllowInteraction(true);
  expect(mjPlayer.getAllowInteraction()).toBeTruthy();
  mjPlayer.setAllowInteraction(false);
  expect(mjPlayer.getAllowInteraction()).toBeFalsy();
});

test('MahjongPlayer - renderInteraction()', () => {
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(0);

  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile(), false, WindEnums.EAST, mockCanvasRef);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);
});

test('MahjongPlayer - renderInteraction() with deadpile', () => {
  deadPile.add(tile8);
  mjPlayer.setHand(tiles);
  mjPlayer.setAllowInteraction(true);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(0);

  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile(), false, WindEnums.EAST, mockCanvasRef);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);
});

test('MahjongPlayer - renderInteraction() with deadpile and skip', () => {
  deadPile.add(tile);
  mjPlayer.setHand(tiles);
  mjPlayer.setAllowInteraction(true);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(0);

  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile(), false, WindEnums.EAST, mockCanvasRef);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1); // empty container
});

test('MahjongPlayer - renderInteraction() with other parameters', () => {
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(0);

  mjPlayer.setAllowInteraction(true);
  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile(), false, WindEnums.EAST, mockCanvasRef);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);

  mjPlayer.removeAllAssets();
  mjPlayer.setAllowInteraction(false);
  mjPlayer.getHand().draw(tile);
  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile(), false, WindEnums.EAST, mockCanvasRef);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);
});

test('MahjongPlayer - getTimer()', () => {
  const timer = mjPlayer.getTimer();
  expect(timer.getIsRunning()).toBeFalsy();
});

test('MahjongPlayer - canWin + renderInteraction()', () => {
  mjPlayer.setHand(winnableTiles);
  deadPile.add(tile8);
  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile(), false, WindEnums.EAST, mockCanvasRef);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);
});

test('MahjongPlayer - canWin selfdrawn + renderInteraction()', () => {
  mjPlayer.setHand(winnableTiles);
  mjPlayer.addTileToHand(tile8);
  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile(), false, WindEnums.EAST, mockCanvasRef);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);
});

test('MahjongPlayer - renderInteractionsWithPlayedTiles()', () => {
  const container = new PIXI.Container();
  mjPlayer.setAllowInteraction(true);
  mjPlayer.setHand(winnableTiles);
  deadPile.add(tile8);
  mjPlayer.renderInteractionsWithPlayedTile(
    spriteFactory,
    callbacks,
    deadPile.getDeadPile(),
    false,
    WindEnums.EAST,
    container,
  );
  expect(container.children).toHaveLength(1);
});

test('MahjongPlayer - renderInteractions() with quad', () => {
  mjPlayer.setHand(tiles);
  mjPlayer.addTileToHand(tile7);
  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile(), false, WindEnums.EAST, mockCanvasRef);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);
});

test('MahjongPlayer - resetEverything()', () => {
  mjPlayer.setHand(tiles);
  mjPlayer.addTileToHand(tile7);
  mjPlayer.setAllowInteraction(true);
  mjPlayer.render(spriteFactory, pixiStage, false, mockCanvasRef, callbacks);

  mjPlayer.resetEverything();

  expect(mjPlayer.getAllowInteraction()).toBeFalsy();
  expect(mjPlayer.getContainer().children).toHaveLength(0);
  expect(mjPlayer.getHand().getTiles()).toStrictEqual([]);
});
