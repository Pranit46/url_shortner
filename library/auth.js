const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const { JWT_SECRET } = require("../env");
const user = require("../models/userSchema");

const hashing = async (value) => {
  try {
    const salt = await bcrypt.genSalt(10);
    console.log("Salt", salt);
    const hash = await bcrypt.hash(value, salt);
    return hash;
  } catch (error) {
    return error;
  }
};

const hashCompare = async (password, hashValue) => {
  try {
    return await bcrypt.compare(password, hashValue);
  } catch (error) {
    return error;
  }
};

const loginrequired = async (req, res, next) => {
  const token = req.cookies["access-token"];
  if (token) {
    const validatetoken = await jwt.verify(token, JWT_SECRET);
    if (validatetoken) {
      (res.user = validatetoken.id), next();
    } else {
      console.log("token expires");
    }
  } else {
    console.log("token not found");
  }
};

const verified = async(req, res, next)=>{
    try{
      const userData = await user.findOne({email:req.body.email})
      console.log(userData.isVerfied);
      if(userData.isVerfied){
        next()
      }else{
        console.log("Please check your email to verify the account");
      }
    }catch(err){
      console.log(err);
    }
}

// const createJWT = async ({ email }) => {
//   return await JWT.sign(
//     {
//       email,
//     },
//     secret,
//     {
//       expiresIn: "1m",
//     }
//   );
// };

// const authentication = async (token) => {
//   const decode = JWTD(token);
//   if (Math.round(new Date() / 1000) <= decode.exp) {
//     return {
//       email: decode.email,
//       validity: true,
//     };
//   } else {
//     return {
//       email: decode.email,
//       validity: false,
//     };
//   }
// };

module.exports = { hashing, hashCompare, loginrequired, verified };
