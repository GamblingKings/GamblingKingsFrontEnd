import TileFactory from '../../Tile/TileFactory';
import Tile from '../../Tile/Tile';

/**
 * Returns a Tile array from a string array
 * @param tileStrArr string[]
 */
const convertStrArrToTileArr = (tileStrArr: string[]): Tile[] =>
  // eslint-disable-next-line implicit-arrow-linebreak
  tileStrArr.map((tile: string) => TileFactory.createTileFromStringDef(tile));

export default convertStrArrToTileArr;
