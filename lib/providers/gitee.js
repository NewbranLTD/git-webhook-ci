/**
 * Implement the Gitee class
 */
const http = require('http');
const GiteeWebhook = require('./gitee-class');
const log = require('../log');

// Main
module.exports = function(config, opt, callback) {
  const i = new GiteeWebhook(config);
  // Register all the event listeners here first
  i.on('error', err => {
    log('error', err);
  });
  // Finally the push is accepted
  i.on('push', result => {
    if (result.ref === config.branch) {
      callback(result, opt);
    } else {
      log('Not expecting this branch', result.ref);
    }
  });
  // Return the server instance
  return http
    .createServer(function(req, res) {
      i.handler(req, res, function(err) {
        res.statusCode = 404;
        log('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    })
    .listen(config.port, () => {
      log(`webhook server start @ ${config.port}`);
    });
};
