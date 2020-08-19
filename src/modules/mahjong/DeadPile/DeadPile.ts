import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../pixi/SpriteFactory';

/**
 * The DeadPile class represents the pool of tiles that is no longer in play. Tiles are added to
 * the deadpile when the tile is "thrown" from a player hand and no one takes the tile.
 * Tiles in the deadpile are therefore considered to be out of play.
 */

import Tile from '../Tile/Tile';
import {
  FRONT_TILE,
  DEFAULT_MAHJONG_WIDTH,
  DEFAULT_MAHJONG_HEIGHT,
  PIXI_TEXT_STYLE,
} from '../../../pixi/mahjongConstants';

class DeadPile {
  private deadpile: Tile[];

  private lastThrow: Tile | null;

  private container: PIXI.Container;

  /**
   * Public constructor
   */
  constructor() {
    this.deadpile = [];
    this.lastThrow = null;
    this.container = new PIXI.Container();
  }

  /**
   * @returns the deadpile array
   */
  public getDeadPile(): Tile[] {
    return this.deadpile;
  }

  /**
   * @returns the lastThrow property
   */
  public getLastThrown(): Tile | null {
    return this.lastThrow;
  }

  public getContainer(): PIXI.Container {
    return this.container;
  }

  /**
   * Adds a tile to the deadpile
   * @param t A Tile object, i.e. SimpleTile, BonusTile, HonorTile
   */
  public add(t: Tile): boolean {
    this.deadpile.push(t);
    return true;
  }

  /**
   * Removes the last tile from the deadpile
   */
  public removeLastTile(): Tile | undefined {
    return this.deadpile.pop();
  }

  /**
   * Adds the lastThrow Tile to the deadPile and reassigns the lastThrow to be a tile object
   * @param t A Tile object, i.e. SimpleTile, BonusTile, HonorTile
   */
  public lastThrown(t: Tile): void {
    if (this.lastThrow) {
      this.add(this.lastThrow);
    }

    this.lastThrow = t;
  }

  /**
   * Resets the deadPile
   */
  public clear(): void {
    this.deadpile = [];
    this.lastThrow = null;
  }

  public removeAllAssets(): void {
    this.container.removeChildren(0, this.container.children.length);
  }

  public renderTiles(spriteFactory: SpriteFactory): PIXI.Container {
    const container = new PIXI.Container();

    this.deadpile.forEach((tile: Tile, index: number) => {
      const frontSprite = spriteFactory.generateSprite(FRONT_TILE);
      frontSprite.width = DEFAULT_MAHJONG_WIDTH;
      frontSprite.height = DEFAULT_MAHJONG_HEIGHT;
      frontSprite.x = index * DEFAULT_MAHJONG_WIDTH;
      const tileSprite = spriteFactory.generateSprite(tile.toString());
      tileSprite.width = DEFAULT_MAHJONG_WIDTH;
      tileSprite.height = DEFAULT_MAHJONG_HEIGHT;
      tileSprite.x = index * DEFAULT_MAHJONG_WIDTH;

      container.addChild(frontSprite);
      container.addChild(tileSprite);
    });

    return container;
  }

  public render(spriteFactory: SpriteFactory, pixiStage: PIXI.Container): void {
    const tileContainer = this.renderTiles(spriteFactory);

    const placeholderText = new PIXI.Text('Dead Pile', PIXI_TEXT_STYLE);
    this.container.addChild(tileContainer);
    this.container.addChild(placeholderText);
    this.container.x = 250;
    this.container.y = 400;

    pixiStage.addChild(this.container);
  }
}

export default DeadPile;
