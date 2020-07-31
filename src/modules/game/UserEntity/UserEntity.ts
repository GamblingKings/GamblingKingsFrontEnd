import * as PIXI from 'pixi.js';
import SpriteFactory from '../../../pixi/SpriteFactory';
import RenderDirection from '../../../pixi/directions';

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

  public abstract render(
    spriteFactory: SpriteFactory,
    pixiStage: PIXI.Container,
    isUserTurn: boolean,
    callbacks: Record<string, (...args: unknown[]) => void>,
  ): void;

  /**
   * Returns the x, y coordinate of where the pixi container should be
   * @param direction RenderDirection
   * @param canvasRef HTMLCanvasElement
   */
  static getContainerPosition(direction: RenderDirection, canvasRef: HTMLCanvasElement): { x: number; y: number } {
    const positions = {
      [RenderDirection.LEFT]: {
        x: 50,
        y: 80,
      },
      [RenderDirection.TOP]: {
        x: 200,
        y: 80,
      },
      [RenderDirection.RIGHT]: {
        x: canvasRef.clientWidth - 120,
        y: 80,
      },
      [RenderDirection.BOTTOM]: {
        x: 100,
        y: canvasRef.clientHeight - 120,
      },
    };
    return positions[direction];
  }
}

export default UserEntity;
