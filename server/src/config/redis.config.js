const { createClient } = require("redis");

const ENV = require("../services/constants.service.js");

const client = createClient({
  url: ENV.REDIS_URL,
});

client.on("error", (err) => {
  console.error("Redis client error:", err);
});

const connectRedis = async () => {
  await client.connect();
};

module.exports = { redis: client, connectRedis };
