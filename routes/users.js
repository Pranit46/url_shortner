let express = require("express");
const mongoose = require("mongoose");
let router = express.Router();
let { AUTH_EMAIL, AUTH_PASS, JWT_SECRET } = require("../env");
const user = require("../models/userSchema");
const { hashing, hashCompare, verified } = require("../library/auth");
const { dbUrl, mongodb, MongoClient } = require("../dbConfig");
const cookieparser = require("cookie-parser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

mongoose.connect(dbUrl);

router.get("/verified-users", async (req, res) => {
  try {
    let userData = await user.find();
    res.json({
      message: "All verified users",
      data: userData,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    let userData = await user.findOne({ email: req.body.email });
    console.log(userData);
    if (userData) {
      res.json({
        message: "User already exists",
      });
    } else {
      const hash = await hashing(req.body.password);
      req.body.password = hash;
      let account = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
      };
      let document = await user.create(account);

      const transport = await nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "urlshortnerpranit@gmail.com",
          pass: "asdfgh!@#$1234",
        },
      });

      const sendVerificationEmail = await transport.sendMail({
        from: "Verify Email <urlshortnerpranit@gmail.com>",
        to: req.body.email,
        subject: "Account Activation",
        html: `<h1>Email Verification</h1>
        <h3>Dear ${req.body.name}!</h3>
        <p>PLeae  <a href=http://localhost:4000/users/verify-email/${document.emailToken}> Click here</a> to activate your account</p>
        <p>The link will expire in few minutes</p>
        </div>`,
      });
      res.status(200).json({
        message:
          "Acount registered successfully.Please check the activation link from your email",
      });
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/verify-email/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const userData = await user.findOne({ emailToken: token });
    if (userData) {
      let document = await user.updateMany(
        { emailToken: token },
        { $set: { isVerfied: true, emailToken: null } }
      );
      res.sendFile(path.join(__dirname, "../library/activation.html"));
      // res.json({
      //   message: "Data Changed Successfully",
      //   data: { document },
      // });
      res.redirect(`http://localhost:3000/verify-email/${req.params.token}`);
    } else {
      console.log("email is not verified");
    }
  } catch (error) {
    console.log(error);
  }
});

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET);
};

router.post("/login", verified, async (req, res) => {
  try {
    let userData = await user.findOne({ email: req.body.email });

    if (userData) {
      const compare = await hashCompare(req.body.password, userData.password);
      if (compare === true) {
        // create token
        const token = createToken(userData.id);
        // store token into cookie
        console.log(token);
        res.json({
          message: "Login Successfull",
        });
      } else {
        res.json({
          message: "Wrong password",
        });
      }
    } else {
      res.json({
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// router.post("/forgot-password", async (req, res) => {
//   try {
//     let userData = await user.findOne({ email: req.body.email });
//     if (userData) {
//       const hash = await hashing(req.body.password);
//       let document = await user.updateOne(
//         { email: req.body.email },
//         { $set: { password: hash } }
//       );

//       res.json({
//         message: "Password Changed Successfully",
//         data: document,
//       });
//     } else {
//       res.json({
//         message: "User does not exist",
//       });
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });

router.post("/forgot-password", async (req, res) => {
  try {
    let userData = await user.findOne({ email: req.body.email });
    if (userData) {
      const hash = await hashing(req.body.password);
      let document = await user.updateMany(
        { email: req.body.email },
        {
          $set: {
            password: hash,
            emailToken: crypto.randomBytes(64).toString("hex"),
            isVerfied: false,
          },
        }
      );
      let Data = await user.findOne({ email: req.body.email });
      const transport = await nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "urlshortnerpranit@gmail.com",
          pass: "asdfgh!@#$1234",
        },
      });

      const sendVerificationEmail = await transport.sendMail({
        from: "Verify Email <urlshortnerpranit@gmail.com>",
        to: req.body.email,
        subject: "Account Activation",
        html: `<h1>Email Verification</h1>
        <h3>Dear ${Data.name}!</h3>
        <p>PLeae  <a href="http://localhost:4000/verify-email/${Data.emailToken}"> Click here</a> to activate your account</p>
        <p>The link will expire in few minutes</p>
        </div>`,
      });
      res.status(200).json({
        message:
          "Password Changed Successfully.Please check the activation link from your email",
      });
    } else {
      res.json({
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.send(error);
  }
});
router.put("/reset-password", async (req, res) => {
  try {
    let userData = await user.findOne({ email: req.body.email });
    if (userData) {
      const compare = await hashCompare(
        req.body.oldPassword,
        userData.password
      );
      if (compare) {
        const hash = await hashing(req.body.newPassword);
        let document = await db
          .collection("auth")
          .updateOne({ email: req.body.email }, { $set: { password: hash } });
        res.json({
          message: "Password Changed Successfully",
          data: document,
        });
      } else {
        res.json({
          message: "Incorrect Password",
        });
      }
    } else {
      res.json({
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.send(error);
  }
});


module.exports = router;
