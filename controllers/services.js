var jwt = require("jwt-simple");
var moment = require("moment");
var config = require('../../NoraDB.json');

exports.createToken = function (user) {
  var payload = {
    sub: user,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix(),
  };
  return jwt.encode(payload, config.apikey);
};