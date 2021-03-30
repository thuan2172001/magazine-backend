import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Species from '../models/species';

const Promise = require('bluebird');

export const generateSpecies = async () => {
  try {
    const generateNumber = await Species.count();

    if (generateNumber > 0) return;

    const speciesFile = await getCSVFiles('species');

    const { header, content } = await getContentCSVFiles(speciesFile[0]);

    await Promise.map(content, async (line) => {
      const field = cleanField(line.split(','));

      const checkSpeciesExits = await Species.findOne({
        name: field[header.indexOf('name')],
        barcode: field[header.indexOf('barcode')],
        growingDays: field[header.indexOf('growingDays')],
        plantingDays: field[header.indexOf('plantingDays')],
        expiryDays: field[header.indexOf('expiryDays')],
      });

      if (!checkSpeciesExits) {
        const species = new Species({
          name: field[header.indexOf('name')],
          barcode: field[header.indexOf('barcode')],
          growingDays: field[header.indexOf('growingDays')],
          plantingDays: field[header.indexOf('plantingDays')],
          expiryDays: field[header.indexOf('expiryDays')],
        });
        await species.save();
      }
    }, { concurrency: 10 });

    console.log('Seed Species Success');
  } catch
  (err) {
    throw new Error(err.message);
  }
};
