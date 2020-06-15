/**
 * The Wall class represents the "wall" or pool of available tiles.
 * The wall contains 144 tiles(if Hong Kong version) at the start and 92 once hands(4) have been formed.
 * Players are able to draw a tile from the wall. Typically the game will end
 * if no players have a winning hand or the end of the wall is reached.
 * Different versions of mahjong have different implementations of the wall
 * and thus this class is left for inheritence
 */

import Tile from '../Tile/Tile';
import SimpleTile from '../Tile/SimpleTile';
import HonorTile from '../Tile/HonorTile';

import simpleTileInit from './init/Simple';
import honorTileInit from './init/Honor';

abstract class Wall {
  static DEFAULT_NUM_OF_TILE = 4;

  protected tiles: Tile[];

  /**
   * Public constructor.
   */
  constructor() {
    this.tiles = [];
  }

  /**
   * Abstract Methods
   */
  abstract initializeWall(reset: boolean): void;

  /**
   * Common methods to be used by children
   */

  /**
   * Intializes all Simple tiles using an the SimpleTileInit object
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

  /**
   * Intializes all Honor tiles using an the HonorTileInit object
   */
  protected initializeHonorTiles(): void {
    Object.values(honorTileInit).forEach((object) => {
      for (let i = 0; i < Wall.DEFAULT_NUM_OF_TILE; i += 1) {
        const t: HonorTile = new HonorTile(object.type);
        this.tiles.push(t);
      }
    });
  }

  /**
   * Shuffles all the tile in the wall
   */
  protected shuffleTiles(): void {
    for (let i = 0; i < this.tiles.length; i += 1) {
      const rnd = Math.floor(Math.random() * this.tiles.length);
      [this.tiles[i], this.tiles[rnd]] = [this.tiles[rnd], this.tiles[i]];
    }
  }

  /**
   * Generates a hand from the wall
   * @returns a Tile Array
   */
  public generateHand(): Tile[] {
    const { length } = this.tiles;
    return this.tiles.splice(length - 13, 13);
  }

  /**
   * Draws a tile from the wall
   * @returns a Tile if available, otherwise null
   */
  public draw(): Tile | null | undefined {
    if (this.tiles.length > 0) {
      return this.tiles.pop();
    }

    return null;
  }

  /**
   * @returns the tile property
   */
  public getTiles(): Tile[] {
    return this.tiles;
  }

  /**
   * Clears the tiles array
   */
  public clear(): void {
    this.tiles = [];
  }
}

export default Wall;
