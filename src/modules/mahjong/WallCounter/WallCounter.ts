import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../pixi/SpriteFactory';
import {
  BACK_TILE,
  DEFAULT_MAHJONG_WIDTH,
  DEFAULT_MAHJONG_HEIGHT,
  PIXI_TEXT_STYLE,
} from '../../../pixi/mahjongConstants';

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

  public getNumberOfTilesLeft(): number {
    return WallCounter.TOTAL_NUMBER_OF_TILES - this.getCurrentIndex();
  }

  public getContainer(): PIXI.Container {
    return this.container;
  }

  public removeAllAssets(): void {
    this.container.removeChildren(0, this.container.children.length);
  }

  public render(spriteFactory: SpriteFactory, pixiStage: PIXI.Container): void {
    const container = new PIXI.Container();
    const tileSprite = spriteFactory.generateSprite(BACK_TILE);
    tileSprite.width = DEFAULT_MAHJONG_WIDTH;
    tileSprite.height = DEFAULT_MAHJONG_HEIGHT;
    container.addChild(tileSprite);

    const numberOfTilesLeftText = new PIXI.Text(`${this.getNumberOfTilesLeft()} tiles left`, PIXI_TEXT_STYLE);

    this.container.addChild(container);
    this.container.addChild(numberOfTilesLeftText);
    // Location is a Placeholder
    this.container.x = 250;
    this.container.y = 250;

    pixiStage.addChild(this.container);
  }
}

export default WallCounter;
