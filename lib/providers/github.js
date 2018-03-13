/**
 * Rewrite the module with ES6, then ditch github-webhook-handler deps
 */
'use strict';
/**
 * Webhook for github to build a cheap and cheerful CI
 * 1. Only do something when the master branch is updated
 * 2. Only affect ./ folder to do a git pull master
 * 3. Restart the script accordingly
 * The github-webook-handler won't work with other git provider
 * @TODO if I want to work with gitee / gitlab then I need to write one myself
 */
const http = require('http');
const githubWebhook = require('github-webhook-handler');
const log = require('../log');
/**
 * @param {object} config configuration for the function return
 * @return {function} for calls
 */
const handler = (config, opt, callback) => {
  const _handler = githubWebhook({
    path: config.path,
    secret: config.secret
  });
  // Start up server
  const server = http
    .createServer(function(req, res) {
      _handler(req, res, function(err) {
        res.statusCode = 404;
        log('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    })
    .listen(config.port, () => {
      log(`webhook server start @ ${config.port}`);
    });
  // On error
  _handler.on('error', err => {
    log('Error:', err.message);
  });
  // On received push event
  _handler.on('push', result => {
    if (result.payload.ref === config.branch) {
      callback(result, opt);
    } else {
      log(
        'Received a push event for %s to %s',
        result.payload.repository.name,
        result.payload.ref
      );
    }
  });
  // Return the server instance for stop or restart
  return server;
};
// Export
module.exports = handler;
