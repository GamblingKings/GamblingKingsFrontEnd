import { TileDimensions } from '../../types/MahjongTypes';
import { HEIGHT_TO_WIDTH_RATIO } from '../../../../pixi/mahjongConstants';

const determineTileSize = (clientWidth: number, widthMultiplier: number): TileDimensions => {
  const tileDimensions: TileDimensions = {
    tileHeight: clientWidth * widthMultiplier * HEIGHT_TO_WIDTH_RATIO,
    tileWidth: clientWidth * widthMultiplier,
  };

  return tileDimensions;
};

export default determineTileSize;
