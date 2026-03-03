const { createClient } = require("redis");

const ENV = require("../services/constants.service.js");

const client = createClient({
  url: ENV.REDIS_URL,
});

client.connect().catch(console.error);

module.exports = { redis: client };
