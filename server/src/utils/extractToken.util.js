const jwt = require("jsonwebtoken");

const ENV = require("../services/constants.service.js");

const extractToken = (req) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    const err = new Error("No token provided");
    err.code = "NO_TOKEN";
    throw err;
  }

  const payload = jwt.verify(token, ENV.JWT_ACCESS_SECRET);

  if (!payload?.userId || typeof payload.userId !== "string") {
    const err = new Error("Malformed token payload");
    err.code = "BAD_PAYLOAD";
    throw err;
  }

  return payload;
};

module.exports = { extractToken };
