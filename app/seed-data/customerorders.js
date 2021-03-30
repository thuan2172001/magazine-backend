import { cleanField, getContentCSVFiles, getCSVFiles } from './scanDataFile';
import CustomerOrder from '../models/customer_order';
import {
  findUser, findAgency, findCustomer,
} from './findData';

const Promise = require('bluebird');

export const generateCustomerOrder = async () => {
  try {
    const generateNumber = await CustomerOrder.count();

    if (generateNumber > 0) return;

    const customerOrderFile = await getCSVFiles('customerorders');

    const { header, content } = await getContentCSVFiles(customerOrderFile[0]);

    const agencyFile = await getCSVFiles('agencies');

    const {
      header: headerAgency,
      content: contentAgency,
    } = await getContentCSVFiles(agencyFile[0]);

    const customerFile = await getCSVFiles('customers');

    const {
      header: headerCustomer,
      content: contentCustomer,
    } = await getContentCSVFiles(customerFile[0]);

    const userFile = await getCSVFiles('users');

    const {
      header: headerUser,
      content: contentUser,
    } = await getContentCSVFiles(userFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));

      const agencyId = field[header.indexOf('sellAgency')];
      const customerId = field[header.indexOf('customer')];
      const sellerId = field[header.indexOf('seller')];

      const agency = await findAgency(agencyId, contentAgency, headerAgency);
      const customer = await findCustomer(customerId, contentCustomer, headerCustomer);
      const seller = await findUser(sellerId, contentUser, headerUser);

      const customerOrderObj = {
        sellAgency: agency[0],
        customer: customer[0],
        seller: seller[0],
      };
      const checkCustomerOrderExits = await CustomerOrder.findOne(customerOrderObj);
      if (!checkCustomerOrderExits) {
        const customerOrder = new CustomerOrder(customerOrderObj);
        await customerOrder.save();
      }
    });

    console.log('Seed Customer Order Success');
  } catch (err) {
    throw new Error(err.message);
  }
};
