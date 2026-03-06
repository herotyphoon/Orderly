const ENV = require("./src/services/constants.service.js");
const app = require("./src/app.js");
const { verifyMailTransport } = require("./src/config/mail.config.js");
const { connectRedis } = require("./src/config/redis.config.js");

const PORT = ENV.PORT;

const start = async () => {
  try {
    await connectRedis();
    await verifyMailTransport();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
