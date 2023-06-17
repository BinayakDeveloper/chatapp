const database = require("../Database/usersDatabase");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config({
  path: "./secret.env",
});

const signup = async (req, res) => {
  let { name, email, pass } = req.body;
  let sameUser = await database.findOne({ email });
  if (sameUser == null) {
    let existingUsers = await database.find();
    if (existingUsers.length != 0) {
      let encryptedPass = await bcrypt.hash(pass, 10);
      console.log("Entered Not Null");
      let currentUid = existingUsers[existingUsers.length - 1].uid + 1;
      let userData = await database({
        name,
        email,
        pass: encryptedPass,
        uid: currentUid,
      });
      let token = jwt.sign({ _id: userData.id }, process.env.SECRET_KEY);
      userData.token = userData.token.concat({ token });
      let status = await userData.save();
      console.log(status);
      res.redirect("/");
    } else if (existingUsers.length == 0) {
      let encryptedPass = await bcrypt.hash(pass, 10);
      let currentUid = 100;
      let userData = await database({
        name,
        email,
        pass: encryptedPass,
        uid: currentUid,
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
