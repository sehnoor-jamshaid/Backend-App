var jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtKey = process.env.JWT_KEY
console.log("jwtKeyyy",jwtKey)

let verifyToken = (req, res, next) => {
    let token = req?.headers['authorization'];
    if (req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
        token = token?.split(' ')[1]
        jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.send({ msg: "Please provide valid token" })
            }
            else {
                next()
            }
        })
    }
    else {
        res.send({ result: "Please add token with headers using bearer." })
    }
}
module.exports = verifyToken;