import ProductPlan from '../models/product_plan';
import QRCode from '../models/qrcode';
import User from '../models/user';

const randomProductPlan = async () => {
  const listProductPlan = await ProductPlan.find({});

  const productPlan = listProductPlan[Math.floor(Math.random() * listProductPlan.length)];

  return productPlan._id;
};

const randomUser = async () => {
  const listUser = await User.find({});

  const user = listUser[Math.floor(Math.random() * listUser.length)];

  return user._id;
};

export const generateQRCodePack = async () => {
  const total = await QRCode.count({});
  if (total < 20) {
    try {
      for (let i = 1; i < 20; i++) {
        const productPlan = await randomProductPlan();
        const createdBy = await randomUser();
        const activeBy = await randomUser();
        const activeAt = new Date();
        const type = '2';
        const listQrCode = await QRCode.find({
          type: '1',
        });
        const qrCode = new QRCode({
          createdBy,
          activeBy,
          activeAt,
          type,
          productPlan,
          enterprise: {
            name: 'UniFarm',
            taxId: '0123456789',
            address: '123 Trung Kính, Cầu Giấy',
            phone: '0961782317',
            presentedBy: 'Nguyễn Văn A',
            gln: '123456',
          },
          children: listQrCode.splice(0, 10),
          isPacked: false,
          isActive: true,
        });

        await qrCode.save();
      }
    } catch
    (err) {
      throw new Error(err.message);
    }
  }
};

export const generateQRCode = async () => {
  const total = await QRCode.count({});
  if (total < 20) {
    try {
      for (let i = 1; i < 10; i++) {
        const createdBy = await randomUser();
        const activeBy = await randomUser();
        const activeAt = new Date();
        const type = '1';
        const qrCode = new QRCode({
          createdBy,
          activeBy,
          activeAt,
          type,
          enterprise: {
            name: 'UniFarm',
            taxId: '0123456789',
            address: '123 Trung Kính, Cầu Giấy',
            phone: '0961782317',
            presentedBy: 'Nguyễn Văn A',
            gln: '123456',
          },
          isPacked: false,
          isActive: false,
        });

        await qrCode.save();
      }
    } catch
    (err) {
      throw new Error(err.message);
    }
  }
};

export const generateQRCodeActive = async () => {
  const total = await QRCode.count({});
  if (total < 20) {
    try {
      for (let i = 1; i < 10; i++) {
        const productPlan = await randomProductPlan();
        const createdBy = await randomUser();
        const activeBy = await randomUser();
        const activeAt = new Date();
        const type = '1';
        const qrCode = new QRCode({
          createdBy,
          activeBy,
          activeAt,
          type,
          productPlan,
          enterprise: {
            name: 'UniFarm',
            taxId: '0123456789',
            address: '123 Trung Kính, Cầu Giấy',
            phone: '0961782317',
            presentedBy: 'Nguyễn Văn A',
            gln: '123456',
          },
          isPacked: false,
          isActive: true,
        });

        await qrCode.save();
      }
    } catch
    (err) {
      throw new Error(err.message);
    }
  }
};
