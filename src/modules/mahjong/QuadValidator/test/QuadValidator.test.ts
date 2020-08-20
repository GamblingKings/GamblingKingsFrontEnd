import QuadValidator from '../QuadValidator';
import TileFactory from '../../Tile/TileFactory';
import PlayerHand from '../../Hand/PlayerHand';
import Tile from '../../Tile/Tile';

let playerHand: PlayerHand;
let playerHand1: PlayerHand;
let playerHand2: PlayerHand;

// 14 tiles (has drawn)
const tileStrings = [
  '7_DOT',
  '7_DOT',
  '7_DOT',
  '7_DOT',
  '8_DOT',
  '2_BAMBOO',
  '5_BAMBOO',
  '9_BAMBOO',
  '9_CHARACTER',
  'NORTH',
  'EAST',
  'REDDRAGON',
  'WHITEDRAGON',
  'WHITEDRAGON',
];
// 8 tiles (has drawn)
const hand_8tiles = ['8_DOT', '2_BAMBOO', '5_BAMBOO', '9_BAMBOO', '9_CHARACTER', 'NORTH', 'WHITEDRAGON', 'WHITEDRAGON'];
// 5 tiles (has drawn)
const hand_5tiles = ['8_DOT', '2_BAMBOO', '2_BAMBOO', 'NORTH', 'WHITEDRAGON'];

const consecutiveMeld = ['1_DOT', '2_DOT', '3_DOT'];
const tripletMeld = ['NORTH', 'NORTH', 'NORTH'];
const tripletMeld2 = ['WHITEDRAGON', 'WHITEDRAGON', 'WHITEDRAGON'];

let tiles: Tile[];
let eightTiles: Tile[];
let fiveTiles: Tile[];

beforeEach(() => {
  tiles = tileStrings.map((tile) => TileFactory.createTileFromStringDef(tile));
  eightTiles = hand_8tiles.map((tile) => TileFactory.createTileFromStringDef(tile));
  fiveTiles = hand_5tiles.map((tile) => TileFactory.createTileFromStringDef(tile));
  const consecutive = consecutiveMeld.map((tile) => TileFactory.createTileFromStringDef(tile));
  const triplet = tripletMeld.map((tile) => TileFactory.createTileFromStringDef(tile));
  const triplet2 = tripletMeld2.map((tile) => TileFactory.createTileFromStringDef(tile));
  playerHand = new PlayerHand(tiles);
  playerHand1 = new PlayerHand(eightTiles);
  playerHand1.addPlayedTiles(consecutive);
  playerHand1.addPlayedTiles(triplet);

  playerHand2 = new PlayerHand(fiveTiles);
  playerHand2.addPlayedTiles(consecutive);
  playerHand2.addPlayedTiles(triplet);
  playerHand2.addPlayedTiles(triplet2);
});

test('QuadValidator - checkForQuads() - no melds', () => {
  const result = [{ tile: TileFactory.createTileFromStringDef('7_DOT'), alreadyMeld: false }];

  expect(QuadValidator.checkForQuads(playerHand)).toEqual(result);
});

test('QuadValidator - checkForQuads() - alreadyMeld with 2 melds', () => {
  const result = [{ tile: TileFactory.createTileFromStringDef('NORTH'), alreadyMeld: true }];

  expect(QuadValidator.checkForQuads(playerHand1)).toEqual(result);
});

test('QuadValidator - checkForQuads() - with 3 melds / can make 2 quads', () => {
  const result = [
    { tile: TileFactory.createTileFromStringDef('NORTH'), alreadyMeld: true },
    { tile: TileFactory.createTileFromStringDef('WHITEDRAGON'), alreadyMeld: true },
  ];

  expect(QuadValidator.checkForQuads(playerHand2)).toEqual(result);
});
