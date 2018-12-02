const cors = require("cors");
const config = require("config");
var corsOptions = {
  origin: config.get("whiteList"),
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
module.exports = function(app) {
  app.use(cors(corsOptions));
};
