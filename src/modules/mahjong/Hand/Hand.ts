/**
 * The Hand class represents a player's hand in Mahjong. It consists of
 * a 13 tile hand that contains various different tiles. The player
 * continuously draws and throws tile from the hand until a winning hand
 * is reached.
 */

import Tile from '../Tile/Tile';
import Wall from '../Wall/Wall';
import DeadPile from '../DeadPile/DeadPile';
import SimpleTileTypes from '../enums/SimpleTileEnums';
import HonorTileTypes from '../enums/HonorTileEnums';
import BonusTileTypes from '../enums/BonusTileEnums';
import { SortHandWeights } from '../types/MahjongTypes';

import sortHandUtils from '../utils/functions/sortHand';

class Hand {
  private hand: Tile[];

  private playedTiles: Tile[][];

  private selectedTile = -1;

  /**
   * Public constructor. Generates a hand from a wall and sorts to the hand
   * @param wall A child of the Wall class
   * @param weights SortHandWeights object that is used to sort the hand
   */
  constructor(wall: Wall, weights: SortHandWeights) {
    this.hand = wall.generateHand();
    this.playedTiles = [];
    this.sortHand(weights);
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

  /**
   * @returns the hand property
   */
  public getHand(): Tile[] {
    return this.hand;
  }

  public getSelectedTile(): number {
    return this.selectedTile;
  }

  public setSelectedTile(index: number): void {
    if (index === this.selectedTile) {
      this.selectedTile = -1;
    } else {
      this.selectedTile = index;
    }
  }

  /**
   * Throws a tile at a given index into the deadpile
   * @param index number
   * @param deadPile DeadPile object
   */
  public throw(index: number, deadPile: DeadPile): boolean {
    if (this.hand.length > index) {
      deadPile.lastThrown(this.hand.splice(index, 1)[0]);
      return true;
    }

    return false;
  }

  /**
   * Draws a tile from a wall
   * @param wall a child of the Wall class
   */
  public draw(wall: Wall): Tile | null {
    const t: Tile | undefined | null = wall.draw();
    if (t) {
      this.hand.push(t);
      return t;
    }

    return null;
  }

  /**
   * Sorts the hand based on given weights
   * @param weights SortHandWeights, an object that stores tile weights
   */
  public sortHand(weights: SortHandWeights): void {
    this.hand = sortHandUtils(this.hand, weights);
  }

  /**
   * Adds a meld to the played tiles
   * @param meld an array of tiles
   */
  public addPlayedTiles(meld: Tile[]): void {
    this.playedTiles.push(meld);
  }

  /**
   * Gets the played tiles
   */
  public getPlayedTiles(): Tile[][] {
    return this.playedTiles;
  }
}

export default Hand;
