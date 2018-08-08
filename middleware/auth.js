const jwt = require('jsonwebtoken');
const config = require('config');

// this middleware is for checking authorizaton
// ( "authentication means providing access to login user...")
let auth = (req, res, next) =>{
    const token = req.header('x-auth-token');
    if(! token){
        res.status(401).send("Access denied. No Auth token provided");
        return false;
    }
    try{
        const decoded = jwt.verify(token, config.get("jwtPrivateKey.value"));
        req.user = decoded;
        next();
        return false;
    }
    catch(err){
        res.status(401).send("Access denied. Invalid Auth token..");
        return false;
    }
    
}
module.exports= auth;