/**
 * Class to store logic related to validating a Mahjong Hand
 */
import Tile from '../Tile/Tile';

class HandValidator {
  /**
   * Validates the Length of the hand must be 14
   * @param tiles An array of tile objects
   * @returns boolean, true if hand length is 14, otherwise false
   */
  public static validateHandLength(tiles: Tile[]): boolean {
    if (tiles.length !== 14) return false;
    return true;
  }

  /**
   * Validates if the hand is a valid thirteen orphans hand
   * @param tiles An array of tile objects
   * @returns true if the hand is valid, otherwise false
   */
  public static validateThirteenOrphans(tiles: Tile[]): boolean {
    if (!this.validateHandLength(tiles)) {
      return false;
    }

    const thirteenOrphansTileRequirement: { [index: string]: number } = {
      '1_DOT': 0,
      '9_DOT': 0,
      '1_BAMBOO': 0,
      '9_BAMBOO': 0,
      '1_CHARACTER': 0,
      '9_CHARACTER': 0,
      EAST: 0,
      SOUTH: 0,
      WEST: 0,
      NORTH: 0,
      REDDRAGON: 0,
      GREENDRAGON: 0,
      WHITEDRAGON: 0,
    };

    let failed = false;

    tiles.forEach((t) => {
      if (Object.prototype.hasOwnProperty.call(thirteenOrphansTileRequirement, t.toString())) {
        thirteenOrphansTileRequirement[t.toString()] += 1;
      } else {
        failed = true;
      }
    });

    if (failed) {
      return false;
    }

    if (Object.values(thirteenOrphansTileRequirement).every((el) => el >= 1)) return true;

    return false;
  }
}

export default HandValidator;
