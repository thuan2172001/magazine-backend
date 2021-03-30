import { uniqueNamesGenerator } from 'unique-names-generator';
import {
  nameConfig,
} from './common_config';

const generateRandomSystemFunction = (quantity) => Array.from({ length: quantity }, (x, i) => ({
  product: [
    uniqueNamesGenerator(nameConfig),
  ],
  agency: [
    uniqueNamesGenerator(nameConfig),
  ],
}));

export const generateSystemFunction = async () => {
  try {
    const mongoose = require('mongoose');
    const SystemFunction = mongoose.model('SystemFunction');
    const generateNumber = 3;
    if ((await SystemFunction.estimatedDocumentCount()) >= generateNumber) return;

    for (const e of generateRandomSystemFunction(generateNumber)) {
      await new SystemFunction(e).save();
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
