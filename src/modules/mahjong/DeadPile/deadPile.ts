/**
 * The DeadPile class represents the pool of tiles that is no longer in play. Tiles are added to
 * the deadpile when the tile is "thrown" from a player hand and no one takes the tile.
 * Tiles in the deadpile are therefore considered to be out of play.
 */

import Tile from '../Tile/tile';

class DeadPile {
  private deadpile: Tile[];

  private lastThrow: Tile | null;

  constructor() {
    this.deadpile = [];
    this.lastThrow = null;
  }

  public getDeadPile(): Tile[] {
    return this.deadpile;
  }

  public getLastThrown(): Tile | null {
    return this.lastThrow;
  }

  public add(t: Tile): boolean {
    this.deadpile.push(t);
    return true;
  }

  public lastThrown(t: Tile): void {
    if (this.lastThrow) {
      this.add(this.lastThrow);
    }

    this.lastThrow = t;
  }

  public clear(): void {
    this.deadpile = [];
    this.lastThrow = null;
  }
}

export default DeadPile;
