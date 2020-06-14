import DeadPile from '../deadPile';
import SimpleTile from '../../Tile/simpleTile';
import SimpleTileTypes from '../../Tile/types/simpleTileTypes';

const charSimpleTile = new SimpleTile(SimpleTileTypes.CHARACTER, 1);
const bambooSimpleTile = new SimpleTile(SimpleTileTypes.BAMBOO, 5);
const d = new DeadPile();

test('Test that the DeadPile stores the last thrown and gets thrown into deadpile if another tile is added', () => {
  d.lastThrown(charSimpleTile);
  d.lastThrown(bambooSimpleTile);

  expect(d.getDeadPile().includes(charSimpleTile)).toBeTruthy();
});

test('Test that the DeadPile only has one tile in the dead pile', () => {
  expect(d.getDeadPile().length).toBe(1);
});
