const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.udfwpx5.mongodb.net/?retryWrites=true&w=majority",
  { dbName: "chatapp" }
);

let chatSchema = new mongoose.Schema({
  relationalId: String,
  message: Array,
});

let chatModel = mongoose.model("chatModel", chatSchema, "chats");

module.exports = chatModel;
