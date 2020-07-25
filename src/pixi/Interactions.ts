/* eslint-disable no-param-reassign */
import * as PIXI from 'pixi.js';

class Interactions {
  static addMouseInteraction(sprite: PIXI.Sprite, callback: (event: PIXI.InteractionEvent) => void): void {
    sprite.interactive = true;
    sprite.on('mousedown', (event: PIXI.InteractionEvent) => {
      callback(event);
    });
  }
}

export default Interactions;
