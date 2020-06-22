import HandValidator from '../HandValidator';
import TileFactory from '../../Tile/TileFactory';
import Tile from '../../Tile/Tile';

const validThirteenOrphansHand = [
  '1_DOT',
  '9_DOT',
  '1_CHARACTER',
  '9_CHARACTER',
  '1_BAMBOO',
  '9_BAMBOO',
  'EAST',
  'SOUTH',
  'WEST',
  'NORTH',
  'REDDRAGON',
  'GREENDRAGON',
  'WHITEDRAGON',
  '1_DOT',
];

/**
 * Validate Hand Length Test
 */

test('Validate Hand length function should return true if hand length is 14', () => {
  const tiles: Tile[] = [];
  validThirteenOrphansHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  expect(HandValidator.validateHandLength(tiles)).toBeTruthy();
});

test('Validate Hand length function should return false if hand length is less than 14', () => {
  const tiles: Tile[] = [];
  validThirteenOrphansHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  tiles.pop();
  expect(HandValidator.validateHandLength(tiles)).toBeFalsy();
});

test('Validate Hand length function should return false if hand length is greater than 14', () => {
  const tiles: Tile[] = [];
  validThirteenOrphansHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  tiles.push(TileFactory.createTileFromStringDef('1_CHARACTER'));
  expect(HandValidator.validateHandLength(tiles)).toBeFalsy();
});

/**
 * Validate Thirteen Orphans Tests
 */

test('Validate Thirteen Orphans returns true for a valid thirteen terminals hand', () => {
  const tiles: Tile[] = [];
  validThirteenOrphansHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  expect(HandValidator.validateThirteenOrphans(tiles)).toBeTruthy();
});

test('Validate Thirteen Orphans returns false if the 14th tile is not one of the 13 Orphan tiles', () => {
  const tiles: Tile[] = [];
  validThirteenOrphansHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  tiles.splice(tiles.length - 1, 1, TileFactory.createTileFromStringDef('2_CHARACTER'));
  expect(HandValidator.validateThirteenOrphans(tiles)).toBeFalsy();
});

test('Validate Thirteen Orphans returns false if hand does not contain all 13 required tiles', () => {
  const tiles: Tile[] = [];
  validThirteenOrphansHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  tiles.splice(1, 1, TileFactory.createTileFromStringDef('GREENDRAGON'));
  expect(HandValidator.validateThirteenOrphans(tiles)).toBeFalsy();
});
