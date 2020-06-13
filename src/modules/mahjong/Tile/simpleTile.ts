import Tile from './tile';
import SimpleTileType from './types/simpleTileTypes';

class SimpleTile extends Tile {
  private type: SimpleTileType;

  private value: number;

  constructor(type: SimpleTileType, value: number) {
    super();
    this.type = type;
    this.value = value;
  }

  public getType(): SimpleTileType {
    return this.type;
  }

  public toString(): string {
    return `${this.value} ${this.type}`;
  }
}

export default SimpleTile;
