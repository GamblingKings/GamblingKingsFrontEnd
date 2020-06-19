/**
 * Tile Mapping used to create a tile given a string value
 */

import { TileDefinition } from '../../types/MahjongTypes';

const TileMapper: { [index: string]: TileDefinition } = {
  '1_DOT': { type: 'DOT', value: 1 },
  '2_DOT': { type: 'DOT', value: 2 },
  '3_DOT': { type: 'DOT', value: 3 },
  '4_DOT': { type: 'DOT', value: 4 },
  '5_DOT': { type: 'DOT', value: 5 },
  '6_DOT': { type: 'DOT', value: 6 },
  '7_DOT': { type: 'DOT', value: 7 },
  '8_DOT': { type: 'DOT', value: 8 },
  '9_DOT': { type: 'DOT', value: 9 },
  '1_BAMBOO': { type: 'BAMBOO', value: 1 },
  '2_BAMBOO': { type: 'BAMBOO', value: 2 },
  '3_BAMBOO': { type: 'BAMBOO', value: 3 },
  '4_BAMBOO': { type: 'BAMBOO', value: 4 },
  '5_BAMBOO': { type: 'BAMBOO', value: 5 },
  '6_BAMBOO': { type: 'BAMBOO', value: 6 },
  '7_BAMBOO': { type: 'BAMBOO', value: 7 },
  '8_BAMBOO': { type: 'BAMBOO', value: 8 },
  '9_BAMBOO': { type: 'BAMBOO', value: 9 },
  '1_CHARACTER': { type: 'CHARACTER', value: 1 },
  '2_CHARACTER': { type: 'CHARACTER', value: 2 },
  '3_CHARACTER': { type: 'CHARACTER', value: 3 },
  '4_CHARACTER': { type: 'CHARACTER', value: 4 },
  '5_CHARACTER': { type: 'CHARACTER', value: 5 },
  '6_CHARACTER': { type: 'CHARACTER', value: 6 },
  '7_CHARACTER': { type: 'CHARACTER', value: 7 },
  '8_CHARACTER': { type: 'CHARACTER', value: 8 },
  '9_CHARACTER': { type: 'CHARACTER', value: 9 },
  EAST: { type: 'EAST', value: -1 },
  SOUTH: { type: 'SOUTH', value: -1 },
  WEST: { type: 'WEST', value: -1 },
  NORTH: { type: 'NORTH', value: -1 },
  RED_DRAGON: { type: 'RED_DRAGON', value: -1 },
  GREEN_DRAGON: { type: 'GREEN_DRAGON', value: -1 },
  WHITE_DRAGON: { type: 'WHITE_DRAGON', value: -1 },
  '1_FLOWER': { type: 'FLOWER', value: 1 },
  '2_FLOWER': { type: 'FLOWER', value: 2 },
  '3_FLOWER': { type: 'FLOWER', value: 3 },
  '4_FLOWER': { type: 'FLOWER', value: 4 },
  '1_SEASON': { type: 'SEASON', value: 1 },
  '2_SEASON': { type: 'SEASON', value: 2 },
  '3_SEASON': { type: 'SEASON', value: 3 },
  '4_SEASON': { type: 'SEASON', value: 4 },
};

export default TileMapper;
