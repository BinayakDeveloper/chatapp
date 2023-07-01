const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./secret.env",
});

const { MONGODB_URI, DB_NAME } = process.env;

mongoose.connect(MONGODB_URI, { dbName: DB_NAME }).then(() => {
  console.log("Database Connected Successfully");
});

let schema = mongoose.Schema({
  selectorId: String,
  userId: String,
  email: String,
  name: String,
  uid: String,
  colorCode: String,
  onlineStatus: String,
});

let recentModel = mongoose.model("recentModel", schema, "recentUsers");

module.exports = recentModel;
