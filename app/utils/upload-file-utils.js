const Promise = require('bluebird');

const pathLib = require('path');
const fs = require('fs');
const { writeFile } = require('./file-utils');
const { encryptMD5 } = require('./crypto-utils');

export const saveFileAndGetHash = async (file) => {
  const { name, path } = file;
  if (/uploads\/(.*).(.*)/gmi.test(path)) {
    console.log('Check Uploaded');
    const hashAndNameArr = /uploads\/(.*)/gmi.exec(path);
    if (hashAndNameArr && hashAndNameArr.length > 1) {
      const hashAndName = hashAndNameArr[1];
      const [hashFile, ...nameArr] = hashAndName.split('-');
      const nameFile = nameArr.join('');

      if (hashFile) {
        const dirUploads = pathLib.join(__dirname, '../../uploads');
        const files = fs.readdirSync(dirUploads);
        if (!files.includes(hashAndName)) throw new Error('UPLOAD.ERROR.FILE.INVALID_HASH_PATH');

        return {
          path,
          name: nameFile,
          uploaded: true,
          hash: hashFile,
        };
      }
    }
  }

  const fileBase64 = path.replace(/^data:.*;base64,/, '');
  const hashFile = encryptMD5(fileBase64);
  const pathFile = pathLib.join(`uploads/${hashFile}-${name}`);
  const buffer = Buffer.from(fileBase64, 'base64');
  if (await writeFile(pathFile, buffer)) {
    return {
      path: pathFile,
      hash: hashFile,
      name,
    };
  }
  console.error('UPLOAD.ERROR.FILE.CANNOT_SAVE_FILE', file);
  throw new Error('UPLOAD.ERROR.FILE.CANNOT_SAVE_FILE');
};

export const saveFileAndGetHashList = async (files) => {
  if (!Array.isArray(files) || files.length === 0) throw new Error('UPLOAD.ERROR.FILE.IMAGES_INVALID');
  return Promise.map(files, saveFileAndGetHash);
};
