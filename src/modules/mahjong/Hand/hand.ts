import Tile from '../Tile/tile';
import Wall from '../Wall/wall';
import DeadPile from '../DeadPile/deadPile';
import SimpleTileTypes from '../Tile/types/simpleTileTypes';
import HonorTileTypes from '../Tile/types/honorTileTypes';
import BonusTileTypes from '../Tile/types/bonusTileTypes';

interface SortHandWeights {
  [SimpleTileTypes.DOT]: number;
  [SimpleTileTypes.BAMBOO]: number;
  [SimpleTileTypes.CHARACTER]: number;
  [HonorTileTypes.EAST]: number;
  [HonorTileTypes.SOUTH]: number;
  [HonorTileTypes.WEST]: number;
  [HonorTileTypes.NORTH]: number;
  [HonorTileTypes.GREEN_DRAGON]: number;
  [HonorTileTypes.RED_DRAGON]: number;
  [HonorTileTypes.WHITE_DRAGON]: number;
  [BonusTileTypes.FLOWER]: number;
  [BonusTileTypes.SEASON]: number;
}

class Hand {
  private hand: Tile[];

  private wall: Wall;

  private deadPile: DeadPile;

  constructor(wall: Wall, deadPile: DeadPile, weights: SortHandWeights) {
    this.wall = wall;
    this.deadPile = deadPile;
    this.hand = this.wall.generateHand();
    this.sort_hand(weights);
  }

  static generateHandWeights(
    dot = 1,
    bamboo = 2,
    character = 3,
    east = 4,
    south = 5,
    west = 6,
    north = 7,
    green = 8,
    red = 9,
    white = 10,
    flower = 11,
    season = 12,
  ): SortHandWeights {
    return {
      [SimpleTileTypes.DOT]: dot,
      [SimpleTileTypes.BAMBOO]: bamboo,
      [SimpleTileTypes.CHARACTER]: character,
      [HonorTileTypes.EAST]: east,
      [HonorTileTypes.SOUTH]: south,
      [HonorTileTypes.WEST]: west,
      [HonorTileTypes.NORTH]: north,
      [HonorTileTypes.GREEN_DRAGON]: green,
      [HonorTileTypes.RED_DRAGON]: red,
      [HonorTileTypes.WHITE_DRAGON]: white,
      [BonusTileTypes.FLOWER]: flower,
      [BonusTileTypes.SEASON]: season,
    };
  }

  public getHand(): Tile[] {
    return this.hand;
  }

  public throw(index: number): boolean {
    if (this.hand.length > index) {
      this.deadPile.lastThrown(this.hand.splice(index, 1)[0]);
      return true;
    }

    return false;
  }

  public draw(): Tile | null {
    const t: Tile | undefined | null = this.wall.draw();
    if (t) {
      this.hand.push(t);
      return t;
    }

    return null;
  }

  public sort_hand(weights: SortHandWeights): void {
    this.hand.sort((t1, t2) => {
      const t1Type = t1.getType();
      const t2Type = t2.getType();

      if (t1Type === t2Type && t1Type in SimpleTileTypes) {
        const v1 = t1.getValue();
        const v2 = t2.getValue();

        return v1 - v2;
      }

      return weights[t1Type] - weights[t2Type];
    });
  }
}

export default Hand;
