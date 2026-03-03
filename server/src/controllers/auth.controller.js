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

const signup = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, ENV.SALT_ROUNDS);

  const user = await conn.query(
    "INSERT INTO users (email, password_hash) VALUES ($1,$2) RETURNING *",
    [email, hashed],
  );

  const emailToken = jwt.sign(
    { userId: user.rows[0].id, type: "profile_setup" },
    ENV.JWT_EMAIL_SECRET,
    { expiresIn: "1h" },
  );

  const verifyLink = `${ENV.FRONTEND_URL}/setup-profile?token=${encodeURIComponent(emailToken)}`;

  const mail = verificationEmailHTML(verifyLink);

  await sendMail(email, "Welcome to Orderly", mail);

  res.json({
    message: "Signup successful. Check email.",
    email: user.rows[0].email,
  });
};

const setupProfile = async (req, res) => {
  try {
    const { token, fullName } = req.body;
    console.log("Received token:", token);

    const decoded = jwt.verify(token, ENV.JWT_EMAIL_SECRET);

    if (decoded.type !== "profile_setup")
      return res.status(400).json({ message: "Invalid token" });

    await conn.query(
      "UPDATE users SET full_name = $1, is_profile_complete = true, is_email_verified = true WHERE id = $2",
      [fullName, decoded.userId],
    );

    const accessToken = generateAccessToken(decoded.userId);
    const refreshToken = generateRefreshToken(decoded.userId);

    await storeRefreshToken(decoded.userId, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Profile setup complete" });
  } catch {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    const userResult = await conn.query(
      "SELECT id, is_email_verified FROM users WHERE email = $1",
      [email],
    );

    if (!userResult.rows.length) {
      return res.json({
        message: "If this email exists, a verification link has been sent.",
      });
    }

    const user = userResult.rows[0];

    if (user.is_email_verified) {
      return res.json({
        message: "If this email exists, a verification link has been sent.",
      });
    }

    const key = `resend:${user.id}`;
    const exists = await redis.exists(key);

    if (exists) {
      return res.json({
        message: "If this email exists, a verification link has been sent.",
      });
    }

    await redis.set(key, "1", { EX: 60 });

    const emailToken = jwt.sign(
      { userId: user.id, type: "profile_setup" },
      ENV.JWT_EMAIL_SECRET,
      { expiresIn: "1h" },
    );
    console.log("Generated email token for resend:", emailToken);

    const verifyLink = `${ENV.FRONTEND_URL}/setup-profile?token=${encodeURIComponent(emailToken)}`;

    const html = verificationEmailHTML(verifyLink);

    await sendMail(email, "Welcome to Orderly", html);

    return res.json({
      message: "If this email exists, a verification link has been sent.",
    });
  } catch (err) {
    console.error("RESEND ERROR:", err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await conn.query("SELECT * FROM users WHERE email=$1", [email]);

  if (!user.rows.length)
    return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.rows[0].password_hash);

  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.rows[0].is_email_verified)
    return res.status(403).json({ message: "Email not verified" });

  const accessToken = generateAccessToken(user.rows[0].id);
  const refreshToken = generateRefreshToken(user.rows[0].id);

  await storeRefreshToken(user.rows[0].id, refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Logged in" });
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = await verifyRefreshToken(token);

    const newAccess = generateAccessToken(payload.userId);
    const newRefresh = generateRefreshToken(payload.userId);

    await storeRefreshToken(payload.userId, newRefresh);

    res.cookie("accessToken", newAccess, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Refreshed" });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const payload = jwt.decode(token);
    if (payload?.userId) await redis.del(`refresh:${payload.userId}`);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const key = `forgot:${email}`;
    const exists = await redis.exists(key);

    if (exists) {
      return res.json({
        message: "If this email exists, a reset code has already been sent.",
      });
    }

    await redis.set(key, "1", { EX: 60 });

    const user = await conn.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);

    if (!user.rows.length) {
      return res.json({
        message: "If this email exists, a reset code has been sent.",
      });
    }

    const userId = user.rows[0].id;

    const code = generateCode();
    const hashedCode = await bcrypt.hash(code, 10);

    await conn.query("DELETE FROM password_reset_codes WHERE user_id=$1", [
      userId,
    ]);

    await conn.query(
      `INSERT INTO password_reset_codes 
         (user_id, code_hash, expires_at) 
         VALUES ($1,$2, now() + interval '10 minutes')`,
      [userId, hashedCode],
    );

    await sendMail(
      email,
      "Orderly - Password Reset Code",
      forgotPasswordEmailHTML(code),
    );

    return res.json({
      message: "If this email exists, a reset code has been sent.",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const code = req.body.code?.trim();

    if (!email || !code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const user = await conn.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);

    if (!user.rows.length) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const userId = user.rows[0].id;

    const record = await conn.query(
      `SELECT * FROM password_reset_codes 
         WHERE user_id=$1 
         ORDER BY expires_at DESC 
         LIMIT 1`,
      [userId],
    );

    if (!record.rows.length) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const hashedCode = record.rows[0].code_hash;
    const expiresAt = new Date(record.rows[0].expires_at);

    const valid = await bcrypt.compare(String(code), hashedCode);

    if (!valid || new Date() > expiresAt) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    return res.json({ message: "Code verified" });
  } catch (err) {
    console.error("VERIFY CODE ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const code = req.body.code?.trim();
    const password = req.body.password;

    if (!email || !code || !password) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = await conn.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);

    if (!user.rows.length) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const userId = user.rows[0].id;

    const record = await conn.query(
      `SELECT * FROM password_reset_codes 
         WHERE user_id=$1 
         ORDER BY expires_at DESC 
         LIMIT 1`,
      [userId],
    );

    if (!record.rows.length) {
      return res.status(400).json({ message: "Invalid code" });
    }

    const hashedCode = record.rows[0].code_hash;
    const expiresAt = new Date(record.rows[0].expires_at);

    const valid = await bcrypt.compare(String(code), hashedCode);

    if (!valid || new Date() > expiresAt) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await conn.query("UPDATE users SET password_hash=$1 WHERE id=$2", [
      hashedPassword,
      userId,
    ]);

    await conn.query("DELETE FROM password_reset_codes WHERE user_id=$1", [
      userId,
    ]);

    return res.json({ message: "Password reset successful" });
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
  verifyResetCode,
  resetPassword,
};
