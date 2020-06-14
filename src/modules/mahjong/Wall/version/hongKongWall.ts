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

  public initalizeWall(reset = false): void {
    if (reset) {
      super.clear();
    }

    super.initializeSimpleTiles();
    super.initializeHonorTiles();
    this.initializeBonusTiles();
    super.shuffleTiles();
  }

  public reset(): void {
    this.initalizeWall(true);
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
    return super.generateHand();
  }

  public draw(): Tile | null | undefined {
    return super.draw();
  }

  public getTiles(): Tile[] {
    return super.getTiles();
  }
}

export default HongKongWall;
