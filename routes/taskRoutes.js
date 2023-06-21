
const express = require('express')
const router = express.Router();
const Task=require('../controller/auth/taskController')
const verifyToken = require('../middleware/jwtverification')

console.log("in routes")

router.post('/createTask',Task.createTask)
router.get('/filterTask',verifyToken,Task.filterTask)
router.delete('/delete/:id',verifyToken,Task.deleteTask)

module.exports = router;