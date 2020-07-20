/**
 * Class that extends the Tile.ts class.
 * Represents a Wind or Dragon tile.
 */

import Tile from './Tile';
import HonorTileType from '../enums/HonorTileEnums';

class HonorTile extends Tile {
  private type: HonorTileType;

  private value: number;

  /**
   * Public constructor.
   * @param type a type from the BonusTileTypes Enum
   */
  constructor(type: HonorTileType) {
    super();
    this.type = type;
    this.value = -1;
  }

  /**
   * @returns the type property
   */
  public getType(): HonorTileType {
    return this.type;
  }

  /**
   * @returns the value property
   */
  public getValue(): number {
    return this.value;
  }

  /**
   * @returns a string representation of the object
   */
  public toString(): string {
    return `${this.type}`;
  }
}

export default HonorTile;
