import faker from 'faker';

import ProductPlan from '../models/product_plan';
import Planting from '../models/planting';
import ProductPlanHarvesting from '../models/product_plan_harvesting';
import ProductPlanPreliminaryTreatment from '../models/product_plan_preliminary_treatment';
import ProductPlanCleaning from '../models/product_plan_cleaning';
import ProductPlanPacking from '../models/product_plan_packing';
import ProductPlanPreserve from '../models/product_plan_preserve';
import User from '../models/user';

faker.locale = 'vi';

const createProductPlan = (code, seeding, planting, harvesting, preliminaryTreatment, cleaning, packing, preservation, createdBy) => {
  const productPlan = new ProductPlan({
    time: new Date(),
    code,
    step: '1',
    process: '2',
    isFulfilled: faker.random.boolean(),
    confirmationStatus: '0',
    seeding,
    planting,
    harvesting,
    preliminaryTreatment,
    cleaning,
    packing,
    preservation,
    createdBy,
  });

  return productPlan.save();
};

const sleepTime = async (time) => new Promise((res) => setTimeout(res, time));

export const generateProductPlanAdmin = async () => {
  try {
    const mongoose = require('mongoose');
    const Seeding = mongoose.model('Seeding');

    const seed = await Seeding.find();
    const generateNumber = 1;
    if ((await ProductPlan.estimatedDocumentCount()) >= generateNumber) return;

    console.log({ code: seed[0].code });
    const planting = await Planting.findOne({
      code: seed[0].code,
    });

    await sleepTime(3000);

    const productPlanPreserve = await ProductPlanPreserve.findOne({
      code: seed[0].code,
    });

    const productPlanHarvesting = await ProductPlanHarvesting.findOne({
      code: seed[0].code,
    });

    const productPlanPreliminaryTreatment = await ProductPlanPreliminaryTreatment.findOne({
      code: seed[0].code,
    });

    const productPlanCleaning = await ProductPlanCleaning.findOne({
      code: seed[0].code,
    });

    const productPlanPacking = await ProductPlanPacking.findOne({
      code: seed[0].code,
    });

    const createdBy = await User.findOne({
      username: 'admin',
    });

    await createProductPlan(seed[0].code, seed[0], planting, productPlanHarvesting, productPlanPreliminaryTreatment, productPlanCleaning, productPlanPacking, productPlanPreserve, createdBy);
  } catch (err) {
    throw new Error(err.message);
  }
};
