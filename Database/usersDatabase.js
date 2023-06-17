const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.udfwpx5.mongodb.net/?retryWrites=true&w=majority",
    { dbName: "chatapp" }
  )
  .then(() => {
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

let model = mongoose.model("model", Schema, "users");

module.exports = model;
