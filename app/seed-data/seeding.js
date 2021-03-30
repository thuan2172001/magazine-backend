import md5 from 'md5';
import { cleanField, getContentCSVFiles, getCSVFiles } from './scanDataFile';
import Seeding from '../models/seeding';
import { findSpecies, findLandLot, findUser } from './findData';

const Promise = require('bluebird');

export const generateSeeding = async () => {
  try {
    const generateNumber = await Seeding.count();

    if (generateNumber > 0) return;

    const seedingFile = await getCSVFiles('seedings');

    const { header, content } = await getContentCSVFiles(seedingFile[0]);

    const speciesFile = await getCSVFiles('species');

    const {
      header: headerSpecies,
      content: contentSpecies,
    } = await getContentCSVFiles(speciesFile[0]);

    const landLotsFile = await getCSVFiles('landlots');

    const {
      header: headerLandLot,
      content: contentLandLot,
    } = await getContentCSVFiles(landLotsFile[0]);

    const userFile = await getCSVFiles('users');

    const {
      header: headerUser,
      content: contentUser,
    } = await getContentCSVFiles(userFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));

      const speciesId = field[header.indexOf('species')];
      const landLotId = field[header.indexOf('landLot')];
      const leaderId = field[header.indexOf('leader')];
      const workerId = field[header.indexOf('worker')];
      const managerId = field[header.indexOf('code')];

      const species = await findSpecies(speciesId, contentSpecies, headerSpecies);
      const landLot = await findLandLot(landLotId, contentLandLot, headerLandLot);
      const leader = await findUser(leaderId, contentUser, headerUser);
      const worker = await findUser(workerId, contentUser, headerUser);
      const manager = await findUser(managerId, contentUser, headerUser);

      const seedingObj = {
        leader: leader[0],
        worker: worker[0],
        code: field[header.indexOf('code')],
        certificates: {
          path: field[header.indexOf('certificates')],
          hash: md5(field[header.indexOf('certificates')]),
        },
        buyInvoice: {
          path: field[header.indexOf('buyInvoice')],
          hash: md5(field[header.indexOf('buyInvoice')]),
        },
        seedingTime: field[header.indexOf('seedingTime')],
        estimatedPlantingTime: field[header.indexOf('estimatedPlantingTime')],
        landLot: landLot[0],
        species: species[0],
        area: field[header.indexOf('area')],
        numberOfSeed: field[header.indexOf('numberOfSeed')],
        expectedQuantity: field[header.indexOf('expectedQuantity')],
        temperature: field[header.indexOf('temperature')],
        humidity: field[header.indexOf('humidity')],
        porosity: field[header.indexOf('porosity')],
        manager: manager[0],
        farmLocation: { type: 'Point', coordinates: [field[header.indexOf('long')], field[header.indexOf('Lat')]] },
        landLotImage: {
          path: field[header.indexOf('landLotImage')],
          hash: md5(field[header.indexOf('landLotImage')]),
        },
        seedingImage: {
          path: field[header.indexOf('seedingImage')],
          hash: md5(field[header.indexOf('seedingImage')]),
        },
      };
      const checkSeedingExits = await Seeding.findOne(seedingObj);
      if (!checkSeedingExits) {
        const seeding = new Seeding(seedingObj);
        await seeding.save();
      }
    });

    console.log('Seed Seeding Success');
  } catch (err) {
    throw new Error(err.message);
  }
};
