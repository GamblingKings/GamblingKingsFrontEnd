/**
 * The Tile class represents a single Tile used in Mahjong.
 * There are different types of tiles which can be categorized
 * as simple (dots, bamboo, characters), honors (dragons and winds), and bonus (flowers, seasons)
 */

import BonusTileType from '../enums/BonusTileEnums';
import SimpleTileType from '../enums/SimpleTileEnums';
import HonorTileType from '../enums/HonorTileEnums';

abstract class Tile {
  static DELIMITER = '_';

  abstract toString(): string;

  abstract getType(): SimpleTileType | HonorTileType | BonusTileType;

  abstract getValue(): number;
}

export default Tile;
