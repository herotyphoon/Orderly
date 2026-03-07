const ensurePasswordStrength = (password) => {
  if (typeof password !== "string") return ["a valid password string"];
  const errors = [];
  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("a number");

  return errors;
};

module.exports = { ensurePasswordStrength };
