const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.udfwpx5.mongodb.net/?retryWrites=true&w=majority",
  { dbName: "chatapp" }
);

let recentChatSchema = new mongoose.Schema({
  user: Array,
});

let recentChatModel = mongoose.model(
  "recentChatModel",
  recentChatSchema,
  "recentChats"
);

module.exports = recentChatModel;
