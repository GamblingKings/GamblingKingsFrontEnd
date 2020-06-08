import Tile from './tile';
import HonorTileTypes from './types/honorTileTypes';

class HonorTile extends Tile {
  private type: HonorTileTypes;

  constructor(type: HonorTileTypes) {
    super();
    this.type = type;
  }

  public toString(): string {
    return `${this.type}`;
  }
}

export default HonorTile;
