const mongoose = require('mongoose');
const config =  require('config');
const db = config.get("DB");
const url =  db.name+"://"+db.host+":"+db.port+"/"+db.dbName
console.log(url);
let dbconnect = (logger) =>{ 
 (async () => {
                    try{
                        await mongoose.connect(url, { useNewUrlParser: true });
                        logger.info('MongoDB is connected ');
                    }
                    catch(err){
                        logger.error("mongodb is not connected", err);
                    }
                })();
            }
module.exports = dbconnect;