const jwt = require("jsonwebtoken");
const database = require("../Database/usersDatabase");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const path = require("path");
const publicPath = path.join(path.resolve(), "public");
const { sendMails } = require("../nodemailer/nodemailer");

dotenv.config({
  path: "./secret.env",
});

async function forgotPassGenLink(req, res) {
  let { email } = req.body;
  let user = await database.findOne({ email });
  if (user != null) {
    let jwtSecret = process.env.SECRET_KEY;
    let secret = jwtSecret + user.pass.slice(0, 30);

    let payload = {
      email: user.email,
      id: user._id,
    };

    let token = await jwt.sign(payload, secret, {
      expiresIn: "15m",
    });

    let tempLink = `https://bichat.onrender.com/forgot/${user._id}/${token}`;
    console.log(tempLink);

    req.flash("invalidUser", "Mail sent...");
    res.redirect("/forgot");
  } else {
    req.flash("invalidUser", "Invalid Email");
    res.redirect("/forgot");
  }
}

async function tokenValidate(req, res) {
  let { id, token } = req.params;
  let user = await database.findById(id);
  let secret = process.env.SECRET_KEY + user.pass.slice(0, 30);
  try {
    let verify = await jwt.verify(token, secret);
    res.render(publicPath + "/EJS/changePass.ejs", { id: id, token: token });
  } catch (error) {
    res.render(publicPath + "/EJS/tokenExpired.ejs");
  }
}

async function updatePass(req, res) {
  let { id, token } = req.params;
  let { newpass } = req.body;
  let encryptPass = await bcrypt.hash(newpass, 10);
  let user = await database.findById(id);
  let secret = process.env.SECRET_KEY + user.pass.slice(0, 30);
  try {
    let verify = await jwt.verify(token, secret);
    await database.findByIdAndUpdate(verify.id, {
      $set: { pass: encryptPass },
    });
    res.render(publicPath + "/EJS/changeSuccess.ejs");
  } catch (error) {
    res.send("Token Expired");
  }
}

module.exports = { forgotPassGenLink, updatePass, tokenValidate };
