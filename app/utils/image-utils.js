const Promise = require('bluebird');

const pathLib = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { writeFile } = require('./file-utils');
const { encryptMD5 } = require('./crypto-utils');

const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 300;

const saveImageAndGetHash = async (image) => {
  const { takenTime, location, path } = image;
  if (/uploads\/(.*).(png|jpeg|jpg)/gmi.test(path)) {
    const findHash = /uploads\/(.*)/gmi.exec(path);
    if (findHash && findHash.length > 0) {
      const hashFile = findHash[1];

      const dirUploads = pathLib.join(__dirname, '../../uploads');

      const images = fs.readdirSync(dirUploads);

      if (!images.includes(hashFile)) throw new Error('UPLOAD.ERROR.IMAGE.INVALID_HASH_PATH');

      const hashOld = /uploads\/(.*).(png|jpeg|jpg)/gmi.exec(path)[1];
      const checkSpecialImage = /image\/jpeg|image\/jpg/gmi.exec(path);
      const imageExtension = checkSpecialImage ? 'jpg' : 'png';
      return {
        path,
        uploaded: true,
        thumbnail: `uploads/${hashOld}-300x300.${imageExtension}`,
        hash: hashOld,
        location: {
          type: 'Point',
          coordinates: location ? location.coordinates : [],
        },
        takenTime,
      };
    }
  }

  const imageBase64 = path.replace(/^data:image\/\w+;base64,/, '');
  const fileName = encryptMD5(imageBase64);
  const checkSpecialImage = /image\/jpeg|image\/jpg/gmi.exec(path);
  const imageExtension = checkSpecialImage ? 'jpg' : 'png';
  const pathFile = pathLib.join(`uploads/${fileName}.${imageExtension}`);
  const pathThumbnail = pathLib.join(`uploads/${fileName}-${THUMBNAIL_WIDTH}x${THUMBNAIL_HEIGHT}.${imageExtension}`);

  const buffer = Buffer.from(imageBase64, 'base64');
  const thumbnailBuffer = await sharp(buffer)
    .resize({ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT, fit: 'cover' })
    .toBuffer();

  if (await writeFile(pathFile, buffer) && await writeFile(pathThumbnail, thumbnailBuffer)) {
    return {
      path: pathFile,
      thumbnail: pathThumbnail,
      hash: fileName,
      location: {
        type: 'Point',
        coordinates: location ? location.coordinates : [],
      },
      takenTime,
    };
  }
  console.error('UPLOAD.ERROR.IMAGE.CANNOT_SAVE_FILE', image);
  throw new Error('UPLOAD.ERROR.IMAGE.CANNOT_SAVE_FILE');
};
const saveImageAndGetHashList = async (images) => {
  if (!Array.isArray(images)) throw new Error('UPLOAD.ERROR.IMAGE.IMAGES_INVALID');
  return Promise.map(images, saveImageAndGetHash);
};

module.exports = {
  saveImageAndGetHashList,
  saveImageAndGetHash,
};
