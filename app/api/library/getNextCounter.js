const Counter = require('../../models/counter');

const pad = '0000000';
async function getNextSequence(name) {
  const ret = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true },
  );
  // if (!ret) {
  //   const newRet = new Counter({
  //     name,
  //     seq: 1,
  //   });
  //   const savedRet = await newRet.save();
  //   const codeString = pad.substring(0, pad.length - savedRet.seq.toString().length) + savedRet.seq.toString();
  //   return codeString;
  // }
  const codeString = pad.substring(0, pad.length - ret.seq.toString().length) + ret.seq.toString();
  return codeString;
}
module.exports = {
  getNextSequence,
};
