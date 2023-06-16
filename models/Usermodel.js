const mongoose = require("mongoose");
const { encryptData } = require("../utils/helpers");
const bcryptjs = require("bcryptjs");
const UsersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

UsersSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    let encryptedPassword = await encryptData(this.password);
    this.password = encryptedPassword;
    return next();
  }

  return next();
});

UsersSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    let encryptedPassword = await encryptData(this._update.password);
    this._update.password = encryptedPassword;
    return next();
  }

  return next();
});
module.exports = mongoose.model("User", UsersSchema, "users");
