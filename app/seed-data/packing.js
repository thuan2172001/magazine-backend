import Packing from '../models/packing';
import { cleanField, getContentCSVFiles, getCSVFiles } from './scanDataFile';
import { findSpecies } from './findData';

const Promise = require('bluebird');

export const generatePacking = async () => {
  try {
    const generateNumber = await Packing.count();

    if (generateNumber > 0) return;

    const packingFile = await getCSVFiles('packing');

    const { header, content } = await getContentCSVFiles(packingFile[0]);

    const speciesFile = await getCSVFiles('species');

    const {
      header: headerSpecies,
      content: contentSpecies,
    } = await getContentCSVFiles(speciesFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));

      const speciesId = field[1];

      const species = await findSpecies(speciesId, contentSpecies, headerSpecies);
      const checkPackingExits = await Packing.findOne({
        weight: field[header.indexOf('weight')],
        species: species[0],
      });

      if (!checkPackingExits) {
        const packing = new Packing({
          weight: field[header.indexOf('weight')],
          species: species[0],
        });
        await packing.save();
      }
    });

    console.log('Seed Packing Success');
  } catch
  (err) {
    throw new Error(err.message);
  }
};
