/**
 * Returns a boolean whether the meld is a triplet
 * @param tiles Tile instances
 */
const checkisTripletMeld = (tiles: Tile[]): boolean => {
  if (tiles.length !== 3) return false;
  return tiles.every((tile: Tile, _index, array) => tile.toString() === array[0].toString());
};

export default checkisTripletMeld;
