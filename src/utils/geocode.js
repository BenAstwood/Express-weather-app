const path = require('path');
const request = require("request");

const accessTokens = require(path.join(__dirname, '../../accessTokens'));

module.exports = geocode = (location, callback) => {

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${accessTokens.mapBox}&limit=1`;

  request({
    url: url,
    json: true
  }, (err, res) => {
    if (err) {
      callback("Unable to connect to mapbox api", null);
    } else if (res.body.features.length === 0) {
      callback("Unable to find location, try another search", null);
    } else {
      const location = res.body.features[0];
      callback(null, {
        long: location.center[1],
        lat: location.center[0],
        location: location.place_name
      });
    }
  });
};
