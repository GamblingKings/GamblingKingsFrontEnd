import OpponentHand from '../OpponentHand';
import TileFactory from '../../Tile/TileFactory';

let opponentHand: OpponentHand;

const SAMPLE_TILE_ARRAY = [
  TileFactory.createTileFromStringDef('2_DOT'),
  TileFactory.createTileFromStringDef('3_DOT'),
  TileFactory.createTileFromStringDef('4_DOT'),
];
const DOT_7 = TileFactory.createTileFromStringDef('7_DOT');
const BONUS_TILE = TileFactory.createTileFromStringDef('3_FLOWER');

beforeEach(() => {
  opponentHand = new OpponentHand();
});

test('OpponentHand - getNumberOfTiles()', () => {
  expect(opponentHand.getNumberOfTiles()).toBe(13);
});

test('OpponentHand - getPlayedTiles()', () => {
  expect(opponentHand.getPlayedTiles()).toHaveLength(0);
});

test('OpponentHand - addPlayedTiles()', () => {
  opponentHand.addPlayedTiles(SAMPLE_TILE_ARRAY);
  expect(opponentHand.getPlayedTiles()).toHaveLength(1);
});

test('OpponentHand - getHasDrawn()', () => {
  expect(opponentHand.getHasDrawn()).toBeFalsy();
  opponentHand.setHasDrawn(true);
  expect(opponentHand.getHasDrawn()).toBeTruthy();
  opponentHand.setHasDrawn(false);
  expect(opponentHand.getHasDrawn()).toBeFalsy();
});

test('OpponentHand - change number of tiles', () => {
  opponentHand.setHasDrawn(true);
  expect(opponentHand.getNumberOfTiles()).toBe(14);
  opponentHand.playedTile();
  expect(opponentHand.getNumberOfTiles()).toBe(13);
});

test('OpponentHand - change number of tiles after add played tile', () => {
  opponentHand.addPlayedTiles(SAMPLE_TILE_ARRAY);
  expect(opponentHand.getNumberOfTiles()).toBe(11);
  opponentHand.playedTile();
  expect(opponentHand.getNumberOfTiles()).toBe(10);
});

test('PlayerHand - formQuad() alreadymeld false', () => {
  opponentHand.formQuad(DOT_7, false);
  const quadMeld = [DOT_7, DOT_7, DOT_7, DOT_7];
  expect(opponentHand.getPlayedTiles()[0]).toStrictEqual(quadMeld);
  expect(opponentHand.getNumberOfTiles()).toBe(11);
  // opponent still needs to play a tile to make it 10
});

test('PlayerHand - formQuad() alreadymeld true', () => {
  const triplet = [DOT_7, DOT_7, DOT_7];
  opponentHand.addSelfPlayedTiles([BONUS_TILE]);
  opponentHand.addPlayedTiles(triplet);

  opponentHand.playedTile();
  opponentHand.formQuad(DOT_7, true);
  const quadMeld = [DOT_7, DOT_7, DOT_7, DOT_7];
  expect(opponentHand.getPlayedTiles()[1]).toStrictEqual(quadMeld);
  expect(opponentHand.getNumberOfTiles()).toBe(11);
  // opponent still needs to play a tile to make it 10
});
