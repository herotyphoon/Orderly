const express = require("express");

const { rateLimit } = require("../middleware/rateLimit.middleware.js");
const { verifyAuth } = require("../middleware/auth.middleware.js");
const {
  signup,
  setupProfile,
  resendVerification,
  login,
  refresh,
  logout,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/setup-profile", setupProfile);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

router.get("/me", verifyAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
