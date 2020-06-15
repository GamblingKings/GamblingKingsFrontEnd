/**
 * Class that extends the Tile.ts class.
 * Represents a Dot, Bamboo, or Character Tile
 */

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

  public getValue(): number {
    return this.value;
  }

  public toString(): string {
    return `${this.value} ${this.type}`;
  }
}

export default SimpleTile;
