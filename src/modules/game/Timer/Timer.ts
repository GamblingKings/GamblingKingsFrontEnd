import * as PIXI from 'pixi.js';
import { PIXI_TEXT_STYLE } from '../../../pixi/mahjongConstants';

class Timer {
  static defaultCallback = (): void => {
    console.log('Timer ended!');
  };

  private isRunning: boolean;

  private timeStart: number;

  // milliseconds
  private timeToRun: number;

  private callback = Timer.defaultCallback;

  private container: PIXI.Container;

  constructor() {
    this.isRunning = false;
    this.timeStart = 0;
    this.timeToRun = 0;
    this.container = new PIXI.Container();
  }

  public setCallback(callback: () => void): void {
    this.callback = callback;
  }

  public getCallback(): () => void {
    return this.callback;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getContainer(): PIXI.Container {
    return this.container;
  }

  public startTimer(currentTime: number, timeToRun: number): void {
    this.timeStart = currentTime;
    this.timeToRun = timeToRun;
    this.isRunning = true;
  }

  public stopTimer(): void {
    this.isRunning = false;
    this.callback = Timer.defaultCallback;
  }

  public removeAllAssets(): void {
    this.container.removeChildren(0, this.container.children.length);
  }

  public update(): void {
    if (!this.isRunning) {
      return;
    }

    const timeNow = new Date().getTime();
    const timeLeft = Math.round((this.timeStart + this.timeToRun - timeNow) / 1000);
    if (timeLeft > 0) {
      const text = new PIXI.Text(timeLeft.toString(), PIXI_TEXT_STYLE);
      this.container.addChild(text);
    } else {
      this.callback();
      this.isRunning = false;
    }
  }
}

export default Timer;
