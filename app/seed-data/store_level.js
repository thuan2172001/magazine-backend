import StoreLevel from '../models/store_level';
import { cleanField, getContentCSVFiles, getCSVFiles } from './scanDataFile';
import { findStoreLevel } from './findData';

const Promise = require('bluebird');

const createStoreLevel = (name, status, level, code, parent) => {
  const storeLevel = new StoreLevel({
    name,
    status,
    level,
    parent,
    code,
  });

  return storeLevel.save();
};

export const generateStoreLevel = async () => {
  try {
    const generateNumber = await StoreLevel.count();

    if (generateNumber > 0) return;

    const storeLevelFile = await getCSVFiles('storelevels');

    const { header, content } = await getContentCSVFiles(storeLevelFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));

      const parentId = field[header.indexOf('parent')];

      const parent = await findStoreLevel(parentId,
        content,
        header);

      const storeLevelObj = {
        level: field[header.indexOf('level')],
        name: field[header.indexOf('name')],
        status: field[header.indexOf('status')],
        parent: parent ? parent[0] : null,
      };
      const checkStoreLevelExits = await StoreLevel.findOne(storeLevelObj);
      if (!checkStoreLevelExits) {
        const storeLevel = new StoreLevel(storeLevelObj);
        await storeLevel.save();
      }
    });

    // const isGeneratedRoot = await StoreLevel.findOne({ name: 'Root' });
    // if (!isGeneratedRoot) await createStoreLevel('Root', '1', '0', '00000');
    // const isGeneratedNPP = await StoreLevel.findOne({ name: 'Nhà phân phối' });
    // if (!isGeneratedNPP) await createStoreLevel('Nhà phân phối', '1', '1', '00001', isGeneratedRoot);
    // const isGeneratedTDL = await StoreLevel.findOne({ name: 'Tổng đại lý' });
    // if (!isGeneratedTDL) await createStoreLevel('Tổng đại lý', '1', '2', '00002', isGeneratedNPP);
    // const isGeneratedDL = await StoreLevel.findOne({ name: 'Đại lý' });
    // if (!isGeneratedDL) await createStoreLevel('Đại lý', '1', '3', '00003', isGeneratedTDL);
    // const isGeneratedCHBL = await StoreLevel.findOne({ name: 'Cửa hàng bán lẻ' });
    // if (!isGeneratedCHBL) await createStoreLevel('Cửa hàng bán lẻ', '1', '4', '00004', isGeneratedDL);
    // const isGeneratedCHGTSP = await StoreLevel.findOne({ name: 'Cửa hàng giới thiệu sản phẩm' });
    // if (!isGeneratedCHGTSP) await createStoreLevel('Cửa hàng giới thiệu sản phẩm', '1', '1', '00005', isGeneratedRoot);
    console.log('Seed Store Level Success');
  } catch
  (err) {
    throw new Error(err.message);
  }
};
