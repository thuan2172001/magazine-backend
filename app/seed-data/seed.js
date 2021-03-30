import {SEED_DATA, VERSION} from '../environment';
import { generateCounter } from './counter';
import SystemInformation from '../models/system_information';
import {createDefaultUser} from "./users";
import {generatePost} from "./posts";
import {generateFaculty} from "./faculties";
import {generateCategory} from "./categories";
import {generateAcademicYear} from "./academic_years";
import {generateRole} from "./roles";
import {generateComment} from "./comments";
import {updateFaculty} from "./updateFaculty";

const { hashElement } = require('folder-hash');

export const seed = async () => {
  if (SEED_DATA === 'true') {
    const version = VERSION ?? '1';
    const hashSeedFolder = await hashElement('./app/models')
    const systemInformation = await SystemInformation.findOne({version});
    if(!systemInformation){
      await _seed();
      await new SystemInformation({version, seedHash: hashSeedFolder.hash}).save();
    } else if(systemInformation.seedHash !== hashSeedFolder.hash){
      await _seed();
      systemInformation.seedHash = hashSeedFolder.hash;
      await systemInformation.save();
    }
  }
};

const _seed = async () => {
  await generateCounter();
  await generateRole();
  await generateFaculty();
  await generateCategory();
  await generateAcademicYear();
  await createDefaultUser();
  await generatePost();
  await generateComment();
}
