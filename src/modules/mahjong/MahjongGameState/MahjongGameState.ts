import * as PIXI from 'pixi.js';

import GameState from '../../game/GameState/GameState';
import WindEnums from '../enums/WindEnums';
import UserEntity from '../../game/UserEntity/UserEntity';
import SpriteFactory from '../../../pixi/SpriteFactory';
import DeadPile from '../DeadPile/DeadPile';
import WallCounter from '../WallCounter/WallCounter';
import { OutgoingAction } from '../../ws';
// eslint-disable-next-line import/no-cycle
import MahjongPlayer from '../MahjongPlayer/MahjongPlayer';
import MahjongOpponent from '../MahjongOpponent/MahjongOpponent';

/**
 * Get flower number based on player and dealer position
 * @param playerPosition number
 * @param dealerPosition number
 */
const getFlowerNumber = (playerPosition: number, dealerPosition: number): number => {
  // List of permutations
  // Pass in player position first, then dealer position for player's flower number
  // Someone make this look prettier if they figure out a better way
  const permutations: Record<number, Record<number, number>> = {
    0: {
      0: 1,
      1: 4,
      2: 3,
      3: 2,
    },
    1: {
      0: 2,
      1: 1,
      2: 4,
      3: 3,
    },
    2: {
      0: 3,
      1: 2,
      2: 1,
      3: 4,
    },
    3: {
      0: 4,
      1: 3,
      2: 2,
      3: 1,
    },
  };
  return permutations[playerPosition][dealerPosition];
};

/**
 * Get player wind based on player flower number and current wind
 * @param flowerNumber number
 * @param currentWind WindEnums
 */
const getPlayerWind = (flowerNumber: number, currentWind: WindEnums): WindEnums => {
  const windOrder = [WindEnums.EAST, WindEnums.SOUTH, WindEnums.WEST, WindEnums.NORTH];
  const windIndex = windOrder.findIndex((wind) => wind === currentWind);

  // Minus 1 due to flowerNumber being (1-4) and need to normalize to 0-3
  return windOrder[(windIndex + flowerNumber - 1) % 4];
};

/**
 * Class that holds all the Mahjong game state for the Front-End Client.
 */
class MahjongGameState extends GameState {
  private currentWind: WindEnums;

  private redrawPending: boolean;

  private roundStarted: boolean;

  private wsCallbacks: Record<string, (...args: unknown[]) => void>;

  private dealer: number;

  private deadPile: DeadPile;

  private wallCounter: WallCounter;

  private mjPlayer: MahjongPlayer;

  constructor(users: UserEntity[], mjPlayer: MahjongPlayer, wsCallbacks: Record<string, (...args: unknown[]) => void>) {
    super(users);
    this.currentWind = WindEnums.EAST;
    this.redrawPending = false;
    this.roundStarted = false;
    this.dealer = 0;
    this.deadPile = new DeadPile();
    this.wallCounter = new WallCounter();
    this.wsCallbacks = wsCallbacks;
    this.mjPlayer = mjPlayer;
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

  public getMjPlayer(): MahjongPlayer {
    return this.mjPlayer;
  }

  public getWallCounter(): WallCounter {
    return this.wallCounter;
  }

  public startRound(): boolean {
    this.roundStarted = true;
    const gameUsers = super.getUsers();
    const indexOfUser = gameUsers.findIndex((user) => user.getConnectionId() === this.mjPlayer.getConnectionId());
    if (indexOfUser === this.dealer) {
      // Draw tile if player is the dealer
      this.wsCallbacks[OutgoingAction.DRAW_TILE]();
    } else {
      // Opponent draws tile
      const opponent = gameUsers[this.dealer] as MahjongOpponent;
      opponent.drawTile();
    }
    const flowerNumber = getFlowerNumber(indexOfUser, this.dealer);
    const playerWind = getPlayerWind(flowerNumber, this.currentWind);

    // Return true if set up is correct
    return this.mjPlayer.setWindAndFlower(playerWind, flowerNumber);
  }

  public endRound(): void {
    this.roundStarted = false;
  }

  public getRoundStarted(): boolean {
    return this.roundStarted;
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
    const currentTurn = super.getCurrentTurn();
    if (!this.redrawPending) {
      this.redrawPending = true;
      stage.removeChildren(0, stage.children.length);
      this.getUsers().forEach((user: UserEntity, index: number) => {
        const isUserTurn = index === currentTurn;
        user.removeAllAssets();
        user.render(spriteFactory, stage, isUserTurn, this.wsCallbacks);
        user.reposition(view);
      });

      this.mjPlayer.renderInteractions(spriteFactory, this.wsCallbacks, this);

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
