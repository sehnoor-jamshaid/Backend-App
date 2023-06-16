
const express = require('express')
const router = express.Router();
const pro=require('../controller/auth/products')
const verifyToken = require('../middleware/jwtverification')

console.log("in routes")


router.get('/pagination/',verifyToken,pro.paginationProducts)



module.exports = router;