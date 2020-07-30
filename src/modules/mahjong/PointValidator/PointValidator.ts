import { ValidPair } from '../types/MahjongTypes';
import MeldEnums from '../enums/MeldEnums';
import TileMapper from '../Tile/map/TileMapper';
import {
  isSimpleTile as isSimpleTileUtils,
  isHonorTile as isHonorTileUtils,
  isBonusTile as isBonusTileUtils,
} from '../utils/functions/checkTypes';

import SimpleTileTypes from '../enums/SimpleTileEnums';

class PointValidator {
  // Validate each hand; assume that each validPair has been validated by the HandValidator as
  // a valid hand and contains an array of melds, otherwise assume the argument is invalid

  static INVALID_SCORE = 0;

  static ALL_CONSECUTIVE_SCORE = 1;

  static ALL_TRIPLET_SCORE = 3;

  static SEMI_PURITY_SCORE = 3;

  static PURITY_SCORE = 7;

  static ALL_HONORS_SCORE = 10;

  static SMALL_DRAGONS_SCORE = 5;

  static LARGE_DRAGONS_SCORE = 8;

  static SMALL_WINDS_SCORE = 10;

  static LARGE_WINDS_SCORE = 13;

  static THIRTEEN_ORPHANS_SCORE = 13;

  static ALL_KONGS_SCORE = 13;

  /**
   * Verfies whether a hand contains all consecutives
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateAllConsecutives = (vp: ValidPair): number => {
    const { melds } = vp;
    let allConsecutives = true;
    if (melds) {
      melds.forEach((meld) => {
        if (meld.type !== MeldEnums.CONSECUTIVE) allConsecutives = false;
      });

      if (allConsecutives) return PointValidator.ALL_CONSECUTIVE_SCORE;
    }

    return PointValidator.INVALID_SCORE;
  };

  /**
   * Verfies whether a hand contains all triplets
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateAllTriplets = (vp: ValidPair): number => {
    const { melds } = vp;
    let allTriplets = true;
    if (melds) {
      melds.forEach((meld) => {
        if (meld.type !== MeldEnums.TRIPLET && meld.type !== MeldEnums.QUAD) allTriplets = false;
      });

      if (allTriplets) return PointValidator.ALL_TRIPLET_SCORE;
    }
    return PointValidator.INVALID_SCORE;
  };

  /**
   * Verfies whether a hand contains semi-purity
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateSemiPurity = (vp: ValidPair): number => {
    const { pair, remainingTiles } = vp;
    let isSemiPure = true;
    let type: SimpleTileTypes;

    // Evaluate the pair first
    if (pair) {
      if (isSimpleTileUtils(pair)) type = <SimpleTileTypes>TileMapper[pair].type;
      else if (isBonusTileUtils(pair)) return PointValidator.INVALID_SCORE;
    }

    Object.keys(remainingTiles).forEach((key) => {
      if (type && isSemiPure) {
        if (TileMapper[key].type !== type && !isHonorTileUtils(key)) {
          isSemiPure = false;
        }
      } else if (isSemiPure && isSimpleTileUtils(key)) {
        type = <SimpleTileTypes>TileMapper[key].type;
      }
    });

    if (isSemiPure) {
      return PointValidator.SEMI_PURITY_SCORE;
    }

    return PointValidator.INVALID_SCORE;
  };

  /**
   * Verfies whether a hand contains semi-purity
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validatePurity = (vp: ValidPair): number => {
    const { pair, remainingTiles } = vp;
    const { type } = TileMapper[pair];
    let isPurity = true;

    Object.keys(remainingTiles).forEach((key) => {
      const keyType = TileMapper[key].type;
      if (keyType !== type) isPurity = false;
    });

    if (isPurity) return PointValidator.PURITY_SCORE;
    return PointValidator.INVALID_SCORE;
  };

  /**
   * Verfies whether a hand contains all honors
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateAllHonors = (vp: ValidPair): number => {
    const { pair, remainingTiles } = vp;
    let isAllHonors = true;

    if (!isHonorTileUtils(pair)) return PointValidator.INVALID_SCORE;
    Object.keys(remainingTiles).forEach((key) => {
      const isHonorTile = isHonorTileUtils(key);
      if (!isHonorTile) isAllHonors = false;
    });

    if (isAllHonors) return PointValidator.ALL_HONORS_SCORE;
    return PointValidator.INVALID_SCORE;
  };

  /**
   * Verfies whether a hand contains small dragons or large
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateSmallAndLargeDragons = (vp: ValidPair): number => {
    const dragons: { [index: string]: boolean } = {
      REDDRAGON: false,
      GREENDRAGON: false,
      WHITEDRAGON: false,
    };

    let pairIsDragon = false;

    const { pair, melds } = vp;
    if (Object.keys(dragons).includes(pair)) {
      dragons[pair] = true;
      pairIsDragon = true;
    }

    if (melds) {
      melds.forEach((meld) => {
        if (meld.type === MeldEnums.TRIPLET || meld.type === MeldEnums.QUAD) {
          const tileDef = meld.tiles[0];
          if (Object.keys(dragons).includes(tileDef)) {
            dragons[tileDef] = true;
          }
        }
      });
    }

    const allDragonsPresent = Object.values(dragons).every((value) => value);
    if (allDragonsPresent) {
      if (pairIsDragon) return PointValidator.SMALL_DRAGONS_SCORE;
      return PointValidator.LARGE_DRAGONS_SCORE;
    }
    return PointValidator.INVALID_SCORE;
  };

  /**
   * Verfies whether a hand contains small dragons or large
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateSmallAndLargeWinds = (vp: ValidPair): number => {
    const winds: { [index: string]: boolean } = {
      EAST: false,
      SOUTH: false,
      WEST: false,
      NORTH: false,
    };

    let pairIsWind = false;

    const { pair, melds } = vp;
    if (Object.keys(winds).includes(pair)) {
      winds[pair] = true;
      pairIsWind = true;
    }

    if (melds) {
      melds.forEach((meld) => {
        if (meld.type === MeldEnums.TRIPLET || meld.type === MeldEnums.QUAD) {
          const tileDef = meld.tiles[0];
          if (Object.keys(winds).includes(tileDef)) {
            winds[tileDef] = true;
          }
        }
      });
    }

    const allWindsPresent = Object.values(winds).every((value) => value);
    if (allWindsPresent) {
      if (pairIsWind) return PointValidator.SMALL_WINDS_SCORE;
      return PointValidator.LARGE_WINDS_SCORE;
    }
    return PointValidator.INVALID_SCORE;
  };

  public static validateAllKongs = (vp: ValidPair): number => {
    const { melds } = vp;
    let allKongs = false;
    if (melds) allKongs = melds.every((meld) => meld.type === MeldEnums.QUAD);
    if (allKongs) return PointValidator.ALL_KONGS_SCORE;
    return PointValidator.INVALID_SCORE;
  };

  // Validate points of a hand
  /**
   * Determine how many points comes from valid hands such as all triplets, all consecutives, purity, etc..
   */
  public static validateHandPoints = (): void => {};

  /**
   * Determine how many points comes from extra points such as winds, dragons, flowers
   */
  public static validateExtraPoints = (): void => {};

  /**
   * Determines how many points a hand is worth factoring for hand and extra points
   */
  public static validateTotalPoints = (): void => {};
}

export default PointValidator;