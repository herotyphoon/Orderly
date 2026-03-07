const {
  ensurePasswordStrength,
} = require("../../utils/ensurePasswordStrength.js");

/**
 * Middleware: validatePassword
 *
 * Validates the password field in the request body.
 * - Password must be present.
 * - Password must meet certain complexity requirements.
 *
 * Error Handling:
 * - 400 Bad Request: Missing password or password does not meet complexity requirements.
 *
 * Note: This middleware should be used on the POST /api/auth/reset-password route before the resetPassword controller.
 */

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const errors = ensurePasswordStrength(password);

  if (errors.length) {
    return res.status(400).json({
      message: `Password must contain: ${errors.join(", ")}.`,
    });
  }

  next();
};

module.exports = {
  validatePassword,
};
