
const express = require('express')
const router = express.Router();
const Auth=require('../controller/auth/AUth')
const sign=require('../controller/auth/users')
const verifyToken = require('../middleware/jwtverification')

console.log("in routes")

router.post('/createUser',sign.signUp)
router.get('/getUsers',verifyToken,sign.users)
router.get('/getUsersById/:id',verifyToken,sign.getUserById)
router.delete('/delete/:id',verifyToken,sign.deleteUser)
router.get('/search/',verifyToken,sign.searchUser)



module.exports = router;