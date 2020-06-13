import Tile from './tile';
import HonorTileType from './types/honorTileTypes';

class HonorTile extends Tile {
  private type: HonorTileType;

  constructor(type: HonorTileType) {
    super();
    this.type = type;
  }

  public getType(): HonorTileType {
    return this.type;
  }

  public toString(): string {
    return `${this.type}`;
  }
}

export default HonorTile;
