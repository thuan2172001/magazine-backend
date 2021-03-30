import md5 from 'md5';
import Planting from '../models/planting';

import { cleanField, getContentCSVFiles, getCSVFiles } from './scanDataFile';
import { findLandLot, findSpecies, findUser } from './findData';

const Promise = require('bluebird');

export const generatePlanting = async () => {
  try {
    const generateNumber = await Planting.count();

    if (generateNumber > 0) return;

    const plantingFile = await getCSVFiles('plantings');

    const { header, content } = await getContentCSVFiles(plantingFile[0]);

    const speciesFile = await getCSVFiles('species');

    const {
      header: headerSpecies,
      content: contentSpecies,
    } = await getContentCSVFiles(speciesFile[0]);

    const landlotsFile = await getCSVFiles('landlots');

    const {
      header: headerLanLot,
      content: contentLandLot,
    } = await getContentCSVFiles(landlotsFile[0]);

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
      const managerId = field[header.indexOf('manager')];

      const species = await findSpecies(speciesId, contentSpecies, headerSpecies);
      const leader = await findUser(leaderId, contentUser, headerUser);
      const manager = await findUser(managerId, contentUser, headerUser);
      const worker = await findUser(workerId, contentUser, headerUser);
      const landLot = await findLandLot(landLotId, contentLandLot, headerLanLot);

      const plantingObj = {
        leader: leader[0],
        worker: worker[0],
        code: field[header.indexOf('code')],
        estimatedPlantingTime: field[header.indexOf('estimatedPlantingTime')],
        estimatedHarvestTime: field[header.indexOf('estimatedHarvestTime')],
        area: field[header.indexOf('area')],
        numberOfPlants: field[header.indexOf('numberOfPlants')],
        expectedQuantity: field[header.indexOf('expectedQuantity')],
        temperature: field[header.indexOf('temperature')],
        humidity: field[header.indexOf('humidity')],
        porosity: field[header.indexOf('porosity')],
        landLot: landLot[0],
        species: species[0],
        manager: manager[0],
        farmLocation: { type: 'Point', coordinates: [field[header.indexOf('long')], field[header.indexOf('Lat')]] },
        imageAfter: {
          path: field[header.indexOf('imageAfter')],
          hash: md5(field[header.indexOf('imageAfter')]),
        },
        imageBefore: {
          path: field[header.indexOf('imageBefore')],
          hash: md5(field[header.indexOf('imageBefore')]),
        },
      };
      const checkPlantingExits = await Planting.findOne(plantingObj);
      if (!checkPlantingExits) {
        const planting = new Planting(plantingObj);
        await planting.save();
      }
    });

    console.log('Seed Planting Success');
  } catch (err) {
    throw new Error(err.message);
  }
};
