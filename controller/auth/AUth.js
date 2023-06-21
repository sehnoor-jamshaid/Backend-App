const { body, validationResult } = require("express-validator");
const connection = require("../../config/config");
const model = require("../../models/Usermodel");
const OTP = require("../../models/otpModel");
const {
  generateOTP,
  sendEmail,
  encryptData,
  comparePassword,
  tokenGenerate,
} = require("../../utils/helpers");
const { ERRORS } = require("../../Errors/errors");
const { default: mongoose } = require("mongoose");
console.log("userssss");

const forgetpassword = async (req, res) => {
  try {
    let { email } = req.body;
    console.log("email", email);
    if (!email) throw Error("Email is not provided");
    let USerExist = await model.findOne({ email }, { _id: 1, email: 1 });
    console.log("userExist", USerExist);
    if (!USerExist) throw Error(ERRORS.USER_NOTEXIST);

    let otpExist = await OTP.findOne({ userId: USerExist._id });

    if (otpExist) {
      await OTP.findByIdAndDelete(otpExist._id);
    }

    let otp = await generateOTP();
    let expiry = new Date();
    expiry.setSeconds(expiry.getMinutes() + 25);
    console.log("expiryyy",expiry)
    let payload = {
      otp,
      expiry,
      userId: USerExist._id,
    };

    let otpData = new OTP(payload);
    await otpData.save();
    let em = await sendEmail(otp, email);
    console.log("EM", em);

    return res.status(200).send({
      success: true,
      message: "Email Sent Successfully",
    });
  } catch (e) {
    return res.status(400).send({
      success: false,
      message: e.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) throw Error("Email or password not provided");
    const userExist = await model.findOne(
      { email },
      { _id: 1, email: 1, password: 1 }
    );
    console.log("usersss", userExist);
    if (!userExist) throw Error(ERRORS.USER_NOTEXIST);
    const passwordMatch = await comparePassword(password, userExist.password);
    console.log("passwordMatch",passwordMatch)
    if (!passwordMatch) throw Error(ERRORS.INVALID_CREDENTIALS);
    const token = await tokenGenerate(req.body);
    const save=await model.findOneAndUpdate({ email:email },{bearerToken:token},{new:true})
 console.log("save",save)
    delete userExist.password;
    return res.status(200).send({
      success: "true",
      data: userExist,
      message: "Login Successfully",
      token: token,
    });
  } catch (e) {
    return res.status(400).send({
      success: "false",
      message: e.message,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    let { email, password, oldpassword } = req.body;
    console.log("resetttttt", email, password, oldpassword);
    if (!email || !password || !oldpassword) throw Error(ERRORS.NULL_FIELD);

    const userExisting = await model.findOne(
      { email: email },
      { _id: 1, password: 1 }
    );
    if (!userExisting) throw Error(ERRORS.USER_NOTEXIST);
    console.log("userExisting.password", userExisting.password);
    const matchpwd = await comparePassword(password, userExisting.password);
    console.log("matchpwd", matchpwd);
    if (!matchpwd) {
      throw Error(ERRORS.NOT_OLD_PASSWORD);
    } else {
      const save = await model.findOneAndUpdate({ email: email }, { password });
      return res.status(200).send({
        success: "true",
        message: "Password reset Successfully",
      });
    }
  } catch (e) {
    console.log("error", e.message);
    return res.status(400).send({
      success: "false",
      message: e.message,
    });
  }
};
const verifyotp = async (req, res) => {
  try {
    console.log("req", req.body);
    let { email, otp } = req.body;
    if (!email || !otp) throw Error("Email or OTP is not provided");
    const userExist = await model.findOne({ email });
    if (!userExist) throw Error(ERRORS.USER_NOTEXIST);
    const otpExist = await OTP.findOne({ userId: userExist._id },{expiry:1,otp:1});
    console.log("otpExist", otpExist, userExist);
    const now = new Date();
    console.log("now", now,otpExist.expiry,now < otpExist.expiry);
    if (now < otpExist.expiry) {
      if ((otp = otpExist.otp)) {
        return res.status(200).send({
          success: "true",
          message: "Otp Verified",
        });
      } else {
        throw Error("Please enter correct OTP");
      }
    } else {
      throw Error("Session has expired");
    }
  } catch (e) {
    return res.status(400).send({
      success: "false",
      message: e.message,
    });
  }
};


module.exports = {
  forgetpassword,
  loginUser,
  resetPassword,
  verifyotp,
};
