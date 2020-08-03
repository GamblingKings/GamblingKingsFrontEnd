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
import { OutgoingAction } from '../../ws';

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
   * @param callbacks references to functions that so events can send to ws
   */
  public renderHand(
    spriteFactory: SpriteFactory,
    callbacks: Record<string, (...args: unknown[]) => void>,
  ): PIXI.Container {
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
        console.log(event.target);
        this.hand?.setSelectedTile(index);
        callbacks.REQUEST_REDRAW();
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
   * Adds assets with interactions for additional functionality (like pong and kong)
   * @param spriteFactory SpriteFactory
   * @param callbacks references to functions that so events can send to ws
   */
  public renderInteractions(
    spriteFactory: SpriteFactory,
    callbacks: Record<string, (...args: unknown[]) => void>,
  ): void {
    const container = new PIXI.Container();
    // Prototyping how to do this...
    const drawTile = spriteFactory.generateSprite(FRONT_TILE);
    drawTile.height = DEFAULT_MAHJONG_HEIGHT;
    drawTile.width = DEFAULT_MAHJONG_WIDTH;
    container.addChild(drawTile);
    container.x = 200 + this.hand.getTiles().length * DEFAULT_MAHJONG_WIDTH;
    Interactions.addMouseInteraction(drawTile, (event: PIXI.InteractionEvent) => {
      console.log(event.target);
      const tile = this.hand.throw();
      if (tile !== null) {
        callbacks[OutgoingAction.PLAY_TILE](tile.toString());
      }
    });

    this.interactionContainer.addChild(container);
  }

  /**
   * Create assets and appends assets to the container in super class, and attaches to the application stage.
   * @param spriteFactory SpriteFactory
   * @param pixiStage PIXI.Container
   * @param isUserTurn boolean indicating if it is current user's turn
   * @param callbacks references to functions that so events can send to ws
   */
  public render(
    spriteFactory: SpriteFactory,
    pixiStage: PIXI.Container,
    isUserTurn: boolean,
    callbacks: Record<string, () => void>,
  ): void {
    const playerContainer = super.getContainer();
    if (isUserTurn) {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0x3498db);
      graphics.drawCircle(0, 0, 20);
      playerContainer.addChild(graphics);
    }
    const playerHand = this.renderHand(spriteFactory, callbacks);
    const name = this.renderName();
    this.renderInteractions(spriteFactory, callbacks);

    playerContainer.addChild(playerHand);
    playerContainer.addChild(name);
    playerContainer.addChild(this.interactionContainer);

    pixiStage.addChild(playerContainer);
  }
}

export default MahjongPlayer;
