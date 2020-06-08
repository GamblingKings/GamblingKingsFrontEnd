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

  public toString(): string {
    return `${this.value} ${this.type}`;
  }
}

export default BonusTile;