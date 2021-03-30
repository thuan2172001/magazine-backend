const { getCSVFiles, getContentCSVFiles } = require('../app/seed-data/scanDataFile');
const { readFile } = require('../app/utils/file-utils');

setImmediate(async () => {
  const listFile = await getCSVFiles('roles');

  const { header, content } = await getContentCSVFiles(listFile[0]);
  // console.log({ header, content });
  //
  // let line = content[0];
  //
  // line = line.split(',');
  //
  // console.log({ line });

  console.log({ header });
});
