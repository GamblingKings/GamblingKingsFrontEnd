/**
 * Class that extends the Tile.ts class.
 * Represents a Flower or Season tile.
 */

import Tile from './Tile';
import BonusTileType from '../enums/BonusTileEnums';

class BonusTile extends Tile {
  private type: BonusTileType;

  private value: number;

  /**
   * Public constructor.
   * @param type a type from the BonusTileTypes Enum
   * @param value A number from 1 - 4
   */
  constructor(type: BonusTileType, value: number) {
    super();

    if (value < 1 || value > 4) {
      throw new RangeError('Value must be between 1 - 4');
    }

    this.type = type;
    this.value = value;
  }

  /**
   * @returns the type property
   */
  public getType(): BonusTileType {
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
    return `${this.value}${Tile.DELIMITER}${this.type}`;
  }
}

export default BonusTile;
