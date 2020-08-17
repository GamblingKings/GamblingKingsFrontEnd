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
const tile = TileFactory.createTileFromStringDef('1_DOT');
const tile8 = TileFactory.createTileFromStringDef('8_DOT');
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
  const handContainerEmpty = mjPlayer.renderHand(spriteFactory, callbacks);

  expect(handContainerEmpty.children).toHaveLength(1); // 1 child for playedtiles container

  // 13 tiles for front and 13 tiles for back
  mjPlayer.setHand(tiles);
  const handContainerFull = mjPlayer.renderHand(spriteFactory, callbacks);
  expect(handContainerFull.children).toHaveLength(27); // 26 + 1 child for playedtiles container
});

test('MahjongPlayer - render() - empty hand', () => {
  mjPlayer.render(spriteFactory, pixiStage, false, callbacks);
  expect(pixiStage.children).toHaveLength(1);

  mjPlayer.removeAllAssets();
  mjPlayer.setHand(tiles);
  mjPlayer.render(spriteFactory, pixiStage, false, callbacks);
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
  const hand = mjPlayer.renderHand(spriteFactory, callbacks);
  expect(hand.children).toHaveLength(29); // 28 + 1 child for playedtiles container
});

test('MahjongPlayer - renderHand() - with played tiles', () => {
  mjPlayer.setHand(tiles);
  mjPlayer.getHand().addPlayedTiles(SAMPLE_TILE_ARRAY);
  let hand = mjPlayer.renderHand(spriteFactory, callbacks);

  // test will fail when tiles in hand get removed
  expect(hand.children).toHaveLength(27); // 26 + 1 child for playedtiles container
  mjPlayer.removeAllAssets();
  mjPlayer.getHand().addPlayedTiles(SAMPLE_TILE_ARRAY);
  hand = mjPlayer.renderHand(spriteFactory, callbacks);
  // test will fail when tiles in hand get removed
  expect(hand.children).toHaveLength(27); // 26 + 1 child for playedtiles container
});

test('MahjongPlayer - removeAllAssets()', () => {
  mjPlayer.render(spriteFactory, pixiStage, false, callbacks);
  mjPlayer.removeAllAssets();
  expect(mjPlayer.getContainer().children).toHaveLength(0);

  mjPlayer.setHand(tiles);
  mjPlayer.render(spriteFactory, pixiStage, false, callbacks);
  mjPlayer.removeAllAssets();
  expect(mjPlayer.getContainer().children).toHaveLength(0);
});

test('MahjongPlayer - reposition()', () => {
  // canvas width and height are both 0
  mjPlayer.reposition(canvas);

  expect(mjPlayer.getContainer().x).toBe(100);
  expect(mjPlayer.getContainer().y).toBe(-160);
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

  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile());
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);
});

test('MahjongPlayer - renderInteraction() with deadpile', () => {
  deadPile.add(tile8);
  mjPlayer.setHand(tiles);
  mjPlayer.setAllowInteraction(true);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(0);

  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile());
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);
});

test('MahjongPlayer - renderInteraction() with deadpile and skip', () => {
  deadPile.add(tile);
  mjPlayer.setHand(tiles);
  mjPlayer.setAllowInteraction(true);
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(0);

  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile());
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(0); // nothing to render
});

test('MahjongPlayer - renderInteraction() with other parameters', () => {
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(0);

  mjPlayer.setAllowInteraction(true);
  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile());
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);

  mjPlayer.removeAllAssets();
  mjPlayer.setAllowInteraction(false);
  mjPlayer.getHand().draw(tile);
  mjPlayer.renderInteractions(spriteFactory, callbacks, deadPile.getDeadPile());
  expect(mjPlayer.getInteractionContainer().children).toHaveLength(1);
});
