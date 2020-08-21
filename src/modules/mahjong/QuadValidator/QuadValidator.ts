import { CreateQuadResults } from '../types/MahjongTypes';
import HandValidator from '../HandValidator/HandValidator';
import PlayerHand from '../Hand/PlayerHand';
import Tile from '../Tile/Tile';
import TileFactory from '../Tile/TileFactory';
import checkisTripletMeld from '../utils/functions/checkTriplet';

class QuadValidator {
  static checkForQuads(playerHand: PlayerHand): CreateQuadResults[] {
    const currentTiles = [...playerHand.getTiles()];
    const playedTiles = [...playerHand.getPlayedTiles()];

    const quadResults: CreateQuadResults[] = [];

    const mapping = HandValidator.createTileMapping(currentTiles);

    // Check for quads in hand
    Object.keys(mapping).forEach((tile: string) => {
      if (mapping[tile] === 4) {
        quadResults.push({
          tile: TileFactory.createTileFromStringDef(tile),
          alreadyMeld: false,
        });
      }
    });

    if (playedTiles.length > 0) {
      playedTiles.forEach((meld: Tile[]) => {
        const { length } = meld;
        if (length === 3) {
          const isTriplet = checkisTripletMeld(meld);
          if (isTriplet) {
            const tileStr = meld[0].toString();
            if (mapping[tileStr] && mapping[tileStr] === 1) {
              quadResults.push({
                tile: TileFactory.createTileFromStringDef(tileStr),
                alreadyMeld: true,
              });
            }
          }
        }
      });
    }

    return quadResults;
  }
}

export default QuadValidator;
