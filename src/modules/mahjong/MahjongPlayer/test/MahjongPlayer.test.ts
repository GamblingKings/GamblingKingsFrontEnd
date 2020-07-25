import 'jest-webgl-canvas-mock';
import * as PIXI from 'pixi.js';
import MahjongPlayer from '../MahjongPlayer';
import HongKongWall from '../../Wall/version/HongKongWall';
import Hand from '../../Hand/Hand';
import SpriteFactory from '../../../../pixi/SpriteFactory';

const w = new HongKongWall();
const DEFAULT_WEIGHTS = Hand.generateHandWeights();
const h1 = new Hand(w, DEFAULT_WEIGHTS);
const spriteFactory = new SpriteFactory({});
let pixiStage: PIXI.Container;
const placeholderFunction = () => {};

const NAME = 'Jay Chou';
let mjPlayer: MahjongPlayer;

beforeEach(() => {
  mjPlayer = new MahjongPlayer(NAME);
  pixiStage = new PIXI.Container();
});

test('MahjongPlayer - getName()', () => {
  expect(mjPlayer.getName()).toEqual(NAME);
});

test('MahjongPlayer - getContainer() - Init to be empty', () => {
  expect(mjPlayer.getContainer().children).toHaveLength(0);
});

test('MahjongPlayer - setHand() / getHand()', () => {
  expect(mjPlayer.getHand()).toBeUndefined();
  mjPlayer.setHand(h1);
  expect(mjPlayer.getHand()).toEqual(h1);
});

test('MahjongPlayer - renderName()', () => {
  const pixiText = mjPlayer.renderName();
  expect(pixiText.text).toBe(NAME);
});

test('MahjongPlayer - renderHand()', () => {
  // Empty hand
  const handContainerEmpty = mjPlayer.renderHand(spriteFactory, placeholderFunction);

  expect(handContainerEmpty.children).toHaveLength(0);

  // 13 tiles for front and 13 tiles for back
  mjPlayer.setHand(h1);
  const handContainerFull = mjPlayer.renderHand(spriteFactory, placeholderFunction);
  expect(handContainerFull.children).toHaveLength(26);
});

test('MahjongPlayer - render() - empty hand', () => {
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  expect(pixiStage.children).toHaveLength(1);

  mjPlayer.removeAllAssets();
  mjPlayer.setHand(h1);
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  expect(pixiStage.children).toHaveLength(1);
});

test('MahjongPlayer - render() - full hand', () => {
  mjPlayer.setHand(h1);
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  expect(pixiStage.children).toHaveLength(1);
});

test('MahjongPlayer - removeAllAssets()', () => {
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  mjPlayer.removeAllAssets();
  expect(mjPlayer.getContainer().children).toHaveLength(0);

  mjPlayer.setHand(h1);
  mjPlayer.render(spriteFactory, pixiStage, placeholderFunction);
  mjPlayer.removeAllAssets();
  expect(mjPlayer.getContainer().children).toHaveLength(0);
});
