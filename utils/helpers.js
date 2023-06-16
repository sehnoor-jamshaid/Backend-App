const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const bcryptjs = require("bcryptjs");
dotenv.config();

const jwt = require('jsonwebtoken')
const generateOTP = () => {
    const num = "0123456789";
    let otp = ""
    for (let i = 0; i <= 3; i++) {
        otp += num[Math.floor(Math.random() * 10)]
    }
    console.log("OTP", otp)
    return otp
}
const tokenGenerate = async (payload) => {
    try {
        const token = await jwt.sign(payload, process.env.JWT_KEY)
        return token
    }
    catch {
        throw Error()
    }
}
const encryptData = async (text) => {
    try {
        let result = await bcryptjs.hash(text, 8);
        return result;
    } catch (error) {
        return error;
    }
};

const comparePassword = async (text, hash) => {
    try {
        console.log("hash", text, hash)
        let result = await bcryptjs.compare(text, hash);
        return result;
    } catch (error) {
        return error;
    }
};

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 0,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    tls: {
        rejectedUnauthorized: false,
    },
    auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PWD, // generated ethereal password
    },

});
const sendEmail = async (otp, email) => {
    try {
        let verify = await transporter.verify()
        console.log("in function1234", verify)
        if (verify) {
            let mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "OTP Verification",

                html: `<p>Thank you for signing up for our service. To verify your account, please use the following One-Time Password (OTP):

                OTP: ${otp}
                
                Please enter this OTP on the verification page to complete the registration process. Please note that the OTP is valid for a limited time and can only be used once.
                
                If you did not initiate this request, please ignore this email.</p>`
            };
            return transporter.sendMail(mailOptions)
        }
    }
    catch (e) {
        console.log("eee", e)
    }

}
const objectValidator = (object) => {
    if (object) {
        const res = Object.entries.map((val) => {
            if ((typeof val[0] !== "boolean" && !val[0]) || val[0] == undefined || val[0] == null)
                return false
            else
                return true    
        })
       return !res.includes(false) 
    }

return false


}
module.exports =
{
    generateOTP,
    sendEmail,
    encryptData,
    comparePassword,
    tokenGenerate
}