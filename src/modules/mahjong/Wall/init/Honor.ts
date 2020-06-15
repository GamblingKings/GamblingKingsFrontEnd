/**
 * Object used to initialize Honor Tiles in the wall class
 */

import HonorTileTypes from '../../Tile/types/HonorTileTypes';

type HonorTileInitObject = {
  east: {
    type: HonorTileTypes;
  };
  south: {
    type: HonorTileTypes;
  };
  west: {
    type: HonorTileTypes;
  };
  north: {
    type: HonorTileTypes;
  };
  red: {
    type: HonorTileTypes;
  };
  green: {
    type: HonorTileTypes;
  };
  white: {
    type: HonorTileTypes;
  };
};

const honorTileInit: HonorTileInitObject = {
  east: {
    type: HonorTileTypes.EAST,
  },
  south: {
    type: HonorTileTypes.SOUTH,
  },
  west: {
    type: HonorTileTypes.WEST,
  },
  north: {
    type: HonorTileTypes.NORTH,
  },
  red: {
    type: HonorTileTypes.RED_DRAGON,
  },
  green: {
    type: HonorTileTypes.GREEN_DRAGON,
  },
  white: {
    type: HonorTileTypes.WHITE_DRAGON,
  },
};

export default honorTileInit;
