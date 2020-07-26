import SimpleTileTypes from '../../enums/SimpleTileEnums';
import BonusTileTypes from '../../enums/BonusTileEnums';
import HonorTileTypes from '../../enums/HonorTileEnums';
import TileMapper from '../../Tile/map/TileMapper';

export const isSimpleTile = (key: string): boolean =>
  // eslint-disable-next-line
  Object.values(SimpleTileTypes).includes(<SimpleTileTypes>TileMapper[key].type);

export const isHonorTile = (key: string): boolean =>
  // eslint-disable-next-line
  Object.values(HonorTileTypes).includes(<HonorTileTypes>TileMapper[key].type);

export const isBonusTile = (key: string): boolean =>
  // eslint-disable-next-line
  Object.values(BonusTileTypes).includes(<BonusTileTypes>TileMapper[key].type);
