import PointValidator from '../PointValidator';
import validateHandStructure from '../../utils/functions/validateHandStructure';
import HKHandMapper from '../../Hand/map/HKHandMapper';
import TileFactory from '../../Tile/TileFactory';
import MeldTypes from '../../enums/MeldEnums';
import WindEnums from '../../enums/WindEnums';

const mixedConsecutiveAndTripletHand = [
  '1_DOT',
  '1_DOT',
  '3_BAMBOO',
  '3_BAMBOO',
  '3_BAMBOO',
  '4_CHARACTER',
  '5_CHARACTER',
  '6_CHARACTER',
  '7_BAMBOO',
  '8_BAMBOO',
  '9_BAMBOO',
  '9_DOT',
  '9_DOT',
  '9_DOT',
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
  '7_CHARACTER',
  '7_CHARACTER',
  '7_CHARACTER',
];

const allTripletsHandWithPurity = [
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

const allTripletsHandWithSemiPurity = [
  'REDDRAGON',
  'REDDRAGON',
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

const allConsecutiveHandWithPurity = [
  '1_CHARACTER',
  '1_CHARACTER',
  '2_CHARACTER',
  '3_CHARACTER',
  '4_CHARACTER',
  '5_CHARACTER',
  '6_CHARACTER',
  '7_CHARACTER',
  '1_CHARACTER',
  '2_CHARACTER',
  '3_CHARACTER',
  '7_CHARACTER',
  '8_CHARACTER',
  '9_CHARACTER',
];

const validHandWith4OfaKind = [
  'EAST',
  'EAST',
  '1_CHARACTER',
  '1_CHARACTER',
  '1_CHARACTER',
  '1_CHARACTER',
  '2_BAMBOO',
  '2_BAMBOO',
  '2_BAMBOO',
  '3_BAMBOO',
  '3_BAMBOO',
  '3_BAMBOO',
  'REDDRAGON',
  'REDDRAGON',
  'REDDRAGON',
];

const validHandWithSemiPurity = [
  'REDDRAGON',
  'REDDRAGON',
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

const validHandWithSemiPurityExample2 = [
  '1_CHARACTER',
  '1_CHARACTER',
  'GREENDRAGON',
  'GREENDRAGON',
  'GREENDRAGON',
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

const validHandWithSmallDragons = [
  'REDDRAGON',
  'REDDRAGON',
  'GREENDRAGON',
  'GREENDRAGON',
  'GREENDRAGON',
  'WHITEDRAGON',
  'WHITEDRAGON',
  'WHITEDRAGON',
  '1_CHARACTER',
  '2_CHARACTER',
  '3_CHARACTER',
  '1_DOT',
  '1_DOT',
  '1_DOT',
];

const validHandWithLargeDragons = [
  'REDDRAGON',
  'REDDRAGON',
  'REDDRAGON',
  'GREENDRAGON',
  'GREENDRAGON',
  'GREENDRAGON',
  'WHITEDRAGON',
  'WHITEDRAGON',
  'WHITEDRAGON',
  '1_CHARACTER',
  '1_CHARACTER',
  '1_DOT',
  '2_DOT',
  '3_DOT',
];

const validHandWithSmallWinds = [
  'EAST',
  'EAST',
  'WEST',
  'SOUTH',
  'NORTH',
  'WEST',
  'SOUTH',
  'NORTH',
  'WEST',
  'SOUTH',
  'NORTH',
  '1_DOT',
  '1_DOT',
  '1_DOT',
];

const validHandWithLargeWinds = [
  'EAST',
  'EAST',
  'EAST',
  'EAST',
  'WEST',
  'SOUTH',
  'NORTH',
  'WEST',
  'SOUTH',
  'NORTH',
  'WEST',
  'SOUTH',
  'NORTH',
  '1_DOT',
  '1_DOT',
];

const validHandWithAllKongs = [
  '1_CHARACTER',
  '1_CHARACTER',
  '9_CHARACTER',
  '9_CHARACTER',
  '9_CHARACTER',
  '9_CHARACTER',
  '1_DOT',
  '1_DOT',
  '1_DOT',
  '1_DOT',
  '9_DOT',
  '9_DOT',
  '9_DOT',
  '9_DOT',
  '1_BAMBOO',
  '1_BAMBOO',
  '1_BAMBOO',
  '1_BAMBOO',
];

const validHandWithThirteenOrphans = [
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
  '1_FLOWER',
  '2_FLOWER',
];

const flowers = ['1_FLOWER', '1_SEASON', '2_FLOWER', '2_SEASON', '3_FLOWER', '3_SEASON', '4_FLOWER', '4_SEASON'];
const dragonMelds = [
  {
    tiles: ['REDDRAGON', 'REDDRAGON', 'REDDRAGON', 'REDDRAGON'],
    type: MeldTypes.QUAD,
  },
  {
    tiles: ['GREENDRAGON', 'GREENDRAGON', 'GREENDRAGON'],
    type: MeldTypes.TRIPLET,
  },
  {
    tiles: ['WHITEDRAGON', 'WHITEDRAGON', 'WHITEDRAGON'],
    type: MeldTypes.TRIPLET,
  },
];

const otherMelds = [
  {
    tiles: ['1_CHARACTER', '1_CHARACTER', '1_CHARACTER', '1_CHARACTER'],
    type: MeldTypes.QUAD,
  },
  {
    tiles: ['EAST', 'EAST', 'EAST'],
    type: MeldTypes.TRIPLET,
  },
  {
    tiles: ['1_DOT', '2_DOT', '3_DOT'],
    type: MeldTypes.CONSECUTIVE,
  },
];

const windMelds = [
  {
    tiles: ['EAST', 'EAST', 'EAST', 'EAST'],
    type: MeldTypes.QUAD,
  },
  {
    tiles: ['SOUTH', 'SOUTH', 'SOUTH'],
    type: MeldTypes.TRIPLET,
  },
  {
    tiles: ['WEST', 'WEST', 'WEST'],
    type: MeldTypes.TRIPLET,
  },
  {
    tiles: ['NORTH', 'NORTH', 'NORTH'],
    type: MeldTypes.TRIPLET,
  },
];

// ####################### validateAllConsecutives ################################
test('Verfies a valid case for validateAllConsecutives', () => {
  const result = validateHandStructure(allConsecutiveHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllConsecutives(vp).points;
    expect(point).toEqual(HKHandMapper.ALL_CONSECUTIVE.points);
  }
});

test('Verifies an invalid case for validateAllConsecutives using allTriplets', () => {
  const result = validateHandStructure(allTripletsHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllConsecutives(vp).points;
    expect(point).toEqual(HKHandMapper.INVALID.points);
  }
});

test('Verifies an invalid case for validateAllConsecutives using mixedConsecutiveAndTripletHand', () => {
  const result = validateHandStructure(mixedConsecutiveAndTripletHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllConsecutives(vp).points;
    expect(point).toEqual(HKHandMapper.INVALID.points);
  }
});

// ####################### validateAllTriplets ################################
test('Verfies a valid case for validateAllTriplets', () => {
  const result = validateHandStructure(allTripletsHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllTriplets(vp).points;
    expect(point).toEqual(HKHandMapper.ALL_TRIPLET.points);
  }
});

test('Verfies a valid case for validateAllTriplets using a hand with 4 of a kind', () => {
  const result = validateHandStructure(validHandWith4OfaKind);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllTriplets(vp).points;
    expect(point).toEqual(HKHandMapper.ALL_TRIPLET.points);
  }
});

test('Verifies an invalid case for validateAllTriplets using mixedConsecutiveesAndTripletsHand', () => {
  const result = validateHandStructure(mixedConsecutiveAndTripletHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllTriplets(vp).points;
    expect(point).toEqual(HKHandMapper.INVALID.points);
  }
});

// ####################### validateSemiPurity ################################

test('Verifies a valid case for validateSemiPurity', () => {
  const result = validateHandStructure(validHandWithSemiPurity);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSemiPurity(vp).points;
    expect(point).toEqual(HKHandMapper.SEMI_PURITY.points);
  }
});

test('Verifies a valid case for validateSemiPurity using example 2', () => {
  const result = validateHandStructure(validHandWithSemiPurityExample2);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSemiPurity(vp).points;
    expect(point).toEqual(HKHandMapper.SEMI_PURITY.points);
  }
});

test('Verifies an invalid case for validateSemiPurity using allConsecutiveHand', () => {
  const result = validateHandStructure(allConsecutiveHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSemiPurity(vp).points;
    expect(point).toEqual(HKHandMapper.INVALID.points);
  }
});

// ####################### validatePurity ################################

test('Verifies a valid case for validatePurity', () => {
  const result = validateHandStructure(validHandWithPurity);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validatePurity(vp).points;
    expect(point).toEqual(HKHandMapper.PURITY.points);
  }
});

test('Verifies an invalid case for validatePurity with SemiPurity hand', () => {
  const result = validateHandStructure(validHandWithSemiPurity);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validatePurity(vp).points;
    expect(point).toEqual(HKHandMapper.INVALID.points);
  }
});

// ####################### validateAllHonors ################################
test('Verfies a valid case for validateAllHonors with validHandWithAllHonors', () => {
  const result = validateHandStructure(validHandWithAllHonors);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllHonors(vp).points;
    expect(point).toEqual(HKHandMapper.ALL_HONORS.points);
  }
});

test('Verifies an invalid case for validateAllHonors with SemiPurity hand', () => {
  const result = validateHandStructure(validHandWithSemiPurity);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllHonors(vp).points;
    expect(point).toEqual(HKHandMapper.INVALID.points);
  }
});

// ####################### validateSmallAndLargeDragons ################################
test('Verifies a valid case for validate small dragons', () => {
  const result = validateHandStructure(validHandWithSmallDragons);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSmallAndLargeDragons(vp).points;
    expect(point).toEqual(HKHandMapper.SMALL_DRAGONS.points);
  }
});

test('Verifies a valid case for validate large dragons', () => {
  const result = validateHandStructure(validHandWithLargeDragons);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSmallAndLargeDragons(vp).points;
    expect(point).toEqual(HKHandMapper.LARGE_DRAGONS.points);
  }
});

test('Verifies an invalid case for validateDragons using allHonors hand', () => {
  const result = validateHandStructure(validHandWithAllHonors);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSmallAndLargeDragons(vp).points;
    expect(point).toEqual(HKHandMapper.INVALID.points);
  }
});

// ####################### validateSmallAndLargeWinds ################################
test('Verifies a valid case for validate small winds', () => {
  const result = validateHandStructure(validHandWithSmallWinds);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSmallAndLargeWinds(vp).points;
    expect(point).toEqual(HKHandMapper.SMALL_WINDS.points);
  }
});

test('Verifies a valid case for validate large winds', () => {
  const result = validateHandStructure(validHandWithLargeWinds);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSmallAndLargeWinds(vp).points;
    expect(point).toEqual(HKHandMapper.LARGE_WINDS.points);
  }
});

test('Verifies an invalid case for validateWinds using allHonors hand', () => {
  const result = validateHandStructure(validHandWithAllHonors);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSmallAndLargeWinds(vp).points;
    expect(point).toEqual(HKHandMapper.INVALID.points);
  }
});

// ####################### validateAllKongs ################################
test('Verifies a valid case for validateAllKongs', () => {
  const result = validateHandStructure(validHandWithAllKongs);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllKongs(vp).points;
    expect(point).toEqual(HKHandMapper.ALL_KONGS.points);
  }
});

test('Verfies an invalid case for validateAllKongs using allTriplets hand', () => {
  const result = validateHandStructure(allTripletsHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllKongs(vp).points;
    expect(point).toEqual(HKHandMapper.INVALID.points);
  }
});

// ####################### validateFlowers ################################
test('Verifies that validateFlower returns the correct amount of points', () => {
  expect(
    PointValidator.validateFlower(
      1,
      flowers.map((str) => TileFactory.createTileFromStringDef(str)),
    ),
  ).toEqual(2);
});

// ####################### validateDragons ################################
test('Verifies that validateDragons returns the correct amount of points for dragon melds', () => {
  expect(PointValidator.validateDragon(dragonMelds)).toEqual(3);
});

test('Verifies that validateDragons returns 0 for otherMelds', () => {
  expect(PointValidator.validateDragon(otherMelds)).toEqual(0);
});

// ####################### Winds ################################
test('Verifies that Winds returns the correct amount of points for wind melds', () => {
  expect(PointValidator.validateWind(windMelds, WindEnums.EAST)).toEqual(1);
});

test('Verifies that Winds returns 0 for otherMelds', () => {
  expect(PointValidator.validateWind(otherMelds, WindEnums.SOUTH)).toEqual(0);
});

// ####################### validateHandPoints ################################
test('Verifies that given the allTripletsHand, the function returns the corresponding points', () => {
  const result = validateHandStructure(allTripletsHand);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  expect(largestHand.totalPoints).toEqual(HKHandMapper.ALL_TRIPLET.points);
});

test('Verifies that given the allTripletsHandWithPurity, the function returns the corresponding points', () => {
  const result = validateHandStructure(allTripletsHandWithPurity);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.ALL_TRIPLET.points + HKHandMapper.PURITY.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the allTripletsHandWithSemiPurity, the function returns the corresponding points', () => {
  const result = validateHandStructure(allTripletsHandWithSemiPurity);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.ALL_TRIPLET.points + HKHandMapper.SEMI_PURITY.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the mixedConsecutiveAndTripletHand, the function returns the corresponding points', () => {
  const result = validateHandStructure(mixedConsecutiveAndTripletHand);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.INVALID.points; // should be 0 points
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the allConsecutiveHand, the function returns the corresponding points', () => {
  const result = validateHandStructure(allConsecutiveHand);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.ALL_CONSECUTIVE.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the semiPurityHand, the function returns the corresponding points', () => {
  const result = validateHandStructure(validHandWithSemiPurity);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.SEMI_PURITY.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the purityHand, the function returns the corresponding points', () => {
  const result = validateHandStructure(validHandWithPurity);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.PURITY.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the validHandWithSmallDragons, the function returns the corresponding points', () => {
  const result = validateHandStructure(validHandWithSmallDragons);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.SMALL_DRAGONS.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the validHandWithLargeDragons, the function returns the corresponding points', () => {
  const result = validateHandStructure(validHandWithLargeDragons);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.LARGE_DRAGONS.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the validHandWithSmallWinds, the function returns the corresponding points', () => {
  const result = validateHandStructure(validHandWithSmallWinds);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.SMALL_WINDS.points + HKHandMapper.SEMI_PURITY.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the validHandWithLargeWinds, the function returns the corresponding points', () => {
  const result = validateHandStructure(validHandWithLargeWinds);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.LARGE_WINDS.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the validHandWith4OfaKind, the function returns the corresponding points', () => {
  const result = validateHandStructure(validHandWith4OfaKind);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.ALL_TRIPLET.points + HKHandMapper.DRAGON_MELD.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the validHandWithAllKongs, the function returns the corresponding points', () => {
  const result = validateHandStructure(validHandWithAllKongs);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.ALL_KONGS.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the validHandWithThirteenOrphans, the function returns the corresponding points', () => {
  const result = validateHandStructure(validHandWithThirteenOrphans);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.THIRTEEN_ORPHANS.points;
  expect(largestHand.totalPoints).toEqual(expected);
});

test('Verifies that given the validHandWithAllConsecutiveAndPurity, the function returns the corresponding points', () => {
  const result = validateHandStructure(allConsecutiveHandWithPurity);
  const pointResults = PointValidator.validateHandPoints(result);
  const { largestHand } = pointResults;
  const expected = HKHandMapper.ALL_CONSECUTIVE.points + HKHandMapper.PURITY.points;
  expect(largestHand.totalPoints).toEqual(expected);
});
