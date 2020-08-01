import HandValidator from '../../HandValidator/HandValidator';
import TileFactory from '../../Tile/TileFactory';
import Tile from '../../Tile/Tile';
import { HandStructureResults } from '../../types/MahjongTypes';

const validateHandStructure = (hand: string[]): HandStructureResults => {
  const tiles: Tile[] = [];
  hand.forEach((str) => tiles.push(TileFactory.createTileFromStringDef(str)));
  const pairs = HandValidator.determineAllPossiblePairs(tiles);
  return HandValidator.validiateValidHandStructure(pairs);
};

export default validateHandStructure;
