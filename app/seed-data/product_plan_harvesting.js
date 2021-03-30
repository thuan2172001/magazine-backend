import faker from 'faker';

const ProductPlanHarvesting = require('../models/product_plan_harvesting');

faker.locale = 'vi';

const createProductPlanHarvesting = (code, manager, leader, worker) => {
  const planHarvesting = new ProductPlanHarvesting({
    time: new Date(),
    code,
    location: { type: 'Point', coordinates: faker.address.nearbyGPSCoordinate() },
  });

  return planHarvesting.save();
};

export const generateProductPlanHarvesting = async () => {
  try {
    const mongoose = require('mongoose');
    const Seeding = mongoose.model('Seeding');
    const seeding = await Seeding.find();
    const generateNumber = await Seeding.count();
    if ((await ProductPlanHarvesting.estimatedDocumentCount()) >= generateNumber) return;
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

      await createProductPlanHarvesting(seed.code, manager, leader, worker);
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
