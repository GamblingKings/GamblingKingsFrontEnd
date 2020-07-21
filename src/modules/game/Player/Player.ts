import * as PIXI from 'pixi.js';

/**
 * Player class that holds PIXI container (bottom of screen) reference
 */
abstract class Player {
  private name: string;

  private container: PIXI.Container;

  constructor(name: string) {
    this.name = name;
    this.container = new PIXI.Container();
  }

  public getName(): string {
    return this.name;
  }

  public getContainer(): PIXI.Container {
    return this.container;
  }

  /**
   * Repositions the container near the bottom of screen
   * @param canvasRef HTMLCanvasElement
   */
  public reposition(canvasRef: HTMLCanvasElement): void {
    this.container.x = 100;
    this.container.y = canvasRef.clientHeight - 120;
  }
}

export default Player;
