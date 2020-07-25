import 'jest-webgl-canvas-mock';
import * as PIXI from 'pixi.js';
import MahjongOpponent from '../MahjongOpponent';
import RenderDirection from '../../../../pixi/directions';
import SpriteFactory from '../../../../pixi/SpriteFactory';

let mjOpponent: MahjongOpponent;
const spriteFactory = new SpriteFactory({});
const NAME = 'Bowser';
const LOCATION = RenderDirection.LEFT;
let pixiStage: PIXI.Container;

beforeEach(() => {
  mjOpponent = new MahjongOpponent(NAME, LOCATION);
  pixiStage = new PIXI.Container();
});

test('MahjongOpponent - getName()', () => {
  expect(mjOpponent.getName()).toBe(NAME);
});

test('MahjongOpponent - getContainer() - Init to be empty', () => {
  expect(mjOpponent.getContainer().children).toHaveLength(0);
});

test('MahjongOpponent - getLocation()', () => {
  expect(mjOpponent.getLocation()).toBe(LOCATION);
});

test('MahjongOpponent - getNumberOfTiles()', () => {
  expect(mjOpponent.getNumberOfTiles()).toBe(13);
});

test('MahjongOpponent - renderName()', () => {
  const pixiText = mjOpponent.renderName();
  expect(pixiText.text).toBe(NAME);
});

test('MahjongOpponent - renderMahjongHand()', () => {
  const hand = mjOpponent.renderMahjongHand(spriteFactory);
  expect(hand.children).toHaveLength(13);
});

test('MahjongOpponent - render()', () => {
  mjOpponent.render(spriteFactory, pixiStage);

  expect(mjOpponent.getContainer().children).toHaveLength(2);
  expect(pixiStage.children).toHaveLength(1);
});

test('MahjongOpponent - removeAllAssets()', () => {
  mjOpponent.render(spriteFactory, pixiStage);
  mjOpponent.removeAllAssets();
  expect(mjOpponent.getContainer().children).toHaveLength(0);

  mjOpponent.render(spriteFactory, pixiStage);
  mjOpponent.removeAllAssets();
  expect(mjOpponent.getContainer().children).toHaveLength(0);
});
