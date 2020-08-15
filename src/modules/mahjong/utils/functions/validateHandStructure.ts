import HandValidator from '../../HandValidator/HandValidator';
import TileFactory from '../../Tile/TileFactory';
import Tile from '../../Tile/Tile';
import { HandStructureResults } from '../../types/MahjongTypes';
import WindEnums from '../../enums/WindEnums';

const validateHandStructure = (
  hand: string[],
  wind: WindEnums = WindEnums.EAST,
  flower = 1,
  roundWind: WindEnums = WindEnums.EAST,
  concealed = false,
): HandStructureResults => {
  const tiles: Tile[] = [];
  hand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  const pairs = HandValidator.determineAllPossiblePairs(tiles, wind, flower, roundWind, concealed);
  return HandValidator.validiateValidHandStructure(pairs);
};

export default validateHandStructure;
