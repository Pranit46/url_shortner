let express = require("express");
const mongoose = require("mongoose");
let router = express.Router();
const shortUrl = require("../models/shortUrlSchema");
const { dbUrl, mongodb, MongoClient } = require("../dbConfig");
const app = require("../app");

mongoose.connect(dbUrl);

router.get("/geturl", async (req, res) => {
  try {
    let getUrlData = await shortUrl.find();
    res.json({
      data: getUrlData,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/creatshorturl", async (req, res) => {
  try {
    let shortUrlData = await shortUrl.create(req.body);
    res.json({
      message: "URL created",
      data: shortUrlData,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/click/:id", async (req, res) => {
  try {
    const shortUrlData = await shortUrl.updateOne({_id:req.params.id }, { $inc:{clicks:1} });
    res.json({
        message:"Updated",
        data: shortUrlData
    })
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
