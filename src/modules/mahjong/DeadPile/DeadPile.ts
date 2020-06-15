/**
 * The DeadPile class represents the pool of tiles that is no longer in play. Tiles are added to
 * the deadpile when the tile is "thrown" from a player hand and no one takes the tile.
 * Tiles in the deadpile are therefore considered to be out of play.
 */

import Tile from '../Tile/tile';

class DeadPile {
  private deadpile: Tile[];

  private lastThrow: Tile | null;

  /**
   * Public constructor
   */
  constructor() {
    this.deadpile = [];
    this.lastThrow = null;
  }

  /**
   * @returns the deadpile array
   */
  public getDeadPile(): Tile[] {
    return this.deadpile;
  }

  /**
   * @returns the lastThrow property
   */
  public getLastThrown(): Tile | null {
    return this.lastThrow;
  }

  /**
   * Adds a tile to the deadpile
   * @param t A Tile object, i.e. SimpleTile, BonusTile, HonorTile
   */
  public add(t: Tile): boolean {
    this.deadpile.push(t);
    return true;
  }

  /**
   * Adds the lastThrow Tile to the deadPile and reassigns the lastThrow to be a tile object
   * @param t A Tile object, i.e. SimpleTile, BonusTile, HonorTile
   */
  public lastThrown(t: Tile): void {
    if (this.lastThrow) {
      this.add(this.lastThrow);
    }

    this.lastThrow = t;
  }

  /**
   * Resets the deadPile
   */
  public clear(): void {
    this.deadpile = [];
    this.lastThrow = null;
  }
}

export default DeadPile;
