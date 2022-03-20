const mongoose = require("mongoose");
const { Schema } = mongoose;
const shortId = require("shortid");

const shortUrlSchema = new Schema({
  full: { type: String, required: true },
  short: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  clicks:{
    type:Number,
    required:true,
    default:0 
  }
});

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);
module.exports = shortUrl;
