require('dotenv').config()

const apiKeyValidator = (req, res, next) => {
    console.log("apikey", req.header.apikey)
    const key = req.headers.apikey
    if (key == process.env.API_KEY) {
        next()
    }
    else {
        res.status(401).send({ error:"Unauthorized: Access Denied. Please provide a valid API key for authentication." })
    }
}

module.exports = { apiKeyValidator }