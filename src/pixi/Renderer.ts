import Hand from '../modules/mahjong/Hand/Hand';
import SpriteFactory from './SpriteFactory';
import Interactions from './Interactions';

const DEFAULT_MAHJONG_WIDTH = 60;
const DEFAULT_MAHJONG_HEIGHT = 80;

class Renderer {
  static renderMahjongHand(spriteFactory: SpriteFactory, container: PIXI.Container, hand: Hand): void {
    const tiles = hand.getHand();
    tiles.forEach((tile, index) => {
      const frontSprite = spriteFactory.generateSprite('Front');
      frontSprite.width = DEFAULT_MAHJONG_WIDTH;
      frontSprite.height = DEFAULT_MAHJONG_HEIGHT;
      frontSprite.x = index * (DEFAULT_MAHJONG_WIDTH + 5);
      container.addChild(frontSprite);

      const sprite = spriteFactory.generateSprite(tile.toString());
      sprite.width = DEFAULT_MAHJONG_WIDTH;
      sprite.height = DEFAULT_MAHJONG_HEIGHT;
      sprite.x = index * (DEFAULT_MAHJONG_WIDTH + 5);

      Interactions.addMouseInteraction(sprite, (event: PIXI.InteractionEvent) => {
        console.log(event.target);
      });

      container.addChild(sprite);
    });
  }

  static renderOpponentMahjongHand(spriteFactory: SpriteFactory, container: PIXI.Container, number: number): void {
    for (let i = 0; i < number; i += 1) {
      const backSprite = spriteFactory.generateSprite('Back');
      backSprite.width = DEFAULT_MAHJONG_WIDTH;
      backSprite.height = DEFAULT_MAHJONG_HEIGHT;
      backSprite.x = i * (DEFAULT_MAHJONG_WIDTH + 5);
      container.addChild(backSprite);
    }
  }
}

export default Renderer;
