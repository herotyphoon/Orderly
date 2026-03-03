const nodemailer = require("nodemailer");

const ENV = require("../services/constants.service.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

module.exports = { transporter };
