const path = require('path');
const request = require("request");

const accessTokens = require(path.join(__dirname, '../../accessTokens'));

module.exports = forecast = (long, lat, callback) => {
  const url = `https://api.darksky.net/forecast/${
  accessTokens.darkSky}/${long},${lat}?units=si`;

  request({
    url: url,
    json: true
  }, (err, res) => {
    if (err) {
      callback("Unable to connect to darksky api", null);
    } else if (res.body.error) {
      callback("Unable to find location", null);
    } else {
      callback(null, res);
    }
  });
};
