import UserEntity from '../UserEntity/UserEntity';

/**
 * Default GameState that all games should have.
 * List of users and current turn reference.
 */
abstract class GameState {
  private users: UserEntity[];

  private currentTurn: number;

  constructor(users: UserEntity[]) {
    this.users = users;
    this.currentTurn = 0;
  }

  public getUsers(): UserEntity[] {
    return this.users;
  }

  public getCurrentTurn(): number {
    return this.currentTurn;
  }

  public goToNextTurn(): number {
    this.currentTurn += 1;
    if (this.currentTurn >= this.users.length) {
      this.currentTurn = 0;
    }
    return this.currentTurn;
  }
}

export default GameState;
