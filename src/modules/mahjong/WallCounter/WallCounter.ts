import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../pixi/SpriteFactory';
import { BACK_TILE, PIXI_TEXT_STYLE, OPPONENT_TILE_WIDTH_MULTIPLER } from '../../../pixi/mahjongConstants';
import determineTileSize from '../utils/functions/determineTileSize';

class WallCounter {
  private currentIndex: number;

  private container: PIXI.Container;

  static TOTAL_NUMBER_OF_TILES = 144;

  static NUMBER_OF_TILES_PER_HAND = 13;

  static NUMBER_OF_PLAYERS = 4;

  constructor() {
    this.currentIndex = WallCounter.NUMBER_OF_TILES_PER_HAND * WallCounter.NUMBER_OF_PLAYERS;
    this.container = new PIXI.Container();
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public increaseCounter(): void {
    this.currentIndex += 1;
  }

  public resetEverything(): void {
    this.removeAllAssets();
    this.currentIndex = WallCounter.NUMBER_OF_TILES_PER_HAND * WallCounter.NUMBER_OF_PLAYERS;
  }

  public setCurrentIndex(currentIndex: number): boolean {
    if (currentIndex < WallCounter.TOTAL_NUMBER_OF_TILES) {
      this.currentIndex = currentIndex;
      return true;
    }

    return false;
  }

  public getNumberOfTilesLeft(): number {
    return WallCounter.TOTAL_NUMBER_OF_TILES - this.getCurrentIndex();
  }

  public getContainer(): PIXI.Container {
    return this.container;
  }

  public removeAllAssets(): void {
    this.container.removeChildren(0, this.container.children.length);
  }

  public render(
    spriteFactory: SpriteFactory,
    pixiStage: PIXI.Container,
    canvasRef: React.RefObject<HTMLDivElement>,
  ): void {
    const container = new PIXI.Container();
    if (canvasRef.current) {
      const { tileWidth, tileHeight } = determineTileSize(canvasRef.current.clientWidth, OPPONENT_TILE_WIDTH_MULTIPLER);
      const tileSprite = spriteFactory.generateSprite(BACK_TILE);
      tileSprite.width = tileWidth;
      tileSprite.height = tileHeight;
      container.addChild(tileSprite);

      const numberOfTilesLeftText = new PIXI.Text(`${this.getNumberOfTilesLeft()} tiles left`, PIXI_TEXT_STYLE);

      this.container.addChild(container);
      this.container.addChild(numberOfTilesLeftText);
      // Location is a Placeholder
      this.container.x = canvasRef.current.clientWidth * 0.3;
      this.container.y = canvasRef.current.clientHeight * 0.3;

      pixiStage.addChild(this.container);
    }
  }
}

export default WallCounter;
