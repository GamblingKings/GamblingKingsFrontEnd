/**
 * Class to store logic related to validating a Mahjong Hand
 */
import Tile from '../Tile/Tile';
import { ValidPair } from '../types/MahjongTypes';

class HandValidator {
  /**
   * Creates an object mapping of the tiles to determine the number of each tile in the hand
   * @param tiles An array of tile objects
   * @returns object containing the number of each tile in the hand
   */
  public static createTileMapping(tiles: Tile[]): { [index: string]: number } {
    const mapping: { [index: string]: number } = {};
    tiles.forEach((t) => {
      if (Object.prototype.hasOwnProperty.call(mapping, t.toString())) mapping[t.toString()] += 1;
      else mapping[t.toString()] = 1;
    });

    return mapping;
  }

  public static determineAllPossiblePairs(tiles: Tile[]): ValidPair[] {
    const tileMapping = this.createTileMapping(tiles);

    /**
     * Valid Pair Schema:
     * {
     *  pair: '1_CHARACTER',
     *  remainingTiles: {}
     * }
     */
    const validPairs: ValidPair[] = [];
    const mappingKeys = Object.keys(tileMapping);

    mappingKeys.forEach((key) => {
      if (tileMapping[key] >= 2) {
        const mappingCopy = { ...tileMapping };

        mappingCopy[key] -= 2;

        validPairs.push({
          pair: key,
          remainingTiles: mappingCopy,
        });
      }
    });

    return validPairs;
  }

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
