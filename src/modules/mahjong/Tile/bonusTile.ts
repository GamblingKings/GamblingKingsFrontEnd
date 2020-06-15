/**
 * Class that extends the Tile.ts class.
 * Represents a Flower or Season tile.
 */

import Tile from './tile';
import BonusTileType from './types/bonusTileTypes';

class BonusTile extends Tile {
  private type: BonusTileType;

  private value: number;

  constructor(type: BonusTileType, value: number) {
    super();
    this.type = type;
    this.value = value;
  }

  public getType(): BonusTileType {
    return this.type;
  }

  public getValue(): number {
    return this.value;
  }

  public toString(): string {
    return `${this.value} ${this.type}`;
  }
}

export default BonusTile;
