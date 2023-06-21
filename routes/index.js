const express = require('express')
const authRoutes = require('./authRoutes');
const userRoutes=require('./userRoutes')
const productRoutes=require('./productRoutes')
const TaskRoutes=require("./taskRoutes")
const router = express.Router();
const bcryptjs=require("bcryptjs")

router.use('/user',userRoutes)
router.use('/auth',authRoutes)
router.use('/product',productRoutes)
router.use('/tasks',TaskRoutes)

module.exports = router;