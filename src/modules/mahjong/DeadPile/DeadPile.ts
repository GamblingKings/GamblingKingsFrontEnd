import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../pixi/SpriteFactory';

/**
 * The DeadPile class represents the pool of tiles that is no longer in play. Tiles are added to
 * the deadpile when the tile is "thrown" from a player hand and no one takes the tile.
 * Tiles in the deadpile are therefore considered to be out of play.
 */

import Tile from '../Tile/Tile';
import { FRONT_TILE, OPPONENT_TILE_WIDTH_MULTIPLER } from '../../../pixi/mahjongConstants';
import determineTileSize from '../utils/functions/determineTileSize';

const MAX_TILES_PER_ROW = 13;

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

  public resetEverything(): void {
    this.deadpile = [];
    this.lastThrow = null;
    this.removeAllAssets();
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

  public renderTiles(spriteFactory: SpriteFactory, canvasRef: React.RefObject<HTMLDivElement>): PIXI.Container {
    const container = new PIXI.Container();

    if (canvasRef.current) {
      const { tileWidth, tileHeight } = determineTileSize(canvasRef.current.clientWidth, OPPONENT_TILE_WIDTH_MULTIPLER);

      let tileCounter = 0;
      this.deadpile.forEach((tile: Tile, index: number) => {
        const frontSprite = spriteFactory.generateSprite(FRONT_TILE);
        frontSprite.width = tileWidth;
        frontSprite.height = tileHeight;
        frontSprite.x = tileCounter * tileWidth;
        frontSprite.y = Math.floor(index / MAX_TILES_PER_ROW) * tileHeight;
        const tileSprite = spriteFactory.generateSprite(tile.toString());
        tileSprite.width = tileWidth;
        tileSprite.height = tileHeight;
        tileSprite.x = tileCounter * tileWidth;
        tileSprite.y = Math.floor(index / MAX_TILES_PER_ROW) * tileHeight;

        tileCounter = (tileCounter + 1) % MAX_TILES_PER_ROW;

        container.addChild(frontSprite);
        container.addChild(tileSprite);
      });
    }

    return container;
  }

  public render(
    spriteFactory: SpriteFactory,
    pixiStage: PIXI.Container,
    canvasRef: React.RefObject<HTMLDivElement>,
  ): void {
    const tileContainer = this.renderTiles(spriteFactory, canvasRef);

    if (canvasRef.current) {
      this.container.x = canvasRef.current.clientWidth * 0.3 - this.container.width / 2;
      this.container.y = canvasRef.current.clientHeight * 0.4;
    }

    this.container.addChild(tileContainer);
    pixiStage.addChild(this.container);
  }
}

export default DeadPile;
