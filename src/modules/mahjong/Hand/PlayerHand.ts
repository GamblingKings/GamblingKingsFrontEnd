import Tile from '../Tile/Tile';
import { SortHandWeights } from '../types/MahjongTypes';
import sortHandUtils from '../utils/functions/sortHand';
import BonusTileTypes from '../enums/BonusTileEnums';
import HonorTileTypes from '../enums/HonorTileEnums';
import SimpleTileTypes from '../enums/SimpleTileEnums';

/**
 * Hand that the Player (client-side) should have.
 * Can see all the tiles that they currently hold.
 */
class PlayerHand {
  private tiles: Tile[];

  private playedTiles: Tile[][];

  private selectedTile = -1;

  private hasDrawnTile: boolean;

  constructor(tiles: Tile[] = []) {
    this.tiles = tiles;
    this.playedTiles = [];
    this.hasDrawnTile = false;
  }

  /**
   * Static method to generate an object used to sort the hands
   * @param dot number
   * @param bamboo number
   * @param character number
   * @param east number
   * @param south number
   * @param west number
   * @param north number
   * @param green number
   * @param red number
   * @param white number
   * @param flower number
   * @param season number
   * @returns SortHandWeights, the object with tile weights
   */
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
      [HonorTileTypes.GREENDRAGON]: green,
      [HonorTileTypes.REDDRAGON]: red,
      [HonorTileTypes.WHITEDRAGON]: white,
      [BonusTileTypes.FLOWER]: flower,
      [BonusTileTypes.SEASON]: season,
    };
  }

  public getTiles(): Tile[] {
    return this.tiles;
  }

  /**
   * Set new tiles for hand.
   * Array of Tiles must have length 13
   * May change if different mahjong versions require different number of starting tiles.
   * @param tiles Tile[]
   */
  public setTiles(tiles: Tile[]): boolean {
    if (tiles.length !== 13) {
      return false;
    }
    this.tiles = tiles;
    return true;
  }

  public getPlayedTiles(): Tile[][] {
    return this.playedTiles;
  }

  public getHasDrawnTile(): boolean {
    return this.hasDrawnTile;
  }

  public addPlayedTiles(tiles: Tile[]): boolean {
    // could add validation that this is valid meld
    this.playedTiles.push(tiles);
    return true;
  }

  public getSelectedTile(): number {
    return this.selectedTile;
  }

  public setSelectedTile(index: number): boolean {
    if (index >= this.tiles.length || index < -1) {
      return false;
    }
    if (index === this.selectedTile) {
      this.selectedTile = -1;
    } else {
      this.selectedTile = index;
    }
    return true;
  }

  public throw(): Tile | null {
    if (this.selectedTile >= 0 && this.selectedTile < this.tiles.length) {
      const index = this.selectedTile;
      const tile = this.tiles[index];
      this.tiles.splice(index, 1);
      this.selectedTile = -1;
      return tile;
    }
    return null;
  }

  public draw(tile: Tile): boolean {
    this.tiles.push(tile);
    this.hasDrawnTile = true;
    this.setSelectedTile(this.tiles.length - 1);
    return true;
  }

  public sortHand(weights: SortHandWeights): void {
    this.tiles = sortHandUtils(this.tiles, weights);
  }
}

export default PlayerHand;
