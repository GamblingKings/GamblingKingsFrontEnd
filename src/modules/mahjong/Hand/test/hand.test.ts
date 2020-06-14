import Hand from '../hand';
import DeadPile from '../../DeadPile/deadPile';
import HongKongWall from '../../Wall/version/hongKongWall';

const w = new HongKongWall();
const d = new DeadPile();
const DEFAULT_WEIGHTS = Hand.generateHandWeights();
const DEFAULT_HAND_LENGTH = 13;

const reset = () => {
  w.reset();
  d.clear();
};

const initHands = () => {
  reset();
  const h1 = new Hand(w, d, DEFAULT_WEIGHTS);
  const h2 = new Hand(w, d, DEFAULT_WEIGHTS);
  const h3 = new Hand(w, d, DEFAULT_WEIGHTS);
  const h4 = new Hand(w, d, DEFAULT_WEIGHTS);

  return [h1, h2, h3, h4];
};

test('hands to have 13 cards when initialized', () => {
  let result = true;

  initHands().forEach((h) => {
    if (h.getHand().length !== DEFAULT_HAND_LENGTH) {
      result = false;
    }
  });

  expect(result).toBeTruthy();
});

test('Drawing removes 1 tile from the wall', () => {
  const [h1, h2, h3, h4] = initHands();
  const wallLength = w.getTiles().length;

  h1.draw();
  h2.draw();
  h3.draw();
  h4.draw();

  expect(w.getTiles().length).toBe(wallLength - 4);
});

test('Throwing a tile adds to the dead pile', () => {
  const [h1, h2, h3, h4] = initHands();

  h1.throw(2);
  h2.throw(2);
  h3.throw(2);
  h4.throw(2);

  expect(d.getDeadPile().length).toBe(3); // Last tile is held in lastThrow property
});

test('Can throw a specific tile', () => {
  const index = 3;
  const [h1] = initHands();
  const tile = h1.getHand()[index];
  h1.throw(index);
  expect(d.getLastThrown()).toBe(tile);
});
