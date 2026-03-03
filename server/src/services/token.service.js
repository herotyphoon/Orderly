const jwt = require("jsonwebtoken");

const ENV = require("../services/constants.service.js");
const { redis } = require("../config/redis.config.js");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.ACCESS_EXPIRY,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.REFRESH_EXPIRY,
  });
};

const storeRefreshToken = async (userId, token) => {
  await redis.set(`refresh:${userId}`, token, {
    EX: 7 * 24 * 60 * 60,
  });
};

const verifyRefreshToken = async (token) => {
  const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  const stored = await redis.get(`refresh:${payload.userId}`);
  if (stored !== token) throw new Error("Invalid refresh token");
  return payload;
};

const blacklistAccessToken = async (token, exp) => {
  await redis.set(`blacklist:${token}`, "1", { EX: exp });
};

const isBlacklisted = async (token) => {
  return await redis.exists(`blacklist:${token}`);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
  blacklistAccessToken,
  isBlacklisted,
};
