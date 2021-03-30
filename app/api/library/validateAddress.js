const validateAddress = (args = {}) => {
  const {
    address, city, district, state,
  } = args;

  if (!address) throw new Error('FIND.ERROR.ADDRESS_INVALID');
  if (!city) throw new Error('FIND.ERROR.CITY_INVALID');
  if (!district) throw new Error('FIND.ERROR.DISTRICT_INVALID');
  if (!state) throw new Error('FIND.ERROR.STATE_INVALID');
  return args;
};

module.exports = validateAddress;
