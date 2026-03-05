const setAuthCookies = (res, accessToken, refreshToken, COOKIE_BASE) => {
  res.cookie("accessToken", accessToken, {
    ...COOKIE_BASE,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...COOKIE_BASE,
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
