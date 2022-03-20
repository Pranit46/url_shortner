const mongoose = require("mongoose");
const crypto = require('crypto')
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailToken: { type: String, default:crypto.randomBytes(64).toString('hex') },
  isVerfied: { type: Boolean, default:false },
  date: { type: Date, default:Date.now() },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
