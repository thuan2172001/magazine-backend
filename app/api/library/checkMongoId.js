const checkMongoId = (id) => {
  const check = new RegExp('^[0-9a-fA-F]{24}$');

  return check.test(id);
};

module.exports = checkMongoId;
