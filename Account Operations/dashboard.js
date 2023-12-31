const database = require("../Database/usersDatabase");
const recentDatabase = require("../Database/recentDatabase");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const publicPath = path.join(path.resolve(), "public");

dotenv.config({
  path: "./secret.env",
});

async function dashboardAuth(req, res) {
  let { uid, name } = req.params;
  let user = await database.findOne({ uid, name });
  if (user != null) {
    let userId = user.id;
    let allUsers = await database.find({ uid: { $nin: uid } });
    let recentUsers = await recentDatabase.find({ selectorId: userId });
    if (user != null) {
      res.render(publicPath + "/EJS/dashboard.ejs", {
        user,
        allUsers,
        recentUsers,
      });
    } else {
      let token = req.cookies.login;
      let verify = await jwt.verify(token, process.env.SECRET_KEY);
      let user = await database.findById(verify._id);
      if (user != null) {
        res.redirect(`/dashboard/${user.uid}/${user.name}`);
      }
    }
  }
}

module.exports = { dashboardAuth };
