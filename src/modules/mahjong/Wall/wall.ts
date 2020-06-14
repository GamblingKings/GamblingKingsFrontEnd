import Tile from '../Tile/tile';
import SimpleTile from '../Tile/simpleTile';
import HonorTile from '../Tile/honorTile';

import simpleTileInit from './init/simple';
import honorTileInit from './init/honor';

abstract class Wall {
  static DEFAULT_NUM_OF_TILE = 4;

  protected tiles: Tile[];

  constructor() {
    this.tiles = [];
  }

  /**
   * Abstract Methods
   */
  abstract initalizeWall(reset: boolean): void;

  /**
   * Common methods to be used by children
   */
  protected initializeSimpleTiles(): void {
    Object.values(simpleTileInit).forEach((object) => {
      for (let value = 1; value <= object.range; value += 1) {
        for (let i = 0; i < Wall.DEFAULT_NUM_OF_TILE; i += 1) {
          const t: SimpleTile = new SimpleTile(object.type, value);
          this.tiles.push(t);
        }
      }
    });
  }

  protected initializeHonorTiles(): void {
    Object.values(honorTileInit).forEach((object) => {
      for (let i = 0; i < Wall.DEFAULT_NUM_OF_TILE; i += 1) {
        const t: HonorTile = new HonorTile(object.type);
        this.tiles.push(t);
      }
    });
  }

  protected shuffleTiles(): void {
    for (let i = 0; i < this.tiles.length; i += 1) {
      const rnd = Math.floor(Math.random() * this.tiles.length);
      [this.tiles[i], this.tiles[rnd]] = [this.tiles[rnd], this.tiles[i]];
    }
  }

  public generateHand(): Tile[] {
    const { length } = this.tiles;
    return this.tiles.splice(length - 13, 13);
  }

  public draw(): Tile | null | undefined {
    if (this.tiles.length > 0) {
      return this.tiles.pop();
    }

    return null;
  }

  public getTiles(): Tile[] {
    return this.tiles;
  }

  public clear(): void {
    this.tiles = [];
  }
}

export default Wall;
