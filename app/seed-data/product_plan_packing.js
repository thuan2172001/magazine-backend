import faker from 'faker';

import ProductPlanPacking from '../models/product_plan_packing';
import Packing from '../models/packing';
import Species from '../models/species';

faker.locale = 'vi';

const createProductPlanPacking = (code, packing, manager, leader, worker) => {
  const productPlanCleaning = new ProductPlanPacking({
    code,
    location: { type: 'Point', coordinates: faker.address.nearbyGPSCoordinate() },
  });

  return productPlanCleaning.save();
};

export const generateProductPlanPacking = async () => {
  try {
    const mongoose = require('mongoose');
    const Seeding = mongoose.model('Seeding');
    const seeding = await Seeding.find();
    const generateNumber = await Seeding.count();
    if ((await ProductPlanPacking.estimatedDocumentCount()) >= generateNumber) return;

    const packing = await Packing.findOne({});

    console.log({ packing });
    await seeding.map(async (seed) => {
      const User = mongoose.model('User');
      const manager = await User.findOne({
        username: 'Manager',
      });

      const leader = await User.findOne({
        username: 'Leader',
      });

      const worker = await User.findOne({
        username: 'Worker',
      });

      await createProductPlanPacking(seed.code, packing, manager, leader, worker);
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
