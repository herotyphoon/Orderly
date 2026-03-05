const express = require("express");

const { verifyAuth } = require("../middleware/auth.middleware.js");
const {
  signup,
  setupProfile,
  resendVerification,
  login,
  refresh,
  logout,
  forgotPassword,
  resendResetCode,
  verifyResetCode,
  resetPassword,
} = require("../controllers/auth.controller.js");
const {
  validateSignup,
} = require("../middleware/auth/validateSignup.middleware.js");
const {
  validateLogin,
} = require("../middleware/auth/validateLogin.middleware.js");
const {
  verifyEmailToken,
} = require("../middleware/auth/verifyEmailToken.middleware.js");
const {
  verifyResetCodeMiddleware,
} = require("../middleware/auth/verifyResetCode.middleware.js");
const {
  validatePassword,
} = require("../middleware/auth/validatePassword.middleware.js");

/**
 * @route POST /api/auth
 * @desc Authentication routes
 *
 * Status code reference:
 * 200 - OK
 * 201 - Created
 * 400 - Bad Request
 * 401 - Unauthorized
 * 403 - Forbidden
 * 404 - Not Found
 * 500 - Internal Server Error
 *
 * @access Public (except /me which is private)
 */

const router = express.Router();

// POST /api/auth/signup
// 200 ok | 201 created | 400 bad request
router.post("/signup", validateSignup, signup);

// POST /api/auth/setup-profile
// 200 ok | 400 validation error
router.post("/setup-profile", verifyEmailToken, setupProfile);

// POST /api/auth/resend-verification
// 200 ok | 400 bad request | 429 too many requests
router.post("/resend-verification", resendVerification);

// POST /api/auth/login
// 200 ok | 400 validation error | 401 Invalid Credentials | 403 Email not verified
router.post("/login", validateLogin, login);

// POST /api/auth/refresh
// 200 ok | 401 no or invalid refresh token
router.post("/refresh", refresh);

// POST /api/auth/logout
// 200 ok
router.post("/logout", logout);

// POST /api/auth/forgot-password
// 200 ok | 400 validation error | 429 too many requests
router.post("/forgot-password", forgotPassword);

// POST /api/auth/resend-reset-code
// 200 ok | 400 validation error | 429 too many requests
router.post("/resend-reset-code", resendResetCode);

// POST /api/auth/verify-reset-code
// 200 ok | 400 validation error
router.post("/verify-reset-code", verifyResetCodeMiddleware, verifyResetCode);

// POST /api/auth/reset-password
// 200 ok | 400 validation error
router.post(
  "/reset-password",
  verifyResetCodeMiddleware,
  validatePassword,
  resetPassword,
);

// GET /api/auth/me
// 200 ok | 401 unauthorized
router.get("/me", verifyAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
