import Tile from '../Tile/Tile';

/**
 * Oppponent hand that the client sees of other players (with no hand tile information)
 */
class OpponentHand {
  private numberOfTiles: number;

  private playedTiles: Tile[][];

  private hasDrawn: boolean;

  constructor() {
    this.numberOfTiles = 13;
    this.hasDrawn = false;
    this.playedTiles = [];
  }

  public getNumberOfTiles(): number {
    return this.numberOfTiles;
  }

  public getPlayedTiles(): Tile[][] {
    return this.playedTiles;
  }

  public getHasDrawn(): boolean {
    return this.hasDrawn;
  }

  public setHasDrawn(permission: boolean): void {
    if (permission) {
      this.numberOfTiles += 1;
    }
    this.hasDrawn = permission;
  }

  public playedTile(): void {
    this.setHasDrawn(false);
    this.numberOfTiles -= 1;
  }

  /**
   * Add Tiles[] to playedTiles and also remove its length from numberOfTiles
   * @param tiles Tiles[]
   */
  public addPlayedTiles(tiles: Tile[]): void {
    this.playedTiles.push(tiles);
    this.numberOfTiles -= tiles.length - 1; // Subtract 1 taken from dead pile
  }

  public addSelfPlayedTiles(tiles: Tile[]): void {
    this.playedTiles.push(tiles);
  }

  public formQuad(tile: Tile, alreadyMeld: boolean | undefined): void {
    if (alreadyMeld) {
      const meldToAppend = this.playedTiles.find(
        // Check first tile of meld with playedTile, and first and second tile are equal to find correct meld
        (meld) => meld[0].toString() === tile.toString() && meld[0].toString() === meld[1].toString(),
      );
      if (meldToAppend) meldToAppend.push(tile);
    } else {
      const quadMeld = [tile, tile, tile, tile];
      this.playedTiles.push(quadMeld);
      this.numberOfTiles -= 3;
    }
  }
}

export default OpponentHand;
