const config = require('config');

let conf = (logger) => {
    if(!config.get('jwtPrivateKey.value')){
        logger.error("Fatal error: JWT private key  is not defined"); // use set vidly_PrivateKey=mySecureKey
        process.exit(1); // value 0 indicates success other than one indicates failure
    }
}
module.exports = conf;