const nodemailer = require("nodemailer");

const ENV = require("../services/constants.service.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});

const verifyMailTransport = async () => {
  await transporter.verify();
};

module.exports = { transporter, verifyMailTransport };
