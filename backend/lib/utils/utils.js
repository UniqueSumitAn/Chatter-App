const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign({ id: payload }, `${process.env.JWTSECRET}`);
};

module.exports = generateToken;
