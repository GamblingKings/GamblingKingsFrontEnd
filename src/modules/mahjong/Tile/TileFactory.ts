/**
 * Class designed to create a Tile given a string definition
 */

import SimpleTile from './SimpleTile';
import BonusTile from './BonusTile';
import HonorTile from './HonorTile';
import Tile from './Tile';
import TileMapper from './map/TileMapper';

import SimpleTileTypes from '../enums/SimpleTileEnums';
import BonusTileTypes from '../enums/BonusTileEnums';
import HonorTileTypes from '../enums/HonorTileEnums';

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
      return new HonorTile(mappedTile.type as HonorTileTypes);
    }

    if (Object.values(SimpleTileTypes).includes(splitMappedTile[1] as SimpleTileTypes)) {
      return new SimpleTile(mappedTile.type as SimpleTileTypes, mappedTile.value);
    }

    return new BonusTile(mappedTile.type as BonusTileTypes, mappedTile.value);
  }
}

export default TileFactory;
