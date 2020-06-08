import Wall from '../wall';
import Tile from '../../Tile/tile';
import BonusTile from '../../Tile/bonusTile';
import MahjongVersion from './versions';

import BonusTileInit from '../init/bonus';

class HongKongWall extends Wall {
  static version: MahjongVersion = MahjongVersion.HongKong;

  constructor() {
    super();
    this.initalizeWall();
  }

  initalizeWall(): void {
    super.initializeSimpleTiles();
    super.initializeHonorTiles();
    this.initializeBonusTiles();
    super.shuffleTiles();
  }

  private initializeBonusTiles(): void {
    Object.values(BonusTileInit).forEach((object) => {
      for (let value = 1; value <= 4; value += 1) {
        const b: BonusTile = new BonusTile(object.type, value);
        this.tiles.push(b);
      }
    });
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
    return super.getTiles();
  }
}

export default HongKongWall;
