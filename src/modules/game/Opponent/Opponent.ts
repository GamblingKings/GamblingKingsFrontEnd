import * as PIXI from 'pixi.js';

import RenderDirection from '../../../pixi/directions';

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

  public reposition(canvasRef: HTMLCanvasElement): void {
    const { x, y } = CONTAINER_POSITIONS(this.location, canvasRef);
    this.container.x = x;
    this.container.y = y;
  }
}

export default Opponent;
