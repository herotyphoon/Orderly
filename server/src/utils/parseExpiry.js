const parseExpiry = (expiry) => {
  if (typeof expiry !== "string") return 7 * 24 * 60 * 60;
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60;
  const [, num, unit] = match;
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
  return parseInt(num) * multipliers[unit];
};

module.exports = { parseExpiry };
