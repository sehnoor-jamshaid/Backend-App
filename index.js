const express = require('express')
const { body, validationResult } = require('express-validator');
const app = express()
const morgan = require("morgan")
// const sslServer=require('./sslServer')
const fs = require('fs')
const { apiKeyValidator } = require('./apikeyValidation')
const https = require('https')
const path = require('path')
const cors = require('cors')
const connection = require('./config/config')
const model = require('./models/Usermodel')
const verifyToken = require('./middleware/jwtverification')
require('dotenv').config();
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler')
app.use(express.json());
app.use(cors())
console.log("indexx")
app.use('/app/v1/api', apiKeyValidator, routes);
// app.use(morgan('dev'))
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app)

sslServer.listen(8080, () => {
    console.log("Secure connection")
})

