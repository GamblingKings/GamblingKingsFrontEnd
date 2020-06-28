/**
 * File to store types used in Mahjong classes
 */

import SimpleTileTypes from '../Tile/types/SimpleTileTypes';
import HonorTileTypes from '../Tile/types/HonorTileTypes';
import BonusTileTypes from '../Tile/types/BonusTileTypes';
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
