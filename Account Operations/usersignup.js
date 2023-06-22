const database = require("../Database/usersDatabase");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config({
  path: "./secret.env",
});

const signup = async (req, res) => {
  let { name, email, pass } = req.body;
  const colorCodes = [
    "#728FCE",
    "#fff",
    "#E6E6FA",
    "#43C6DB",
    "#E2F516",
    "#FFD700",
    "#E799A3",
  ];
  let sameUser = await database.findOne({ email });
  if (sameUser == null) {
    let existingUsers = await database.find();
    let userColorCode =
      colorCodes[Math.floor(Math.random() * colorCodes.length)];
    if (existingUsers.length != 0) {
      let encryptedPass = await bcrypt.hash(pass, 10);
      let currentUid =
        Number.parseInt(existingUsers[existingUsers.length - 1].uid) + 1;
      let userData = await database({
        name,
        email,
        pass: encryptedPass,
        colorCode: userColorCode,
        onlineStatus: "Online",
        uid: currentUid,
        isOnline: false,
      });
      let token = jwt.sign({ _id: userData.id }, process.env.SECRET_KEY);
      userData.token = userData.token.concat({ token });
      await userData.save();
      res.redirect("/");
    } else if (existingUsers.length == 0) {
      let encryptedPass = await bcrypt.hash(pass, 10);
      let currentUid = 100;
      let userColorCode =
        colorCodes[Math.floor(Math.random() * colorCodes.length)];
      let userData = await database({
        name,
        email,
        pass: encryptedPass,
        colorCode: userColorCode,
        onlineStatus: "Online",
        uid: currentUid,
        isOnline: false,
      });
      let token = jwt.sign({ _id: userData.id }, process.env.SECRET_KEY);
      userData.token = userData.token.concat({ token });
      await userData.save();
      res.redirect("/");
    }
  } else if (sameUser != null) {
    req.flash("sameuser", "User already exists");
    res.redirect("/register");
  }
};

module.exports = { signup };
