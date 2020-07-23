/**
 * Class to store logic related to validating a Mahjong Hand
 */
import Tile from '../Tile/Tile';
import { ValidPair, Meld, HandStructureResults } from '../types/MahjongTypes';
import TileMapper from '../Tile/map/TileMapper';
import SimpleTileTypes from '../enums/SimpleTileEnums';
import MeldTypes from '../enums/MeldEnums';
import sortHandUtils from '../utils/functions/sortHand';
import Hand from '../Hand/Hand';

class HandValidator {
  public static TRIPLET_SIZE = 3;

  public static KAN_SIZE = 4;

  public static MIN_HAND_SIZE = 14;

  public static DEFAULT_MELD_SIZE = 3;

  public static REQUIRED_NUM_OF_MELDS = 4;

  /**
   * Creates an object mapping of the tiles to determine the number of each tile in the hand
   * @param tiles An array of tile objects
   * @returns object containing the number of each tile in the hand
   */
  public static createTileMapping(tiles: Tile[]): { [index: string]: number } {
    const mapping: { [index: string]: number } = {};
    const sortedTiles = sortHandUtils(tiles, Hand.generateHandWeights());
    sortedTiles.forEach((t) => {
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
     *  remainingTiles: {},
     *  numTiles: number
     * }
     */
    const validPairs: ValidPair[] = [];
    const mappingKeys = Object.keys(tileMapping);
    const numTiles = Object.values(tileMapping).reduce((pv, cv) => pv + cv);

    mappingKeys.forEach((key) => {
      if (tileMapping[key] >= 2) {
        const mappingCopy = { ...tileMapping };

        mappingCopy[key] -= 2;

        validPairs.push({
          pair: key,
          remainingTiles: mappingCopy,
          numTiles,
        });
      }
    });

    return validPairs;
  }

  /**
   * Determines all possible valid hands and invalid hands
   * @param validPairs an array of ValidPairs
   */
  public static validiateValidHandStructure(validPairs: ValidPair[]): HandStructureResults {
    const results: HandStructureResults = {
      valid: [],
      invalid: [],
    };

    validPairs.forEach((vp) => {
      const { remainingTiles, numTiles } = vp;
      const copyRemainingTiles = { ...remainingTiles }; // modify copy to preserve original object
      const melds: Meld[] = [];
      let passed = true;

      if (numTiles > this.MIN_HAND_SIZE) {
        // There is a 4 of a kind somewhere in the hand and has to be used as a four of a kind
        Object.keys(copyRemainingTiles).forEach((key) => {
          if (copyRemainingTiles[key] === this.KAN_SIZE) {
            const meld: Meld = {
              tiles: [key, key, key, key],
              type: MeldTypes.QUAD,
            };
            copyRemainingTiles[key] -= this.KAN_SIZE;
            melds.push(meld);
          }
        });
      }

      // Start trying to create all consecutive melds
      // Cannot start with triplets as there is a chance we use the triplet for a consecutive
      Object.keys(copyRemainingTiles).forEach((key) => {
        const isSimpleTile: boolean = Object.values(SimpleTileTypes).includes(<SimpleTileTypes>TileMapper[key].type);

        // n = number that can be used to create a consecutive
        let n = copyRemainingTiles[key] < this.TRIPLET_SIZE || copyRemainingTiles[key] === this.KAN_SIZE;
        n = copyRemainingTiles[key] > 0 && n;

        if (isSimpleTile && n) {
          while (passed && copyRemainingTiles[key] !== 0 && copyRemainingTiles[key] !== this.TRIPLET_SIZE) {
            const meldTiles = [key];
            copyRemainingTiles[key] -= 1;

            let currentConsecutive = key;
            let nextConsecutive = TileMapper[key].next;

            while (meldTiles.length < 3 && nextConsecutive && passed) {
              if (copyRemainingTiles[nextConsecutive] >= 1) {
                meldTiles.push(nextConsecutive);
                copyRemainingTiles[nextConsecutive] -= 1;
                currentConsecutive = nextConsecutive;
                nextConsecutive = TileMapper[currentConsecutive].next;
              } else passed = false;
            }

            if (meldTiles.length === this.DEFAULT_MELD_SIZE) {
              melds.push({
                tiles: meldTiles,
                type: MeldTypes.CONSECUTIVE,
              });
            }
          }
        }
      });

      // Start trying to create all triplet melds
      if (passed) {
        Object.keys(copyRemainingTiles).forEach((key) => {
          if (copyRemainingTiles[key] === this.TRIPLET_SIZE) {
            const meld = {
              tiles: [key, key, key],
              type: MeldTypes.TRIPLET,
            };
            copyRemainingTiles[key] -= this.TRIPLET_SIZE;
            melds.push(meld);
          }
        });

        if (melds.length === this.REQUIRED_NUM_OF_MELDS) {
          results.valid.push({
            ...vp,
            melds,
          });
        }
      } else {
        results.invalid.push(vp);
      }
    });

    return results;
  }

  // /**
  // TO BE DONE AT A LATER PR
  //  * Given a hand, determine how many points the hand is able to get based on
  //  * what valid hands are possible to create
  //  * ex: All triplets, all consec, purity, semi-pure
  //  * @param validPair
  //  * @returns an number representing the point value
  //  */
  // public static determineHandPoints(validPair: ValidPair): number {
  //   console.log(validPair);
  //   return 37;
  // }

  // /**
  //  * Given a hand, determine how many extra points the hand is able to get
  //  * ex: dragons, winds, flowers
  //  * @param validPair
  //  */
  // public static determineExtraPoints(validPair: ValidPair): number {
  //   console.log(validPair);
  //   return 37;
  // }

  // /**
  //  * Given HandStructureResults, calculate the total number of points for each valid hand
  //  * @param handStructureResults
  //  */
  // public static evaluatePoints(handStructureResults: HandStructureResults) {}

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
