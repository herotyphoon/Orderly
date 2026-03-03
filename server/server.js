const ENV = require("./src/services/constants.service.js");
const app = require("./src/app.js");

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
