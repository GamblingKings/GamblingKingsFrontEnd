import * as PIXI from 'pixi.js';
import Hand from '../modules/mahjong/Hand/Hand';
import SpriteFactory from './SpriteFactory';
import Interactions from './Interactions';
import MahjongOpponent from '../modules/mahjong/MahjongOpponent/MahjongOpponent';
import MahjongPlayer from '../modules/mahjong/MahjongPlayer/MahjongPlayer';
import RenderDirection from './directions';

const DEFAULT_MAHJONG_WIDTH = 54;
const DEFAULT_MAHJONG_HEIGHT = 72;
const DISTANCE_FROM_TILES = 2;

const PIXI_TEXT_STYLE = { fill: '#FCFF00' };

class Renderer {
  static renderMahjongHand(spriteFactory: SpriteFactory, container: PIXI.Container, hand: Hand): void {
    const tiles = hand.getHand();
    tiles.forEach((tile, index) => {
      const frontSprite = spriteFactory.generateSprite('Front');
      frontSprite.width = DEFAULT_MAHJONG_WIDTH;
      frontSprite.height = DEFAULT_MAHJONG_HEIGHT;
      frontSprite.x = index * (DEFAULT_MAHJONG_WIDTH + DISTANCE_FROM_TILES);
      container.addChild(frontSprite);

      const sprite = spriteFactory.generateSprite(tile.toString());
      sprite.width = DEFAULT_MAHJONG_WIDTH;
      sprite.height = DEFAULT_MAHJONG_HEIGHT;
      sprite.x = index * (DEFAULT_MAHJONG_WIDTH + DISTANCE_FROM_TILES);

      Interactions.addMouseInteraction(sprite, (event: PIXI.InteractionEvent) => {
        console.log(event.target);
      });

      container.addChild(sprite);
    });
  }

  static renderPlayerMahjong(spriteFactory: SpriteFactory, container: PIXI.Container, player: MahjongPlayer): void {
    const hand = player.getHand();

    Renderer.renderMahjongHand(spriteFactory, container, hand);
    const text = new PIXI.Text(player.getName(), PIXI_TEXT_STYLE);
    text.x = -100;
    container.addChild(text);
  }

  static generateOpponentMahjongHand(spriteFactory: SpriteFactory, number: number): PIXI.Container {
    const container = new PIXI.Container();
    for (let i = 0; i < number; i += 1) {
      const backSprite = spriteFactory.generateSprite('Back');
      backSprite.width = DEFAULT_MAHJONG_WIDTH;
      backSprite.height = DEFAULT_MAHJONG_HEIGHT;
      backSprite.x = i * (DEFAULT_MAHJONG_WIDTH + DISTANCE_FROM_TILES);
      container.addChild(backSprite);
    }
    return container;
  }

  static renderOpponentMahjong(
    spriteFactory: SpriteFactory,
    container: PIXI.Container,
    opponent: MahjongOpponent,
    direction: RenderDirection,
  ): void {
    const numberOfTiles = opponent.getNumberOfTiles();
    const hand = Renderer.generateOpponentMahjongHand(spriteFactory, numberOfTiles);

    if (direction === RenderDirection.LEFT) {
      hand.pivot.x = 0;
      hand.pivot.y = DEFAULT_MAHJONG_HEIGHT;
      hand.angle = 90;
    } else if (direction === RenderDirection.TOP) {
      hand.pivot.x = hand.width;
      hand.pivot.y = DEFAULT_MAHJONG_HEIGHT;
      hand.angle = 180;
    } else if (direction === RenderDirection.RIGHT) {
      hand.pivot.x = hand.width;
      hand.pivot.y = DEFAULT_MAHJONG_HEIGHT;
      hand.angle = 270;
      hand.x = DEFAULT_MAHJONG_HEIGHT;
    }

    container.addChild(hand);

    const text = new PIXI.Text(opponent.getName(), PIXI_TEXT_STYLE);
    container.addChild(text);
  }
}

export default Renderer;
