import Tile from '../Tile/Tile';

/**
 * Oppponent hand that the client sees of other players (with no hand tile information)
 */
class OpponentHand {
  private numberOfTiles: number;

  private playedTiles: Tile[][];

  constructor() {
    this.numberOfTiles = 13;

    this.playedTiles = [];
  }

  public getNumberOfTiles(): number {
    return this.numberOfTiles;
  }

  public getPlayedTiles(): Tile[][] {
    return this.playedTiles;
  }

  public addPlayedTiles(tiles: Tile[]): void {
    this.playedTiles.push(tiles);
  }
}

export default OpponentHand;
