/**
 * Group the server contruction here
 */
const http = require('http');
// Main export
module.exports = function(config, callback, debug) {
  return http.createServer(callback).listen(config.port, () => {
    debug(`${config.provider} webhook server start @ ${config.port}`);
  });
};
