import TileFactory from '../TileFactory';
import SimpleTile from '../SimpleTile';
import HonorTile from '../HonorTile';
import BonusTile from '../BonusTile';

test('Tile Factory creates a Simple Tile when passed 1_DOT', () => {
  const t = TileFactory.createTileFromStringDef('1_DOT');
  expect(t).toBeInstanceOf(SimpleTile);
});

test('Tile Factory creates a Simple Tile with the correct value when passed 5_CHARACTER', () => {
  const t = TileFactory.createTileFromStringDef('5_CHARACTER');
  expect(t.getValue()).toBe(5);
});

test('Tile Factory creates a Simple Tile with the correct type when passed 8_BAMBOO', () => {
  const t = TileFactory.createTileFromStringDef('8_BAMBOO');
  expect(t.getType()).toBe('BAMBOO');
});

test('Tile Factory creates a Honor Tile when passed NORTH', () => {
  const t = TileFactory.createTileFromStringDef('NORTH');
  expect(t).toBeInstanceOf(HonorTile);
});

test('Tile Factory create a Honor Tile with the correct type when passed REDDRAGON', () => {
  const t = TileFactory.createTileFromStringDef('REDDRAGON');
  expect(t.getType()).toBe('REDDRAGON');
});

test('Tile Factory creates a Bonus Tile when passed 1_FLOWER', () => {
  const t = TileFactory.createTileFromStringDef('1_FLOWER');
  expect(t).toBeInstanceOf(BonusTile);
});

test('Tile Factory creates a Bonus Tile with the correct type when passed 2_FLOWER', () => {
  const t = TileFactory.createTileFromStringDef('2_FLOWER');
  expect(t.getType()).toBe('FLOWER');
});

test('Tile Factory creates a Bonus Tile with the correct value when passed 2_SEASON', () => {
  const t = TileFactory.createTileFromStringDef('2_SEASON');
  expect(t.getValue()).toBe(2);
});
