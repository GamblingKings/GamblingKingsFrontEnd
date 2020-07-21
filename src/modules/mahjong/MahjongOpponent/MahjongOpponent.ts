import * as PIXI from 'pixi.js';

import Opponent from '../../game/Opponent/Opponent';
import Tile from '../Tile/Tile';
import RenderDirection from '../../../pixi/directions';
import SpriteFactory from '../../../pixi/SpriteFactory';

import {
  DEFAULT_MAHJONG_WIDTH,
  DEFAULT_MAHJONG_HEIGHT,
  DISTANCE_FROM_TILES,
  PIXI_TEXT_STYLE,
  BACK_TILE,
} from '../../../pixi/mahjongConstants';

/**
 * Mahjong Opponent that holds information about its tiles and render methods
 */
class MahjongOpponent extends Opponent {
  private numberOfTiles: number;

  private playedTiles: Tile[][] = [];

  constructor(name: string, location: RenderDirection) {
    super(name, location);
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

  /**
   * Removes all children from the container in super class.
   */
  public removeAllAssets(): void {
    const container = super.getContainer();
    container.removeChildren(0, container.children.length);
  }

  /**
   * Returns a PIXI.Container containing all back tile sprites
   * TODO: render played tiles
   * @param spriteFactory SpriteFactory
   */
  public renderMahjongHand(spriteFactory: SpriteFactory): PIXI.Container {
    const container = new PIXI.Container();
    for (let i = 0; i < this.numberOfTiles; i += 1) {
      const backSprite = spriteFactory.generateSprite(BACK_TILE);
      backSprite.width = DEFAULT_MAHJONG_WIDTH;
      backSprite.height = DEFAULT_MAHJONG_HEIGHT;
      backSprite.x = i * (DEFAULT_MAHJONG_WIDTH + DISTANCE_FROM_TILES);
      container.addChild(backSprite);
    }
    return container;
  }

  /**
   * Returns a PIXI.Text containing the Opponent's name
   */
  public renderName(): PIXI.Text {
    const name = super.getName();
    const text = new PIXI.Text(name, PIXI_TEXT_STYLE);
    return text;
  }

  /**
   * Create assets and appends assets to the container in super class, and attaches to the application stage.
   * @param spriteFactory SpriteFactory
   * @param pixiStage PIXI.Container
   */
  public render(spriteFactory: SpriteFactory, pixiStage: PIXI.Container): void {
    const opponentContainer = super.getContainer();

    const hand = this.renderMahjongHand(spriteFactory);
    const name = this.renderName();

    /**
     * Rotates the hand based on where the Opponent is sitting
     */
    const direction = super.getLocation();
    if (direction === RenderDirection.LEFT) {
      hand.pivot.x = 0;
      hand.pivot.y = DEFAULT_MAHJONG_HEIGHT;
      hand.angle = 90;
    } else if (direction === RenderDirection.TOP) {
      hand.pivot.x = hand.width;
      hand.pivot.y = DEFAULT_MAHJONG_HEIGHT;
      hand.angle = 180;
    } else if (direction === RenderDirection.RIGHT) {
      hand.pivot.x = hand.width;
      hand.pivot.y = DEFAULT_MAHJONG_HEIGHT;
      hand.angle = 270;
      hand.x = DEFAULT_MAHJONG_HEIGHT;
    }
    opponentContainer.addChild(hand);
    opponentContainer.addChild(name);

    pixiStage.addChild(opponentContainer);
  }
}

export default MahjongOpponent;
