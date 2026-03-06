const { conn } = require("../../config/db.config.js");
const bcrypt = require("bcrypt");

/**
 * Middleware: verifyResetCodeMiddleware
 *
 * Verifies the password reset code in the request body.
 * - Email and code must be present.
 * - Code must be valid and not expired.
 *
 * Error Handling:
 * - 400 Bad Request: Missing email or code, or invalid/expired code.
 *
 * Note: This middleware should be used on the POST /api/auth/reset-password route before the reset controller.
 */
const verifyResetCodeMiddleware = async (req, res, next) => {
  try {
    const { email: rawEmail, code: rawCode } = req.body ?? {};
    const email =
      typeof rawEmail === "string" ? rawEmail.toLowerCase().trim() : "";
    const code = typeof rawCode === "string" ? rawCode.trim() : "";

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await conn.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (!user.rows.length) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const userId = user.rows[0].id;

    const record = await conn.query(
      `SELECT code_hash, expires_at FROM password_reset_codes
         WHERE user_id = $1
         ORDER BY expires_at DESC
         LIMIT 1`,
      [userId],
    );
    if (!record.rows.length) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const { code_hash, expires_at } = record.rows[0];

    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const valid = await bcrypt.compare(String(code), code_hash);
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    req.resetUserId = userId;
    req.body.email = email;
    next();
  } catch (err) {
    console.error("VERIFY RESET CODE MIDDLEWARE ERROR:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  verifyResetCodeMiddleware,
};
