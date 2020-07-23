import SimpleTile from '../SimpleTile';
import SimpleTileTypes from '../../enums/SimpleTileEnums';

test('SimpleTile fails to initialize is range is not between 1 - 9', () => {
  const t = () => {
    const s = new SimpleTile(SimpleTileTypes.DOT, 10);
    return s;
  };

  expect(t).toThrow(RangeError);
});
