import PointValidator from '../PointValidator';
import validateHandStructure from '../../utils/functions/validateHandStructure';

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

// const allConsecutiveWithLipeikou = [
//   '1_DOT',
//   '1_DOT',
//   '2_CHARACTER',
//   '3_CHARACTER',
//   '4_CHARACTER',
//   '5_CHARACTER',
//   '6_CHARACTER',
//   '7_CHARACTER',
//   '1_BAMBOO',
//   '2_BAMBOO',
//   '3_BAMBOO',
//   '2_CHARACTER',
//   '3_CHARACTER',
//   '4_CHARACTER',
// ];

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

// ####################### validateAllConsecutives ################################
test('Verfies a valid case for validateAllConsecutives', () => {
  const result = validateHandStructure(allConsecutiveHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllConsecutives(vp);
    expect(point).toEqual(PointValidator.ALL_CONSECUTIVE_SCORE);
  }
});

test('Verifies an invalid case for validateAllConsecutives using allTriplets', () => {
  const result = validateHandStructure(allTripletsHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllConsecutives(vp);
    expect(point).toEqual(PointValidator.INVALID_SCORE);
  }
});

test('Verifies an invalid case for validateAllConsecutives using mixedConsecutiveAndTripletHand', () => {
  const result = validateHandStructure(mixedConsecutiveAndTripletHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllConsecutives(vp);
    expect(point).toEqual(PointValidator.INVALID_SCORE);
  }
});

// ####################### validateAllTriplets ################################
test('Verfies a valid case for validateAllTriplets', () => {
  const result = validateHandStructure(allTripletsHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllTriplets(vp);
    expect(point).toEqual(PointValidator.ALL_TRIPLET_SCORE);
  }
});

test('Verfies a valid case for validateAllTriplets using a hand with 4 of a kind', () => {
  const result = validateHandStructure(validHandWith4OfaKind);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllTriplets(vp);
    expect(point).toEqual(PointValidator.ALL_TRIPLET_SCORE);
  }
});

test('Verifies an invalid case for validateAllTriplets using mixedConsecutiveesAndTripletsHand', () => {
  const result = validateHandStructure(mixedConsecutiveAndTripletHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllTriplets(vp);
    expect(point).toEqual(PointValidator.INVALID_SCORE);
  }
});

// ####################### validateSemiPurity ################################

test('Verifies a valid case for validateSemiPurity', () => {
  const result = validateHandStructure(validHandWithSemiPurity);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSemiPurity(vp);
    expect(point).toEqual(PointValidator.SEMI_PURITY_SCORE);
  }
});

test('Verifies a valid case for validateSemiPurity using example 2', () => {
  const result = validateHandStructure(validHandWithSemiPurityExample2);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSemiPurity(vp);
    expect(point).toEqual(PointValidator.SEMI_PURITY_SCORE);
  }
});

test('Verifies an invalid case for validateSemiPurity using allConsecutiveHand', () => {
  const result = validateHandStructure(allConsecutiveHand);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateSemiPurity(vp);
    expect(point).toEqual(PointValidator.INVALID_SCORE);
  }
});

// ####################### validatePurity ################################

test('Verifies a valid case for validatePurity', () => {
  const result = validateHandStructure(validHandWithPurity);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validatePurity(vp);
    expect(point).toEqual(PointValidator.PURITY_SCORE);
  }
});

test('Verifies an invalid case for validatePurity with SemiPurity hand', () => {
  const result = validateHandStructure(validHandWithSemiPurity);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validatePurity(vp);
    expect(point).toEqual(PointValidator.INVALID_SCORE);
  }
});

// ####################### validateAllHonors ################################
test('Verfies a valid case for validateAllHonors with validHandWithAllHonors', () => {
  const result = validateHandStructure(validHandWithAllHonors);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllHonors(vp);
    expect(point).toEqual(PointValidator.ALL_HONORS_SCORE);
  }
});

test('Verifies an invalid case for validateAllHonors with SemiPurity hand', () => {
  const result = validateHandStructure(validHandWithSemiPurity);
  const vp = result.valid[0];
  if (vp) {
    const point = PointValidator.validateAllHonors(vp);
    expect(point).toEqual(PointValidator.INVALID_SCORE);
  }
});
