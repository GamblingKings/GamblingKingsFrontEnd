/**
 * Class that extends the Tile.ts class.
 * Represents a Dot, Bamboo, or Character Tile
 */

import Tile from './Tile';
import SimpleTileType from './types/SimpleTileTypes';

class SimpleTile extends Tile {
  private type: SimpleTileType;

  private value: number;

  /**
   * Public constructor.
   * @param type a type from the BonusTileTypes Enum
   * @param value A number from 1 - 9
   */
  constructor(type: SimpleTileType, value: number) {
    super();

    if (value < 1 || value > 9) {
      throw new RangeError('Value must be between 1 - 9');
    }

    this.type = type;
    this.value = value;
  }

  /**
   * @returns the type property
   */
  public getType(): SimpleTileType {
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
    return `${this.value} ${this.type}`;
  }
}

export default SimpleTile;
