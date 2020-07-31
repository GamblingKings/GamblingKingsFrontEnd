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

  private interactionContainer: PIXI.Container;

  constructor(name: string, connectionId: string) {
    super(name, connectionId, RenderDirection.BOTTOM);
    this.hand = new PlayerHand();
    this.interactionContainer = new PIXI.Container();
  }

  public getHand(): PlayerHand {
    return this.hand;
  }

  public setHand(tiles: Tile[]): boolean {
    return this.hand.setTiles(tiles);
  }

  public getInteractionContainer(): PIXI.Container {
    return this.interactionContainer;
  }

  public addTileToHand(tile: Tile): void {
    this.hand.draw(tile);
  }

  /**
   * Removes all children from the container in super class.
   */
  public removeAllAssets(): void {
    const container = super.getContainer();
    container.removeChildren(0, container.children.length);

    this.interactionContainer.removeChildren(0, this.interactionContainer.children.length);
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
    const hasDrawn = this.hand.getHasDrawnTile();
    const lastTile = hasDrawn ? tiles.length - 1 : -1;

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
      if (index === lastTile) {
        sprite.x += DISTANCE_FROM_TILES * 3;
        frontSprite.x += DISTANCE_FROM_TILES * 3;
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

  public renderInteractions(spriteFactory: SpriteFactory, requestRedraw: () => void): void {
    const container = new PIXI.Container();
    // Prototyping how to do this...
    const drawTile = spriteFactory.generateSprite(FRONT_TILE);
    drawTile.height = DEFAULT_MAHJONG_HEIGHT;
    drawTile.width = DEFAULT_MAHJONG_WIDTH;
    container.addChild(drawTile);
    container.x = 200 + this.hand.getTiles().length * DEFAULT_MAHJONG_WIDTH;
    Interactions.addMouseInteraction(drawTile, (event: PIXI.InteractionEvent) => {
      console.log(event);
      this.hand.throw();
      requestRedraw();
    });

    this.interactionContainer.addChild(container);
  }

  /**
   * Create assets and appends assets to the container in super class, and attaches to the application stage.
   * @param spriteFactory SpriteFactory
   * @param pixiStage PIXI.Container
   * @param requestRedraw function that requests a redraw of canvas if there are state changes
   */
  public render(
    spriteFactory: SpriteFactory,
    pixiStage: PIXI.Container,
    isUserTurn: boolean,
    requestRedraw: () => void,
  ): void {
    const playerContainer = super.getContainer();
    if (isUserTurn) {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0x3498db);
      graphics.drawCircle(0, 0, 20);
      playerContainer.addChild(graphics);
    }
    const playerHand = this.renderHand(spriteFactory, requestRedraw);
    const name = this.renderName();
    this.renderInteractions(spriteFactory, requestRedraw);

    playerContainer.addChild(playerHand);
    playerContainer.addChild(name);
    playerContainer.addChild(this.interactionContainer);

    pixiStage.addChild(playerContainer);
  }
}

export default MahjongPlayer;
