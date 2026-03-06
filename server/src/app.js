const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const ENV = require("./services/constants.service.js");
const authRoutes = require("./routes/auth.routes.js");
const { checkAuth } = require("./middleware/auth.middleware.js");

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
