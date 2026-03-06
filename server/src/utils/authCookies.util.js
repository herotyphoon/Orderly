const ENV = require("../services/constants.service.js");

const setAuthCookies = (res, accessToken, refreshToken, COOKIE_BASE) => {
  res.cookie("accessToken", accessToken, {
    ...COOKIE_BASE,
    maxAge: ENV.ACCESS_EXPIRY,
  });
  res.cookie("refreshToken", refreshToken, {
    ...COOKIE_BASE,
    maxAge: ENV.REFRESH_EXPIRY,
  });
};

const clearAuthCookies = (res, COOKIE_BASE) => {
  res.clearCookie("accessToken", COOKIE_BASE);
  res.clearCookie("refreshToken", COOKIE_BASE);
};

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};
