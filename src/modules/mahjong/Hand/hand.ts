import Tile from '../Tile/tile';
import Wall from '../Wall/wall';
import DeadPile from '../DeadPile/deadPile';
import SimpleTileTypes from '../Tile/types/simpleTileTypes';
import HonorTileTypes from '../Tile/types/honorTileTypes';
import BonusTileTypes from '../Tile/types/bonusTileTypes';
import HongKongWall from '../Wall/version/hongKongWall';

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

  constructor(wall: Wall, deadPile: DeadPile) {
    this.wall = wall;
    this.deadPile = deadPile;
    this.hand = this.wall.generateHand();
    this.sort_hand();
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

  public sort_hand(): void {
    const weights: SortHandWeights = Hand.generateHandWeights();

    this.hand.sort((t1, t2) => {
      const t1Type = t1.getType();
      const t2Type = t2.getType();

      return weights[t1Type] - weights[t2Type];
    });
  }
}

const w = new HongKongWall();
const d = new DeadPile();

const handOne = new Hand(w, d);
const handTwo = new Hand(w, d);
const handThree = new Hand(w, d);
const handFour = new Hand(w, d);

console.log(w.getTiles().length);
console.log(`HAND ONE ${handOne.getHand()}`);
console.log(`HAND TWO ${handTwo.getHand()}`);
console.log(`HAND THREE ${handThree.getHand()}`);
console.log(`HAND FOUR ${handFour.getHand()}`);

export default Hand;
