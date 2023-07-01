const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./secret.env",
});

const { MONGODB_URI, DB_NAME } = process.env;

mongoose.connect(MONGODB_URI, { dbName: DB_NAME }).then(() => {
  console.log("Database Connected Successfully");
});

let Schema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  pass: {
    type: String,
  },
  colorCode: {
    type: String,
  },
  onlineStatus: {
    type: String,
  },
  isOnline: {
    type: Boolean,
  },
  uid: {
    type: String,
    unique: true,
  },
  token: [
    {
      token: String,
    },
  ],
});

let userModel = mongoose.model("userModel", Schema, "users");

module.exports = userModel;
