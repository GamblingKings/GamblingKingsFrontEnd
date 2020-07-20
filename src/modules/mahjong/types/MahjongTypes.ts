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
