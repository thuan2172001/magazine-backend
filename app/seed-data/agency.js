import { cleanField, getContentCSVFiles, getCSVFiles } from './scanDataFile';
import Agency from '../models/agency';
import { findStoreLevel, findUser } from './findData';

const Promise = require('bluebird');

export const generateAgency = async () => {
  try {
    const generateNumber = await Agency.count();

    if (generateNumber > 0) return;

    const agenciesFile = await getCSVFiles('agencies');

    const { header, content } = await getContentCSVFiles(agenciesFile[0]);

    const storeLevelFile = await getCSVFiles('storelevels');

    const {
      header: headerStoreLevel,
      content: contentStoreLevel,
    } = await getContentCSVFiles(storeLevelFile[0]);

    const userFile = await getCSVFiles('users');

    const {
      header: headerUser,
      content: contentUser,
    } = await getContentCSVFiles(userFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));

      const storeLevelId = field[header.indexOf('storeLevel')];
      const ownerId = field[header.indexOf('owner')];

      const storeLevel = await findStoreLevel(storeLevelId,
        contentStoreLevel,
        headerStoreLevel);

      const owner = await findUser(ownerId,
        contentUser,
        headerUser);

      const agencyObj = {
        name: field[header.indexOf('name (ten don vi)')],
        storeLevel: storeLevel[0],
        phone: field[header.indexOf('phone')],
        status: '1',
        address: {
          address: field[header.indexOf('address')],
          city: field[header.indexOf('city')],
          district: field[header.indexOf('district')],
          state: field[header.indexOf('state')],
        },
        shippingAddress: [
          {
            address: field[header.indexOf('address')],
            city: field[header.indexOf('city')],
            district: field[header.indexOf('district')],
            state: field[header.indexOf('state')],
            isDefault: true,
          },
        ],
        owner: owner[0],
      };

      const checkAgencyExits = await Agency.findOne({
        ...agencyObj,
        type: '0',
        taxId: field[header.indexOf('taxId')],
      });

      if (!checkAgencyExits) {
        const landLot = new Agency({
          ...agencyObj,
          type: '0',
          taxId: field[header.indexOf('taxId')],
        });
        await landLot.save();
      }
    });

    console.log('Seed Agency Success');
  } catch (err) {
    throw new Error(err.message);
  }
};
