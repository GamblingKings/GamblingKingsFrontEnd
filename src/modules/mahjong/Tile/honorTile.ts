import Tile from './tile';
import HonorTileType from './types/honorTileTypes';

class HonorTile extends Tile {
  private type: HonorTileType;

  private value: number;

  constructor(type: HonorTileType) {
    super();
    this.type = type;
    this.value = -1;
  }

  public getType(): HonorTileType {
    return this.type;
  }

  public getValue(): number {
    return this.value;
  }

  public toString(): string {
    return `${this.type}`;
  }
}

export default HonorTile;
