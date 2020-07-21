import * as PIXI from 'pixi.js';

import Player from '../../game/Player/Player';
import Hand from '../Hand/Hand';
import SpriteFactory from '../../../pixi/SpriteFactory';
import Interactions from '../../../pixi/Interactions';

const DEFAULT_MAHJONG_WIDTH = 54;
const DEFAULT_MAHJONG_HEIGHT = 72;
const DISTANCE_FROM_TILES = 2;

const PIXI_TEXT_STYLE = { fill: '#FCFF00' };

class MahjongPlayer extends Player {
  private hand: Hand | undefined;

  // constructor(name: string) {
  //   super(name);
  // }

  public getHand(): Hand | undefined {
    return this.hand;
  }

  public setHand(hand: Hand): void {
    this.hand = hand;
  }

  public removeAllAssets(): void {
    const container = super.getContainer();
    container.removeChildren(0, container.children.length);
  }

  public renderHand(spriteFactory: SpriteFactory, requestRedraw: () => void): PIXI.Container {
    const container = new PIXI.Container();
    if (this.hand !== undefined) {
      const selectedTile = this.hand.getSelectedTile();
      const tiles = this.hand.getHand();

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

        if (index === selectedTile) {
          sprite.y = -10;
          frontSprite.y = -10;
        }

        Interactions.addMouseInteraction(sprite, (event: PIXI.InteractionEvent) => {
          requestRedraw();
          this.hand?.setSelectedTile(index);
          console.log(event.target);
        });

        container.addChild(sprite);
      });
    }
    return container;
  }

  public renderName(): PIXI.Text {
    const name = super.getName();
    const text = new PIXI.Text(name, PIXI_TEXT_STYLE);
    return text;
  }

  public render(spriteFactory: SpriteFactory, pixiStage: PIXI.Container, requestRedraw: () => void): void {
    const playerContainer = super.getContainer();

    const playerHand = this.renderHand(spriteFactory, requestRedraw);

    playerContainer.addChild(playerHand);

    pixiStage.addChild(playerContainer);
  }
}

export default MahjongPlayer;
