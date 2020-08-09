import HandValidator from '../HandValidator';
import TileFactory from '../../Tile/TileFactory';
import Tile from '../../Tile/Tile';
import validateHandStructure from '../../utils/functions/validateHandStructure';
import WindEnums from '../../enums/WindEnums';

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

const validHandWithAllHonors = [
  'REDDRAGON',
  'REDDRAGON',
  'REDDRAGON',
  'EAST',
  'EAST',
  'GREENDRAGON',
  'GREENDRAGON',
  'GREENDRAGON',
  'WEST',
  'WEST',
  'WEST',
  'NORTH',
  'NORTH',
  'NORTH',
];

const allTripletsHand = [
  '1_DOT',
  '1_DOT',
  '2_DOT',
  '2_DOT',
  '2_DOT',
  '3_DOT',
  '3_DOT',
  '3_DOT',
  '4_DOT',
  '4_DOT',
  '4_DOT',
  '5_DOT',
  '5_DOT',
  '5_DOT',
];

const allConsecutiveHand = [
  '1_DOT',
  '1_DOT',
  '2_CHARACTER',
  '3_CHARACTER',
  '4_CHARACTER',
  '5_CHARACTER',
  '6_CHARACTER',
  '7_CHARACTER',
  '1_BAMBOO',
  '2_BAMBOO',
  '3_BAMBOO',
  '7_BAMBOO',
  '8_BAMBOO',
  '9_BAMBOO',
];

const allConsecutiveWithLipeikou = [
  '1_DOT',
  '1_DOT',
  '2_CHARACTER',
  '3_CHARACTER',
  '4_CHARACTER',
  '5_CHARACTER',
  '6_CHARACTER',
  '7_CHARACTER',
  '1_BAMBOO',
  '2_BAMBOO',
  '3_BAMBOO',
  '2_CHARACTER',
  '3_CHARACTER',
  '4_CHARACTER',
];

const validHandWith4OfaKindNotBeingUsedAs4OfaKind = [
  'EAST',
  'EAST',
  '1_CHARACTER',
  '1_CHARACTER',
  '1_CHARACTER',
  '1_CHARACTER',
  '2_CHARACTER',
  '3_CHARACTER',
  '1_BAMBOO',
  '2_BAMBOO',
  '3_BAMBOO',
  'REDDRAGON',
  'REDDRAGON',
  'REDDRAGON',
];

const validHandWith4OfaKind = [
  'EAST',
  'EAST',
  '1_CHARACTER',
  '1_CHARACTER',
  '1_CHARACTER',
  '1_CHARACTER',
  '2_CHARACTER',
  '3_CHARACTER',
  '4_CHARACTER',
  '1_BAMBOO',
  '2_BAMBOO',
  '3_BAMBOO',
  'REDDRAGON',
  'REDDRAGON',
  'REDDRAGON',
];

const invalidHand = [
  'EAST',
  'EAST',
  '1_CHARACTER',
  '1_CHARACTER',
  '1_CHARACTER',
  'WEST',
  '2_CHARACTER',
  '9_CHARACTER',
  '4_CHARACTER',
  '1_BAMBOO',
  '2_BAMBOO',
  '6_BAMBOO',
  'REDDRAGON',
  'REDDRAGON',
  'REDDRAGON',
];

const validHandWithPurity = [
  '1_CHARACTER',
  '1_CHARACTER',
  '9_CHARACTER',
  '9_CHARACTER',
  '9_CHARACTER',
  '4_CHARACTER',
  '4_CHARACTER',
  '4_CHARACTER',
  '3_CHARACTER',
  '5_CHARACTER',
  '5_CHARACTER',
  '5_CHARACTER',
  '6_CHARACTER',
  '6_CHARACTER',
];

/**
 * Create Tile Mapping Tests
 */
test('Create Tile Mapping function returns an object with the type and amount of each tile', () => {
  const tiles: Tile[] = [];
  validThirteenOrphansHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  const mapping = HandValidator.createTileMapping(tiles);
  expect(mapping['1_DOT']).toBe(2);
});

/**
 * DetermineAllPossiblePairs Tests
 */
test('determineAllPossiblePairs should return an array of 5 objects when passed in the allTriplets hand', () => {
  const tiles: Tile[] = [];
  allTripletsHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  const pairs = HandValidator.determineAllPossiblePairs(tiles);
  expect(pairs).toHaveLength(5);
});

/**
 * validate hand structure tests
 */
test('allTripletHand should have a valid hand structure', () => {
  const result = validateHandStructure(allTripletsHand);
  expect(result.valid.length).toBeGreaterThanOrEqual(1);
});

test('allConsecutiveHand should have a valid hand structure', () => {
  const result = validateHandStructure(allConsecutiveHand);
  expect(result.valid.length).toBeGreaterThanOrEqual(1);
});

test('allConsecutiveHandWithLipeikou should have a valid hand structure', () => {
  const result = validateHandStructure(allConsecutiveWithLipeikou);
  expect(result.valid.length).toBeGreaterThanOrEqual(1);
});

test('validHandWith4OfaKindNotBeingUsedAs4OfaKind should have a valid hand structure', () => {
  const result = validateHandStructure(validHandWith4OfaKindNotBeingUsedAs4OfaKind);
  expect(result.valid.length).toBeGreaterThanOrEqual(1);
});

test('validHandWith4OfaKind should have a valid hand structure', () => {
  const result = validateHandStructure(validHandWith4OfaKind);
  expect(result.valid.length).toBeGreaterThanOrEqual(1);
});

test('invalidHand should not have a valid hand structure', () => {
  const result = validateHandStructure(invalidHand);
  expect(result.valid).toHaveLength(0);
});

test('purityHand should have a valid hand structure', () => {
  const result = validateHandStructure(validHandWithPurity);
  expect(result.valid.length).toBeGreaterThanOrEqual(1);
});

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

test('Validate that the wind gets set correctly', () => {
  const result = validateHandStructure(validHandWithPurity, WindEnums.NORTH);
  expect(result.valid[0].wind).toBe(WindEnums.NORTH);
});

test('Validate that the flower gets set correctly', () => {
  const result = validateHandStructure(validHandWithPurity, WindEnums.NORTH, 3);
  expect(result.valid[0].flower).toBe(3);
});

/**
 * Can Create Melds Tests
 */

test('Validate that can create Melds will work for triplets and Consecutives', () => {
  const tiles: Tile[] = [];
  allTripletsHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  const spliced = tiles.splice(tiles.length - 1, 1);
  const results = HandValidator.canCreateMeld(tiles, spliced[0]);
  expect(results.triplet.canCreate).toBeTruthy();
  expect(results.consecutive.canCreate).toBeTruthy();
});

test('Validate that canCreateMelds will work for quads', () => {
  const tiles: Tile[] = [];
  validHandWithPurity.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  const kongTile = TileFactory.createTileFromStringDef('9_CHARACTER');
  const results = HandValidator.canCreateMeld(tiles, kongTile);
  expect(results.quad.canCreate).toBeTruthy();
  expect(results.triplet.canCreate).toBeFalsy();
});

test('Validate that canCreateMelds will only create a triplet for honor hands', () => {
  const tiles: Tile[] = [];
  validHandWithAllHonors.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  const spliced = tiles.splice(1, 1);
  const results = HandValidator.canCreateMeld(tiles, spliced[0]);
  expect(results.triplet.canCreate).toBeTruthy();
  expect(results.consecutive.canCreate).toBeFalsy();
});

test('Validate that if the take tile is 9 charaacter, you can only create one meld', () => {
  const tiles: Tile[] = [];
  allConsecutiveHand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  const spliced = tiles.splice(tiles.length - 1, 1);
  const results = HandValidator.canCreateMeld(tiles, spliced[0]);
  expect(results.consecutive.canCreate).toBeTruthy();
  expect(results.consecutive.melds).toHaveLength(1);
});

test('Validate that if we take a middle tile, there will be two melds - one for upper, for for lower', () => {
  const tiles: Tile[] = [];
  allConsecutiveWithLipeikou.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  const spliced = tiles.splice(5, 1);
  const results = HandValidator.canCreateMeld(tiles, spliced[0]);
  expect(results.consecutive.canCreate).toBeTruthy();
  expect(results.consecutive.melds).toHaveLength(2);
});
