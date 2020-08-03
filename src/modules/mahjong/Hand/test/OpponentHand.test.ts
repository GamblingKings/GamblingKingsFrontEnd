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

test('OpponentHand - adPlayedTiles()', () => {
  opponentHand.addPlayedTiles(SAMPLE_TILE_ARRAY);
  expect(opponentHand.getPlayedTiles()).toHaveLength(1);
});
