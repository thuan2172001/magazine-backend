import faker from 'faker';
import User from '../models/user';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Faculty from '../models/faculty';
import Role from '../models/role';

const Promise = require('bluebird');

faker.locale = 'vi';

export const createDefaultUser = async () => {
  try {
    const generateNumber = await User.count();

    if (generateNumber > 0) return;

    const userFile = await getCSVFiles('users');

    const { header, content } = await getContentCSVFiles(userFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));
      const facultyCode = field[header.indexOf('faculty')];
      const faculty = await Faculty.findOne({ code: facultyCode });

      const roleCode = field[header.indexOf('role')];
      const role = await Role.findOne({ code: roleCode });

      const checkDataExits = await User.findOne({
        code: field[header.indexOf('code')],
      });

      // const userObj = {
      //   username: field[header.indexOf('username')],
      //   fullName: field[header.indexOf('fullName')],
      //   faculty: field[header.indexOf('faculty')],
      //   email: field[header.indexOf('email')],
      //   birthDay: field[header.indexOf('birthDay')],
      //   gender: field[header.indexOf('gender')],
      //   phone: field[header.indexOf('phone')],
      //   role: field[header.indexOf('role')],
      // };

      // const checkUserExits = await User.findOne(userObj);
      const username = field[header.indexOf('email')];
      if (!checkDataExits) {
        const user = new User({
          username,
          fullName: field[header.indexOf('fullName')],
          faculty,
          identifier: field[header.indexOf('identifier')],
          status: field[header.indexOf('status')],
          email: field[header.indexOf('email')],
          birthDay: field[header.indexOf('birthDay')],
          gender: field[header.indexOf('gender')],
          phone: field[header.indexOf('phone')],
          role,
          publicKey: 'ApKXOV4ilsHdFCDISoN4so/zXQxDWtt3AiAZg5bx2oNM',
          encryptedPrivateKey:
                        'U2FsdGVkX1849aMg8O6GLRVrFSLd2aQI4cRaS4Ql2nZr8p+smv5O9koFn+J6EkcwaZF6u8dGb3tJEXg35q0raA==',
          issuerSignature: 'Admin System',
          issuedPublicKey: username === 'guest' ? '' : 'ApKXOV4ilsHdFCDISoN4so/zXQxDWtt3AiAZg5bx2oNM',
        });
        await user.save();
      }
    });

    console.log('Seed User Success');
  } catch (err) {
    throw new Error(err.message);
  }
};

// export const createAgencyForUser = async () => {
//   try {
//     const userFile = await getCSVFiles('users');
//
//     const { header, content } = await getContentCSVFiles(userFile[0]);
//
//     const agencyFile = await getCSVFiles('agencies');
//
//     const {
//       header: headerAgency,
//       content: contentAgency,
//     } = await getContentCSVFiles(agencyFile[0]);
//
//     await Promise.each(content, async (line) => {
//       const field = cleanField(line.split(','));
//
//       const agencyId = field[header.indexOf('agency')];
//
//       if (agencyId !== '') {
//         const agency = await findAgency(agencyId, contentAgency, headerAgency);
//
//         const userObj = {
//           username: field[header.indexOf('username')],
//         };
//         const userExits = await User.findOne(userObj);
//
//         if (userExits && !userExits.agency && agency[0]) {
//           await User
//             .updateOne({ _id: userExits._id }, {
//               $set: {
//                 agency: agency[0]._id,
//               },
//             });
//         }
//       }
//     });
//
//     console.log('Seed Agency for User Success');
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// export const createStudentForUser = async () => {
//   try {
//     const userFile = await getCSVFiles('users');
//
//     const { header, content } = await getContentCSVFiles(userFile[0]);
//
//     const studentFile = await getCSVFiles('student');
//
//     const {
//       header: headerStudent,
//       content: contentStudent,
//     } = await getContentCSVFiles(studentFile[0]);
//
//     await Promise.each(content, async (line) => {
//       const field = cleanField(line.split(','));
//
//       const studentId = field[header.indexOf('student')];
//
//       if (studentId !== '') {
//         const student = await findAgency(studentId, contentStudent, headerStudent);
//
//         const userObj = {
//           username: field[header.indexOf('username')],
//         };
//         const userExits = await User.findOne(userObj);
//
//         if (userExits && !userExits.student && student[0]) {
//           await User
//             .updateOne({ _id: userExits._id }, {
//               $set: {
//                 student: student[0]._id,
//               },
//             });
//         }
//       }
//     });
//
//     console.log('Seed Student for User Success');
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// export const createShippingAgencyForUser = async () => {
//   try {
//     const userFile = await getCSVFiles('users');
//
//     const { header, content } = await getContentCSVFiles(userFile[0]);
//
//     const shippingAgencyFile = await getCSVFiles('shippingagencies');
//
//     const {
//       header: headerShippingAgency,
//       content: contentShippingAgency,
//     } = await getContentCSVFiles(shippingAgencyFile[0]);
//
//     await Promise.each(content, async (line) => {
//       const field = cleanField(line.split(','));
//
//       const shippingAgencyId = field[header.indexOf('shippingAgency')];
//
//       if (shippingAgencyId !== '') {
//         const shippingAgency = await findAgency(shippingAgencyId,
//           contentShippingAgency, headerShippingAgency);
//
//         const userObj = {
//           username: field[header.indexOf('username')],
//         };
//
//         const userExits = await User.findOne(userObj);
//
//         if (userExits && !userExits.agency && shippingAgency[0]) {
//           console.log({ userExits });
//           await User
//             .updateOne({ _id: userExits._id }, {
//               $set: {
//                 agency: shippingAgency[0]._id,
//               },
//             });
//         }
//       }
//     });
//
//     console.log('Seed Shipping Agency for User Success');
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };
