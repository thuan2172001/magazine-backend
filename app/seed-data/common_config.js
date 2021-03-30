import {
  adjectives, animals, colors, NumberDictionary,
} from 'unique-names-generator';

export const nameConfig = {
  dictionaries: [adjectives, colors, animals],
  separator: ' ',
  length: 2,
};
export const codeConfig = {
  dictionaries: [adjectives, colors, animals],
  separator: '_',
  length: 2,
  style: 'lowerCase',
};
export const phoneNumbers = [
  '(+84)333888648',
  '(+84)388944118',
  '(+84)918760972',
];

export const phoneConfig = {
  dictionaries: [phoneNumbers],
};

export const addresses = ['13, Nam Từ Liêm, Hà Nội', 'Cầu Giấy, Hà Nội', 'Trung Kính, Cầu Giấy, Hà Nội'];
export const addresssConfig = {
  dictionaries: [addresses],
};
export const taxNumbers = [
  '2333132275',
  '3889441135',
  '2454057091',
  '3817103740',
  '8357984733',
  '8431552234',
  '6559798273',
  '4608982168',
  '3400469731',
  '8993948623',
  '9115179452',
  '6036525240',
  '8798782619',
  '4769645364',
  '4873260242',
  '6536083620',
  '8062382297',
  '2857734031',
  '9321087807',
  '2899874192',
  '3799185736',
  '4827456961',
  '9187609710',
];

export const taxConfig = {
  dictionaries: [taxNumbers],
};

const alphabetCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z'];

const twoDigitNumbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99'];

export const lotConfig = {
  dictionaries: [alphabetCharacters],
  style: 'upperCase',
};

export const subLotConfig = {
  dictionaries: [twoDigitNumbers],
};
