const jwt = require("jsonwebtoken");

const ENV = require("../services/constants.service.js");
const { isBlacklisted } = require("../services/token.service.js");

const checkAuth = (req, res, next) => {
  const token = req.cookies?.__sessionID;

  if (token) {
    try {
      req.user = getUserFromToken(token);
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  return next();
};

const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const blacklisted = await isBlacklisted(token);
    if (blacklisted) return res.status(401).json({ message: "Invalid token" });

    const user = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { checkAuth, verifyAuth };
