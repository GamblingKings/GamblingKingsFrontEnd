/**
 * Tile Mapping used to create a tile given a string value
 */

import SimpleTileTypes from '../types/SimpleTileTypes';
import BonusTileTypes from '../types/BonusTileTypes';
import HonorTileTypes from '../types/HonorTileTypes';
import { TileDefinition } from '../../types/MahjongTypes';

const TileMapper: { [index: string]: TileDefinition } = {
  '1_DOT': {
    type: SimpleTileTypes.DOT,
    value: 1,
    next: '2_DOT',
    prev: null,
  },
  '2_DOT': {
    type: SimpleTileTypes.DOT,
    value: 2,
    next: '3_DOT',
    prev: '1_DOT',
  },
  '3_DOT': {
    type: SimpleTileTypes.DOT,
    value: 3,
    next: '4_DOT',
    prev: '2_DOT',
  },
  '4_DOT': {
    type: SimpleTileTypes.DOT,
    value: 4,
    next: '5_DOT',
    prev: '3_DOT',
  },
  '5_DOT': {
    type: SimpleTileTypes.DOT,
    value: 5,
    next: '6_DOT',
    prev: '4_DOT',
  },
  '6_DOT': {
    type: SimpleTileTypes.DOT,
    value: 6,
    next: '7_DOT',
    prev: '5_DOT',
  },
  '7_DOT': {
    type: SimpleTileTypes.DOT,
    value: 7,
    next: '8_DOT',
    prev: '6_DOT',
  },
  '8_DOT': {
    type: SimpleTileTypes.DOT,
    value: 8,
    next: '9_DOT',
    prev: '7_DOT',
  },
  '9_DOT': {
    type: SimpleTileTypes.DOT,
    value: 9,
    next: null,
    prev: '8_DOT',
  },
  '1_BAMBOO': {
    type: SimpleTileTypes.BAMBOO,
    value: 1,
    next: '2_BAMBOO',
    prev: null,
  },
  '2_BAMBOO': {
    type: SimpleTileTypes.BAMBOO,
    value: 2,
    next: '3_BAMBOO',
    prev: '1_BAMBOO',
  },
  '3_BAMBOO': {
    type: SimpleTileTypes.BAMBOO,
    value: 3,
    next: '4_BAMBOO',
    prev: '2_BAMBOO',
  },
  '4_BAMBOO': {
    type: SimpleTileTypes.BAMBOO,
    value: 4,
    next: '5_BAMBOO',
    prev: '3_BAMBOO',
  },
  '5_BAMBOO': {
    type: SimpleTileTypes.BAMBOO,
    value: 5,
    next: '6_BAMBOO',
    prev: '4_BAMBOO',
  },
  '6_BAMBOO': {
    type: SimpleTileTypes.BAMBOO,
    value: 6,
    next: '7_BAMBOO',
    prev: '5_BAMBOO',
  },
  '7_BAMBOO': {
    type: SimpleTileTypes.BAMBOO,
    value: 7,
    next: '8_BAMBOO',
    prev: '6_BAMBOO',
  },
  '8_BAMBOO': {
    type: SimpleTileTypes.BAMBOO,
    value: 8,
    next: '9_BAMBOO',
    prev: '7_BAMBOO',
  },
  '9_BAMBOO': {
    type: SimpleTileTypes.BAMBOO,
    value: 9,
    next: null,
    prev: '8_BAMBOO',
  },
  '1_CHARACTER': {
    type: SimpleTileTypes.CHARACTER,
    value: 1,
    next: '2_CHARACTER',
    prev: null,
  },
  '2_CHARACTER': {
    type: SimpleTileTypes.CHARACTER,
    value: 2,
    next: '3_CHARACTER',
    prev: '1_CHARACTER',
  },
  '3_CHARACTER': {
    type: SimpleTileTypes.CHARACTER,
    value: 3,
    next: '4_CHARACTER',
    prev: '2_CHARACTER',
  },
  '4_CHARACTER': {
    type: SimpleTileTypes.CHARACTER,
    value: 4,
    next: '5_CHARACTER',
    prev: '3_CHARACTER',
  },
  '5_CHARACTER': {
    type: SimpleTileTypes.CHARACTER,
    value: 5,
    next: '6_CHARACTER',
    prev: '4_CHARACTER',
  },
  '6_CHARACTER': {
    type: SimpleTileTypes.CHARACTER,
    value: 6,
    next: '7_CHARACTER',
    prev: '5_CHARACTER',
  },
  '7_CHARACTER': {
    type: SimpleTileTypes.CHARACTER,
    value: 7,
    next: '8_CHARACTER',
    prev: '6_CHARACTER',
  },
  '8_CHARACTER': {
    type: SimpleTileTypes.CHARACTER,
    value: 8,
    next: '9_CHARACTER',
    prev: '7_CHARACTER',
  },
  '9_CHARACTER': {
    type: SimpleTileTypes.CHARACTER,
    value: 9,
    next: null,
    prev: '8_CHARACTER',
  },
  EAST: {
    type: HonorTileTypes.EAST,
    value: -1,
    next: null,
    prev: null,
  },
  SOUTH: {
    type: HonorTileTypes.SOUTH,
    value: -1,
    next: null,
    prev: null,
  },
  WEST: {
    type: HonorTileTypes.WEST,
    value: -1,
    next: null,
    prev: null,
  },
  NORTH: {
    type: HonorTileTypes.NORTH,
    value: -1,
    next: null,
    prev: null,
  },
  REDDRAGON: {
    type: HonorTileTypes.REDDRAGON,
    value: -1,
    next: null,
    prev: null,
  },
  GREENDRAGON: {
    type: HonorTileTypes.GREENDRAGON,
    value: -1,
    next: null,
    prev: null,
  },
  WHITEDRAGON: {
    type: HonorTileTypes.WHITEDRAGON,
    value: -1,
    next: null,
    prev: null,
  },
  '1_FLOWER': {
    type: BonusTileTypes.FLOWER,
    value: 1,
    next: null,
    prev: null,
  },
  '2_FLOWER': {
    type: BonusTileTypes.FLOWER,
    value: 2,
    next: null,
    prev: null,
  },
  '3_FLOWER': {
    type: BonusTileTypes.FLOWER,
    value: 3,
    next: null,
    prev: null,
  },
  '4_FLOWER': {
    type: BonusTileTypes.FLOWER,
    value: 4,
    next: null,
    prev: null,
  },
  '1_SEASON': {
    type: BonusTileTypes.SEASON,
    value: 1,
    next: null,
    prev: null,
  },
  '2_SEASON': {
    type: BonusTileTypes.SEASON,
    value: 2,
    next: null,
    prev: null,
  },
  '3_SEASON': {
    type: BonusTileTypes.SEASON,
    value: 3,
    next: null,
    prev: null,
  },
  '4_SEASON': {
    type: BonusTileTypes.SEASON,
    value: 4,
    next: null,
    prev: null,
  },
};

export default TileMapper;
