const ENV = require("./src/services/constants.service.js");
const app = require("./src/app.js");
const { verifyMailTransport } = require("./src/config/mail.config.js");
const { connectRedis } = require("./src/config/redis.config.js");

const PORT = ENV.PORT;

verifyMailTransport();
connectRedis();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
