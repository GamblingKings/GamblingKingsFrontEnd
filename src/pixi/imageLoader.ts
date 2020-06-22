import SimpleTileTypes from '../modules/mahjong/Tile/types/SimpleTileTypes';

function importAll(r: __WebpackModuleApi.RequireContext) {
  const images: Record<string, string> = {};
  r.keys().forEach((item) => {
    const itemName = item.replace('./', '').replace('.png', '');
    images[itemName] = r(item);
  });
  return images;
}

const imageImport = importAll(require.context('../assets/tiles/Regular/', false, /\.png/));

type ImageType = {
  name: string;
  url: string;
};

function ImageInit(): ImageType[] {
  const images: ImageType[] = [];
  for (let i = 1; i <= 9; i += 1) {
    Object.values(SimpleTileTypes).forEach((type) => {
      const imageName = `${i}_${type}`;
      images.push({
        name: imageName,
        url: imageImport[imageName],
      });
    });
  }
  return images;
}

export default ImageInit;
