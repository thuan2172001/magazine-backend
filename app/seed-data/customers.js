import Customer from '../models/customer';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';

const Promise = require('bluebird');

export const generateCustomer = async () => {
  try {
    const generateNumber = await Customer.count();

    if (generateNumber > 0) return;

    const customersFile = await getCSVFiles('customers');

    const { header, content } = await getContentCSVFiles(customersFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));
      const checkCustomerExits = await Customer.findOne({
        username: field[header.indexOf('username')],
      });

      if (!checkCustomerExits) {
        const customer = new Customer({
          username: field[header.indexOf('username')],
          fullName: field[header.indexOf('fullname')],
        });
        await customer.save();
      }
    });
    console.log('Seed Customer Success');
  } catch
  (err) {
    throw new Error(err.message);
  }
};
