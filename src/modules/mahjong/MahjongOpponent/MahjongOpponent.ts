import * as PIXI from 'pixi.js';

import Tile from '../Tile/Tile';
import RenderDirection from '../../../pixi/directions';
import SpriteFactory from '../../../pixi/SpriteFactory';

import {
  DEFAULT_MAHJONG_HEIGHT,
  DISTANCE_FROM_TILES,
  PIXI_TEXT_STYLE,
  BACK_TILE,
  FRONT_TILE,
  OPPONENT_TILE_WIDTH_MULTIPLER,
} from '../../../pixi/mahjongConstants';
import OpponentHand from '../Hand/OpponentHand';
import UserEntity from '../../game/UserEntity/UserEntity';
import determineTileSize from '../utils/functions/determineTileSize';

/**
 * Mahjong Opponent that holds information about its tiles and render methods
 */
class MahjongOpponent extends UserEntity {
  private opponentHand: OpponentHand;

  constructor(name: string, connectionId: string, location: RenderDirection) {
    super(name, connectionId, location);
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

  public drawTile(): void {
    this.opponentHand.setHasDrawn(true);
  }

  public playedTile(): void {
    this.opponentHand.playedTile();
  }

  public resetEverything(): void {
    this.removeAllAssets();
    this.opponentHand.resetEverything();
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
   * @param spriteFactory SpriteFactory
   */
  public renderMahjongHand(spriteFactory: SpriteFactory, canvasRef: React.RefObject<HTMLDivElement>): PIXI.Container {
    if (canvasRef.current) {
      const { tileWidth, tileHeight } = determineTileSize(canvasRef.current.clientWidth, OPPONENT_TILE_WIDTH_MULTIPLER);
      const container = new PIXI.Container();
      const hand = this.opponentHand;
      const hasDrawn = hand.getHasDrawn();
      const lastTile = hasDrawn ? hand.getNumberOfTiles() - 1 : -1;
      for (let i = 0; i < hand.getNumberOfTiles(); i += 1) {
        const backSprite = spriteFactory.generateSprite(BACK_TILE);
        backSprite.width = tileWidth;
        backSprite.height = tileHeight;
        backSprite.x = i * (tileWidth + DISTANCE_FROM_TILES);

        if (i === lastTile) {
          backSprite.y -= 10;
        }
        container.addChild(backSprite);
      }

      // Render played tiles
      const allMeldsContainer = new PIXI.Container();
      const playedTiles = this.getHand().getPlayedTiles();
      playedTiles.forEach((meld: Tile[], index: number) => {
        const meldContainer = new PIXI.Container();
        meld.forEach((tile: Tile, tileIndex: number) => {
          const frontSprite = spriteFactory.generateSprite(FRONT_TILE);
          frontSprite.width = tileWidth;
          frontSprite.height = tileHeight;
          frontSprite.x = tileIndex * (tileWidth + DISTANCE_FROM_TILES);
          frontSprite.y += tileHeight + DISTANCE_FROM_TILES;

          meldContainer.addChild(frontSprite);

          const tileSprite = spriteFactory.generateSprite(tile.toString());
          tileSprite.width = tileWidth;
          tileSprite.height = tileHeight;
          tileSprite.x = tileIndex * (tileWidth + DISTANCE_FROM_TILES);
          tileSprite.y += tileHeight + DISTANCE_FROM_TILES;

          meldContainer.addChild(tileSprite);
        });
        // Give adequate/correct spacing between each meld for readability
        if (index !== 0) {
          const previousMeldLength = playedTiles[index - 1].length;
          // eslint + prettier conflict
          // eslint-disable-next-line operator-linebreak
          meldContainer.x =
            // eslint-disable-next-line operator-linebreak
            (tileWidth + 3 * DISTANCE_FROM_TILES) * previousMeldLength + allMeldsContainer.getChildAt(index - 1).x;
        }

        allMeldsContainer.addChild(meldContainer);
      });

      container.addChild(allMeldsContainer);

      return container;
    }

    return new PIXI.Container();
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
  public render(
    spriteFactory: SpriteFactory,
    pixiStage: PIXI.Container,
    isUserTurn: boolean,
    canvasRef: React.RefObject<HTMLDivElement>,
  ): void {
    const opponentContainer = super.getContainer();
    if (isUserTurn) {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0x3498db);
      graphics.drawCircle(0, 0, 20);
      opponentContainer.addChild(graphics);
    }
    const hand = this.renderMahjongHand(spriteFactory, canvasRef);
    const name = this.renderName();

    if (canvasRef.current) {
      const { tileHeight } = determineTileSize(canvasRef.current.clientWidth, OPPONENT_TILE_WIDTH_MULTIPLER);

      /**
       * Rotates the hand based on where the Opponent is sitting
       */
      const direction = super.getLocation();
      if (direction === RenderDirection.LEFT) {
        hand.pivot.x = 0;
        hand.pivot.y = DEFAULT_MAHJONG_HEIGHT;
        hand.angle = 90;

        name.angle = 90;
        name.y = hand.y + hand.width / 2;
        name.x = hand.x + tileHeight * 2;
      } else if (direction === RenderDirection.TOP) {
        hand.pivot.x = hand.width;
        hand.pivot.y = DEFAULT_MAHJONG_HEIGHT;
        hand.angle = 180;

        name.angle = 180;
        name.x = hand.x + hand.width / 2;
        name.y = hand.y + tileHeight * 2;
      } else if (direction === RenderDirection.RIGHT) {
        hand.pivot.x = hand.width;
        hand.pivot.y = DEFAULT_MAHJONG_HEIGHT;
        hand.angle = 270;
        hand.x = DEFAULT_MAHJONG_HEIGHT;

        name.angle = 270;
        name.x = hand.x - tileHeight * 2;
        name.y = hand.y + hand.width / 2;
      }
      opponentContainer.addChild(hand);
      opponentContainer.addChild(name);

      pixiStage.addChild(opponentContainer);
    }
  }
}

export default MahjongOpponent;
