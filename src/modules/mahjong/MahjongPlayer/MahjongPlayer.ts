import Player from '../../game/Player/Player';
import Hand from '../Hand/Hand';

class MahjongPlayer extends Player {
  private hand: Hand;

  constructor(name: string, hand: Hand) {
    super(name);
    this.hand = hand;
  }

  public getHand(): Hand {
    return this.hand;
  }
}

export default MahjongPlayer;
