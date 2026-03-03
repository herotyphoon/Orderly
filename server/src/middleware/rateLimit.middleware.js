const { RateLimiterRedis } = require("rate-limiter-flexible");

const { redis } = require("../config/redis.config.js");
const ENV = require("../services/constants.service.js");

const limiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl",
  points: ENV.NODE_ENV === "production" ? 10 : 100,
  duration: 60,
});

const rateLimit = async (req, res, next) => {
  try {
    await limiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ message: "Too many requests" });
  }
};

module.exports = { rateLimit };
