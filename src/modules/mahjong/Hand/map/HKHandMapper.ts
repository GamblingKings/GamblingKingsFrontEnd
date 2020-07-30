import { HandDefinition } from '../../types/MahjongTypes';

const HKHandMapper: { [index: string]: HandDefinition } = {
  INVALID: {
    points: 0,
    name: 'INVALID',
  },
  ALL_CONSECUTIVE: {
    points: 1,
    name: 'ALL_CONSECUTIVE',
  },
  ALL_TRIPLET: {
    points: 3,
    name: 'ALL_TRIPLET',
  },
  SEMI_PURITY: {
    points: 3,
    name: 'SEMI_PURITY',
  },
  PURITY: {
    points: 7,
    name: 'PURITY',
  },
  ALL_HONORS: {
    points: 10,
    name: 'ALL_HONORS',
  },
  SMALL_DRAGONS: {
    points: 5,
    name: 'SMALL_DRAGONS',
  },
  LARGE_DRAGONS: {
    points: 8,
    name: 'LARGE_DRAGONS',
  },
  SMALL_WINDS: {
    points: 0,
    name: 'SMALL_WINDS',
  },
  LARGE_WINDS: {
    points: 13,
    name: 'LARGE_WINDS',
  },
  THIRTEEN_ORPHANS: {
    points: 0,
    name: 'THIRTEEN_ORPHANS',
  },
  ALL_KONGS: {
    points: 0,
    name: 'ALL_KONGS',
  },
};

export default HKHandMapper;
