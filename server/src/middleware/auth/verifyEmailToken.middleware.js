const jwt = require("jsonwebtoken");
const ENV = require("../../services/constants.service.js");

/**
 * Middleware: verifyEmailToken
 *
 * Verifies the email verification token in the request body.
 * - Token must be present.
 * - Token must be valid and not expired.
 *
 * Error Handling:
 * - 400 Bad Request: Missing or invalid token.
 * - 400 Bad Request: Expired verification link.
 *
 * Note: This middleware should be used on the POST /api/auth/verify-email route before the verification controller.
 */

const verifyEmailToken = (req, res, next) => {
  const token =
    typeof (req.body ?? {}).token === "string" ? req.body.token.trim() : "";

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_EMAIL_SECRET);

    if (!decoded.userId || !decoded.type) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    req.emailUser = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Verification link has expired. Please request a new one.",
      });
    }
    return res.status(400).json({ message: "Invalid verification token" });
  }
};

module.exports = {
  verifyEmailToken,
};
