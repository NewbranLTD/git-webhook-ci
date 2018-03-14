/**
 * Implement the Gitee class
 */
const http = require('http');
const GiteeWebhook = require('./gitee-class');
const log = require('../log');

// Main
module.exports = function(config, opt, callback) {
  const gitee = new GiteeWebhook(config);
  // Register all the event listeners here first
  gitee.on('error', err => {
    log('error', err);
  });
  // Finally the push is accepted
  gitee.on('push', result => {
    if (config.branch === '*' || result.payload.ref === config.branch) {
      callback(result, opt);
    } else {
      log('Not expecting this branch', result.ref);
    }
  });
  // Return the server instance
  return http
    .createServer(function(req, res) {
      gitee.handler(req, res, function(err) {
        res.statusCode = 404;
        log('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    })
    .listen(config.port, () => {
      log(`Gitee webhook server start @ ${config.port}`);
    });
};
