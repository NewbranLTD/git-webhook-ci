/**
 * Group the server contruction here
 */
const http = require('http');
// Main export
module.exports = function(config, callback, debug) {
  return http.createServer(callback).listen(config.port, () => {
    debug(`Gitlab webhook server start @ ${config.port}`);
  });
};
