const { isBlacklisted } = require("../services/token.service.js");
const { extractToken } = require("../utils/extractToken.util.js");

/**
 * Middleware: checkAuth
 *
 * This is useful for routes that can be accessed by both authenticated and unauthenticated users,
 * allowing the route handler to decide how to handle the presence or absence of req.user.
 * Instead, it sets req.user to null and allows the request to proceed.
 */

const checkAuth = (req, res, next) => {
  try {
    req.user = extractToken(req);
  } catch {
    req.user = null;
  }

  return next();
};

/**
 * Middleware: verifyAuth
 *
 * Checks for a valid JWT access token in the Authorization header or cookies.
 * If valid, attaches the decoded user info to req.user and calls next().
 * If invalid or missing, responds with 401 Unauthorized.
 */

const verifyAuth = async (req, res, next) => {
  let payload;

  try {
    payload = extractToken(req);
  } catch (err) {
    if (err.code === "NO_TOKEN") {
      return res.status(401).json({ message: "No token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = req.cookies.accessToken;
    const revoked = await isBlacklisted(token);
    if (revoked) {
      return res.status(401).json({ message: "Token revoked" });
    }
  } catch (err) {
    console.error("AUTH BLACKLIST CHECK ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }

  req.user = payload;
  return next();
};

module.exports = { checkAuth, verifyAuth };
