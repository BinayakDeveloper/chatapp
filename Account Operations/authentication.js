const database = require("../Database/usersDatabase");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({
  path: "./secret.env",
});

async function isLogin(req, res, next) {
  let token = req.cookies.login;
  if (token != undefined) {
    let verify = await jwt.verify(token, process.env.SECRET_KEY);
    let user = await database.findById(verify._id);
    if (user != null) {
      next();
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
}

async function isLogout(req, res, next) {
  let token = req.cookies.login;
  if (token == undefined) {
    next();
  } else {
    let verify = await jwt.verify(token, process.env.SECRET_KEY);
    let user = await database.findById(verify._id);
    if (user != null) {
      res.redirect(`/dashboard/${user.uid}/${user.name}`);
    } else {
      res.redirect("/");
    }
  }
}

module.exports = { isLogin, isLogout };
