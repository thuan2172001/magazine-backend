import ImportOrder from '../models/export_order';
import Agency from '../models/agency';
import User from '../models/user';

const createExportOrder = (exportType, status, agency, user) => {
  const exportOrder = new ExportOrder({
    exportType,
    status,
    buyer: {
      name: 'Nguyễn Văn Mua',
      phone: '0961782319',
    },
    exportAgency: agency,
    importAgency: agency,
    createdBy: user,
    exportedBy: user,
    exportedAt: new Date(),
  });

  return exportOrder.save();
};

export const generateExportOrder = async () => {
  try {
    const generateNumber = 30;
    if ((await ExportOrder.estimatedDocumentCount()) >= generateNumber) return;

    const agency = await Agency.findOne();
    const users = await User.findOne();

    for (let i = 0; i < 5; i++) {
      /**
       * Xuất kho bán lẻ
       */
      await createExportOrder('1', '1', agency, users);
      await createExportOrder('1', '2', agency, users);
      await createExportOrder('1', '3', agency, users);
      /**
       * Xuất kho phân phối
       */
      await createExportOrder('2', '1', agency, users);
      await createExportOrder('2', '2', agency, users);
      await createExportOrder('2', '3', agency, users);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
