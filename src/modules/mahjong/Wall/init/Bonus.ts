/**
 * Object used to initialize Bonus Tiles in the wall class
 */

import BonusTileTypes from '../../enums/BonusTileEnums';

type BonusTileInitObject = {
  flowers: {
    type: BonusTileTypes;
    range: number;
  };
  seasons: {
    type: BonusTileTypes;
    range: number;
  };
};

const bonusTileInit: BonusTileInitObject = {
  flowers: {
    type: BonusTileTypes.FLOWER,
    range: 4,
  },
  seasons: {
    type: BonusTileTypes.SEASON,
    range: 4,
  },
};

export default bonusTileInit;
