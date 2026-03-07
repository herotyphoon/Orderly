const crypto = require("crypto");

const generateCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

module.exports = { generateCode };
