const { conn } = require("../config/db.config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { redis } = require("../config/redis.config.js");
const { generateCode } = require("../utils/generateCode.utils.js");
const ENV = require("../services/constants.service.js");
const { sendMail } = require("../services/email.service.js");
const {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
} = require("../services/token.service.js");
const {
  verificationEmailHTML,
  forgotPasswordEmailHTML,
} = require("../utils/emailHTML.js");
const {
  setAuthCookies,
  clearAuthCookies,
} = require("../utils/authCookies.util.js");

const COOKIE_BASE = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "production",
  sameSite: "strict",
};

/**
 * @desc Create a new user account and send verification email
 * @route POST /api/auth/signup
 * @access Public
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 *
 * @returns {200} Signup successful message  -> { message, email }
 * @returns {201} User created message       -> { message, email }
 * @returns {400} Validation error           -> { message }
 * @returns {500} Server error               -> { message }
 */

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await conn.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length) {
      return res.status(200).json({
        message: "Signup successful. Check email.",
        email,
      });
    }

    const hashed = await bcrypt.hash(password, ENV.SALT_ROUNDS);

    let userId;
    try {
      const user = await conn.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
        [email, hashed],
      );
      userId = user.rows[0].id;
    } catch (dbErr) {
      if (dbErr.code === "23505") {
        return res
          .status(200)
          .json({ message: "Signup successful. Check email." });
      }
      throw dbErr;
    }

    const emailToken = jwt.sign(
      { userId, type: "profile_setup" },
      ENV.JWT_EMAIL_SECRET,
      { expiresIn: "1h" },
    );

    const verifyLink = `${ENV.FRONTEND_URL}/setup-profile?token=${encodeURIComponent(emailToken)}`;

    try {
      await sendMail(
        email,
        "Welcome to Orderly",
        verificationEmailHTML(verifyLink),
      );
    } catch (mailErr) {
      console.error("SIGNUP MAIL ERROR:", mailErr);
    }

    return res.status(201).json({
      message: "Signup successful. Check email.",
      email,
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @desc Set up user profile after email verification
 * @route POST /api/auth/setup-profile
 * @access Public
 *
 * @param {string} fullName - User's full name
 *
 * @returns {200} Profile setup successful message -> { message }
 * @returns {400} Validation error                 -> { message }
 * @returns {500} Server error                     -> { message }
 */

const setupProfile = async (req, res) => {
  try {
    const { userId, type } = req.emailUser;
    const fullName = req.body.fullName?.trim();

    if (type !== "profile_setup") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    if (!fullName || fullName.length < 2 || fullName.length > 100) {
      return res.status(400).json({
        message: "Full name must be between 2 and 100 characters",
      });
    }

    const safeName = fullName.replace(/[\x00-\x1F\x7F]/g, "").trim();
    if (!safeName) {
      return res.status(400).json({ message: "Invalid full name" });
    }

    const userCheck = await conn.query(
      "SELECT id, is_email_verified FROM users WHERE id = $1",
      [userId],
    );
    if (!userCheck.rows.length) {
      return res.status(400).json({ message: "User not found" });
    }
    if (userCheck.rows[0].is_email_verified) {
      return res
        .status(409)
        .json({ message: "Profile already set up. Please log in." });
    }

    await conn.query(
      "UPDATE users SET full_name = $1, is_profile_complete = true, is_email_verified = true WHERE id = $2",
      [safeName, userId],
    );

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    await storeRefreshToken(userId, refreshToken);

    setAuthCookies(res, accessToken, refreshToken, COOKIE_BASE);

    return res.status(200).json({ message: "Profile setup complete" });
  } catch (err) {
    console.error("SETUP PROFILE ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @desc Resend email verification link
 * @route POST /api/auth/resend-verification
 * @access Public
 *
 * @param {string} email - User's email address
 *
 * @returns {200} Resend successful message  -> { message, email }
 * @returns {400} Validation error           -> { message }
 * @returns {429} Too many requests          -> { message }
 * @returns {500} Server error               -> { message }
 */

const resendVerification = async (req, res) => {
  const SAFE_MSG = "If this email exists, a verification link has been sent.";

  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) return res.status(400).json({ message: "Email is required" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const userResult = await conn.query(
      "SELECT id, is_email_verified FROM users WHERE email = $1",
      [email],
    );

    if (!userResult.rows.length || userResult.rows[0].is_email_verified) {
      return res.status(200).json({ message: SAFE_MSG, email });
    }

    const user = userResult.rows[0];

    const key = `resend:${user.id}`;

    const ttl = await redis.ttl(key);

    if (ttl > 0) {
      return res.status(429).json({
        message: `Please wait ${ttl} seconds before requesting another link.`,
        ttl,
      });
    }

    await redis.set(key, "1", { EX: 60 });

    const emailToken = jwt.sign(
      {
        userId: user.id,
        type: "profile_setup",
      },
      ENV.JWT_EMAIL_SECRET,
      { expiresIn: "1h" },
    );

    const verifyLink = `${ENV.FRONTEND_URL}/setup-profile?token=${encodeURIComponent(emailToken)}`;

    try {
      await sendMail(
        email,
        "Verify your Orderly account",
        verificationEmailHTML(verifyLink),
      );
    } catch (mailErr) {
      console.error("MAIL ERROR:", mailErr);

      await redis.del(key);

      return res.status(500).json({
        message: "Failed to send email. Please try again.",
      });
    }

    return res.status(200).json({ message: SAFE_MSG });
  } catch (err) {
    console.error("RESEND ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/**
 * @desc Log in a user
 * @route POST /api/auth/login
 * @access Public
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 *
 * @returns {200} Login successful message   -> { message }
 * @returns {400} Validation error           -> { message }
 * @returns {401} Invalid credentials        -> { message }
 * @returns {403} Email not verified         -> { message }
 * @returns {500} Server error               -> { message }
 */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const result = await conn.query(
      "SELECT id, password_hash, is_email_verified, is_profile_complete FROM users WHERE email = $1",
      [email],
    );

    const dummyHash =
      "$2b$12$invalidhashforunknownuserlookup000000000000000000000";
    const storedHash = result.rows[0]?.password_hash ?? dummyHash;
    const valid = await bcrypt.compare(password, storedHash);

    if (!result.rows.length || !valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    if (!user.is_email_verified) {
      return res.status(403).json({
        message:
          "Email not verified. Please check your inbox or request a new link.",
      });
    }

    if (!user.is_profile_complete) {
      return res.status(403).json({
        message:
          "Profile setup incomplete. Please check your email to finish setup.",
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await storeRefreshToken(user.id, refreshToken);

    setAuthCookies(res, accessToken, refreshToken, COOKIE_BASE);

    return res.status(200).json({ message: "Logged in" });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @desc Refresh user tokens
 * @route POST /api/auth/refresh
 * @access Public
 *
 * @params None (relies on refresh token cookie)
 *
 * @returns {200} Refresh successful message  -> { message }
 * @returns {401} No or invalid token         -> { message }
 * @returns {500} Server error                -> { message }
 */

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    let payload;
    try {
      payload = await verifyRefreshToken(token);
    } catch (err) {
      clearAuthCookies(res, COOKIE_BASE);
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    if (!payload?.userId) {
      clearAuthCookies(res, COOKIE_BASE);
      return res.status(401).json({ message: "Malformed token payload" });
    }

    const newAccess = generateAccessToken(payload.userId);
    const newRefresh = generateRefreshToken(payload.userId);
    await storeRefreshToken(payload.userId, newRefresh);

    setAuthCookies(res, newAccess, newRefresh, COOKIE_BASE);

    return res.status(200).json({ message: "Refreshed" });
  } catch (err) {
    console.error("REFRESH ERROR:", err);
    clearAuthCookies(res, COOKIE_BASE);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @desc Log out a user
 * @route POST /api/auth/logout
 * @access Public
 *
 * @params None (relies on refresh token cookie)
 *
 * @returns {200} Logout successful message  -> { message }
 * @returns {500} Server error               -> { message }
 */

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      let payload;
      payload = jwt.decode(token);

      if (payload?.userId) {
        redis
          .del(`refresh:${payload.userId}`)
          .catch((err) => console.error("LOGOUT REDIS DEL ERROR:", err));
      }
    }

    clearAuthCookies(res, COOKIE_BASE);
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    clearAuthCookies(res, COOKIE_BASE);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @desc Initiate forgot password flow by sending reset code
 * @route POST /api/auth/forgot-password
 * @access Public
 *
 * @param {string} email - User's email address
 *
 * @returns {200} Forgot password initiated message -> { message }
 * @returns {400} Validation error                  -> { message }
 * @returns {429} Too many requests                 -> { message }
 * @returns {500} Server error                      -> { message }
 */

const forgotPassword = async (req, res) => {
  const SAFE_MSG = "If this email exists, a reset code has been sent.";

  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const key = `forgot:${email}`;
    const ttl = await redis.ttl(key);

    if (ttl > 0) {
      return res.status(429).json({
        message: `Please wait ${ttl} seconds before requesting another reset code.`,
      });
    }

    await redis.set(key, "1", { EX: 60 });

    const user = await conn.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (!user.rows.length) {
      await new Promise((r) => setTimeout(r, 200));
      return res.status(200).json({ message: SAFE_MSG });
    }

    const userId = user.rows[0].id;
    const code = generateCode();
    const hashedCode = await bcrypt.hash(code, 10);
    await conn.query("BEGIN");
    try {
      await conn.query("DELETE FROM password_reset_codes WHERE user_id = $1", [
        userId,
      ]);
      await conn.query(
        `INSERT INTO password_reset_codes (user_id, code_hash, expires_at)
         VALUES ($1, $2, now() + interval '10 minutes')`,
        [userId, hashedCode],
      );
      await conn.query("COMMIT");
    } catch (txErr) {
      await conn.query("ROLLBACK");
      throw txErr;
    }

    try {
      await sendMail(
        email,
        "Orderly - Password Reset Code",
        forgotPasswordEmailHTML(code),
      );
    } catch (mailErr) {
      console.error("FORGOT PASSWORD MAIL ERROR:", mailErr);
      await redis.del(key);
      return res
        .status(500)
        .json({ message: "Failed to send reset code. Please try again." });
    }

    return res.status(200).json({ message: SAFE_MSG });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @desc Resend password reset code
 * @route POST /api/auth/resend-reset-code
 * @access Public
 *
 * @param {string} email - User's email address
 *
 * @returns {200} Reset code resent message -> { message }
 * @returns {400} Validation error                -> { message }
 * @returns {429} Too many requests               -> { message }
 * @returns {500} Server error                  -> { message }
 */

const resendResetCode = async (req, res) => {
  const SAFE_MSG = "If this email exists, a new reset code has been sent.";

  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const key = `forgot:${email}`;
    const ttl = await redis.ttl(key);

    if (ttl > 0) {
      return res.status(429).json({
        message: `Please wait ${ttl} seconds before requesting another code.`,
        retryAfter: ttl,
      });
    }

    await redis.set(key, "1", { EX: 60 });

    const user = await conn.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (!user.rows.length) {
      await new Promise((r) => setTimeout(r, 200));
      return res.status(200).json({ message: SAFE_MSG });
    }

    const userId = user.rows[0].id;

    const existing = await conn.query(
      "SELECT id FROM password_reset_codes WHERE user_id = $1",
      [userId],
    );
    if (!existing.rows.length) {
      await new Promise((r) => setTimeout(r, 200));
      return res.status(200).json({ message: SAFE_MSG });
    }

    const code = generateCode();
    const hashedCode = await bcrypt.hash(code, 10);

    await conn.query("BEGIN");
    try {
      await conn.query("DELETE FROM password_reset_codes WHERE user_id = $1", [
        userId,
      ]);
      await conn.query(
        `INSERT INTO password_reset_codes (user_id, code_hash, expires_at)
         VALUES ($1, $2, now() + interval '10 minutes')`,
        [userId, hashedCode],
      );
      await conn.query("COMMIT");
    } catch (txErr) {
      await conn.query("ROLLBACK");
      throw txErr;
    }

    try {
      await sendMail(
        email,
        "Orderly - New Password Reset Code",
        forgotPasswordEmailHTML(code),
      );
    } catch (mailErr) {
      console.error("RESEND RESET CODE MAIL ERROR:", mailErr);
      await redis.del(key);
      return res.status(500).json({
        message: "Failed to send code. Please try again.",
      });
    }

    return res.status(200).json({ message: SAFE_MSG });
  } catch (err) {
    console.error("RESEND RESET CODE ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @desc Verify password reset code
 * @route POST /api/auth/verify-reset-code
 * @access Public
 *
 * @param {string} email - User's email address
 * @param {string} code - Reset code
 *
 * @returns {200} Code verified message           -> { message }
 * @returns {400} Validation error                -> { message }
 * @returns {500} Server error                    -> { message }
 */

const verifyResetCode = (req, res) => {
  if (!req.resetUserId) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }
  return res.status(200).json({ message: "Code verified" });
};

/**
 * @desc Reset user password after verifying reset code
 * @route POST /api/auth/reset-password
 * @access Public
 *
 * @param {string} email - User's email address
 * @param {string} code - Reset code
 * @param {string} password - New password
 *
 * @returns {200} Password reset successful message -> { message }
 * @returns {400} Validation error                  -> { message }
 * @returns {500} Server error                      -> { message }
 */

const resetPassword = async (req, res) => {
  try {
    const userId = req.resetUserId;
    const { password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await conn.query("BEGIN");
    try {
      await conn.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
        hashedPassword,
        userId,
      ]);
      await conn.query("DELETE FROM password_reset_codes WHERE user_id = $1", [
        userId,
      ]);
      await conn.query("COMMIT");
    } catch (txErr) {
      await conn.query("ROLLBACK");
      throw txErr;
    }

    try {
      await redis.del(`refresh:${userId}`);
    } catch (redisErr) {
      console.error("RESET PASSWORD REDIS DEL ERROR:", redisErr);
    }

    clearAuthCookies(res, COOKIE_BASE);

    return res
      .status(200)
      .json({ message: "Password reset successful. Please log in again." });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
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
};
