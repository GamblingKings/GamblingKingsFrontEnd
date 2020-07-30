import * as PIXI from 'pixi.js';

import SpriteFactory from '../../../pixi/SpriteFactory';
import Interactions from '../../../pixi/Interactions';

import {
  DEFAULT_MAHJONG_WIDTH,
  DEFAULT_MAHJONG_HEIGHT,
  DISTANCE_FROM_TILES,
  PIXI_TEXT_STYLE,
  FRONT_TILE,
  PLAYER_HAND_SPRITE_X,
} from '../../../pixi/mahjongConstants';
import RenderDirection from '../../../pixi/directions';
import UserEntity from '../../game/UserEntity/UserEntity';
import PlayerHand from '../Hand/PlayerHand';
import Tile from '../Tile/Tile';

/**
 * Mahjong player that holds information about current hand (tiles) and render methods
 */
class MahjongPlayer extends UserEntity {
  private hand: PlayerHand;

  constructor(name: string) {
    super(name, RenderDirection.BOTTOM);
    this.hand = new PlayerHand();
  }

  public getHand(): PlayerHand {
    return this.hand;
  }

  public setHand(tiles: Tile[]): boolean {
    return this.hand.setTiles(tiles);
  }

  /**
   * Removes all children from the container in super class.
   */
  public removeAllAssets(): void {
    const container = super.getContainer();
    container.removeChildren(0, container.children.length);
  }

  /**
   * Return a PIXI.container containing all the tile sprites
   * TODO: render played tiles
   * @param spriteFactory SpriteFactory
   * @param requestRedraw function that requests a redraw of canvas if there are state changes
   */
  public renderHand(spriteFactory: SpriteFactory, requestRedraw: () => void): PIXI.Container {
    const container = new PIXI.Container();

    const selectedTile = this.hand.getSelectedTile();
    const tiles = this.hand.getTiles();

    tiles.forEach((tile: Tile, index: number) => {
      const frontSprite = spriteFactory.generateSprite(FRONT_TILE);
      frontSprite.width = DEFAULT_MAHJONG_WIDTH;
      frontSprite.height = DEFAULT_MAHJONG_HEIGHT;
      frontSprite.x = PLAYER_HAND_SPRITE_X + index * (DEFAULT_MAHJONG_WIDTH + DISTANCE_FROM_TILES);
      container.addChild(frontSprite);

      const sprite = spriteFactory.generateSprite(tile.toString());
      sprite.width = DEFAULT_MAHJONG_WIDTH;
      sprite.height = DEFAULT_MAHJONG_HEIGHT;
      sprite.x = PLAYER_HAND_SPRITE_X + index * (DEFAULT_MAHJONG_WIDTH + DISTANCE_FROM_TILES);

      if (index === selectedTile) {
        sprite.y = -10;
        frontSprite.y = -10;
      }
      Interactions.addMouseInteraction(sprite, (event: PIXI.InteractionEvent) => {
        requestRedraw();
        this.hand?.setSelectedTile(index);
        console.log(event.target);
      });

      container.addChild(sprite);
    });

    return container;
  }

  /**
   * Returns a PIXI.Text containing the Player's name
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
   * @param requestRedraw function that requests a redraw of canvas if there are state changes
   */
  public render(spriteFactory: SpriteFactory, pixiStage: PIXI.Container, requestRedraw: () => void): void {
    const playerContainer = super.getContainer();

    const playerHand = this.renderHand(spriteFactory, requestRedraw);
    const name = this.renderName();

    playerContainer.addChild(playerHand);
    playerContainer.addChild(name);

    pixiStage.addChild(playerContainer);
  }
}

export default MahjongPlayer;
