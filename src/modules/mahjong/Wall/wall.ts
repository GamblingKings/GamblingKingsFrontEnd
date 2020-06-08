import Tile from '../Tile/tile';
import SimpleTile from '../Tile/simpleTile';

import simpleTileInit from './init/simple';

abstract class Wall {
  protected tiles: Tile[];

  constructor() {
    this.tiles = [];
  }

  /**
   * Abstract Methods
   */
  abstract initalizeWall(): void;

  /**
   * Common methods to be used by children
   */
  protected initializeSimpleTiles(): void {
    Object.values(simpleTileInit).forEach((object) => {
      for (let i = 1; i <= object.range; i += 1) {
        const t: SimpleTile = new SimpleTile(i, object.type);
        this.tiles.push(t);
      }
    });
  }

  protected getTiles(): Tile[] {
    return this.tiles;
  }
}

export default Wall;
