import * as PIXI from 'pixi.js';

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

  public reposition(canvasRef: HTMLCanvasElement): void {
    this.container.x = 100;
    this.container.y = canvasRef.clientHeight - 120;
  }
}

export default Player;
