const ENV = require("../services/constants.service.js");
const { transporter } = require("../config/mail.config.js");

const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Orderly"`,
    to,
    subject,
    html,
  });
};

module.exports = { sendMail };
