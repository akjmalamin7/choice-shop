const jwt = require('jsonwebtoken')
module.exports = async(req, res, next) =>{
    let token = req.header('Authorization')
    if(!token) return res.status(401).send("Access denied. No token provided!")

    token = token.split(" ")[1].trim()
    try{
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()

    }catch(err){
        if(!decoded) return res.status(400).send("Invalid token!")

    }
}