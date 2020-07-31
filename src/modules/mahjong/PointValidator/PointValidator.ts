import {
  ValidPair,
  HandStructureResults,
  HandDefinition,
  HandPointResults,
  PointValidationResults,
} from '../types/MahjongTypes';
import MeldEnums from '../enums/MeldEnums';
import TileMapper from '../Tile/map/TileMapper';
import HKHandMapper from '../Hand/map/hkHandMapper';
import {
  isSimpleTile as isSimpleTileUtils,
  isHonorTile as isHonorTileUtils,
  isBonusTile as isBonusTileUtils,
} from '../utils/functions/checkTypes';

import SimpleTileTypes from '../enums/SimpleTileEnums';

class PointValidator {
  static MAX_POINTS = 13;

  static MIN_POINTS = 3;
  // Validate each hand; assume that each validPair has been validated by the HandValidator as
  // a valid hand and contains an array of melds, otherwise assume the argument is invalid

  /**
   * Verfies whether a hand contains all consecutives
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateAllConsecutives = (vp: ValidPair): HandDefinition => {
    const { melds } = vp;
    let allConsecutives = true;
    if (melds) {
      melds.forEach((meld) => {
        if (meld.type !== MeldEnums.CONSECUTIVE) allConsecutives = false;
      });

      if (allConsecutives) return HKHandMapper.ALL_CONSECUTIVE;
    }

    return HKHandMapper.INVALID;
  };

  /**
   * Verfies whether a hand contains all triplets
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateAllTriplets = (vp: ValidPair): HandDefinition => {
    const { melds } = vp;
    let allTriplets = true;
    if (melds) {
      melds.forEach((meld) => {
        if (meld.type !== MeldEnums.TRIPLET && meld.type !== MeldEnums.QUAD) allTriplets = false;
      });

      if (allTriplets) return HKHandMapper.ALL_TRIPLET;
    }
    return HKHandMapper.INVALID;
  };

  /**
   * Verfies whether a hand contains semi-purity
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateSemiPurity = (vp: ValidPair): HandDefinition => {
    const { pair, remainingTiles } = vp;
    let isSemiPure = true;
    let type: SimpleTileTypes;

    // Evaluate the pair first
    if (pair) {
      if (isSimpleTileUtils(pair)) type = <SimpleTileTypes>TileMapper[pair].type;
      else if (isBonusTileUtils(pair)) return HKHandMapper.INVALID;
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
      return HKHandMapper.SEMI_PURITY;
    }

    return HKHandMapper.INVALID;
  };

  /**
   * Verfies whether a hand contains semi-purity
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validatePurity = (vp: ValidPair): HandDefinition => {
    const { pair, remainingTiles } = vp;
    const { type } = TileMapper[pair];
    let isPurity = true;

    Object.keys(remainingTiles).forEach((key) => {
      const keyType = TileMapper[key].type;
      if (keyType !== type) isPurity = false;
    });

    if (isPurity) return HKHandMapper.PURITY;
    return HKHandMapper.INVALID;
  };

  /**
   * Verfies whether a hand contains all honors
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateAllHonors = (vp: ValidPair): HandDefinition => {
    const { pair, remainingTiles } = vp;
    let isAllHonors = true;

    if (!isHonorTileUtils(pair)) return HKHandMapper.INVALID;
    Object.keys(remainingTiles).forEach((key) => {
      const isHonorTile = isHonorTileUtils(key);
      if (!isHonorTile) isAllHonors = false;
    });

    if (isAllHonors) return HKHandMapper.ALL_HONORS;
    return HKHandMapper.INVALID;
  };

  /**
   * Verfies whether a hand contains small dragons or large
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateSmallAndLargeDragons = (vp: ValidPair): HandDefinition => {
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
      if (pairIsDragon) return HKHandMapper.SMALL_DRAGONS;
      return HKHandMapper.LARGE_DRAGONS;
    }
    return HKHandMapper.INVALID;
  };

  /**
   * Verfies whether a hand contains small dragons or large
   * @returns the corresponding score if valid, otherwise 0
   */
  public static validateSmallAndLargeWinds = (vp: ValidPair): HandDefinition => {
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
      if (pairIsWind) return HKHandMapper.SMALL_WINDS;
      return HKHandMapper.LARGE_WINDS;
    }
    return HKHandMapper.INVALID;
  };

  public static validateAllKongs = (vp: ValidPair): HandDefinition => {
    const { melds } = vp;
    let allKongs = false;
    if (melds) allKongs = melds.every((meld) => meld.type === MeldEnums.QUAD);
    if (allKongs) return HKHandMapper.ALL_KONGS;
    return HKHandMapper.INVALID;
  };

  // Validate points of a hand
  /**
   * Determine how many points comes from valid hands such as all triplets, all consecutives, purity, etc..
   */
  public static validateHandPoints = (handStructureResults: HandStructureResults): PointValidationResults => {
    const result: PointValidationResults = {
      largestHand: {
        melds: [],
        points: 0,
        hands: [],
        tiles: [],
      },
      allHands: [],
    };

    let largestHand: HandPointResults = {
      melds: [],
      points: 0,
      hands: [],
      tiles: [],
    };

    if (handStructureResults.isThirteenTerminals) {
      largestHand.points = HKHandMapper.THIRTEEN_ORPHANS.points;
      largestHand.tiles = handStructureResults.valid[0].originalTiles;

      result.largestHand = largestHand;
      result.allHands.push(largestHand);
      return result;
    }

    const { valid } = handStructureResults;

    valid.forEach((vp) => {
      let points = 0;
      const hands: HandDefinition[] = [];

      const consecutive: HandDefinition = PointValidator.validateAllConsecutives(vp);
      let triplets = {
        points: 0,
        name: '',
      }; // placeholder
      let kongs = {
        points: 0,
        name: '',
      };

      // Check first if the hand is allConsecutives or allTriplets as these are common hands
      if (consecutive.points > 0) {
        points += consecutive.points;
        hands.push(consecutive);
      } else {
        // Need to check Kong before Triplets as validate all triplets will yield correct for all Kong
        kongs = PointValidator.validateAllKongs(vp);
        if (kongs.points > 0) {
          points += kongs.points;
          hands.push(kongs);
        } else {
          triplets = PointValidator.validateAllTriplets(vp);
          if (triplets.points > 0) {
            points += triplets.points;
            hands.push(triplets);
          }
        }
      }

      if (consecutive.points === 0) {
        const handsToCheck = [
          PointValidator.validateAllHonors,
          PointValidator.validateSmallAndLargeDragons,
          PointValidator.validateSmallAndLargeWinds,
        ];

        handsToCheck.forEach((fn) => {
          const resultOfFn = fn(vp);
          if (resultOfFn.points > 0) {
            points += resultOfFn.points;
            hands.push(resultOfFn);
          }
        });
      }

      // always check for purity/semi-pure as they can stack with allConsecutives/allTriplets or be standalone
      const purity = PointValidator.validatePurity(vp);
      if (purity.points > 0) {
        points += purity.points;
        hands.push(purity);
      }

      if (purity.points === 0) {
        const semiPure = PointValidator.validateSemiPurity(vp);
        if (semiPure.points > 0) {
          points += semiPure.points;
          hands.push(semiPure);
        }
      }

      const resultOfThisVP = {
        points,
        melds: vp.melds,
        hands,
        tiles: vp.originalTiles,
      };

      if (resultOfThisVP.points > largestHand.points) largestHand = resultOfThisVP;
      result.allHands.push(resultOfThisVP);
    });

    result.largestHand = largestHand;
    if (result.largestHand.points > PointValidator.MAX_POINTS) result.largestHand.points = PointValidator.MAX_POINTS;
    return result;
  };

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
