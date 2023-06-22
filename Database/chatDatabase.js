const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./secret.env",
});

const { MONGODB_URI, DB_NAME } = process.env;

mongoose.connect(MONGODB_URI, { dbName: DB_NAME });

let chatSchema = new mongoose.Schema({
  relationalId: String,
  message: Array,
});

let chatModel = mongoose.model("chatModel", chatSchema, "chats");

module.exports = chatModel;
