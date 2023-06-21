var jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtKey = process.env.JWT_KEY;
const users = require("../models/Usermodel");
const mongoose = require("mongoose");
console.log("jwtKeyyy", jwtKey);

let verifyToken = async (req, res, next) => {
  let token = req?.headers["authorization"];
  let _id = req?.headers["id"]
//   console.log("assignee",req?.params)
//   let _id = new mongoose.Types.ObjectId(id);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("bearer")
  ) {
    token = token?.split(" ")[1];
    const verifiedUserToken = await users.findOne({ _id: _id });
    console.log("verifiedUserToken", verifiedUserToken,_id);
    // if (verifiedUserToken == null) throw Error("Error ");
    if (verifiedUserToken?.bearerToken != token) {
      return res.send({ message: "Please provide valid token for this user." });
    } else {
      next();
    }
    // jwt.verify(token, jwtKey, (err, valid) => {
    //   if (verifiedUserToken) {
    //     if (verifiedUserToken.bearerToken != token) {
    //         console.log("token provideee")
    //       res.send({ msg: "Please provide valid token" });
    //     }
    //   } else {
    //     next();
    //   }
    // });
  } else {
    res.send({ result: "Please add token with headers using bearer." });
  }
};
module.exports = verifyToken;
