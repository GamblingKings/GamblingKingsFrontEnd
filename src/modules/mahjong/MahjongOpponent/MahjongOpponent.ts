import Opponent from '../../game/Opponent/Opponent';
import Tile from '../Tile/Tile';

class MahjongOpponent extends Opponent {
  private numberOfTiles: number;

  private playedTiles: Tile[][] = [];

  constructor(name: string) {
    super(name);
    this.numberOfTiles = 13;
  }

  public getNumberOfTiles(): number {
    return this.numberOfTiles;
  }

  public getPlayedTiles(): Tile[][] {
    return this.playedTiles;
  }

  public addPlayedTiles(tiles: Tile[]): void {
    this.playedTiles.push(tiles);
  }
}

export default MahjongOpponent;
