const database = require("../Database/usersDatabase");
const bcrypt = require("bcrypt");

async function signin(req, res) {
  let { email, pass } = req.body;
  let user = await database.findOne({ email });
  if (user != null) {
    if (!user.isOnline) {
      let passCompare = await bcrypt.compare(pass, user.pass);
      if (passCompare) {
        res.cookie("login", user.token[0].token, {
          maxAge: 1000 * 60 * 60 * 24 * 90,
          httpOnly: true,
        });
        res.redirect(`/dashboard/${user.uid}/${user.name}`);
      } else {
        req.flash("invalidLoginDetails", "Invalid Login Details");
        res.redirect("/");
      }
    } else if (user.isOnline) {
      req.flash("invalidLoginDetails", "Account already in use");
      res.redirect("/");
    }
  } else {
    req.flash("invalidLoginDetails", "Invalid Login Details");
    res.redirect("/");
  }
}
module.exports = { signin };
