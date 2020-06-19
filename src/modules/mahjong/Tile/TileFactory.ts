/**
 * Class designed to create a Tile given a string definition
 */

import SimpleTile from './SimpleTile';
import BonusTile from './BonusTile';
import HonorTile from './HonorTile';
import Tile from './Tile';
import TileMapper from './map/TileMapper';

import SimpleTileTypes from './types/SimpleTileTypes';
import BonusTileTypes from './types/BonusTileTypes';
import HonorTileTypes from './types/HonorTileTypes';

import { TileDefinition } from '../types/MahjongTypes';

class TileFactory {
  /**
   *
   * @param strDef : string representation of a tile
   * @returns a SimpleTile, BonusTile, or HonorTile depending on the strDef
   */
  static createTileFromStringDef(strDef: string): SimpleTile | BonusTile | HonorTile {
    const mappedTile: TileDefinition = TileMapper[strDef];
    const splitMappedTile: string[] = strDef.split(Tile.DELIMITER);

    if (splitMappedTile.length === 1) {
      return new HonorTile(<HonorTileTypes>mappedTile.type);
    }

    if (splitMappedTile.length === 2 && Object.values(SimpleTileTypes).includes(<SimpleTileTypes>splitMappedTile[1])) {
      return new SimpleTile(<SimpleTileTypes>mappedTile.type, mappedTile.value);
    }

    return new BonusTile(<BonusTileTypes>mappedTile.type, mappedTile.value);
  }
}

export default TileFactory;
