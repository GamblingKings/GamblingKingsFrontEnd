import HonorTile from '../HonorTile';
import HonorTileTypes from '../../enums/HonorTileEnums';

const { REDDRAGON } = HonorTileTypes;

test('HonorTile - getValue()', () => {
  const honorTile = new HonorTile(REDDRAGON);
  expect(honorTile.getValue()).toBe(-1);
});
