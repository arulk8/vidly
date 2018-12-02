const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan"); // used for logging  errors
// var Fawn = require("fawn"); for providing transaction in mongoDB.
// const startupDebugger = require('debug')('app:startup');
// const dbDebugger = require('debug')('app:db');
//const authentication = require('./middleware/authenticate');
//const logger = require('./middleware/logger');
const logger = require("./startup/logging");
require("./startup/config")(logger);
//console.log(config.get('jwtPrivateKey'));
require("./startup/DBconnection")(logger);

// throw new Error("i created this error");  // checking error handelling of unhandeled exception.

/*const p = Promise.reject(
     setTimeout( ()=>{
        throw new Error("i created this error");
     }, 100)
 )
 p.then(x =>{   // checking unhandeled promise.

 });*/

// Fawn.init(mongoose);
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
//app.use(authentication);
//app.use(logger);
require("./startup/cors")(app);
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("tiny"));
require("./startup/routes")(app);

//startupDebugger('morgan is enabled');
//dbDebugger('db is enabled');
const port = process.env.PORT || 3900;
app.listen(port, () => {
  console.log(`listening on ${port}...`);
});
