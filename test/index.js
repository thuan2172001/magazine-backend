const faker = require('faker');

const moment = require('moment');

const pathLib = require('path');
const pluralize = require('pluralize');
const sharp = require('sharp');
const fs = require('fs');
const QRCode = require('qrcode');
const QRPaper = require('qr-paper');
const path = require('path');
const slugify = require('slugify');
const _ = require('lodash');
const { readFile } = require('../app/utils/file-utils');
const Upload = require('../app/utils/image-utils');
const RoleScope = require('../app/const/role_scope.json');

faker.locale = 'vi';

setImmediate(async () => {
  const data = {
    enterprise: {
      name: 'UniFarm',
      taxId: '0123456789',
      address: '123 Trung Kính, Cầu Giấy',
      phone: '0961782317',
      presentedBy: 'Nguyễn Văn A',
      gln: '123456',
    },
    abc: '123',
  };

  console.log(_.has(data, 'enterprise.address'));

  _.unset(data, 'enterprise.taxId');

  console.log(_.pick(data, ['enterprise.address', 'enterprise.presentedBy']));
  // console.log({ data });
});
