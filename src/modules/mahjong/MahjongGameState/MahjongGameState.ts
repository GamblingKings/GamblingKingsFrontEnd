import * as PIXI from 'pixi.js';

import GameState from '../../game/GameState/GameState';
import WindEnums from '../enums/WindEnums';
import UserEntity from '../../game/UserEntity/UserEntity';
import SpriteFactory from '../../../pixi/SpriteFactory';

/**
 * Class that holds all the Mahjong game state for the Front-End Client.
 */
class MahjongGameState extends GameState {
  private currentWind: WindEnums;

  private redrawPending: boolean;

  constructor(users: UserEntity[]) {
    super(users);
    this.currentWind = WindEnums.EAST;
    this.redrawPending = false;
  }

  /**
   * Changes redrawPending to false to initialize a redraw
   */
  public requestRedraw(): void {
    this.redrawPending = false;
  }

  public getCurrentWind(): WindEnums {
    return this.currentWind;
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
    }
  }
}

export default MahjongGameState;
