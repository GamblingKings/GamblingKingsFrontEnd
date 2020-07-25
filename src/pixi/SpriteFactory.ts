import * as PIXI from 'pixi.js';

/**
 * SpriteGenerator that uses resources loaded into PIXI
 */
export default class SpriteGenerator {
  private resources: Partial<Record<string, PIXI.LoaderResource>>;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>) {
    this.resources = resources;
  }

  /**
   * Returns a PIXI.Sprite
   * Returns a sprite with invalid texture if resource not found.
   * @param resourceName string
   */
  public generateSprite(resourceName: string): PIXI.Sprite {
    if (this.resources[resourceName]) {
      const resource = this.resources[resourceName] as PIXI.LoaderResource;
      const sprite = new PIXI.Sprite(resource.texture);
      sprite.name = resourceName;
      return sprite;
    }
    try {
      const resource = this.resources.RED_X as PIXI.LoaderResource;
      const sprite = new PIXI.Sprite(resource.texture);
      sprite.name = resourceName;
      return sprite;
    } catch (err) {
      const undefinedSprite = new PIXI.Sprite();
      undefinedSprite.name = 'undefined';
      return undefinedSprite;
    }
  }
}
