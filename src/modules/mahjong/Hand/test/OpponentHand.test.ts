import OpponentHand from '../OpponentHand';
import TileFactory from '../../Tile/TileFactory';

let opponentHand: OpponentHand;

const SAMPLE_TILE_ARRAY = [
  TileFactory.createTileFromStringDef('2_DOT'),
  TileFactory.createTileFromStringDef('3_DOT'),
  TileFactory.createTileFromStringDef('4_DOT'),
];

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
