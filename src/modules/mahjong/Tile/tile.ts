import BonusTileType from './types/bonusTileTypes';
import SimpleTileType from './types/simpleTileTypes';
import HonorTileType from './types/honorTileTypes';

abstract class Tile {
  abstract toString(): string;

  abstract getType(): SimpleTileType | HonorTileType | BonusTileType;
}

export default Tile;
