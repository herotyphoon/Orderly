const ENV = require("../services/constants.service.js");
const { transporter } = require("../config/mail.config.js");

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    name: `"Orderly"`,
    from: ENV.EMAIL_USER,
    to,
    subject,
    html,
  });
};

module.exports = { sendMail };
