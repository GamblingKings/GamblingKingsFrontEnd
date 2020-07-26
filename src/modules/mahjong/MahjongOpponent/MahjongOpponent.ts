import * as PIXI from 'pixi.js';

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
import OpponentHand from '../Hand/OpponentHand';
import UserEntity from '../../game/UserEntity/UserEntity';

/**
 * Mahjong Opponent that holds information about its tiles and render methods
 */
class MahjongOpponent extends UserEntity {
  private opponentHand: OpponentHand;

  constructor(name: string, location: RenderDirection) {
    super(name, location);
    this.opponentHand = new OpponentHand();
  }

  public getHand(): OpponentHand {
    return this.opponentHand;
  }

  public addPlayedTiles(tiles: Tile[]): void {
    this.opponentHand.addPlayedTiles(tiles);
  }

  public getPlayedTiles(): Tile[][] {
    return this.opponentHand.getPlayedTiles();
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
    const hand = this.opponentHand;
    for (let i = 0; i < hand.getNumberOfTiles(); i += 1) {
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
