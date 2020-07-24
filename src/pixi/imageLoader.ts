import SimpleTileTypes from '../modules/mahjong/enums/SimpleTileEnums';
import HonorTileTypes from '../modules/mahjong/enums/HonorTileEnums';
import BonusTileTypes from '../modules/mahjong/enums/BonusTileEnums';
import GameTypes from '../modules/game/gameTypes';

import RED_X from '../assets/Red_X.svg';

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

/**
 * Import images and create an array that is loadable for Pixi.js.
 * @param gameType GameTypes
 */
function ImageInit(gameType: GameTypes): ImageType[] {
  const images: ImageType[] = [];

  if (gameType === GameTypes.Mahjong) {
    for (let i = 1; i <= 9; i += 1) {
      Object.values(SimpleTileTypes).forEach((type) => {
        const imageName = `${i}_${type}`;
        images.push({
          name: imageName,
          url: imageImport[imageName],
        });

        if (i === 5) {
          const doraImage = `${imageName}_DORA`;
          images.push({
            name: doraImage,
            url: imageImport[imageName],
          });
        }
      });
    }
    Object.values(HonorTileTypes).forEach((type) => {
      images.push({
        name: type,
        url: imageImport[type],
      });
    });
    Object.values(BonusTileTypes).forEach((type) => {
      console.log(type);
      // TODO: find bonus tile assets
      // images.push({
      //   name: type,
      //   url: imageImport[type],
      // });
    });
  }
  images.push({
    name: 'Back',
    url: imageImport.Back,
  });
  images.push({
    name: 'Front',
    url: imageImport.Front,
  });
  // This must always be loaded.
  images.push({
    name: 'RED_X',
    url: RED_X,
  });
  return images;
}

export default ImageInit;
