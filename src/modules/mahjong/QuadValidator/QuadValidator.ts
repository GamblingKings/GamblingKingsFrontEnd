import { CreateQuadResults } from '../types/MahjongTypes';
import HandValidator from '../HandValidator/HandValidator';
import PlayerHand from '../Hand/PlayerHand';
import Tile from '../Tile/Tile';
import TileFactory from '../Tile/TileFactory';

class QuadValidator {
  static checkForQuads(playerHand: PlayerHand): CreateQuadResults[] {
    const currentTiles = playerHand.getTiles();
    const playedTiles = playerHand.getPlayedTiles();

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
          const firstTile = meld[0].toString();
          const triplet = firstTile === meld[1].toString();
          if (triplet) {
            // Check all tiles in current hand to see if it's the same as triplet
            Object.keys(mapping).forEach((tile: string) => {
              if (tile === firstTile) {
                quadResults.push({
                  tile: TileFactory.createTileFromStringDef(tile),
                  alreadyMeld: true,
                });
              }
            });
          }
        }
      });
    }

    return quadResults;
  }
}

export default QuadValidator;
