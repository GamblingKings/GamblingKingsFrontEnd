import * as PIXI from 'pixi.js';

import GameState from '../../game/GameState/GameState';
import WindEnums from '../enums/WindEnums';
import UserEntity from '../../game/UserEntity/UserEntity';
import SpriteFactory from '../../../pixi/SpriteFactory';
import DeadPile from '../DeadPile/DeadPile';
import WallCounter from '../WallCounter/WallCounter';

/**
 * Class that holds all the Mahjong game state for the Front-End Client.
 */
class MahjongGameState extends GameState {
  private currentWind: WindEnums;

  private redrawPending: boolean;

  private dealer: number;

  private deadPile: DeadPile;

  private wallCounter: WallCounter;

  constructor(users: UserEntity[]) {
    super(users);
    this.currentWind = WindEnums.EAST;
    this.redrawPending = false;
    this.dealer = 0;
    this.deadPile = new DeadPile();
    this.wallCounter = new WallCounter();
  }

  /**
   * Changes redrawPending to false to initialize a redraw
   */
  public requestRedraw = (): void => {
    this.redrawPending = false;
  };

  public getCurrentWind(): WindEnums {
    return this.currentWind;
  }

  public getDealer(): number {
    return this.dealer;
  }

  public getDeadPile(): DeadPile {
    return this.deadPile;
  }

  /**
   * Changes wind (in counter clockwise direction)
   */
  public changeWind(): void {
    const current = this.currentWind;

    if (current === WindEnums.EAST) {
      this.currentWind = WindEnums.SOUTH;
    } else if (current === WindEnums.SOUTH) {
      this.currentWind = WindEnums.WEST;
    } else if (current === WindEnums.WEST) {
      this.currentWind = WindEnums.NORTH;
    } else if (current === WindEnums.NORTH) {
      this.currentWind = WindEnums.EAST;
    }
  }

  /**
   * Changes dealer. If dealer goes back to 0, change wind as well.
   */
  public changeDealer(): void {
    this.dealer += 1;
    if (this.dealer >= this.getUsers().length) {
      this.dealer = 0;
      this.changeWind();
    }
  }

  public renderCanvas(spriteFactory: SpriteFactory, pixiApp: PIXI.Application): void {
    const { view, stage } = pixiApp;

    if (!this.redrawPending) {
      this.redrawPending = true;
      stage.removeChildren(0, stage.children.length);
      this.getUsers().forEach((user) => {
        user.removeAllAssets();
        user.render(spriteFactory, stage, this.requestRedraw);
        user.reposition(view);
      });
      // Render Wall
      this.wallCounter.removeAllAssets();
      this.wallCounter.render(spriteFactory, stage);
      // Render DeadPile
      this.deadPile.removeAllAssets();
      this.deadPile.render(spriteFactory, stage);
    }
  }
}

export default MahjongGameState;
