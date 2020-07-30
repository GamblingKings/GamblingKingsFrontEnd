/**
 * File to store types used in Mahjong classes
 */

import SimpleTileTypes from '../enums/SimpleTileEnums';
import HonorTileTypes from '../enums/HonorTileEnums';
import BonusTileTypes from '../enums/BonusTileEnums';
import MeldTypes from '../enums/MeldEnums';

export interface TileDefinition {
  type: SimpleTileTypes | HonorTileTypes | BonusTileTypes;
  value: number;
  next: string | null;
  prev: string | null;
}

export interface ValidPair {
  pair: string;
  remainingTiles: { [index: string]: number };
  numTiles: number;
  melds?: Meld[];
}

export interface Meld {
  tiles: string[];
  type: MeldTypes;
}

export interface HandStructureResults {
  valid: ValidPair[];
  invalid: ValidPair[];
}

export interface SortHandWeights {
  [SimpleTileTypes.DOT]: number;
  [SimpleTileTypes.BAMBOO]: number;
  [SimpleTileTypes.CHARACTER]: number;
  [HonorTileTypes.EAST]: number;
  [HonorTileTypes.SOUTH]: number;
  [HonorTileTypes.WEST]: number;
  [HonorTileTypes.NORTH]: number;
  [HonorTileTypes.GREENDRAGON]: number;
  [HonorTileTypes.REDDRAGON]: number;
  [HonorTileTypes.WHITEDRAGON]: number;
  [BonusTileTypes.FLOWER]: number;
  [BonusTileTypes.SEASON]: number;
}

export interface HandPointResults {
  melds?: Meld[];
  points: number;
  handNames: string[];
}

export interface PointValidationResults {
  largestHand: HandPointResults;
  allHands: HandPointResults[];
}

export interface HandDefinition {
  points: number;
  name: string;
}
