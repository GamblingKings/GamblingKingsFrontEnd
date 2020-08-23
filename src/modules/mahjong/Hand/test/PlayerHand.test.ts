import PlayerHand from '../PlayerHand';
import TileFactory from '../../Tile/TileFactory';
import Tile from '../../Tile/Tile';
import WindEnums from '../../enums/WindEnums';

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

let tiles: Tile[];
const tilesNot13 = tileStringsNot13.map((tile) => TileFactory.createTileFromStringDef(tile));
const tileMeld = tileStringMeld.map((tile) => TileFactory.createTileFromStringDef(tile));
const DOT_7 = TileFactory.createTileFromStringDef('7_DOT');
const BONUS_TILE = TileFactory.createTileFromStringDef('3_FLOWER');

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
  fullHand.draw(TileFactory.createTileFromStringDef('7_DOT'));
  expect(fullHand.throw()).toStrictEqual(TileFactory.createTileFromStringDef('7_DOT'));
  expect(fullHand.getTiles()).toHaveLength(13);
  expect(fullHand.getSelectedTile()).toBe(-1);

  expect(fullHand.throw()).toBeNull();
});

test('PlayerHand - draw()', () => {
  fullHand.draw(TileFactory.createTileFromStringDef('7_DOT'));
  fullHand.setSelectedTile(0);
  fullHand.throw();
  expect(fullHand.getTiles()).toHaveLength(13);
  expect(fullHand.getTiles()).toStrictEqual(tiles);
});

test('PlayerHand - draw() - cannot draw', () => {
  fullHand.setMadeMeld(true);
  expect(fullHand.draw(TileFactory.createTileFromStringDef('7_DOT'))).toBeFalsy();
});

test('PlayerHand - getFlowerNumber()', () => {
  expect(emptyHand.getFlowerNumber()).toBe(1);
  expect(fullHand.getFlowerNumber()).toBe(1);
});

test('PlayerHand - setFlowerNumber()', () => {
  expect(emptyHand.getFlowerNumber()).toBe(1);
  expect(fullHand.getFlowerNumber()).toBe(1);
  expect(emptyHand.setFlowerNumber(2)).toBeTruthy();
  expect(emptyHand.getFlowerNumber()).toBe(2);
  expect(emptyHand.setFlowerNumber(3)).toBeTruthy();
  expect(emptyHand.getFlowerNumber()).toBe(3);
  expect(emptyHand.setFlowerNumber(4)).toBeTruthy();
  expect(emptyHand.getFlowerNumber()).toBe(4);
  expect(emptyHand.setFlowerNumber(0)).toBeFalsy();
  expect(emptyHand.getFlowerNumber()).toBe(4);
});

test('PlayerHand - getWind()', () => {
  expect(emptyHand.getWind()).toBe(WindEnums.EAST);
  expect(fullHand.getWind()).toBe(WindEnums.EAST);
});

test('PlayerHand - setWind()', () => {
  expect(emptyHand.getWind()).toBe(WindEnums.EAST);
  expect(emptyHand.setWind(WindEnums.SOUTH)).toBeTruthy();
  expect(emptyHand.getWind()).toBe(WindEnums.SOUTH);
  expect(emptyHand.setWind(WindEnums.WEST)).toBeTruthy();
  expect(emptyHand.getWind()).toBe(WindEnums.WEST);
  expect(emptyHand.setWind(WindEnums.NORTH)).toBeTruthy();
  expect(emptyHand.getWind()).toBe(WindEnums.NORTH);
  expect(emptyHand.setWind('SOMETHING' as WindEnums)).toBeFalsy();
  expect(emptyHand.getWind()).toBe(WindEnums.NORTH);
});

test('PlayerHand - removeTiles()', () => {
  const tilesToRemove = [TileFactory.createTileFromStringDef('8_DOT'), TileFactory.createTileFromStringDef('8_DOT')];
  expect(fullHand.removeTiles(tilesToRemove)).toBeTruthy();
  expect(fullHand.getTiles()).toHaveLength(11);
});

test('PlayerHand - removeTiles() - bad request', () => {
  const tilesToRemove = [TileFactory.createTileFromStringDef('8_DOT'), TileFactory.createTileFromStringDef('9_DOT')];
  expect(fullHand.removeTiles(tilesToRemove)).toBeFalsy();
});

test('PlayerHand - formQuad() alreadymeld false', () => {
  fullHand.formQuad(DOT_7, false);
  const quadMeld = [DOT_7, DOT_7, DOT_7, DOT_7];
  expect(fullHand.getPlayedTiles()[0]).toStrictEqual(quadMeld);
  expect(fullHand.getTiles()).toHaveLength(10);
});

test('PlayerHand - formQuad() alreadymeld true', () => {
  const triplet = [DOT_7, DOT_7, DOT_7];
  fullHand.addPlayedTiles([BONUS_TILE]);
  fullHand.addPlayedTiles(triplet);
  fullHand.removeTiles(triplet);
  fullHand.formQuad(DOT_7, true);
  const quadMeld = [DOT_7, DOT_7, DOT_7, DOT_7];
  expect(fullHand.getPlayedTiles()[1]).toStrictEqual(quadMeld);
  expect(fullHand.getTiles()).toHaveLength(10);
});

test('PlayerHand - resetEverything()', () => {
  const triplet = [DOT_7, DOT_7, DOT_7];
  fullHand.addPlayedTiles([BONUS_TILE]);
  fullHand.addPlayedTiles(triplet);
  fullHand.draw(TileFactory.createTileFromStringDef('7_DOT'));
  fullHand.setSelectedTile(0);

  fullHand.resetEverything();
  expect(fullHand.getTiles()).toStrictEqual([]);
  expect(fullHand.getPlayedTiles()).toStrictEqual([]);
  expect(fullHand.getHasDrawn()).toBeFalsy();
  expect(fullHand.getConcealed()).toBeTruthy();
});
