const winston = require('winston'); // used for logging  errors
const mongoDB = require('winston-mongodb').MongoDB;

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: './logs/combined.log' })
    ]
  });

process.on("uncaughtException", ex => {
    console.log("A");
    logger.error(ex.message, ex);
    process.exit(1);
});
process.on("unhandledRejection", ex => {
    console.log("B");
    logger.error(ex.message, ex);
    process.exit(1);
});
// logger.add( new winston.transports.MongoDB({
//      db: 'mongodb://localhost:27017/vidly', // this is for writing error in mongdb but it is not working
//     collection: 'logs'
//  }));

module.exports = logger;