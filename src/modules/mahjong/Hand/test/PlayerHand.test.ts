import PlayerHand from '../PlayerHand';
import TileFactory from '../../Tile/TileFactory';

let emptyHand: PlayerHand;
let fullHand: PlayerHand;

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
const tileStringsNot13 = ['EAST'];
const tileStringMeld = ['NORTH', 'NORTH', 'NORTH'];

let tiles: Tiles[];
const tilesNot13 = tileStringsNot13.map((tile) => TileFactory.createTileFromStringDef(tile));
const tileMeld = tileStringMeld.map((tile) => TileFactory.createTileFromStringDef(tile));

beforeEach(() => {
  tiles = tileStrings.map((tile) => TileFactory.createTileFromStringDef(tile));
  emptyHand = new PlayerHand();
  fullHand = new PlayerHand(tiles);
});

test('PlayerHand - getTiles()', () => {
  expect(emptyHand.getTiles()).toHaveLength(0);
  expect(fullHand.getTiles()).toHaveLength(13);
});

test('PlayerHand - setTiles()', () => {
  expect(emptyHand.setTiles(tilesNot13)).toBeFalsy();
  expect(fullHand.setTiles(tilesNot13)).toBeFalsy();
  expect(emptyHand.setTiles(tiles)).toBeTruthy();
  expect(emptyHand.getTiles()).toHaveLength(13);
});

test('PlayerHand - getPlayedTiles()', () => {
  expect(emptyHand.getPlayedTiles()).toHaveLength(0);
  expect(fullHand.getPlayedTiles()).toHaveLength(0);
});

test('PlayerHand - addPlayedTiles()', () => {
  expect(fullHand.getPlayedTiles()).toHaveLength(0);
  expect(fullHand.addPlayedTiles(tileMeld)).toBeTruthy();
  expect(fullHand.getPlayedTiles()).toHaveLength(1);
});

test('PlayerHand - getSelectedTile()', () => {
  expect(fullHand.getSelectedTile()).toBe(-1);
  expect(emptyHand.getSelectedTile()).toBe(-1);
});

test('PlayerHand - setSelectedTile()', () => {
  expect(fullHand.setSelectedTile(15)).toBeFalsy();
  expect(fullHand.setSelectedTile(-2)).toBeFalsy();
  expect(emptyHand.setSelectedTile(0)).toBeFalsy();

  expect(fullHand.setSelectedTile(8)).toBeTruthy();
  expect(fullHand.getSelectedTile()).toBe(8);
  expect(fullHand.setSelectedTile(8)).toBeTruthy();
  expect(fullHand.getSelectedTile()).toBe(-1);

  expect(fullHand.setSelectedTile(3)).toBeTruthy();
  expect(fullHand.getSelectedTile()).toBe(3);
  expect(fullHand.setSelectedTile(0)).toBeTruthy();
  expect(fullHand.getSelectedTile()).toBe(0);
});

test('PlayerHand - throw()', () => {
  fullHand.setSelectedTile(0);
  expect(fullHand.throw()).toStrictEqual(TileFactory.createTileFromStringDef('7_DOT'));
  expect(fullHand.getTiles()).toHaveLength(12);
  expect(fullHand.getSelectedTile()).toBe(-1);

  expect(fullHand.throw()).toBeNull();
});

test('PlayerHand - draw()', () => {
  fullHand.setSelectedTile(0);
  fullHand.throw();
  fullHand.draw(TileFactory.createTileFromStringDef('7_DOT'));
  expect(fullHand.getTiles()).toHaveLength(13);
  fullHand.sortHand(PlayerHand.generateHandWeights());
  expect(fullHand.getTiles()).toStrictEqual(tiles);
});
