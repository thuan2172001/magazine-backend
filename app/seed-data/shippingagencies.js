import { cleanField, getContentCSVFiles, getCSVFiles } from './scanDataFile';
import ShippingAgency from '../models/agency';
import { findUser } from './findData';

const Promise = require('bluebird');

export const generateShippingAgency = async () => {
  try {
    const shippingAgenciesFile = await getCSVFiles('shippingagencies');

    const { header, content } = await getContentCSVFiles(shippingAgenciesFile[0]);

    const userFile = await getCSVFiles('users');

    const {
      header: headerUser,
      content: contentUser,
    } = await getContentCSVFiles(userFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));

      const ownerId = field[header.indexOf('owner')];

      const owner = await findUser(ownerId,
        contentUser,
        headerUser);

      const agencyObj = {
        type: '1',
        status: '1',
        phone: field[header.indexOf('phone')],
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
        taxId: `${field[header.indexOf('taxId')]}00`,
      };

      const checkShippingAgencyExits = await ShippingAgency.findOne({
        type: '1',
        name: field[header.indexOf('name (ten don vi)')],
      });

      if (!checkShippingAgencyExits) {
        console.log('create new shipping agency');
        const shippingAgency = new ShippingAgency({
          ...agencyObj,
          name: field[header.indexOf('name (ten don vi)')],
        });
        await shippingAgency.save();
      }
    });

    console.log('Seed Shipping Agency Success');
  } catch (err) {
    throw new Error(err.message);
  }
};
