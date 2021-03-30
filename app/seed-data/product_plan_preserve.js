import faker from 'faker';

import ProductPlanPreserve from '../models/product_plan_preserve';

faker.locale = 'vi';

const createProductPlanPreserve = (code, manager, leader, worker) => {
  const productPlanCleaning = new ProductPlanPreserve({
    code,
    location: { type: 'Point', coordinates: faker.address.nearbyGPSCoordinate() },
  });

  return productPlanCleaning.save();
};

export const generateProductPlanPreserve = async () => {
  try {
    const mongoose = require('mongoose');
    const Seeding = mongoose.model('Seeding');
    const seeding = await Seeding.find();
    const generateNumber = await Seeding.count();
    if ((await ProductPlanPreserve.estimatedDocumentCount()) >= generateNumber) return;
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

      await createProductPlanPreserve(seed.code, manager, leader, worker);
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
