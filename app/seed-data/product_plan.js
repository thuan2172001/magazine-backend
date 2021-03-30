import faker from 'faker';
import ProductPlan from '../models/product_plan';
import ProductPlanHarvesting from '../models/product_plan_harvesting';
import ProductPlanPreliminaryTreatment from '../models/product_plan_preliminary_treatment';
import ProductPlanCleaning from '../models/product_plan_cleaning';
import ProductPlanPreserve from '../models/product_plan_preserve';
import ProductPlanPacking from '../models/product_plan_packing';
import { getContentCSVFiles, getCSVFiles, cleanField } from './scanDataFile';

import {
  findPacking,
  findPlanting,
  findSeeding,
} from './findData';
import ProductPlanConfig from '../api/client/product-plan/product-plan.config.json';
import PlanRoleMapping from '../models/plan_role_mapping';
import { updateToBlockchain } from '../services/blockchain/hashProcess';

const Promise = require('bluebird');

faker.locale = 'vi';

export const generateProductPlan = async () => {
  try {
    const generateNumber = await ProductPlan.count();

    if (generateNumber > 0) return;

    const productPlanFile = await getCSVFiles('productplans');

    const { header, content } = await getContentCSVFiles(productPlanFile[0]);

    const plantingFile = await getCSVFiles('plantings');

    const {
      header: headerPlanting,
      content: contentPlanting,
    } = await getContentCSVFiles(plantingFile[0]);

    const seedingFile = await getCSVFiles('seedings');

    const {
      header: headerSeeding,
      content: contentSeeding,
    } = await getContentCSVFiles(seedingFile[0]);

    // const packingFile = await getCSVFiles('packing');
    //
    // const {
    //   header: headerPacking,
    //   content: contentPacking,
    // } = await getContentCSVFiles(packingFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));

      const seedingId = field[header.indexOf('seeding')];
      const plantingId = field[header.indexOf('planting')];
      // const packingId = field[header.indexOf('packing')];

      const seeding = await findSeeding(seedingId, contentSeeding, headerSeeding);
      const planting = await findPlanting(plantingId, contentPlanting, headerPlanting);
      // const packing = await findPacking(packingId, contentPacking, headerPacking);

      const checkProductPlantExits = await ProductPlan.findOne({
        code: field[header.indexOf('code')],
        seeding: seeding[0],
        planting: planting[0],
      });
      if (!checkProductPlantExits) {
        const preserve = new ProductPlanPreserve();
        await preserve.save();
        const cleaning = new ProductPlanCleaning();
        await cleaning.save();
        const productPlanPacking = new ProductPlanPacking();
        await productPlanPacking.save();
        const preliminaryTreatment = new ProductPlanPreliminaryTreatment();
        await preliminaryTreatment.save();
        const productPlanHarvesting = new ProductPlanHarvesting();
        await productPlanHarvesting.save();

        const newProductPlan = new ProductPlan({
          code: field[header.indexOf('code')],
          step: '0',
          process: '1',
          confirmationStatus: '0',
          isMaster: true,
          isActive: true,
          seeding: seeding[0],
          preservation: preserve,
          cleaning,
          preliminaryTreatment,
          harvesting: productPlanHarvesting,
          planting: planting[0],
          packing: productPlanPacking,
        });
        await newProductPlan.save();
        // update hash to blockchain
        const productPlan = await ProductPlan.findOne({ _id: newProductPlan._id }).lean().populate([
          ProductPlanConfig.seeding,
          ProductPlanConfig.planting,
          ProductPlanConfig.harvesting,
          ProductPlanConfig.preliminaryTreatment,
          ProductPlanConfig.cleaning,
          ProductPlanConfig.packing,
          ProductPlanConfig.preservation,
          ProductPlanConfig.comment,
          ProductPlanConfig.createdBy,
        ]);
        const planRoleMapping = await PlanRoleMapping.find({ productPlan: newProductPlan._id }).lean().select('process user role isRecieved').populate({ path: 'user', select: 'firstName lastName fullName' });
        const mappingInfo = [
          { process: '2', name: 'harvesting' },
          { process: '3', name: 'preliminaryTreatment' },
          { process: '4', name: 'cleaning' },
          { process: '5', name: 'packing' },
          { process: '6', name: 'preservation' },
        ];
        mappingInfo.forEach((m) => {
          const mapRoleProcess = planRoleMapping.filter((e) => e.process === m.process);
          if (!productPlan[m.name]) return;
          productPlan[m.name].technical = mapRoleProcess.filter((e) => e.role === 'technical');
          productPlan[m.name].leader = mapRoleProcess.filter((e) => e.role === 'leader');
          productPlan[m.name].worker = mapRoleProcess.filter((e) => e.role === 'worker');
        });
        console.log(productPlan);
        await updateToBlockchain(productPlan);
      }
    });

    console.log('Seeding Product Plan Success');
  } catch (err) {
    throw new Error(err.message);
  }
};
