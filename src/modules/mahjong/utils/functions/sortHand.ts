import Tile from '../../Tile/Tile';
import SimpleTileTypes from '../../enums/SimpleTileEnums';
import { SortHandWeights } from '../../types/MahjongTypes';

const sortHand = (tiles: Tile[], weights: SortHandWeights): Tile[] => {
  tiles.sort((t1, t2) => {
    const t1Type = t1.getType();
    const t2Type = t2.getType();

    if (t1Type === t2Type && t1Type in SimpleTileTypes) {
      const v1 = t1.getValue();
      const v2 = t2.getValue();

      return v1 - v2;
    }

    return weights[t1Type] - weights[t2Type];
  });

  return tiles;
};

export default sortHand;
