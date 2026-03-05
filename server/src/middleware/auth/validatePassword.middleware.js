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
 * Note: This middleware should be used on the POST /api/auth/register route before the registration controller.
 */

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const errors = [];
  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("a number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("a special character");

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
