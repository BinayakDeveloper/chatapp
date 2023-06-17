const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "banjarajajabar@gmail.com",
    pass: "jxwfezqppffwypty",
  },
});

function sendMails(receiver, htmlCode) {
  const mailOptions = {
    from: "banjarajajabar@gmail.com",
    to: receiver,
    subject: "Reset your password",
    html: htmlCode,
  };
  transport.sendMail(mailOptions);
}

module.exports = { sendMails };
