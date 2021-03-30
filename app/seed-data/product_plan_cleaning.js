import faker from 'faker';

import ProductPlanCleaning from '../models/product_plan_cleaning';

faker.locale = 'vi';

const createProductPlanCleaning = (code, manager, leader, worker) => {
  const productPlanCleaning = new ProductPlanCleaning({
    code,
    location: { type: 'Point', coordinates: faker.address.nearbyGPSCoordinate() },
  });

  return productPlanCleaning.save();
};

export const generateProductPlanCleaning = async () => {
  try {
    const mongoose = require('mongoose');
    const Seeding = mongoose.model('Seeding');
    const seeding = await Seeding.find();
    const generateNumber = await Seeding.count();
    if ((await ProductPlanCleaning.estimatedDocumentCount()) >= generateNumber) return;
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

      await createProductPlanCleaning(seed.code, manager, leader, worker);
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
