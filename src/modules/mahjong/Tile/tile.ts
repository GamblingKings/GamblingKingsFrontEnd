/**
 * The Tile class represents a single Tile used in Mahjong.
 * There are different types of tiles which can be categorized
 * as simple (dots, bamboo, characters), honors (dragons and winds), and bonus (flowers, seasons)
 */

import BonusTileType from './types/bonusTileTypes';
import SimpleTileType from './types/simpleTileTypes';
import HonorTileType from './types/honorTileTypes';

abstract class Tile {
  abstract toString(): string;

  abstract getType(): SimpleTileType | HonorTileType | BonusTileType;

  abstract getValue(): number;
}

export default Tile;
