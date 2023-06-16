
const express = require('express')
const router = express.Router();
const Auth=require('../controller/auth/AUth')
const verifyToken = require('../middleware/jwtverification')


router.post('/forgetPwd',Auth.forgetpassword)
router.post('/login',Auth.loginUser)
router.post('/reset-pwd',Auth.resetPassword)
router.post('/verify-otp',Auth.verifyotp)

module.exports = router;