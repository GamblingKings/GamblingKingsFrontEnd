import * as PIXI from 'pixi.js';

import RenderDirection from '../../../pixi/directions';

/**
 * Returns the x, y coordinate of where the opponent container should be
 * @param direction RenderDirection
 * @param canvasRef HTMLCanvasElement
 */
const CONTAINER_POSITIONS = (direction: RenderDirection, canvasRef: HTMLCanvasElement): { x: number; y: number } => {
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
  };
  return positions[direction];
};

/**
 * Opponent class that holds container reference based on where opponent is.
 */
abstract class Opponent {
  private name: string;

  private container: PIXI.Container;

  private location: RenderDirection;

  constructor(name: string, location: RenderDirection) {
    this.name = name;
    this.container = new PIXI.Container();
    this.location = location;
  }

  public getName(): string {
    return this.name;
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
    const { x, y } = CONTAINER_POSITIONS(this.location, canvasRef);
    this.container.x = x;
    this.container.y = y;
  }
}

export default Opponent;