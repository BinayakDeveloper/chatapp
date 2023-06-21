const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config({
  path: "/secret.env",
});

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "banjarajajabar@gmail.com",
    pass: process.env.APP_PASS,
  },
});

function sendMails(receiver, htmlCode) {
  console.log(process.env.APP_PASS);
  const mailOptions = {
    from: "banjarajajabar@gmail.com",
    to: receiver,
    subject: "Reset your password",
    html: htmlCode,
  };
  transport.sendMail(mailOptions);
}

module.exports = { sendMails };
