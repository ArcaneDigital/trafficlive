var trafficLive = require('./lib/trafficLive.js');

module.exports = function(options) {
  return new trafficLive(options);
}