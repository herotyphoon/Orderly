const jwt = require("jsonwebtoken");

const ENV = require("../services/constants.service.js");
const { redis } = require("../config/redis.config.js");
const { parseExpiry } = require("../utils/parseExpiry.js");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ENV.JWT_ACCESS_SECRET, {
    expiresIn: parseExpiry(ENV.ACCESS_EXPIRY),
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: parseExpiry(ENV.REFRESH_EXPIRY),
  });
};

const storeRefreshToken = async (userId, token) => {
  await redis.set(`refresh:${userId}`, token, {
    EX: parseExpiry(ENV.REFRESH_EXPIRY),
  });
};

const verifyRefreshToken = async (token) => {
  const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  const stored = await redis.get(`refresh:${payload.userId}`);
  if (stored !== token) throw new Error("Invalid refresh token");
  return payload;
};

const blacklistAccessToken = async (token, ttlSeconds) => {
  await redis.set(`blacklist:${token}`, "1", { EX: ttlSeconds });
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
