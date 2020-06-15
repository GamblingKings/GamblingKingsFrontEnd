import BonusTile from '../bonusTile';
import BonusTileTypes from '../types/bonusTileTypes';

test('BonusTile fails to initialize is range is not between 1 - 4', () => {
  const t = () => {
    const b = new BonusTile(BonusTileTypes.FLOWER, 5);
    return b;
  };

  expect(t).toThrow(RangeError);
});
