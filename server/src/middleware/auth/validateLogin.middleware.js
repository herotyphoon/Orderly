/**
 * Middleware: validateLogin
 *
 * Validates the email and password fields in the login request body.
 * - Email must be present, properly formatted, and is normalized to lowercase.
 * - Password must be present.
 *
 * Error Handling:
 * - 400 Bad Request: Missing email or password.
 * - 401 Unauthorized: Invalid email format (to prevent user enumeration).
 *
 * Note: This middleware should be used on the POST /api/auth/login route before the login controller.
 */

const validateLogin = (req, res, next) => {
  const email = req.body.email?.toLowerCase().trim();
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.body.email = email;
  next();
};

module.exports = {
  validateLogin,
};
