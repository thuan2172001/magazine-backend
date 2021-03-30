import LandLot from '../models/land_lot';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';

const Promise = require('bluebird');

export const generateLandLot = async () => {
  try {
    const generateNumber = await LandLot.count();

    if (generateNumber > 0) return;

    const landLotsFile = await getCSVFiles('landlots');

    const { header, content } = await getContentCSVFiles(landLotsFile[0]);

    await Promise.map(content, async (line) => {
      const field = cleanField(line.split(','));
      const checkLandLotExits = await LandLot.findOne({
        lot: field[header.indexOf('lot')],
        subLot: field[header.indexOf('subLot')],
        code: field[header.indexOf('code')],
      });

      if (!checkLandLotExits) {
        const landLot = new LandLot({
          lot: field[header.indexOf('lot')],
          subLot: field[header.indexOf('subLot')],
          code: field[header.indexOf('code')],
        });
        await landLot.save();
      }
    }, { concurrency: 10 });
    console.log('Seed LanLot Success');
  } catch
  (err) {
    throw new Error(err.message);
  }
};
