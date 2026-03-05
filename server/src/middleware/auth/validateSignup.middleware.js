/**
 * Middleware: validateSignup
 *
 * Validates the email and password fields in the signup request body.
 * - Email must be present, properly formatted, and is normalized to lowercase.
 * - Password must be present and meet certain complexity requirements.
 *
 * Error Handling:
 * - 400 Bad Request: Missing email or password, or invalid email format.
 * - 400 Bad Request: Password does not meet complexity requirements.
 *
 * Note: This middleware should be used on the POST /api/auth/register route before the registration controller.
 */

const validateSignup = (req, res, next) => {
  const email = req.body.email?.toLowerCase().trim();
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const errors = [];
  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("a number");

  if (errors.length) {
    return res.status(400).json({
      message: `Password must contain: ${errors.join(", ")}.`,
    });
  }

  req.body.email = email;
  next();
};

module.exports = {
  validateSignup,
};
