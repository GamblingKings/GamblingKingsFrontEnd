/**
 * File to store types used in Mahjong classes
 */

import SimpleTileTypes from '../enums/SimpleTileEnums';
import HonorTileTypes from '../enums/HonorTileEnums';
import BonusTileTypes from '../enums/BonusTileEnums';
import MeldTypes from '../enums/MeldEnums';
import Tile from '../Tile/Tile';
import WindEnums from '../enums/WindEnums';

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
  filteredTiles: Tile[];
  bonusTiles: Tile[];
  melds?: Meld[];
  wind: WindEnums;
  flower: number;
}

export interface Meld {
  tiles: string[];
  type: MeldTypes;
}

export interface HandStructureResults {
  valid: ValidPair[];
  invalid: ValidPair[];
  isThirteenTerminals: boolean;
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
  totalPoints: number;
  handPoints: number;
  extraPoints: number;
  windPoints: number;
  dragonPoints: number;
  flowerPoints: number;
  hands: HandDefinition[];
  tiles: Tile[];
  bonusTiles: Tile[];
  wind: WindEnums;
  flower: number;
}

export interface PointValidationResults {
  largestHand: HandPointResults;
  allHands: HandPointResults[];
}

export interface HandDefinition {
  points: number;
  name: string;
}
