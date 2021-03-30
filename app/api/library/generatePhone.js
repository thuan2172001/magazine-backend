const RandExp = require('randexp');

const randomPhone = () => new RandExp(/^09[0-9]{8}$/).gen();

module.exports = randomPhone;
