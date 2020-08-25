import * as PIXI from 'pixi.js';
import SpriteFactory from '../../../pixi/SpriteFactory';
import RenderDirection from '../../../pixi/directions';
import { PLAYER_TILE_WIDTH_MULTIPLER, NUMBER_OF_TILES, DISTANCE_FROM_TILES } from '../../../pixi/mahjongConstants';
import determineTileSize from '../../mahjong/utils/functions/determineTileSize';

/**
 * UserEntity class that holds PIXI container reference to render based on its position
 */
abstract class UserEntity {
  private name: string;

  private connectionId: string;

  private container: PIXI.Container;

  private location: RenderDirection;

  constructor(name: string, connectionId: string, location: RenderDirection) {
    this.name = name;
    this.connectionId = connectionId;
    this.container = new PIXI.Container();
    this.location = location;
  }

  public getName(): string {
    return this.name;
  }

  public getConnectionId(): string {
    return this.connectionId;
  }

  public getContainer(): PIXI.Container {
    return this.container;
  }

  public getLocation(): RenderDirection {
    return this.location;
  }

  /**
   * Repositions the container based on its location
   * @param canvasRef HTMLCanvasElement
   */
  public reposition(canvasRef: HTMLCanvasElement): void {
    const { x, y } = UserEntity.getContainerPosition(this.location, canvasRef);
    this.container.x = x;
    this.container.y = y;
  }

  abstract removeAllAssets(): void;

  abstract resetEverything(): void;

  public abstract render(
    spriteFactory: SpriteFactory,
    pixiStage: PIXI.Container,
    isUserTurn: boolean,
    canvasRef: React.RefObject<HTMLDivElement>,
    callbacks: Record<string, (...args: unknown[]) => void>,
  ): void;

  /**
   * Returns the x, y coordinate of where the pixi container should be
   * @param direction RenderDirection
   * @param canvasRef HTMLCanvasElement
   */
  static getContainerPosition(direction: RenderDirection, canvasRef: HTMLCanvasElement): { x: number; y: number } {
    const { clientHeight, clientWidth } = canvasRef;
    const { tileWidth, tileHeight } = determineTileSize(clientWidth, PLAYER_TILE_WIDTH_MULTIPLER);
    const horizontalHandContainer = {
      width: tileWidth * (NUMBER_OF_TILES + DISTANCE_FROM_TILES),
      height: tileHeight * 2 + DISTANCE_FROM_TILES, // 2 because of tiles in hand and tiles in meld container
    };

    const verticalHandContainer = {
      width: horizontalHandContainer.height,
      height: horizontalHandContainer.width,
    };

    const X_MARGIN = 0.1;

    // Right Container
    const RIGHT_X = clientWidth - clientWidth * X_MARGIN - verticalHandContainer.width / 2;
    const RIGHT_Y = clientHeight * 0.5 - verticalHandContainer.height / 3;

    // Left Container
    const LEFT_X = clientWidth * X_MARGIN;
    const LEFT_Y = RIGHT_Y;

    // Top Container
    const TOP_X = clientWidth * 0.5 - horizontalHandContainer.width / 2;
    const TOP_Y = RIGHT_Y - tileHeight;

    // Bottom Container
    const BOTTOM_X = TOP_X;
    const BOTTOM_Y = clientHeight * 0.5 + verticalHandContainer.height / 3;

    const positions = {
      [RenderDirection.LEFT]: {
        x: LEFT_X,
        y: LEFT_Y,
      },
      [RenderDirection.TOP]: {
        x: TOP_X,
        y: TOP_Y,
      },
      [RenderDirection.RIGHT]: {
        x: RIGHT_X,
        y: RIGHT_Y,
      },
      [RenderDirection.BOTTOM]: {
        x: BOTTOM_X,
        y: BOTTOM_Y,
      },
    };
    return positions[direction];
  }
}

export default UserEntity;
