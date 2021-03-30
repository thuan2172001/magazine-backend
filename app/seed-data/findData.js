import Species from '../models/species';
import LandLot from '../models/land_lot';
import Agency from '../models/agency';
import ManagementUnit from '../models/management_unit';
import StoreLevel from '../models/store_level';
import User from '../models/user';
import Seeding from '../models/seeding';
import Planting from '../models/planting';
import Packing from '../models/packing';
import Role from '../models/role';
import School from '../models/school';
import Customer from '../models/customer';
import { cleanField } from './scanDataFile';

const Promise = require('bluebird');

export const findSpecies = async (speciesId, speciesContent, header) => {
  let result = await Promise.map(speciesContent, async (line) => {
    if (line.includes(speciesId)) {
      const field = cleanField(line.split(','));

      return Species.findOne({
        code: field[header.indexOf('code')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findLandLot = async (landLotId, landLotContent, header) => {
  let result = await Promise.map(landLotContent, async (line) => {
    if (line.includes(landLotId)) {
      const field = cleanField(line.split(','));

      return LandLot.findOne({
        code: field[header.indexOf('code')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findManagementUnit = async (managementUnitId, managementContent, header) => {
  let result = await Promise.map(managementContent, async (line) => {
    if (line.includes(managementUnitId)) {
      const field = cleanField(line.split(','));

      return ManagementUnit.findOne({
        code: field[header.indexOf('code')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findUser = async (userId, userContent, header) => {
  let result = await Promise.map(userContent, async (line) => {
    if (line.includes(userId)) {
      const field = cleanField(line.split(','));

      return User.findOne({
        username: field[header.indexOf('username')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findSeeding = async (seedingId, seedingContent, header) => {
  let result = await Promise.map(seedingContent, async (line) => {
    if (line.includes(seedingId)) {
      const field = cleanField(line.split(','));

      return Seeding.findOne({
        code: field[header.indexOf('code')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findPlanting = async (plantingId, plantingContent, header) => {
  let result = await Promise.map(plantingContent, async (line) => {
    if (line.includes(plantingId)) {
      const field = cleanField(line.split(','));

      return Planting.findOne({
        code: field[header.indexOf('code')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findPacking = async (packingId, packingContent, header) => {
  let result = await Promise.map(packingContent, async (line) => {
    if (line.includes(packingId)) {
      const field = cleanField(line.split(','));

      return Packing.findOne({
        weight: field[header.indexOf('weight')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findRole = async (roleId, roleContent, header) => {
  let result = await Promise.map(roleContent, async (line) => {
    if (line.includes(roleId)) {
      const field = cleanField(line.split(','));

      return Role.findOne({
        name: field[header.indexOf('name')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findStoreLevel = async (storeLevelId, storeLevelContent, header) => {
  let result = await Promise.map(storeLevelContent, async (line) => {
    if (line.includes(storeLevelId)) {
      const field = cleanField(line.split(','));

      return StoreLevel.findOne({
        name: field[header.indexOf('name')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findAgency = async (agencyId, agencyContent, header) => {
  let result = await Promise.map(agencyContent, async (line) => {
    if (line.includes(agencyId)) {
      const field = cleanField(line.split(','));

      return Agency.findOne({
        code: field[header.indexOf('code (ma don vi)')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findCustomer = async (customerId, customerContent, header) => {
  let result = await Promise.map(customerContent, async (line) => {
    if (line.includes(customerId)) {
      const field = cleanField(line.split(','));

      return Customer.findOne({
        username: field[header.indexOf('username')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};

export const findSchool = async (schoolId, content, header) => {
  let result = await Promise.map(content, async (line) => {
    if (line.includes(schoolId)) {
      const field = cleanField(line.split(','));

      return School.findOne({
        code: field[header.indexOf('code')],
      });
    }

    return false;
  });

  result = result.filter(Boolean);

  return result;
};
